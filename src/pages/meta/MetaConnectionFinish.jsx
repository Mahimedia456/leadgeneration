import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../../layouts/AppShell";
import { completeMetaConnectionApi } from "../../lib/metaApi";
import { CheckCircle2, LoaderCircle, AlertTriangle } from "lucide-react";

function decodeBase64Url(input) {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded);
}

export default function MetaConnectionFinish() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Finalizing Meta connection...");

  useEffect(() => {
    async function run() {
      try {
        const params = new URLSearchParams(window.location.search);
        const payload = params.get("payload");

        if (!payload) {
          throw new Error("Missing Meta payload");
        }

        const decoded = JSON.parse(decodeBase64Url(payload));
        await completeMetaConnectionApi(decoded);

        setStatus("success");
        setMessage("Meta connection completed successfully.");

        setTimeout(() => {
          navigate("/meta-connections");
        }, 1000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Meta connection failed");
      }
    }

    run();
  }, [navigate]);

  const Icon =
    status === "success"
      ? CheckCircle2
      : status === "error"
      ? AlertTriangle
      : LoaderCircle;

  return (
    <AppShell>
      <div className="mx-auto max-w-3xl">
        <div className="app-panel p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                status === "success"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : status === "error"
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-blue-500/10 text-blue-500"
              }`}
            >
              <Icon
                size={24}
                className={status === "loading" ? "animate-spin" : ""}
              />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Meta Connection
              </h1>
              <p className="mt-3 text-base text-slate-500 dark:text-slate-400">
                {message}
              </p>

              <div className="mt-6">
                <button
                  onClick={() => navigate("/meta-connections")}
                  className="blue-gradient-btn rounded-xl px-5 py-3 text-sm font-semibold text-white"
                >
                  Back to Meta Connections
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}