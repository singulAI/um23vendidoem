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

// Domain row types — kept loose on purpose. The mock layer already produces
// plain objects keyed by these fields, and the FastAPI client will map its
// responses into the same shape.
export type GenericRow = Record<string, unknown> & { id: ID };

export interface OrganizadoresService extends CrudService<GenericRow> {}
export interface LeiloesService extends CrudService<GenericRow> {}
export interface AuctionNoticesService extends CrudService<GenericRow> {}
export interface LotesService extends CrudService<GenericRow> {}
export interface VeiculosService extends CrudService<GenericRow> {}
export interface FavoritesService extends CrudService<GenericRow> {}
export interface RelatoriosService extends ReadService<GenericRow> {}
export interface DashboardService {
  getKpis(): Promise<Record<string, number | string>>;
  getRecentAuctions(limit?: number): Promise<GenericRow[]>;
}
export interface BillingService extends ReadService<GenericRow> {}
export interface PagamentosService extends ReadService<GenericRow> {}
export interface MonitoringService extends ReadService<GenericRow> {}
export interface JobsService extends CrudService<GenericRow> {}
export interface ConnectorsService extends CrudService<GenericRow> {}
export interface IntelligenceService extends ReadService<GenericRow> {}
export interface AlertasService extends CrudService<GenericRow> {}
export interface AuditoriaService extends ReadService<GenericRow> {}

/** Full service container exposed to the app. */
export interface ServiceRegistry {
  organizadores: OrganizadoresService;
  leiloes: LeiloesService;
  auctionNotices: AuctionNoticesService;
  lotes: LotesService;
  veiculos: VeiculosService;
  favorites: FavoritesService;
  relatorios: RelatoriosService;
  dashboard: DashboardService;
  billing: BillingService;
  pagamentos: PagamentosService;
  monitoring: MonitoringService;
  jobs: JobsService;
  connectors: ConnectorsService;
  intelligence: IntelligenceService;
  alertas: AlertasService;
  auditoria: AuditoriaService;
}
