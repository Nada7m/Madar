import { useEffect, useRef, useState } from "react";
import { X, AlertCircle, CheckCircle, Trash2, Star } from "lucide-react";
import { type Project, CATEGORIES, STATUSES } from "@/data/projects";
import {
  updateProject,
  type ProjectUpdateInput,
  uploadProjectImage,
  deleteProjectImage as deleteSupabaseProjectImage,
  setMainProjectImage,
  getProjectImagesWithMain,
} from "@/lib/supabase";
import {
  uploadProjectImages,
  deleteProjectImage as deleteLocalProjectImage,
} from "@/lib/imageUpload";

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type EditFormData = {
  project_name: string;
  description: string;
  category: string;
  status: string;
  progress: number;
  start_date: string;
  end_date: string;
  executing_entity: string;
  area_value: string;
  area_unit: string;
  latitude: string;
  longitude: string;
};

// Map Arabic status/category to English codes for database
const statusToCode: { [key: string]: string } = {
  مكتمل: "completed",
  "قيد التنفيذ": "in_progress",
  مخطط: "planned",
};

function createFormDataFromProject(project: Project): EditFormData {
  return {
    project_name: project.name || "",
    description: project.description || "",
    category: project.category || "",
    status: project.status || "",
    progress: project.progress ?? 0,
    start_date: project.startDate || "",
    end_date: project.endDate || "",
    executing_entity: project.executorEntity || "",
    area_value: project.area || "",
    area_unit: project.areaUnit || "م²",
    latitude: project.lat?.toString() || "",
    longitude: project.lng?.toString() || "",
  };
}

function normalizeStringValue(value: string): string {
  return value.trim();
}

function buildChangedProjectPayload(
  initialData: EditFormData,
  currentData: EditFormData,
): ProjectUpdateInput {
  const payload: ProjectUpdateInput = {};

  const maybeSetString = (field: keyof EditFormData, payloadKey: keyof ProjectUpdateInput) => {
    const before = normalizeStringValue(String(initialData[field] ?? ""));
    const after = normalizeStringValue(String(currentData[field] ?? ""));
    if (before !== after) {
      (payload as Record<string, unknown>)[payloadKey] = after;
    }
  };

  maybeSetString("project_name", "project_name");
  maybeSetString("description", "description");
  maybeSetString("category", "category");
  maybeSetString("status", "status");
  maybeSetString("start_date", "start_date");
  maybeSetString("end_date", "end_date");
  maybeSetString("executing_entity", "executing_entity");
  maybeSetString("area_value", "area_value");
  maybeSetString("area_unit", "area_unit");

  if (initialData.progress !== currentData.progress) {
    payload.progress = currentData.progress;
  }

  const initialLat = normalizeStringValue(initialData.latitude);
  const currentLat = normalizeStringValue(currentData.latitude);
  if (initialLat !== currentLat) {
    payload.latitude = currentLat === "" ? null : Number(currentLat);
  }

  const initialLng = normalizeStringValue(initialData.longitude);
  const currentLng = normalizeStringValue(currentData.longitude);
  if (initialLng !== currentLng) {
    payload.longitude = currentLng === "" ? null : Number(currentLng);
  }

  return payload;
}

