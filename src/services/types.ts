/**
 * Cross-service shared types. Keep these stable — they are the contract
 * shared between mock providers (today) and the FastAPI REST providers (future).
 */

export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: Record<string, string | number | boolean | undefined>;
  sort?: string; // e.g. "data:desc"
}

export type ID = string;
