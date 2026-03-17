import { apiFetch } from "./api";

export async function getMetaOAuthUrlApi() {
  return apiFetch("/api/meta/oauth-url", {
    method: "GET",
    auth: true,
  });
}

export async function completeMetaConnectionApi(payload) {
  return apiFetch("/api/meta/exchange-code", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function getMetaConnectionsApi() {
  return apiFetch("/api/meta/connections", {
    method: "GET",
    auth: true,
  });
}

export async function syncMetaConnectionApi(connectionId) {
  return apiFetch(`/api/meta/connections/${encodeURIComponent(connectionId)}/sync`, {
    method: "POST",
    auth: true,
  });
}

export async function deleteMetaConnectionApi(connectionId) {
  return apiFetch(`/api/meta/connections/${encodeURIComponent(connectionId)}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function getMetaPagesApi() {
  return apiFetch("/api/meta/pages", {
    method: "GET",
    auth: true,
  });
}

export async function getMetaPageDetailApi(pageId) {
  return apiFetch(`/api/meta/pages/${encodeURIComponent(pageId)}`, {
    method: "GET",
    auth: true,
  });
}

export async function getMetaInstagramAccountsApi() {
  return apiFetch("/api/meta/instagram-accounts", {
    method: "GET",
    auth: true,
  });
}

export async function getMetaInstagramDetailApi(accountId) {
  return apiFetch(`/api/meta/instagram-accounts/${encodeURIComponent(accountId)}`, {
    method: "GET",
    auth: true,
  });
}