import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useState } from "react";
import { setRole } from "@/lib/auth";
import { useLocale } from "@/lib/i18n";
import { UserCog, User } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "تسجيل الدخول — مدار" }] }),
});

function LoginPage() {
  const locale = useLocale();
  const isEnglish = locale === "en";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (r: "employee" | "guest") => {
    setRole(r);
    navigate({ to: r === "employee" ? "/projects" : "/map" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-lg px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <div className="gold-divider mb-4" />
          <h1 className="text-2xl font-bold text-foreground">{isEnglish ? "Login" : "تسجيل الدخول"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isEnglish ? "Choose the entry type to continue." : "اختر نوع الدخول للمتابعة."}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login("employee");
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={isEnglish ? "Username" : "اسم المستخدم"}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEnglish ? "Password" : "كلمة المرور"}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              <UserCog className="h-4 w-4" /> {isEnglish ? "Login as employee" : "دخول كموظف"}
            </button>
          </form>

          <div className="my-4 text-center text-xs text-muted-foreground">{isEnglish ? "or" : "أو"}</div>

          <button
            onClick={() => login("guest")}
            className="btn-outline w-full inline-flex items-center justify-center gap-2"
          >
            <User className="h-4 w-4" /> {isEnglish ? "Continue as guest" : "الدخول كضيف"}
          </button>
        </div>
      </div>
    </div>
  );
}
