import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { ShieldAlert, LayoutDashboard, Building2, LifeBuoy } from "lucide-react";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <AuthLayout showHelp={false}>
      <main className="mx-auto w-full max-w-md auth-shell-glow">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Mahimedia Solutions"
              className="h-10 w-10 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mahimedia<span className="text-blue-500">.</span>
            </span>
          </div>
        </div>

        <section className="auth-glass-card rounded-[28px] p-8 shadow-2xl md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5 text-blue-400">
              <ShieldAlert size={34} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Security Protocol 403
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
              Access Denied
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              You do not have permission to access this area.
            </p>

            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-500">
              You may need a different role or workspace assignment. If this
              seems incorrect, contact your administrator.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="blue-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate("/workspace-selection")}
              className="auth-outline-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold"
            >
              <Building2 size={18} />
              Switch Workspace
            </button>

            <button
              type="button"
              className="auth-outline-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold"
            >
              <LifeBuoy size={18} />
              Contact Admin
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <a href="#" className="transition hover:text-blue-400">
              System Status
            </a>
            <a href="#" className="transition hover:text-blue-400">
              Documentation
            </a>
            <a href="#" className="transition hover:text-blue-400">
              Support Center
            </a>
          </div>
        </section>

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            © 2025 Mahimedia Solutions. Secure Identity Access enabled.
          </p>
        </footer>
      </main>
    </AuthLayout>
  );
}