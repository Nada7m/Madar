import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

const reverseGeocodeCache = new Map<string, string | null>();

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function handleReverseGeocodeApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lng = Number(url.searchParams.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return jsonResponse({ error: "Invalid lat/lng query parameters" }, 400);
  }

  const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (reverseGeocodeCache.has(cacheKey)) {
    const cached = reverseGeocodeCache.get(cacheKey) ?? null;
    if (cached) {
      return jsonResponse({ name: cached });
    }
    reverseGeocodeCache.delete(cacheKey);
  }

  try {
    const photonUrl = new URL("https://photon.komoot.io/reverse");
    photonUrl.searchParams.set("lat", String(lat));
    photonUrl.searchParams.set("lon", String(lng));

    const response = await fetch(photonUrl.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "MadarPlatform/1.0 (development analytics dashboard)",
      },
    });

    if (!response.ok) {
      return jsonResponse({ name: null, error: "Reverse geocoding provider error" }, 502);
    }

    const data = (await response.json()) as {
      features?: Array<{
        properties?: {
          district?: string;
          suburb?: string;
          locality?: string;
          name?: string;
        };
      }>;
    };

    const props = data.features?.[0]?.properties;
    const name = props?.district || props?.suburb || props?.locality || props?.name || null;

    if (name) {
      reverseGeocodeCache.set(cacheKey, name);
    }
    return jsonResponse({ name });
  } catch (error) {
    console.error("Reverse geocoding API failure", error);
    return jsonResponse({ name: null }, 500);
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (url.pathname === "/api/reverse-geocode") {
        return await handleReverseGeocodeApi(request);
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
