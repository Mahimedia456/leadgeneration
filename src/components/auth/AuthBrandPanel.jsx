import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const stats = [
  { label: "Brands Managed", value: "24+" },
  { label: "Active Campaigns", value: "1.2k" },
  { label: "Lead Records", value: "890k" },
];

export default function AuthBrandPanel() {
  return (
    <section className="relative hidden min-h-screen w-1/2 overflow-hidden border-r border-white/10 lg:flex">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,12,20,0.98),rgba(9,16,28,0.96),rgba(14,24,42,0.94))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(17,82,212,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 flex w-full flex-col justify-between p-14 xl:p-20">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-xl">
              <img
                src={logo}
                alt="Mahimedia Solutions"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Unified Marketing OS
              </p>
              <h3 className="text-2xl font-black tracking-tight text-white">
                Mahimedia Solutions
              </h3>
            </div>
          </div>

          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Multi-brand command center
            </span>

            <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-tight text-white xl:text-6xl">
              Manage brands,
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                campaigns and leads
              </span>
              from one place.
            </h1>

            <p className="max-w-xl text-lg leading-8 text-slate-300">
              Secure enterprise workflow for campaign visibility, Meta
              integrations, workspace access control, and region-wise lead
              distribution across all your brands.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <p className="text-2xl font-black text-white">{item.value}</p>
                <p className="mt-2 text-sm text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Platform Highlights
                </p>
                <h4 className="mt-1 text-lg font-bold text-white">
                  Real-time enterprise operations
                </h4>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                <span className="material-symbols-outlined">insights</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Meta Ready</p>
                <p className="mt-1 text-sm text-slate-400">
                  Facebook pages, Instagram accounts, campaigns, and lead sync.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">Role Based</p>
                <p className="mt-1 text-sm text-slate-400">
                  Secure workspace access for admins, analysts, managers, and teams.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold text-white">
              Need invited account setup?
            </p>
            <p className="text-sm text-slate-400">
              Finish onboarding and join your assigned brand workspace.
            </p>
          </div>

          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Open Invite
            <span className="material-symbols-outlined text-[18px]">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}