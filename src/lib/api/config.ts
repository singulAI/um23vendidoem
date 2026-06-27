/**
 * Centralized API configuration.
 *
 * Toggle providers via env:
 * - VITE_API_BASE_URL: external FastAPI base URL (e.g. https://api.123vendido.com)
 * - VITE_API_PROVIDER: "mock" | "rest" (default: "mock")
 *
 * Never hardcode URLs anywhere else in the app — read from here.
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

export type ApiProvider = "mock" | "rest";

export const API_PROVIDER: ApiProvider =
  ((import.meta.env.VITE_API_PROVIDER as ApiProvider | undefined) ?? "mock");

export const API_TIMEOUT_MS = 30_000;