export function EditProjectModal({ project, isOpen, onClose, onSuccess }: EditProjectModalProps) {
  const [formData, setFormData] = useState<EditFormData>(createFormDataFromProject(project));

  const [images, setImages] = useState<{ url: string; isMain: boolean }[]>(
    project.images.map((url) => ({ url, isMain: false })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(createFormDataFromProject(project));
    setError(null);
    setSuccess(false);

    let isMounted = true;
    (async () => {
      try {
        const latestImages = await getProjectImagesWithMain(project.id);
        if (!isMounted) return;

        if (latestImages.length > 0) {
          setImages(latestImages);
        } else {
          setImages(project.images.map((url) => ({ url, isMain: false })));
        }
      } catch {
        if (!isMounted) return;
        setImages(project.images.map((url) => ({ url, isMain: false })));
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [isOpen, project]);

  if (!isOpen) return null;

  const handleChange = (field: keyof EditFormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const validateForm = (): string | null => {
    if (!formData.project_name.trim()) return "اسم المشروع مطلوب";
    if (!formData.description.trim()) return "وصف المشروع مطلوب";
    if (!formData.category) return "نوع المشروع مطلوب";
    if (!formData.status) return "حالة المشروع مطلوبة";
    if (formData.progress < 0 || formData.progress > 100)
      return "نسبة الإنجاز يجب أن تكون بين 0 و 100";
    if (formData.latitude && isNaN(Number(formData.latitude)))
      return "خط العرض يجب أن يكون رقماً صحيحاً";
    if (formData.longitude && isNaN(Number(formData.longitude)))
      return "خط الطول يجب أن يكون رقماً صحيحاً";
    return null;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("يجب أن يكون الملف صورة");
      return;
    }

    setUploadingImage(true);
    setError(null);

    try {
      const isMainImage = images.length === 0; // First image is main
      let url: string;
      try {
        url = await uploadProjectImage(project.id, file, isMainImage);
      } catch (supabaseError) {
        if (!import.meta.env.DEV) throw supabaseError;
        const [uploadedImage] = await uploadProjectImages(project.id, [file]);
        url = uploadedImage.url;
      }
      setImages((prev) => [...prev, { url, isMain: isMainImage }]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تحميل الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      try {
        await deleteSupabaseProjectImage(project.id, imageUrl);
      } catch (supabaseError) {
        if (!import.meta.env.DEV || !imageUrl.startsWith("/uploads/projects/")) {
          throw supabaseError;
        }
        await deleteLocalProjectImage(project.id, imageUrl);
      }
      setImages((prev) => prev.filter((img) => img.url !== imageUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل حذف الصورة");
    } finally {
      setLoading(false);
    }
  };

  const handleSetMainImage = async (imageUrl: string) => {
    setLoading(true);
    setError(null);

    try {
      await setMainProjectImage(project.id, imageUrl);
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isMain: img.url === imageUrl,
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل تعيين الصورة الرئيسية");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const initialData = createFormDataFromProject(project);
      const changedPayload = buildChangedProjectPayload(initialData, formData);

      if (changedPayload.status) {
        changedPayload.status = statusToCode[changedPayload.status] || changedPayload.status;
      }

      // Remove any accidental undefined values before calling API.
      const cleanPayload = Object.fromEntries(
        Object.entries(changedPayload).filter(([, value]) => value !== undefined),
      ) as ProjectUpdateInput;

      await updateProject(project.id, cleanPayload);

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحديث المشروع");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-h-[90vh] overflow-y-auto bg-background rounded-t-2xl sm:rounded-2xl sm:max-w-2xl shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <h2 className="text-xl font-bold text-foreground">تعديل المشروع</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">تم تحديث المشروع بنجاح!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Image Management Section */}
          <div className="space-y-3 border-b border-border pb-4">
            <h3 className="text-sm font-semibold text-foreground">إدارة الصور</h3>

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img) => (
                  <div key={img.url} className="relative group">
                    <img
                      src={img.url}
                      alt="Project"
                      className="h-24 w-full object-cover rounded-lg border border-border"
                    />
                    {img.isMain && (
                      <div className="absolute top-1 right-1 bg-primary text-white p-1 rounded-full">
                        <Star className="h-3 w-3 fill-current" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                      {!img.isMain && (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(img.url)}
                          disabled={loading}
                          title="جعل الصورة الرئيسية"
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full"
                        >
                          <Star className="h-4 w-4 text-white" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.url)}
                        disabled={loading}
                        title="حذف الصورة"
                        className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage || loading}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage || loading}
                className="w-full rounded-lg border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 disabled:opacity-50 transition"
              >
                {uploadingImage ? "جاري التحميل..." : "اضغط لتحميل صورة جديدة"}
              </button>
            </div>
          </div>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">اسم المشروع *</label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => handleChange("project_name", e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="أدخل اسم المشروع"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">وصف المشروع *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="أدخل وصف المشروع"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                نوع المشروع *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              >
                <option value="">اختر النوع</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">الحالة *</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              >
                <option value="">اختر الحالة</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                نسبة الإنجاز: {formData.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleChange("progress", Number(e.target.value))}
                disabled={loading}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">وحدة المساحة</label>
              <select
                value={formData.area_unit}
                onChange={(e) => handleChange("area_unit", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              >
                <option value="م²">م²</option>
                <option value="كم²">كم²</option>
                <option value="هكتار">هكتار</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                تاريخ البداية
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => handleChange("start_date", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="2024م"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                تاريخ النهاية
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => handleChange("end_date", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="2026م"
              />
            </div>
          </div>

          {/* Entities */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">الجهة المنفذة</label>
            <input
              type="text"
              value={formData.executing_entity}
              onChange={(e) => handleChange("executing_entity", e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="أدخل الجهة المنفذة"
            />
          </div>

          {/* Area */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">المساحة</label>
            <input
              type="text"
              value={formData.area_value}
              onChange={(e) => handleChange("area_value", e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
              placeholder="أدخل المساحة"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                خط العرض (Latitude)
              </label>
              <input
                type="text"
                value={formData.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="24.5265"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                خط الطول (Longitude)
              </label>
              <input
                type="text"
                value={formData.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                disabled={loading}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                placeholder="39.6289"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2 font-medium text-foreground transition hover:bg-secondary disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "جاري التحديث..." : "حفظ التغييرات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
