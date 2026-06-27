/**
 * Service registry entry point.
 *
 * Pick the provider via VITE_API_PROVIDER ("mock" by default).
 * Components import from "@/services" only — never from /mock or /rest
 * directly, so swapping is a one-line change.
 */
import { API_PROVIDER } from "@/lib/api/config";
import type { ServiceRegistry } from "./interfaces";
import { mockServices } from "./mock";
import { restServices } from "./rest";

export const services: ServiceRegistry =
  API_PROVIDER === "rest" ? restServices : mockServices;

export type { ServiceRegistry } from "./interfaces";
export * from "./types";
