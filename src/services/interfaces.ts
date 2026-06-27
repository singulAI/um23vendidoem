/**
 * Service interfaces (Repository pattern).
 *
 * Every business module is consumed through one of these interfaces. Mock and
 * REST implementations live side by side under src/services/{mock,rest} and
 * MUST implement the exact same signatures so the UI does not change when the
 * provider is swapped.
 */
import type { ID, ListQuery, Page } from "./types";

export interface ReadService<T> {
  list(query?: ListQuery): Promise<Page<T>>;
  getById(id: ID): Promise<T | null>;
}

export interface CrudService<T, TInput = Partial<T>> extends ReadService<T> {
  create(input: TInput): Promise<T>;
  update(id: ID, input: TInput): Promise<T>;
  remove(id: ID): Promise<void>;
}

export type GenericRow = Record<string, unknown> & { id: ID };

export interface DashboardService {
  getKpis(): Promise<Record<string, number | string>>;
  getRecentAuctions(limit?: number): Promise<GenericRow[]>;
  getRecentAlerts(limit?: number): Promise<GenericRow[]>;
  getRecentJobs(limit?: number): Promise<GenericRow[]>;
  getTopOrganizadores(limit?: number): Promise<GenericRow[]>;
}

/**
 * Full service container exposed to the app.
 *
 * `resources` is indexed by module key (matches ModuleConfig.key). Adding a
 * new module is configuration — no type plumbing.
 */
export interface ServiceRegistry {
  dashboard: DashboardService;
  resources: Record<string, CrudService<GenericRow>>;
}
