import { apiFetch } from "./api";

export function getMetaOAuthUrlApi() {
  return apiFetch("/api/meta/oauth-url", {
    method: "GET",
    auth: true,
  });
}

export function getMetaConnectionsApi() {
  return apiFetch("/api/meta/connections", {
    method: "GET",
    auth: true,
  });
}

export function syncMetaConnectionApi(connectionId) {
  return apiFetch(`/api/meta/connections/${connectionId}/sync`, {
    method: "POST",
    auth: true,
  });
}

export function deleteMetaConnectionApi(connectionId) {
  return apiFetch(`/api/meta/connections/${connectionId}`, {
    method: "DELETE",
    auth: true,
  });
}

export function getMetaPagesApi() {
  return apiFetch("/api/meta/pages", {
    method: "GET",
    auth: true,
  });
}

export function getMetaPageDetailApi(pageId) {
  return apiFetch(`/api/meta/pages/${pageId}`, {
    method: "GET",
    auth: true,
  });
}

export function getMetaInstagramAccountsApi() {
  return apiFetch("/api/meta/instagram-accounts", {
    method: "GET",
    auth: true,
  });
}

export function getMetaInstagramDetailApi(accountId) {
  return apiFetch(`/api/meta/instagram-accounts/${accountId}`, {
    method: "GET",
    auth: true,
  });
}