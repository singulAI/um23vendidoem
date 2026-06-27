/**
 * Centralized HTTP client for the external FastAPI backend.
 *
 * Responsibilities:
 *  - Single fetch wrapper for every REST call (no scattered `fetch()`).
 *  - JWT bearer attached from the current Supabase session (Lovable manages auth).
 *  - Refresh-token interceptor: on 401, asks Supabase to refresh and retries once.
 *  - Standardized ApiError with status + payload.
 *  - Typed JSON envelope.
 *
 * The HTTP client is intentionally framework-agnostic so the same instance
 * can be reused by every Service / Repository under src/services/rest/.
 */
import { supabase } from "@/integrations/supabase/client";
import { API_BASE_URL, API_TIMEOUT_MS } from "./config";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** When true, do not attach the Authorization header. */
  anonymous?: boolean;
}

export class ApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function getBearer(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function refreshSession(): Promise<string | null> {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) return null;
  return data.session?.access_token ?? null;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const url = new URL(path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function doFetch(url: string, init: RequestInit, anonymous: boolean): Promise<Response> {
  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  if (!anonymous) {
    const token = await getBearer();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, { ...init, headers });
}

export async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  if (!API_BASE_URL && opts.anonymous !== true) {
    throw new ApiError(
      "VITE_API_BASE_URL is not configured. Set it in .env to enable the REST provider.",
      0,
      null,
    );
  }

  const url = buildUrl(path, opts.query);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const signal = opts.signal ?? controller.signal;

  const init: RequestInit = {
    method: opts.method ?? "GET",
    headers: opts.headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal,
  };

  try {
    let res = await doFetch(url, init, opts.anonymous === true);

    // Refresh-token interceptor: try once.
    if (res.status === 401 && !opts.anonymous) {
      const fresh = await refreshSession();
      if (fresh) res = await doFetch(url, init, false);
    }

    const text = await res.text();
    const payload = text ? safeJson(text) : null;

    if (!res.ok) {
      throw new ApiError(
        (payload as { message?: string } | null)?.message ?? `HTTP ${res.status}`,
        res.status,
        payload,
      );
    }
    return payload as T;
  } finally {
    clearTimeout(timeout);
  }
}

function safeJson(s: string): unknown {
  try { return JSON.parse(s); } catch { return s; }
}

export const http = {
  get: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...opts, method: "POST", body }),
  put: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...opts, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptions, "method">) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
