import { createClient } from "@supabase/supabase-js";
import type { Project } from "@/data/projects";
import { getCategoryLabel, getStatusLabel } from "@/lib/display";
import {
  getAllProjects,
  consolidateProjects,
  getOfficialProjectLinkByName,
  getProjectByNameMatch,
  getUserProjects,
  getUserProjectById,
  hotelProjects,
  isProjectDeletedLocally,
  markProjectDeleted,
  removeUserProject,
} from "@/data/projects";

let supabaseUnavailable = false;
let supabaseFailureReported = false;

function reportSupabaseUnavailable(error: unknown) {
  supabaseUnavailable = true;
  if (!supabaseFailureReported) {
    console.warn("Supabase unavailable; using the complete local project dataset.", error);
    supabaseFailureReported = true;
  }
}

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://example.supabase.co";

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "local-dev-placeholder-key";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
);
type SupabaseProjectRow = {
  id: string;
  project_name?: string | null;
  name?: string | null;
  category?: string | null;
  description?: string | null;
  progress?: number | null;
  status?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  duration_years?: number | null;
  owner_entity?: string | null;
  executing_entity?: string | null;
  executor_entity?: string | null;
  area_value?: string | null;
  area_unit?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  lat?: number | string | null;
  lng?: number | string | null;
};

type SupabaseProjectImageRow = {
  id?: string;
  project_id?: string | null;
  url?: string | null;
  image_url?: string | null;
  path?: string | null;
};

type SupabaseProfileRow = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  is_active?: boolean | null;
  [key: string]: unknown;
};

