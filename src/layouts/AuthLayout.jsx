import ThemeToggle from "../components/common/ThemeToggle";

export default function AuthLayout({
  children,
  showHelp = false,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden auth-centered-bg">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-10%] h-[34rem] w-[34rem] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/10" />
        <div className="absolute bottom-[-12%] left-[-8%] h-[28rem] w-[28rem] rounded-full bg-blue-400/10 blur-[120px] dark:bg-blue-400/10" />
      </div>

      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}