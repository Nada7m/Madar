import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    tailwindcss(),
    react(),
    nitro({ defaultPreset: "cloudflare-module" }),
    {
      name: "dev-image-upload",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use("/__dev__/api/upload-image", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method not allowed");
            return;
          }

          try {
            const chunks: Buffer[] = [];

            req.on("data", (chunk: Buffer) => {
              chunks.push(chunk);
            });

            req.on("end", () => {
              const buffer = Buffer.concat(chunks);
              const boundary = req.headers["content-type"]?.split("boundary=")[1];

              if (!boundary) {
                res.statusCode = 400;
                res.end("Invalid request");
                return;
              }

              try {
                const boundaryBytes = Buffer.from(`--${boundary}`);
                const parts: Buffer[] = [];
                let partStart = buffer.indexOf(boundaryBytes);
                while (partStart !== -1) {
                  const nextBoundary = buffer.indexOf(boundaryBytes, partStart + boundaryBytes.length);
                  if (nextBoundary === -1) break;
                  parts.push(buffer.subarray(partStart + boundaryBytes.length, nextBoundary));
                  partStart = nextBoundary;
                }

                const fieldValue = (part: Buffer) => {
                  const separator = Buffer.from("\r\n\r\n");
                  const start = part.indexOf(separator);
                  return start === -1 ? "" : part.subarray(start + separator.length).toString("utf8").trim();
                };

                let filename = "";
                let projectId = "";
                let fileData: Buffer | null = null;

                for (const part of parts) {
                  const headers = part.subarray(0, part.indexOf(Buffer.from("\r\n\r\n"))).toString("utf8");
                  if (headers.includes('name="projectId"')) projectId = fieldValue(part);
                  if (headers.includes('name="filename"')) filename = fieldValue(part);
                  if (headers.includes('name="file"')) {
                    const separator = Buffer.from("\r\n\r\n");
                    const start = part.indexOf(separator);
                    fileData = start === -1 ? null : part.subarray(start + separator.length, part.length - 2);
                  }
                }

                if (!fileData || !filename || !projectId) {
                  res.statusCode = 400;
                  res.end("Missing required fields");
                  return;
                }

                const safeProjectId = projectId.replace(/[^a-zA-Z0-9_-]/g, "");
                const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
                if (!safeProjectId || !safeFilename) {
                  res.statusCode = 400;
                  res.end("Invalid file name");
                  return;
                }

                const uploadDir = path.join(process.cwd(), "public", "uploads", "projects", safeProjectId);
                fs.mkdirSync(uploadDir, { recursive: true });

                // Write file to disk
                const filePath = path.join(uploadDir, safeFilename);
                fs.writeFileSync(filePath, fileData);

                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({ url: `/uploads/projects/${safeProjectId}/${safeFilename}` }));
              } catch (error) {
                console.error("Upload error:", error);
                res.statusCode = 500;
                res.end("Upload failed");
              }
            });
          } catch (error) {
            console.error("Upload handler error:", error);
            res.statusCode = 500;
            res.end("Server error");
          }
        });

        server.middlewares.use("/__dev__/api/delete-image", async (req, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end("Method not allowed");
            return;
          }

          try {
            let body = "";
            req.on("data", (chunk: Buffer) => {
              body += chunk.toString();
            });

            req.on("end", () => {
              try {
                const { projectId, imagePath } = JSON.parse(body);

                if (!projectId || !imagePath) {
                  res.statusCode = 400;
                  res.end("Missing required fields");
                  return;
                }

                // Validate path to prevent directory traversal
                if (imagePath.includes("..") || imagePath.includes("~")) {
                  res.statusCode = 400;
                  res.end("Invalid path");
                  return;
                }

                const uploadsRoot = path.resolve(process.cwd(), "public", "uploads", "projects");
                const filePath = path.resolve(process.cwd(), "public", imagePath.replace(/^\/+/, ""));

                // Only allow deleting files below public/uploads/projects.
                if (!filePath.startsWith(`${uploadsRoot}${path.sep}`)) {
                  res.statusCode = 400;
                  res.end("Invalid file location");
                  return;
                }

                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }

                res.setHeader("Content-Type", "application/json");
                res.statusCode = 200;
                res.end(JSON.stringify({ success: true }));
              } catch (error) {
                console.error("Delete error:", error);
                res.statusCode = 500;
                res.end("Delete failed");
              }
            });
          } catch (error) {
            console.error("Delete handler error:", error);
            res.statusCode = 500;
            res.end("Server error");
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
