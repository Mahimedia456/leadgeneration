import { apiFetch, getSelectedWorkspace } from "./api";

function getActiveWorkspaceId() {
  const selectedWorkspace = getSelectedWorkspace();

  if (!selectedWorkspace) return "";

  return (
    selectedWorkspace.id ||
    selectedWorkspace.workspace_id ||
    selectedWorkspace.workspaceId ||
    ""
  );
}

function requireWorkspaceId() {
  const workspaceId = getActiveWorkspaceId();

  if (!workspaceId) {
    throw new Error("No active workspace selected");
  }

  return workspaceId;
}

export async function getMetaOAuthUrlApi() {
  const workspaceId = requireWorkspaceId();

  return apiFetch(`/api/meta/oauth/url?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    auth: true,
  });
}

export async function completeMetaConnectionApi(payload) {
  const workspaceId = payload?.workspace_id || requireWorkspaceId();

  return apiFetch("/api/meta/complete", {
    method: "POST",
    auth: true,
    body: {
      ...payload,
      workspace_id: workspaceId,
    },
  });
}

export async function getMetaConnectionsApi() {
  const workspaceId = requireWorkspaceId();

  return apiFetch(`/api/meta/connections?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    auth: true,
  });
}

export async function syncMetaConnectionApi(connectionId) {
  const workspaceId = requireWorkspaceId();

  return apiFetch(
    `/api/meta/connections/${encodeURIComponent(connectionId)}/sync?workspace_id=${encodeURIComponent(workspaceId)}`,
    {
      method: "POST",
      auth: true,
    }
  );
}

export async function deleteMetaConnectionApi(connectionId) {
  const workspaceId = requireWorkspaceId();

  return apiFetch(
    `/api/meta/connections/${encodeURIComponent(connectionId)}?workspace_id=${encodeURIComponent(workspaceId)}`,
    {
      method: "DELETE",
      auth: true,
    }
  );
}

export async function getMetaPagesApi() {
  const workspaceId = requireWorkspaceId();

  return apiFetch(`/api/meta/pages?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    auth: true,
  });
}

export async function getMetaPageDetailApi(pageId) {
  const workspaceId = requireWorkspaceId();

  return apiFetch(
    `/api/meta/pages/${encodeURIComponent(pageId)}?workspace_id=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
}

export async function getMetaInstagramAccountsApi() {
  const workspaceId = requireWorkspaceId();

  return apiFetch(`/api/meta/instagram?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    auth: true,
  });
}

export async function getMetaInstagramDetailApi(accountId) {
  const workspaceId = requireWorkspaceId();

  return apiFetch(
    `/api/meta/instagram/${encodeURIComponent(accountId)}?workspace_id=${encodeURIComponent(workspaceId)}`,
    {
      method: "GET",
      auth: true,
    }
  );
}

export async function getMetaLeadsApi() {
  const workspaceId = requireWorkspaceId();

  return apiFetch(`/api/meta/leads?workspace_id=${encodeURIComponent(workspaceId)}`, {
    method: "GET",
    auth: true,
  });
}