import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllProjectsWithLocal } from "@/lib/supabase";
import { getCategoryLabel, getStatusLabel } from "@/lib/display";
import { isEmployee } from "@/lib/auth";
import { CATEGORIES, STATUSES, type Project } from "@/data/projects";
import { useEffect, useMemo, useState } from "react";
import { FileDown, FileSpreadsheet, CheckSquare, Square } from "lucide-react";
import {
  exportProjectsPDF,
  exportProjectsExcel,
  exportProjectPDF,
  exportProjectExcel,
} from "@/lib/exports";

export const Route = createFileRoute("/reports")({
  beforeLoad: () => {
    if (!isEmployee()) {
      throw redirect({ to: "/" });
    }
  },
  component: ReportsPage,
  head: () => ({ meta: [{ title: "التقارير — مدار" }] }),
});

function ReportsPage() {
  const [all, setAll] = useState<Project[]>([]);
  const [cat, setCat] = useState("");
  const [st, setSt] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    getAllProjectsWithLocal().then(setAll).catch(console.error);
  }, []);

  const filtered = useMemo(
    () => all.filter((p) => (!cat || p.category === cat) && (!st || p.status === st)),
    [all, cat, st],
  );

  const selectedList = useMemo(
    () => filtered.filter((p) => selected.has(p.id)),
    [filtered, selected],
  );
  const allChecked = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => {
    const s = new Set(selected);
    if (allChecked) filtered.forEach((p) => s.delete(p.id));
    else filtered.forEach((p) => s.add(p.id));
    setSelected(s);
  };
  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) {
      s.delete(id);
    } else {
      s.add(id);
    }
    setSelected(s);
  };

  const exportList = selectedList.length > 0 ? selectedList : filtered;
  const exportLabel =
    selectedList.length > 0 ? `المحددة (${selectedList.length})` : `المعروضة (${filtered.length})`;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="gold-divider" />
        <h1 className="mt-3 text-3xl font-bold text-foreground">التقارير</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          صدّر تقارير المشاريع بصيغة PDF (طباعة) أو Excel. حدّد مشاريع بعينها من الجدول لتصدير مخصص.
        </p>

        {/* Filter + Bulk export */}
        <div className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">
              تصفية بالتصنيف
            </label>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="mt-1 block w-48 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">كل التصنيفات</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">تصفية بالحالة</label>
            <select
              value={st}
              onChange={(e) => setSt(e.target.value)}
              className="mt-1 block w-40 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">كل الحالات</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="mr-auto flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">تصدير {exportLabel}:</span>
            <button
              onClick={() => exportProjectsPDF(exportList, "تقرير المشاريع").catch(console.error)}
              disabled={exportList.length === 0}
              className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" /> PDF
            </button>
            <button
              onClick={() => exportProjectsExcel(exportList)}
              disabled={exportList.length === 0}
              className="btn-outline inline-flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <FileSpreadsheet className="h-4 w-4" /> Excel
            </button>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground">
          ملاحظة: تصدير PDF يفتح نافذة طباعة — اختر "حفظ كملف PDF" من مربع الطباعة لضمان دعم كامل
          للنص العربي.
        </p>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs">
              <tr>
                <th className="p-3 w-10">
                  <button onClick={toggleAll} aria-label="تحديد الكل" className="inline-flex">
                    {allChecked ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </th>
                <th className="p-3 text-right">المشروع</th>
                <th className="p-3 text-right">التصنيف</th>
                <th className="p-3 text-right">الحالة</th>
                <th className="p-3 text-right">الإنجاز</th>
                <th className="p-3 text-right">تصدير فردي</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="p-3">
                    <button onClick={() => toggle(p.id)} aria-label="تحديد">
                      {selected.has(p.id) ? (
                        <CheckSquare className="h-4 w-4 text-primary" />
                      ) : (
                        <Square className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 font-medium text-foreground">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{getCategoryLabel(p.category)}</td>
                  <td className="p-3 text-muted-foreground">{getStatusLabel(p.status)}</td>
                  <td className="p-3 text-muted-foreground">{p.progress}%</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => exportProjectPDF(p).catch(console.error)}
                        className="rounded border border-input px-2 py-1 text-xs hover:bg-secondary inline-flex items-center gap-1"
                      >
                        <FileDown className="h-3 w-3" /> PDF
                      </button>
                      <button
                        onClick={() => exportProjectExcel(p)}
                        className="rounded border border-input px-2 py-1 text-xs hover:bg-secondary inline-flex items-center gap-1"
                      >
                        <FileSpreadsheet className="h-3 w-3" /> Excel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">
                    لا توجد مشاريع مطابقة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
