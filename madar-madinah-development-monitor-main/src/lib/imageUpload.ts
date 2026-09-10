/**
 * Local development image upload handler
 * This utility provides a safe way to upload images during development
 * Images are written to the repository public/uploads/projects directory
 * 
 * IMPORTANT: This is development-only functionality
 * Production builds will not expose this capability
 */

export interface UploadedImage {
  path: string;
  filename: string;
  url: string;
}

/**
 * Upload image files for a project (development mode only)
 * @param projectId - The project ID
 * @param files - Image files to upload
 * @returns Array of uploaded image paths for the project.images array
 */
export async function uploadProjectImages(
  projectId: string,
  files: File[],
): Promise<UploadedImage[]> {
  // Only allow in development mode
  if (!import.meta.env.DEV) {
    throw new Error("Image upload is only available in development mode");
  }

  const uploadedImages: UploadedImage[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error(`File ${file.name} is not an image`);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error(`File ${file.name} is too large (max 10MB)`);
    }

    // Generate safe filename
    const timestamp = Date.now();
    const ext = file.type.split("/")[1] || "jpg";
    const safeFilename = `${projectId}-${timestamp}-${i}.${ext}`;
    const relativePath = `/uploads/projects/${projectId}/${safeFilename}`;

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("projectId", projectId);
      formData.append("filename", safeFilename);

      // Send to development API endpoint
      const response = await fetch("/__dev__/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
      }

      const result = await response.json();

      uploadedImages.push({
        path: relativePath,
        filename: safeFilename,
        url: result.url || relativePath,
      });
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      throw error;
    }
  }

  return uploadedImages;
}

/**
 * Delete an uploaded image (development mode only)
 * @param projectId - The project ID
 * @param imagePath - The relative path to the image
 */
export async function deleteProjectImage(
  projectId: string,
  imagePath: string,
): Promise<void> {
  // Only allow in development mode
  if (!import.meta.env.DEV) {
    throw new Error("Image deletion is only available in development mode");
  }

  try {
    const response = await fetch("/__dev__/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, imagePath }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Deletion failed: ${error}`);
    }
  } catch (error) {
    console.error(`Failed to delete ${imagePath}:`, error);
    throw error;
  }
}