export type ProjectUpdateInput = {
  project_name?: string;
  category?: string;
  description?: string;
  progress?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  duration_years?: number;
  owner_entity?: string;
  executing_entity?: string;
  area_value?: string;
  area_unit?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const PROJECT_UPDATE_COLUMN_ALIASES: Record<keyof ProjectUpdateInput, string[]> = {
  project_name: ["project_name", "name"],
  category: ["category"],
  description: ["description"],
  progress: ["progress"],
  status: ["status"],
  start_date: ["start_date"],
  end_date: ["end_date"],
  duration_years: ["duration_years"],
  owner_entity: ["owner_entity"],
  executing_entity: ["executing_entity", "executor_entity"],
  area_value: ["area_value"],
  area_unit: ["area_unit"],
  latitude: ["latitude", "lat"],
  longitude: ["longitude", "lng"],
};

const FALLBACK_PROJECT_COLUMNS = new Set(
  Object.values(PROJECT_UPDATE_COLUMN_ALIASES).flatMap((keys) => keys),
);

let cachedProjectsColumns: Set<string> | null = null;

type SupabaseProjectUpdateRow = {
  id: string;
  project_id?: string | null;
  title?: string | null;
  content?: string | null;
  created_at?: string | null;
  [key: string]: unknown;
};

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function normalizeCoordinate(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function normalizeProjectName(value: string): string {
  return value
    .trim()
    .replace(/^(محطة|مشروع|مشروع تطوير|تطوير)\s+/u, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function mergeLocalProjectDetails(project: Project, localProject?: Project): Project {
  if (!localProject) return project;

  return {
    ...project,
    name: project.name || localProject.name,
    name_en: project.name_en || localProject.name_en,
    description: project.description || localProject.description,
    description_en: project.description_en || localProject.description_en,
    visitor_description: project.visitor_description || localProject.visitor_description,
    visitor_description_en:
      project.visitor_description_en || localProject.visitor_description_en,
    main_features: project.main_features?.length ? project.main_features : localProject.main_features,
    main_features_en: project.main_features_en?.length
      ? project.main_features_en
      : localProject.main_features_en,
    services: project.services?.length ? project.services : localProject.services,
    services_en: project.services_en?.length ? project.services_en : localProject.services_en,
    project_importance: project.project_importance?.length
      ? project.project_importance
      : localProject.project_importance,
    project_importance_en: project.project_importance_en?.length
      ? project.project_importance_en
      : localProject.project_importance_en,
    official_url: project.official_url || localProject.official_url,
    booking_url: project.booking_url || localProject.booking_url,
    projectLink: project.projectLink || localProject.projectLink,
    images: project.images.length > 0 ? project.images : localProject.images,
  };
}

function mapProject(row: SupabaseProjectRow, images: string[] = []): Project {
  const name = normalizeString(row.project_name ?? row.name ?? row.id);
  const latitude = normalizeCoordinate(row.latitude ?? row.lat);
  const longitude = normalizeCoordinate(row.longitude ?? row.lng);
  const officialProjectLink = getOfficialProjectLinkByName(name);
  const fallbackProject = getProjectByNameMatch(name) ?? getAllProjects().find((project) => {
    const localName = normalizeProjectName(project.name);
    const remoteName = normalizeProjectName(name);
    return localName === remoteName || localName.includes(remoteName) || remoteName.includes(localName);
  });

  const mappedProject: Project = {
    id: normalizeString(row.id),
    name,
    category: getCategoryLabel(row.category) as Project["category"],
    description: normalizeString(row.description),
    progress: normalizeNumber(row.progress),
    status: getStatusLabel(row.status),
    startDate: normalizeString(row.start_date),
    endDate: normalizeString(row.end_date),
    durationYears: normalizeNumber(row.duration_years),
    ownerEntity: normalizeString(row.owner_entity),
    executorEntity: normalizeString(row.executing_entity ?? row.executor_entity),
    area: normalizeString(row.area_value),
    areaUnit: normalizeString(row.area_unit) || "",
    projectLink: officialProjectLink ?? fallbackProject?.projectLink,
    lng: longitude,
    lat: latitude,
    images,
  };

  return mergeLocalProjectDetails(mappedProject, fallbackProject);
}

function pickImageUrl(row: SupabaseProjectImageRow): string {
  return normalizeString(row.url || row.image_url || row.path);
}

async function loadProjectsColumns(): Promise<Set<string>> {
  if (cachedProjectsColumns) return cachedProjectsColumns;

  const { data, error } = await supabase.from("projects").select("*").limit(1);

  if (error) {
    console.warn("Unable to read projects columns from Supabase. Falling back to known columns.", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    cachedProjectsColumns = new Set(FALLBACK_PROJECT_COLUMNS);
    return cachedProjectsColumns;
  }

  const firstRow = (data as Record<string, unknown>[] | null)?.[0];
  if (firstRow && typeof firstRow === "object") {
    cachedProjectsColumns = new Set(Object.keys(firstRow));
    return cachedProjectsColumns;
  }

  // If table has no rows, keep fallback so updates still work.
  cachedProjectsColumns = new Set(FALLBACK_PROJECT_COLUMNS);
  return cachedProjectsColumns;
}

async function sanitizeProjectUpdatePayload(updates: ProjectUpdateInput): Promise<{
  payload: Record<string, unknown>;
  droppedFields: string[];
}> {
  const knownColumns = await loadProjectsColumns();
  const payload: Record<string, unknown> = {};
  const droppedFields: string[] = [];

  for (const [rawKey, value] of Object.entries(updates)) {
    if (value === undefined) continue;

    const key = rawKey as keyof ProjectUpdateInput;
    const candidateColumns = PROJECT_UPDATE_COLUMN_ALIASES[key] ?? [rawKey];
    const matchedColumn = candidateColumns.find((column) => knownColumns.has(column));

    if (!matchedColumn) {
      droppedFields.push(rawKey);
      continue;
    }

    payload[matchedColumn] = value;
  }

  return { payload, droppedFields };
}

function extractProblemField(errorMessage: string, droppedFields: string[]): string {
  const byColumnRegex = /column\s+"?([a-zA-Z0-9_]+)"?/i;
  const byCacheRegex = /schema cache\s+for\s+([a-zA-Z0-9_]+)/i;
  const byPathRegex = /'([a-zA-Z0-9_]+)'/i;

  const fromColumn = errorMessage.match(byColumnRegex)?.[1];
  if (fromColumn) return fromColumn;

  const fromCache = errorMessage.match(byCacheRegex)?.[1];
  if (fromCache) return fromCache;

  const fromPath = errorMessage.match(byPathRegex)?.[1];
  if (fromPath) return fromPath;

  if (droppedFields.length > 0) {
    return droppedFields.join(", ");
  }

  return "غير محدد";
}

export async function getProjects(): Promise<Project[]> {
  if (supabaseUnavailable) return getAllProjects();

  try {
    const { data: projectsData, error: projectsError } = await supabase.from("projects").select("*");
    if (projectsError) throw projectsError;

    const remoteProjects = (projectsData ?? []) as SupabaseProjectRow[];
    const projectIds = remoteProjects.map((project) => normalizeString(project.id)).filter(Boolean);

    if (projectIds.length === 0) return getAllProjects();

    const { data: imagesData, error: imagesError } = await supabase
      .from("project_images")
      .select("*")
      .in("project_id", projectIds);

    if (imagesError) throw imagesError;

    const images = (imagesData ?? []) as SupabaseProjectImageRow[];
    const imagesMap = new Map<string, string[]>();
    images.forEach((image) => {
      const projectId = normalizeString(image.project_id);
      const url = pickImageUrl(image);
      if (!url) return;
      const list = imagesMap.get(projectId) ?? [];
      list.push(url);
      imagesMap.set(projectId, list);
    });

    const mappedProjects = remoteProjects.map((project) =>
      mapProject(project, imagesMap.get(normalizeString(project.id)) ?? []),
    );
    return consolidateProjects([...mappedProjects, ...getAllProjects()]);
  } catch (error) {
    reportSupabaseUnavailable(error);
    return getAllProjects();
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (supabaseUnavailable) return getAllProjects().find((project) => project.id === id) ?? null;
  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  // Handle errors - "PGRST116" is not found, "22P02" is invalid UUID format
  if (projectError && !["PGRST116", "22P02"].includes(projectError.code || "")) {
    throw projectError;
  }

  if (!projectData) {
    return null;
  }

  const { data: imagesData, error: imagesError } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", id);

  if (imagesError) {
    throw imagesError;
  }

  const images = ((imagesData ?? []) as SupabaseProjectImageRow[])
    .map(pickImageUrl)
    .filter(Boolean);
  const project = mapProject(projectData as SupabaseProjectRow, images);
  return project;
}

export async function getAllProjectsWithLocal(): Promise<Project[]> {
  const remoteOrFallbackProjects = await getProjects();
  return consolidateProjects([...remoteOrFallbackProjects, ...getAllProjects()]);
}

export async function getProjectByIdWithLocal(id: string): Promise<Project | null> {
  if (isProjectDeletedLocally(id)) return null;

  try {
    const project = await getProjectById(id);
    if (project) return project;
  } catch (error) {
    reportSupabaseUnavailable(error);
  }

  return (
    getUserProjectById(id) ??
    hotelProjects.find((p) => p.id === id && !isProjectDeletedLocally(p.id)) ??
    getAllProjects().find((project) => project.id === id) ??
    null
  );
}

export async function getProjectImages(projectId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  return ((data ?? []) as SupabaseProjectImageRow[]).map(pickImageUrl).filter(Boolean);
}

export async function getProfileById(id: string): Promise<SupabaseProfileRow | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") {
    throw error;
  }
  return data ?? null;
}

export async function getProjectUpdates(projectId: string): Promise<SupabaseProjectUpdateRow[]> {
  const { data, error } = await supabase
    .from("project_updates")
    .select("*")
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }
  return (data ?? []) as SupabaseProjectUpdateRow[];
}

export async function deleteProject(projectId: string): Promise<void> {
  const localProject = getUserProjectById(projectId);

  if (localProject) {
    removeUserProject(projectId);
    return;
  }

  if (hotelProjects.some((project) => project.id === projectId)) {
    markProjectDeleted(projectId);
    return;
  }

  try {
    const images = await getProjectImages(projectId);

    for (const imageUrl of images) {
      await deleteProjectImage(projectId, imageUrl);
    }

    const { error: updatesError } = await supabase
      .from("project_updates")
      .delete()
      .eq("project_id", projectId);

    if (updatesError) {
      throw updatesError;
    }

    const { error } = await supabase.from("projects").delete().eq("id", projectId);

    if (error) {
      const message = error.message || "";
      const permissionDenied = /permission denied|42501|GRANT DELETE/i.test(message);
      const missingProject = /no rows|PGRST116|not found|does not exist/i.test(message);

      if (permissionDenied) {
        throw new Error(
          "لا توجد صلاحية حذف على جدول projects. السبب: الدور الحالي لا يملك DELETE على public.projects."
        );
      }

      if (missingProject) {
        markProjectDeleted(projectId);
        return;
      }

      throw error;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isMissingProject = /no rows|PGRST116|not found|does not exist|permission denied|42501|GRANT DELETE/i.test(message);

    if (isMissingProject) {
      if (/permission denied|42501|GRANT DELETE/i.test(message)) {
        throw new Error(
          "لا توجد صلاحية حذف على جدول projects. السبب: الدور الحالي لا يملك DELETE على public.projects."
        );
      }

      markProjectDeleted(projectId);
      return;
    }

    throw error;
  }
}

export async function updateProject(
  projectId: string,
  updates: ProjectUpdateInput,
): Promise<void> {
  const { payload, droppedFields } = await sanitizeProjectUpdatePayload(updates);

  if (Object.keys(payload).length === 0) {
    console.warn("Skipping project update because payload has no valid columns.", {
      projectId,
      originalPayload: updates,
      droppedFields,
    });
    return;
  }

  console.log("Project update payload (sanitized):", {
    projectId,
    payload,
    droppedFields,
    originalPayload: updates,
  });

  const { error } = await supabase.from("projects").update(payload).eq("id", projectId);

  if (error) {
    const problemField = extractProblemField(error.message || "", droppedFields);

    console.error("Project update failed");
    console.error("Problematic field:", problemField);
    console.error("Project ID:", projectId);
    console.error("Original payload:", updates);
    console.error("Sanitized payload:", payload);
    console.error("Dropped fields:", droppedFields);
    console.error("Supabase message:", error.message);
    console.error("Supabase details:", error.details);
    console.error("Supabase hint:", error.hint);
    console.error("Supabase full error:", error);

    throw new Error(
      `فشل تحديث المشروع. الحقل المحتمل: ${problemField}. رسالة Supabase: ${error.message}`,
    );
  }
}

export async function uploadProjectImage(
  projectId: string,
  file: File,
  isMain: boolean = false,
): Promise<string> {
  const fileName = `${projectId}/${Date.now()}-${file.name}`;

  // Upload to storage
  const { data, error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    throw uploadError;
  }

  if (!data) {
    throw new Error("Failed to upload image");
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("project-images").getPublicUrl(fileName);

  // Insert into project_images table
  const { error: dbError } = await supabase.from("project_images").insert({
    project_id: projectId,
    image_url: publicUrl,
    image_name: file.name,
    is_main: isMain,
  });

  if (dbError) {
    throw dbError;
  }

  return publicUrl;
}

export async function deleteProjectImage(projectId: string, imageUrl: string): Promise<void> {
  // Extract file path from URL
  const urlParts = imageUrl.split("/");
  const fileName = urlParts[urlParts.length - 1];
  const filePath = `${projectId}/${fileName}`;

  // Delete from storage
  const { error: storageError } = await supabase.storage.from("project-images").remove([filePath]);

  if (storageError) {
    throw storageError;
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from("project_images")
    .delete()
    .eq("project_id", projectId)
    .eq("image_url", imageUrl);

  if (dbError) {
    throw dbError;
  }
}

export async function setMainProjectImage(projectId: string, imageUrl: string): Promise<void> {
  // Set all images to is_main = false
  await supabase.from("project_images").update({ is_main: false }).eq("project_id", projectId);

  // Set the selected image to is_main = true
  const { error } = await supabase
    .from("project_images")
    .update({ is_main: true })
    .eq("project_id", projectId)
    .eq("image_url", imageUrl);

  if (error) {
    throw error;
  }
}

export async function getProjectImagesWithMain(
  projectId: string,
): Promise<{ url: string; isMain: boolean }[]> {
  const { data, error } = await supabase
    .from("project_images")
    .select("image_url, is_main")
    .eq("project_id", projectId);

  if (error) {
    throw error;
  }

  return ((data ?? []) as { image_url: string; is_main?: boolean }[]).map((img) => ({
    url: img.image_url,
    isMain: img.is_main ?? false,
  }));
}
