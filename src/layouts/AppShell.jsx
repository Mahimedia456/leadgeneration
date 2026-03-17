import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";
import ThemeToggle from "../components/common/ThemeToggle";

import {
  LayoutDashboard,
  Building2,
  Users,
  Link2,
  FileText,
  Instagram,
  Megaphone,
  UserRoundSearch,
  BarChart3,
  Settings,
  Search,
  Bell,
  LogOut,
  Plus,
  Activity,
  X,
  BriefcaseBusiness,
  Menu,
} from "lucide-react";

const navGroups = [
  {
    label: "General",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/brands", label: "Brands", icon: Building2 },
      { to: "/users", label: "Users", icon: Users },
      { to: "/meta-connections", label: "Meta Connections", icon: Link2 },
    ],
  },
  {
    label: "Campaigns & Social",
    items: [
      { to: "/meta/pages", label: "Pages", icon: FileText },
      { to: "/meta/instagram", label: "Instagram", icon: Instagram },
      { to: "/campaigns", label: "Campaigns", icon: Megaphone },
      { to: "/leads", label: "Leads", icon: UserRoundSearch },
    ],
  },
  {
    label: "Analytics",
    items: [
      { to: "/distribution", label: "Distribution", icon: Link2 },
      { to: "/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/workspaces", label: "Workspaces", icon: BriefcaseBusiness },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function SidebarItem({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive ? "app-nav-item app-nav-item-active" : "app-nav-item"
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const notifications = [
    {
      title: "New Lead Captured",
      desc: "A new lead submitted a form from Facebook Ads.",
      time: "2m ago",
    },
    {
      title: "Campaign Budget Warning",
      desc: "Retargeting campaign reached 80% budget.",
      time: "1h ago",
    },
    {
      title: "User Login Detected",
      desc: "Login detected from Chrome in New York.",
      time: "3h ago",
    },
  ];

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const handleLogout = () => {
    closeMobileSidebar();
    navigate("/login");
  };

  const renderSidebar = (isMobile = false) => (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-6 py-6 dark:border-[#26262a]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="sidebar-brand-logo-wrap flex h-11 w-11 items-center justify-center">
              <img
                src={logo}
                alt="Mahimedia"
                className="h-7 w-7 object-contain"
              />
            </div>

            <div>
              <p className="text-[17px] font-extrabold text-slate-900 dark:text-white">
                Mahimedia Solutions
              </p>
              <p className="text-xs text-slate-500">Suite</p>
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={closeMobileSidebar}
              className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/[0.03]"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-6">
        <div className="space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.to}
                    {...item}
                    onClick={isMobile ? closeMobileSidebar : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 px-3 py-4 dark:border-[#26262a]">
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/[0.03]"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="app-shell-bg flex h-screen overflow-hidden text-slate-900 dark:text-slate-100">
      <aside className="app-sidebar hidden h-screen w-[250px] shrink-0 flex-col lg:flex">
        {renderSidebar(false)}
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`app-sidebar fixed left-0 top-0 z-50 h-screen w-[280px] shrink-0 flex-col lg:hidden ${
          mobileSidebarOpen ? "flex" : "hidden"
        }`}
      >
        {renderSidebar(true)}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-topbar sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="topbar-action-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-full lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="relative min-w-0 max-w-[650px] flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                placeholder="Search campaigns, users, or data..."
                className="auth-minimal-input w-full rounded-2xl py-3 pl-11 pr-4 text-sm"
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="topbar-action-btn flex h-11 w-11 items-center justify-center rounded-full"
            >
              <Bell size={18} />
            </button>

            <button
              onClick={() => navigate("/activity-logs")}
              className="topbar-action-btn hidden h-11 w-11 items-center justify-center rounded-full sm:flex"
            >
              <Activity size={18} />
            </button>

            <ThemeToggle />

            <div className="hidden h-6 w-px bg-slate-200 dark:bg-[#26262a] md:block" />

            <div className="hidden items-center gap-3 md:flex">
              <div className="text-right">
                <p className="text-sm font-bold">Alexander Chen</p>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  Marketing Director
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white font-bold dark:border-[#26262a] dark:bg-[#161618]">
                AC
              </div>
            </div>

            <button
              onClick={() => navigate("/campaigns/add")}
              className="blue-gradient-btn hidden items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white xl:flex"
            >
              <Plus size={16} />
              New Campaign
            </button>
          </div>
        </header>

        {showNotifications && (
          <div className="fixed right-4 top-[78px] z-50 w-[calc(100vw-2rem)] max-w-[360px] rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-[#26262a] dark:bg-[#161618] sm:right-6 sm:top-[82px]">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-[#26262a]">
              <p className="font-bold">Notifications</p>

              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-500 transition hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto">
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className="border-b border-slate-100 px-5 py-4 hover:bg-slate-50 dark:border-[#26262a] dark:hover:bg-[#1c1c1f]"
                >
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.desc}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                </div>
              ))}
            </div>

            <div className="p-4 text-center">
              <button
                onClick={() => navigate("/notifications")}
                className="text-sm font-semibold text-blue-600"
              >
                View All Notifications
              </button>
            </div>
          </div>
        )}

        <main className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}

          <footer className="mt-8 border-t border-slate-200 pt-5 dark:border-[#26262a]">
            <div className="flex flex-col gap-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} Mahimedia Solutions. All rights reserved.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/privacy-policy")}
                  className="transition hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => navigate("/terms-of-use")}
                  className="transition hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Terms of Use
                </button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}