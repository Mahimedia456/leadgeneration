import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { loginApi, setSession } from "../../lib/api";

const DEMO_USERS = [
  {
    key: "admin",
    label: "Admin Login",
    email: "admin@mahimediasolutions.com",
    password: "mahimediasolutions",
  },
  {
    key: "brandOwner",
    label: "Brand Login",
    email: "brandowner@mahimediasolutions.com",
    password: "mahimediasolutions",
  },
  {
    key: "user1",
    label: "Workspace User 1",
    email: "user1@mahimediasolutions.com",
    password: "mahimediasolutions",
  },
  {
    key: "user2",
    label: "Workspace User 2",
    email: "user2@mahimediasolutions.com",
    password: "mahimediasolutions",
  },
  {
    key: "user3",
    label: "Workspace User 3",
    email: "user3@mahimediasolutions.com",
    password: "mahimediasolutions",
  },
];

function getRedirectPath(user) {
  if (!user) return "/login";

  if (user.globalRole === "admin") {
    return "/brands";
  }

  if (user.globalRole === "brand_user") {
    return "/workspace-selection";
  }

  if (user.globalRole === "workspace_user") {
    return "/workspace-selection";
  }

  return "/access-denied";
}

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [activeDemo, setActiveDemo] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "admin@mahimediasolutions.com",
    password: "mahimediasolutions",
    remember: true,
  });

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fillDemoUser = (demo) => {
    setActiveDemo(demo.key);
    setError("");
    setForm((prev) => ({
      ...prev,
      email: demo.email,
      password: demo.password,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginApi({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });

      navigate(getRedirectPath(data.user), { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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

        <section className="auth-glass-card animate-soft-glow rounded-[28px] p-8 shadow-2xl md:p-10">
          <header className="mb-6 text-center">
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Sign in with your admin, brand, or workspace account.
            </p>
          </header>

          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Quick Demo Access
            </p>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((demo) => {
                const isActive = activeDemo === demo.key;

                return (
                  <button
                    key={demo.key}
                    type="button"
                    onClick={() => fillDemoUser(demo)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-blue-500/50"
                    }`}
                  >
                    {demo.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-minimal-input w-full rounded-xl py-3 pl-11 pr-4 text-slate-900 placeholder:text-slate-500 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-500 transition hover:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>

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

            <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <input
                className="h-4 w-4 rounded border-slate-400 bg-transparent text-blue-500 focus:ring-blue-500"
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
              Remember for 30 days
            </label>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="blue-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Already Invited?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-500 transition hover:text-blue-400"
              >
                Sign up
              </Link>
            </p>
          </div>

          <footer className="mt-10 text-center">
            <p className="text-xs text-slate-500">
              © 2025 Mahimedia Solutions. All rights reserved.
            </p>
          </footer>
        </section>
      </main>
    </AuthLayout>
  );
}