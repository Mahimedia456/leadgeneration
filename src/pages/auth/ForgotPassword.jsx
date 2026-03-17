import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { ArrowLeft } from "lucide-react";
import { forgotPasswordApi, setResetEmail } from "../../lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      await forgotPasswordApi({
        email: normalizedEmail,
      });

      setResetEmail(normalizedEmail);
      setSuccess("Verification code sent successfully.");

      setTimeout(() => {
        navigate("/verify-otp");
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to send reset code");
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
              Forgot Password?
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Enter your email address and we&apos;ll send you a verification code.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-minimal-input w-full rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-500 dark:text-white"
              />
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
              {loading ? "Sending..." : "Send Reset Code"}
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

        <footer className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            © 2025 Mahimedia Solutions. All rights reserved.
          </p>
        </footer>
      </main>
    </AuthLayout>
  );
}