import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  clearResetEmail,
  getResetEmail,
  resetPasswordApi,
} from "../../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const email = getResetEmail();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Reset email not found. Please restart forgot password flow.");
      return;
    }

    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPasswordApi({
        email,
        newPassword: form.password,
      });

      clearResetEmail();
      setSuccess("Password reset successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
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
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Reset Password
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {email ? `Resetting password for ${email}` : "Create your new password below."}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-500 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="blue-gradient-btn w-full rounded-xl py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-sm text-slate-500 transition hover:text-blue-400"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </section>
      </main>
    </AuthLayout>
  );
}
