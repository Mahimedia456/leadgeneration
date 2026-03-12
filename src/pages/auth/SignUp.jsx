import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, ShieldCheck } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "alex.chen@enterprise.com",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/workspace-selection");
  };

  return (
    <AuthLayout showHelp={false}>
      <main className="mx-auto w-full max-w-[1100px]">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="auth-glass-card animate-soft-glow rounded-[28px] p-8 shadow-2xl md:p-10 lg:col-span-7">
            <header className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-500">
                Invite Activation
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                Complete Your Account Setup
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                You have been invited to join a workspace. Complete your profile
                and activate your access.
              </p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={handleChange}
                      className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-500 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      name="email"
                      type="email"
                      readOnly
                      value={form.email}
                      className="auth-minimal-input w-full cursor-not-allowed rounded-xl py-3 pl-11 pr-4 text-slate-500 dark:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-12 text-slate-900 placeholder:text-slate-500 dark:text-white"
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
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-12 text-slate-900 placeholder:text-slate-500 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400">
                <input
                  className="mt-0.5 h-4 w-4 rounded border-slate-400 bg-transparent text-blue-500 focus:ring-blue-500"
                  type="checkbox"
                  name="terms"
                  checked={form.terms}
                  onChange={handleChange}
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                className="blue-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white"
              >
                Accept Invitation &amp; Setup Account
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Already have access?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-500 transition hover:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-5">
            <div className="auth-glass-card rounded-[28px] p-8">
              <h3 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
                Invite Details
              </h3>

              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4 dark:border-white/10">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Invited Brand
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    Allianz 3
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4 dark:border-white/10">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Assigned Role
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    Marketing Manager
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Inviter
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-500">
                      SJ
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      Sarah Johnson
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-glass-card rounded-[28px] p-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Secure Account Setup
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    Your connection is encrypted. We use industry-standard
                    security protocols to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-10 text-center">
          <p className="text-xs text-slate-500">
            © 2025 Mahimedia Solutions. All rights reserved.
          </p>
        </footer>
      </main>
    </AuthLayout>
  );
}