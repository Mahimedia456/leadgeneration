import { useMemo, useState } from "react";
import AppShell from "../../layouts/AppShell";
import {
  Search,
  CheckCheck,
  Trash2,
  UserPlus,
  Cpu,
  Megaphone,
  Users,
  Shield,
  MoreVertical,
} from "lucide-react";

const tabs = ["All", "Unread", "System", "Leads", "Campaigns"];

const initialNotifications = [
  {
    id: 1,
    title: "New High-Value Lead",
    description:
      "Sarah Jenkins from Enterprise Co. just downloaded the whitepaper. Immediate follow-up recommended.",
    type: "Leads",
    badge: "Urgent",
    badgeTone: "danger",
    time: "2 mins ago",
    unread: true,
    icon: UserPlus,
  },
  {
    id: 2,
    title: "System Update Complete",
    description:
      "Version 2.4.0 rollout was successful. Check the changelog for new automation features.",
    type: "System",
    badge: "System",
    badgeTone: "neutral",
    time: "1h ago",
    unread: false,
    icon: Cpu,
  },
  {
    id: 3,
    title: "Campaign Performance Alert",
    description:
      '"Q4 Retargeting" has reached its daily budget cap. Adjust settings to keep it running.',
    type: "Campaigns",
    badge: "Warning",
    badgeTone: "warning",
    time: "3h ago",
    unread: true,
    icon: Megaphone,
  },
  {
    id: 4,
    title: "Team Member Assigned",
    description:
      "Alex Rivera has been added to the North America Sales territory.",
    type: "Leads",
    badge: "Leads",
    badgeTone: "neutral",
    time: "5h ago",
    unread: false,
    icon: Users,
  },
  {
    id: 5,
    title: "Security Login Detected",
    description:
      "A new login was detected from a Chrome browser on Windows in Seattle, WA.",
    type: "System",
    badge: "Security",
    badgeTone: "neutral",
    time: "Yesterday",
    unread: false,
    icon: Shield,
  },
];

function badgeClass(tone) {
  if (tone === "danger") {
    return "bg-rose-500/10 text-rose-500";
  }
  if (tone === "warning") {
    return "bg-amber-500/10 text-amber-500";
  }
  if (tone === "success") {
    return "bg-emerald-500/10 text-emerald-500";
  }
  return "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400";
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(initialNotifications);

  const filteredNotifications = useMemo(() => {
    let list = [...notifications];

    if (activeTab === "Unread") {
      list = list.filter((item) => item.unread);
    } else if (activeTab !== "All") {
      list = list.filter((item) => item.type === activeTab);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, notifications, query]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const handleClearRead = () => {
    setNotifications((prev) => prev.filter((item) => item.unread));
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: !item.unread } : item
      )
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">
              Message Center
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Monitor system alerts, lead updates, campaign events, and user activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleMarkAllRead}
              className="auth-outline-btn flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>

            <button
              onClick={handleClearRead}
              className="flex items-center gap-2 rounded-2xl border border-rose-500/15 bg-rose-500/5 px-5 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-500/10"
            >
              <Trash2 size={16} />
              Clear selected
            </button>
          </div>
        </div>

        <div className="app-panel p-4 md:p-5">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 dark:border-white/10 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                const count =
                  tab === "Unread" ? unreadCount : tab === "All" ? notifications.length : null;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={
                      isActive
                        ? "rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(37,99,235,0.6)]"
                        : "rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-slate-300 dark:hover:bg-white/[0.09]"
                    }
                  >
                    <span>{tab}</span>
                    {count !== null && (
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full max-w-sm">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications..."
                className="auth-minimal-input w-full rounded-2xl py-3 pl-11 pr-10 text-sm text-slate-900 placeholder:text-slate-400 dark:text-white"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 dark:hover:text-white">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                  <Shield size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No notifications found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Try changing your filters or search query to find matching notifications.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className={`rounded-[1.5rem] border p-4 transition-all md:p-5 ${
                      item.unread
                        ? "border-blue-500/40 bg-blue-500/[0.06] shadow-[0_18px_40px_-26px_rgba(37,99,235,0.45)]"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-white/5 dark:bg-white/[0.02] dark:hover:border-white/10"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          item.unread
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-slate-200 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3
                              className={`truncate text-base ${
                                item.unread
                                  ? "font-bold text-slate-900 dark:text-white"
                                  : "font-semibold text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 md:ml-6">
                            <span className="whitespace-nowrap text-xs font-medium text-slate-400">
                              {item.time}
                            </span>
                            {item.unread && (
                              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${badgeClass(
                              item.badgeTone
                            )}`}
                          >
                            {item.badge}
                          </span>

                          <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500">
                            {item.type}
                          </span>

                          <button
                            onClick={() => handleToggleRead(item.id)}
                            className="ml-auto text-xs font-semibold text-blue-500 transition hover:text-blue-400"
                          >
                            {item.unread ? "Mark read" : "Mark unread"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {filteredNotifications.length > 0 && (
            <div className="pt-6 text-center">
              <button className="auth-outline-btn rounded-2xl px-6 py-3 text-sm font-semibold">
                Load previous notifications
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}