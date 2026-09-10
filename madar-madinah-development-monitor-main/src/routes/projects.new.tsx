import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useEffect, useState } from "react";
import { isEmployee } from "@/lib/auth";
import {
  CATEGORIES,
  STATUSES,
  saveUserProject,
  type ProjectCategory,
  type ProjectStatus,
  type Project,
} from "@/data/projects";
import { Upload, X } from "lucide-react";

export const Route = createFileRoute("/projects/new")({
  component: NewProjectPage,
  head: () => ({ meta: [{ title: "إضافة مشروع — مدار" }] }),
});

function NewProjectPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(isEmployee());
  }, []);

  const [form, setForm] = useState({
    name: "",
    category: CATEGORIES[0] as ProjectCategory,
    description: "",
    lat: "",
    lng: "",
    progress: 0,
    status: STATUSES[0] as ProjectStatus,
    startDate: "",
    endDate: "",
    durationYears: 0,
    ownerEntity: "",
    executorEntity: "",
    area: "",
    areaUnit: "م²",
  });
  const [images, setImages] = useState<string[]>([]);

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = await Promise.all(
      Array.from(files).map(
        (f) =>
          new Promise<string>((res) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.readAsDataURL(f);
          }),
      ),
    );
    setImages((prev) => [...prev, ...arr]);
  };

  if (!allowed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">مطلوب صلاحية موظف</h1>
          <p className="mt-2 text-sm text-muted-foreground">يجب تسجيل الدخول كموظف لإضافة مشروع.</p>
          <Link to="/login" className="btn-primary mt-6 inline-block">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Project = {
      id: `user-${Date.now()}`,
      name: form.name,
      category: form.category,
      description: form.description,
      progress: Number(form.progress),
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      durationYears: Number(form.durationYears),
      ownerEntity: form.ownerEntity,
      executorEntity: form.executorEntity,
      area: form.area,
      areaUnit: form.areaUnit,
      lat: Number(form.lat),
      lng: Number(form.lng),
      images,
    };
    saveUserProject(p);
    navigate({ to: "/projects/$id", params: { id: p.id } });
  };

  const inputCls =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary";
  const labelCls = "text-xs font-semibold text-foreground";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="gold-divider" />
        <h1 className="mt-3 text-3xl font-bold text-foreground">إضافة مشروع جديد</h1>

        <form
          onSubmit={submit}
          className="mt-8 rounded-2xl border border-border bg-card p-6 space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>اسم المشروع</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>التصنيف</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })}
                className={inputCls + " mt-1"}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>الحالة</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
                className={inputCls + " mt-1"}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>خط العرض (Latitude)</label>
              <input
                required
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                className={inputCls + " mt-1"}
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelCls}>خط الطول (Longitude)</label>
              <input
                required
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                className={inputCls + " mt-1"}
                dir="ltr"
              />
            </div>
            <div>
              <label className={labelCls}>نسبة الإنجاز (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>المدة (سنوات)</label>
              <input
                type="number"
                min={0}
                value={form.durationYears}
                onChange={(e) => setForm({ ...form, durationYears: Number(e.target.value) })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>تاريخ البداية</label>
              <input
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="مثال: 2024م"
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>تاريخ النهاية</label>
              <input
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="مثال: 2026م"
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>الجهة المسؤولة</label>
              <input
                value={form.ownerEntity}
                onChange={(e) => setForm({ ...form, ownerEntity: e.target.value })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>الجهة المنفذة</label>
              <input
                value={form.executorEntity}
                onChange={(e) => setForm({ ...form, executorEntity: e.target.value })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>المساحة / الطول</label>
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div>
              <label className={labelCls}>وحدة القياس</label>
              <select
                value={form.areaUnit}
                onChange={(e) => setForm({ ...form, areaUnit: e.target.value })}
                className={inputCls + " mt-1"}
              >
                <option value="م²">م²</option>
                <option value="كم²">كم²</option>
                <option value="م">م (طول)</option>
                <option value="كم">كم (طول)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>الوصف</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className={inputCls + " mt-1"}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>الصور</label>
              <label className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/40 p-6 text-sm text-muted-foreground hover:bg-muted/60">
                <Upload className="h-4 w-4" />
                <span>اختر صور المشروع (متعددة)</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
              </label>
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                    >
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, j) => j !== i))}
                        className="absolute left-1 top-1 rounded-full bg-black/60 p-1 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">
            حفظ المشروع
          </button>
        </form>
      </div>
    </div>
  );
}
