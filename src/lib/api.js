const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "leadgen_access_token";
const REFRESH_TOKEN_KEY = "leadgen_refresh_token";
const USER_KEY = "leadgen_user";
const RESET_EMAIL_KEY = "leadgen_reset_email";
const SELECTED_WORKSPACE_KEY = "leadgen_selected_workspace";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession({ accessToken, refreshToken, user }) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(RESET_EMAIL_KEY);
  localStorage.removeItem(SELECTED_WORKSPACE_KEY);
}

export function setResetEmail(email) {
  localStorage.setItem(RESET_EMAIL_KEY, email);
}

export function getResetEmail() {
  return localStorage.getItem(RESET_EMAIL_KEY) || "";
}

export function clearResetEmail() {
  localStorage.removeItem(RESET_EMAIL_KEY);
}

export function setSelectedWorkspace(workspace) {
  localStorage.setItem(SELECTED_WORKSPACE_KEY, JSON.stringify(workspace));
}

export function getSelectedWorkspace() {
  const raw = localStorage.getItem(SELECTED_WORKSPACE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSelectedWorkspace() {
  localStorage.removeItem(SELECTED_WORKSPACE_KEY);
}

async function parseJsonSafely(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Unexpected server response" };
  }
}

function getErrorMessage(data, fallback = "Request failed") {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.error?.message) return data.error.message;
  if (data.error_description) return data.error_description;
  if (data.details) return data.details;
  return fallback;
}

export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = false,
  } = options;

  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is missing. Add it in frontend env and restart/redeploy."
    );
  }

  const finalHeaders = {
    ...headers,
  };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined,
    });
  } catch (networkError) {
    const error = new Error("Unable to connect to server");
    error.statusCode = 0;
    error.data = null;
    error.cause = networkError;
    throw error;
  }

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    const error = new Error(
      getErrorMessage(data, `Request failed with status ${response.status}`)
    );
    error.statusCode = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/* ---------------- Auth ---------------- */

export async function loginApi(payload) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: payload,
  });
}

export async function forgotPasswordApi(payload) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export async function verifyOtpApi(payload) {
  return apiFetch("/api/auth/verify-otp", {
    method: "POST",
    body: payload,
  });
}

export async function resetPasswordApi(payload) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

export async function getMyWorkspacesApi() {
  return apiFetch("/api/workspaces/mine", {
    method: "GET",
    auth: true,
  });
}

/* ---------------- Invitations ---------------- */

export async function getInvitationByTokenApi(token) {
  return apiFetch(`/api/invitations/token/${token}`, {
    method: "GET",
  });
}

export async function signupWithInvitationApi(payload) {
  return apiFetch("/api/invitations/signup", {
    method: "POST",
    body: payload,
  });
}

export async function createInvitationApi(payload) {
  return apiFetch("/api/invitations", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function listInvitationsApi(workspaceId = "") {
  const query = workspaceId
    ? `?workspaceId=${encodeURIComponent(workspaceId)}`
    : "";

  return apiFetch(`/api/invitations${query}`, {
    method: "GET",
    auth: true,
  });
}

export async function revokeInvitationApi(invitationId) {
  return apiFetch(`/api/invitations/${invitationId}/revoke`, {
    method: "PATCH",
    auth: true,
  });
}

/* ---------------- Workspaces ---------------- */

export async function getAllWorkspacesApi() {
  return apiFetch("/api/workspaces", {
    method: "GET",
    auth: true,
  });
}

export async function getWorkspaceByIdApi(workspaceId) {
  return apiFetch(`/api/workspaces/${workspaceId}`, {
    method: "GET",
    auth: true,
  });
}

export async function createWorkspaceApi(payload) {
  return apiFetch("/api/workspaces", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function updateWorkspaceApi(workspaceId, payload) {
  return apiFetch(`/api/workspaces/${workspaceId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export async function deleteWorkspaceApi(workspaceId) {
  return apiFetch(`/api/workspaces/${workspaceId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getWorkspaceMembersApi(workspaceId) {
  return apiFetch(`/api/workspaces/${workspaceId}/members`, {
    method: "GET",
    auth: true,
  });
}

/* ---------------- Brands ---------------- */

export async function getBrandsApi() {
  return apiFetch("/api/brands", {
    method: "GET",
    auth: true,
  });
}

export async function getBrandByIdApi(brandId) {
  return apiFetch(`/api/brands/${brandId}`, {
    method: "GET",
    auth: true,
  });
}

export async function getBrandWorkspacesApi(brandId) {
  return apiFetch(`/api/brands/${brandId}/workspaces`, {
    method: "GET",
    auth: true,
  });
}

export async function createBrandApi(payload) {
  return apiFetch("/api/brands", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function updateBrandApi(brandId, payload) {
  return apiFetch(`/api/brands/${brandId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export async function deleteBrandApi(brandId) {
  return apiFetch(`/api/brands/${brandId}`, {
    method: "DELETE",
    auth: true,
  });
}

/* ---------------- Users ---------------- */

export async function getUsersApi() {
  return apiFetch("/api/users", {
    method: "GET",
    auth: true,
  });
}

export async function getUserByIdApi(userId) {
  return apiFetch(`/api/users/${userId}`, {
    method: "GET",
    auth: true,
  });
}

export async function createUserApi(payload) {
  return apiFetch("/api/users", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function updateUserApi(userId, payload) {
  return apiFetch(`/api/users/${userId}`, {
    method: "PATCH",
    auth: true,
    body: payload,
  });
}

export async function deleteUserApi(userId) {
  return apiFetch(`/api/users/${userId}`, {
    method: "DELETE",
    auth: true,
  });
}

/* ---------------- Roles & Permissions ---------------- */

export async function getRolesPermissionsApi() {
  return apiFetch("/api/admin/roles-permissions", {
    method: "GET",
    auth: true,
  });
}

export async function updateRolePermissionsApi(role, permissions) {
  return apiFetch(`/api/admin/roles-permissions/${encodeURIComponent(role)}`, {
    method: "PATCH",
    auth: true,
    body: { permissions },
  });
}