import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useMemo, useState } from "react";
import { Users, UserCheck, UserX } from "lucide-react";

export const Route = createFileRoute("/system-management")({
  component: SystemManagementPage,
  head: () => ({
    meta: [
      { title: "إدارة النظام — مدار" },
      { name: "description", content: "لوحة استعراضية لإدارة حسابات الموظفين" },
    ],
  }),
});

type Employee = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

const MOCK_EMPLOYEES: Employee[] = [
  { id: "emp-001", name: "سلمان الحربي", email: "salman.harbi@madar.sa", isActive: true },
  { id: "emp-002", name: "نورة العمري", email: "noura.omari@madar.sa", isActive: true },
  { id: "emp-003", name: "أحمد الغامدي", email: "ahmed.ghamdi@madar.sa", isActive: false },
  { id: "emp-004", name: "ريم الأنصاري", email: "reem.ansari@madar.sa", isActive: true },
  { id: "emp-005", name: "عبدالملك الزهراني", email: "abdulmalik.zahrani@madar.sa", isActive: false },
  { id: "emp-006", name: "مي العوفي", email: "mai.oufi@madar.sa", isActive: true },
];

function SystemManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);

  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((employee) => employee.isActive).length;
    const disabled = total - active;

    return { total, active, disabled };
  }, [employees]);

  const handleToggleEmployee = (id: string) => {
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === id ? { ...employee, isActive: !employee.isActive } : employee,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="gold-divider" />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">إدارة النظام</h1>
            <p className="mt-1 text-sm text-muted-foreground">صفحة استعراضية مخصصة لمدير النظام.</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard
            icon={Users}
            title="عدد الموظفين"
            value={metrics.total}
            accent="#2d5a3f"
          />
          <MetricCard
            icon={UserCheck}
            title="الحسابات النشطة"
            value={metrics.active}
            accent="#3f7358"
          />
          <MetricCard
            icon={UserX}
            title="الحسابات المعطلة"
            value={metrics.disabled}
            accent="#a68a5c"
          />
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-bold text-foreground">جدول الموظفين</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="border-b border-border bg-secondary/40 px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                    الاسم
                  </th>
                  <th className="border-b border-border bg-secondary/40 px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                    البريد الإلكتروني
                  </th>
                  <th className="border-b border-border bg-secondary/40 px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                    حالة الحساب
                  </th>
                  <th className="border-b border-border bg-secondary/40 px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                    الإجراء
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="border-b border-border/70 px-4 py-3 text-sm font-semibold text-foreground">
                      {employee.name}
                    </td>
                    <td className="border-b border-border/70 px-4 py-3 text-sm text-muted-foreground" dir="ltr">
                      {employee.email}
                    </td>
                    <td className="border-b border-border/70 px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          employee.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {employee.isActive ? "نشط" : "معطل"}
                      </span>
                    </td>
                    <td className="border-b border-border/70 px-4 py-3">
                      <button
                        onClick={() => handleToggleEmployee(employee.id)}
                        className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          employee.isActive
                            ? "border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100"
                            : "border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                        }`}
                      >
                        {employee.isActive ? "تعطيل" : "تنشيط"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
      <div className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </div>
          <div className="mt-3 text-[1.6rem] font-extrabold leading-none text-foreground">{value}</div>
        </div>
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
          style={{ background: `${accent}18`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}