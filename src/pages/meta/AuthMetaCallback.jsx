import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, getSelectedWorkspace } from "../../lib/api";

export default function AuthMetaCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Connecting Meta...");

  useEffect(() => {
    async function run() {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");
        const errorReason = params.get("error_reason");
        const errorDescription = params.get("error_description");

        if (error) {
          throw new Error(
            errorDescription || errorReason || "Meta authorization failed"
          );
        }

        if (!code) {
          throw new Error("Authorization code not found in callback URL");
        }

        const selectedWorkspace = getSelectedWorkspace();
        const workspaceId = selectedWorkspace?.id || selectedWorkspace?.workspace_id || "";

        if (!workspaceId) {
          throw new Error("No workspace selected. Please select a workspace first.");
        }

        await apiFetch("/api/meta/exchange-code", {
          method: "POST",
          auth: true,
          body: { code, workspaceId },
        });

        navigate("/meta/connections?success=1", { replace: true });
      } catch (err) {
        console.error(err);
        setMessage(err.message || "Meta connection failed");

        setTimeout(() => {
          navigate("/meta/connections?error=1", { replace: true });
        }, 1500);
      }
    }

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-xl font-semibold mb-2">Meta Connection</h1>
        <p className="text-sm opacity-80">{message}</p>
      </div>
    </div>
  );
}