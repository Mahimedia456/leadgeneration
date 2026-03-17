import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import logo from "../../assets/logo.png";
import {
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  getInvitationByTokenApi,
  signupWithInvitationApi,
} from "../../lib/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingInvite, setLoadingInvite] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [formError, setFormError] = useState("");

  const [invitation, setInvitation] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  useEffect(() => {
    async function loadInvitation() {
      setInviteError("");
      setLoadingInvite(true);

      try {
        if (!token) {
          throw new Error("Invitation token is missing");
        }

        const data = await getInvitationByTokenApi(token);
        const invite = data.invitation;

        setInvitation(invite);
        setForm((prev) => ({
          ...prev,
          email: invite.email || "",
        }));
      } catch (err) {
        setInviteError(err.message || "Failed to load invitation");
      } finally {
        setLoadingInvite(false);
      }
    }

    loadInvitation();
  }, [token]);

  const inviterInitials = useMemo(() => {
    const fullName = invitation?.inviter?.full_name || "Admin User";
    return fullName
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [invitation]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!token) {
      setFormError("Invitation token is missing");
      return;
    }

    if (!form.fullName.trim()) {
      setFormError("Full name is required");
      return;
    }

    if (!form.password || form.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (!form.terms) {
      setFormError("Please accept the terms to continue");
      return;
    }

    setSubmitting(true);

    try {
      await signupWithInvitationApi({
        inviteToken: token,
        fullName: form.fullName.trim(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setFormError(err.message || "Failed to complete account setup");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInvite) {
    return (
      <AuthLayout showHelp={false}>
        <main className="mx-auto w-full max-w-[1100px]">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Mahimedia Solutions" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Mahimedia<span className="text-blue-500">.</span>
              </span>
            </div>
          </div>

          <div className="auth-glass-card rounded-[28px] p-10 text-center">
            <p className="text-slate-500 dark:text-slate-400">Loading invitation...</p>
          </div>
        </main>
      </AuthLayout>
    );
  }

  if (inviteError || !invitation) {
    return (
      <AuthLayout showHelp={false}>
        <main className="mx-auto w-full max-w-[800px]">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Mahimedia Solutions" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Mahimedia<span className="text-blue-500">.</span>
              </span>
            </div>
          </div>

          <div className="auth-glass-card rounded-[28px] p-10 text-center">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Invitation Unavailable
            </h1>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {inviteError || "This invitation is invalid or expired."}
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white"
            >
              Back to Login
            </Link>
          </div>
        </main>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout showHelp={false}>
      <main className="mx-auto w-full max-w-[1100px]">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Mahimedia Solutions" className="h-10 w-10 object-contain" />
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
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

              {formError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                  {formError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="blue-gradient-btn flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Setting Up..." : "Accept Invitation & Setup Account"}
                {!submitting && <ArrowRight size={18} />}
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
                    Invited Workspace
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {invitation?.workspace?.name || "-"}
                  </p>
                </div>

                <div className="border-b border-slate-200 pb-4 dark:border-white/10">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Assigned Role
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {invitation?.member_role || "workspace_editor"}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Inviter
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10 font-bold text-blue-500">
                      {inviterInitials}
                    </div>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {invitation?.inviter?.full_name || "Workspace Admin"}
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
