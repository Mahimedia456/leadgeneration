import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <AuthLayout showHelp={false}>
      <main className="mx-auto w-full max-w-md auth-shell-glow">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mahimedia Solutions" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mahimedia<span className="text-blue-500">.</span>
            </span>
          </div>
        </div>

        <section className="auth-glass-card animate-soft-glow rounded-[28px] p-8 shadow-2xl md:p-10">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white md:text-3xl">
              Create New Password
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Your new password must be different from previous ones.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                New Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-500 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-500 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-blue-500/10 bg-blue-500/5 p-3 text-xs text-slate-500 dark:text-slate-400">
              <ul className="list-inside list-disc space-y-1">
                <li>Minimum 8 characters</li>
                <li>One special character</li>
                <li>One uppercase letter</li>
              </ul>
            </div>

            <button
              type="submit"
              className="blue-gradient-btn w-full rounded-xl px-6 py-4 font-semibold text-white"
            >
              Update Password
            </button>
          </form>

          <footer className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm text-slate-500 transition hover:text-blue-400"
            >
              Back to Login
            </Link>
          </footer>
        </section>

        <div className="mt-8 text-center text-xs text-slate-500">
          © 2025 Mahimedia Solutions
        </div>
      </main>
    </AuthLayout>
  );
}