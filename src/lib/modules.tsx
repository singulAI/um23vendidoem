import {
  LayoutDashboard,
  Gavel,
  Package,
  Car,
  Brain,
  Radar,
  FileBarChart,
  CreditCard,
  User as UserIcon,
  ShieldCheck,
  Plug,
  Code2,
  Cog,
  Activity,
  History,
  Building2,
  Star,
  Bell,
  Trophy,
  FileText,
  UploadCloud,
  Image as ImageIcon,
  Settings,
  Sparkles,
  TrendingUp,
  Eye,
  ScanSearch,
  Lightbulb,
  BookOpen,
  Wallet,
  Receipt,
  RefreshCw,
  Ticket,
  Boxes,
  Layers,
  Users,
  KeyRound,
  Database,
  FlaskConical,
  MessageSquare,
  Gauge,
  Scale,
  ListChecks,
  Flag,
  ServerCog,
  Cloud,
  type LucideIcon,
} from "lucide-react";

export type Column = { key: string; label: string; format?: (v: unknown) => string };
export type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "select" | "textarea";
  options?: string[];
};
export type Tab = { key: string; label: string };

export type ModuleConfig = {
  key: string;
  label: string;
  icon: LucideIcon;
  group: string;
  parent?: string; // sub-group inside `group` (e.g. "Inteligência")
  description: string;
  columns: Column[];
  filters?: string[];
  fields: FieldDef[];
  searchKeys: string[];
  detailTabs?: Tab[];
};

const fmtMoney = (v: unknown) => `R$ ${Number(v).toLocaleString("pt-BR")}`;
const fmtPct = (v: unknown) => `${v}%`;

const COL_NAME: Column = { key: "nome", label: "Nome" };
const COL_DESC: Column = { key: "descricao", label: "Descrição" };
const COL_STATUS: Column = { key: "status", label: "Status" };
const COL_DATA: Column = { key: "data", label: "Data" };
const GENERIC_COLS: Column[] = [COL_NAME, COL_DESC, COL_STATUS, COL_DATA];
const GENERIC_FIELDS: FieldDef[] = [
  { key: "nome", label: "Nome" },
  { key: "descricao", label: "Descrição", type: "textarea" },
  { key: "status", label: "Status" },
];

export const MODULES: ModuleConfig[] = [
  // ─────────── Plataforma (usuário) ───────────
  {
    key: "favoritos",
    label: "Favoritos",
    icon: Star,
    group: "Plataforma",
    description: "Lotes e leilões salvos para acompanhamento.",
    columns: [
      { key: "numero", label: "Lote" },
      { key: "titulo", label: "Descrição" },
      { key: "categoria", label: "Categoria" },
      { key: "lance", label: "Lance", format: fmtMoney },
      { key: "score", label: "Score" },
    ],
    filters: ["categoria"],
    searchKeys: ["titulo", "numero"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "radar",
    label: "Radar",
    icon: Radar,
    group: "Plataforma",
    description: "Alertas em editais monitorados.",
    columns: [
      { key: "titulo", label: "Alerta" },
      { key: "tipo", label: "Tipo" },
      { key: "severidade", label: "Severidade" },
      COL_DATA,
    ],
    filters: ["tipo", "severidade"],
    searchKeys: ["titulo"],
    fields: [
      { key: "titulo", label: "Título" },
      { key: "tipo", label: "Tipo", type: "select", options: ["Edital novo", "Mudança", "Oportunidade", "Risco"] },
      { key: "severidade", label: "Severidade", type: "select", options: ["Crítico", "Alto", "Médio", "Baixo"] },
    ],
  },
  {
    key: "resultados",
    label: "Resultados",
    icon: Trophy,
    group: "Plataforma",
    description: "Arremates concluídos e histórico de lances.",
    columns: GENERIC_COLS,
    searchKeys: ["nome"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "relatorios",
    label: "Relatórios",
    icon: FileBarChart,
    group: "Plataforma",
    description: "Exportações financeiras, operacionais e analíticas.",
    columns: [
      COL_NAME,
      { key: "tipo", label: "Tipo" },
      { key: "periodo", label: "Período" },
      { key: "gerado", label: "Gerado em" },
      { key: "tamanho", label: "Tamanho" },
    ],
    filters: ["tipo"],
    searchKeys: ["nome"],
    fields: [
      COL_NAME,
      { key: "tipo", label: "Tipo", type: "select", options: ["Financeiro", "Operacional", "Usuários", "Leilões", "Veículos"] },
      { key: "periodo", label: "Período" },
    ],
  },
  {
    key: "documentos",
    label: "Documentos",
    icon: FileText,
    group: "Plataforma",
    description: "Editais, comprovantes e anexos processados.",
    columns: GENERIC_COLS,
    searchKeys: ["nome"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "assets",
    label: "Assets",
    icon: ImageIcon,
    group: "Plataforma",
    description: "Imagens, logos e arquivos estáticos.",
    columns: GENERIC_COLS,
    searchKeys: ["nome"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "notificacoes",
    label: "Notificações",
    icon: Bell,
    group: "Plataforma",
    description: "Histórico de notificações recebidas.",
    columns: [
      { key: "titulo", label: "Notificação" },
      { key: "severidade", label: "Severidade" },
      COL_DATA,
    ],
    searchKeys: ["titulo"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "preferencias",
    label: "Preferências",
    icon: Settings,
    group: "Plataforma",
    description: "Tema, idioma, fuso e notificações.",
    columns: GENERIC_COLS,
    searchKeys: ["nome"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "conta",
    label: "Minha Conta",
    icon: UserIcon,
    group: "Plataforma",
    description: "Dados da conta, segurança e plano atual.",
    columns: GENERIC_COLS,
    searchKeys: ["nome"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "configuracoes",
    label: "Configurações",
    icon: Cog,
    group: "Plataforma",
    description: "Configurações gerais do workspace.",
    columns: GENERIC_COLS,
    searchKeys: ["nome"],
    fields: GENERIC_FIELDS,
  },

  // ─────────── Catálogo ───────────
  {
    key: "organizadores",
    label: "Organizadores",
    icon: Building2,
    group: "Catálogo",
    description: "Leiloeiros e instituições que organizam os leilões.",
    columns: [
      COL_NAME,
      { key: "uf", label: "UF" },
      { key: "leiloes", label: "Leilões" },
      COL_STATUS,
      { key: "contato", label: "Contato" },
    ],
    filters: ["status", "uf"],
    searchKeys: ["nome", "contato"],
    fields: [
      COL_NAME,
      { key: "uf", label: "UF" },
      { key: "contato", label: "E-mail de contato" },
      { key: "status", label: "Status", type: "select", options: ["Ativo", "Em revisão", "Inativo"] },
    ],
    detailTabs: [
      { key: "leiloes", label: "Leilões" },
      { key: "documentos", label: "Documentos" },
      { key: "estatisticas", label: "Estatísticas" },
    ],
  },
  {
    key: "leiloes",
    label: "Leilões",
    icon: Gavel,
    group: "Catálogo",
    description: "Editais ativos, encerrados e agendados.",
    columns: [
      { key: "numero", label: "Nº" },
      { key: "organizador", label: "Organizador" },
      { key: "tipo", label: "Tipo" },
      { key: "cidade", label: "Cidade" },
      COL_DATA,
      { key: "lotes", label: "Lotes" },
      COL_STATUS,
      { key: "score", label: "Score" },
    ],
    filters: ["status", "tipo", "organizador"],
    searchKeys: ["numero", "organizador", "cidade"],
    fields: [
      { key: "numero", label: "Número do edital" },
      { key: "organizador", label: "Organizador" },
      { key: "tipo", label: "Tipo", type: "select", options: ["Judicial", "Extrajudicial", "Administrativo"] },
      { key: "cidade", label: "Cidade/UF" },
      { key: "data", label: "Data" },
      { key: "lotes", label: "Qtd. lotes", type: "number" },
      { key: "status", label: "Status", type: "select", options: ["Aberto", "Encerrado", "Em breve", "Cancelado"] },
    ],
    detailTabs: [
      { key: "lotes", label: "Lotes" },
      { key: "cronograma", label: "Cronograma" },
      { key: "documentos", label: "Documentos" },
      { key: "erratas", label: "Erratas" },
      { key: "mapa", label: "Mapa" },
    ],
  },
  {
    key: "lotes",
    label: "Lotes",
    icon: Package,
    group: "Catálogo",
    description: "Lotes individuais com lance, FIPE e score.",
    columns: [
      { key: "numero", label: "Lote" },
      { key: "titulo", label: "Descrição" },
      { key: "categoria", label: "Categoria" },
      { key: "lance", label: "Lance", format: fmtMoney },
      { key: "fipe", label: "FIPE", format: fmtMoney },
      { key: "desconto", label: "Desconto", format: fmtPct },
      { key: "liquidez", label: "Liquidez" },
      { key: "score", label: "Score" },
    ],
    filters: ["categoria", "liquidez"],
    searchKeys: ["titulo", "numero"],
    fields: [
      { key: "numero", label: "Número do lote" },
      { key: "titulo", label: "Descrição" },
      { key: "categoria", label: "Categoria", type: "select", options: ["Veículo leve", "Veículo pesado", "Moto", "Equipamento", "Sucata"] },
      { key: "lance", label: "Lance mínimo", type: "number" },
      { key: "fipe", label: "Tabela FIPE", type: "number" },
    ],
    detailTabs: [
      { key: "galeria", label: "Galeria" },
      { key: "historico", label: "Histórico" },
      { key: "analise", label: "Análise" },
      { key: "financeiro", label: "Financeiro" },
      { key: "imagens", label: "Imagens" },
      { key: "documentos", label: "Documentos" },
    ],
  },
  {
    key: "veiculos",
    label: "Veículos",
    icon: Car,
    group: "Catálogo",
    description: "Catálogo completo de veículos analisados.",
    columns: [
      { key: "placa", label: "Placa" },
      { key: "marca", label: "Marca" },
      { key: "modelo", label: "Modelo" },
      { key: "ano", label: "Ano" },
      { key: "km", label: "KM" },
      { key: "combustivel", label: "Combustível" },
      { key: "fipe", label: "FIPE", format: fmtMoney },
      { key: "estado", label: "Estado" },
    ],
    filters: ["marca", "combustivel", "estado"],
    searchKeys: ["placa", "marca", "modelo"],
    fields: [
      { key: "placa", label: "Placa" },
      { key: "marca", label: "Marca" },
      { key: "modelo", label: "Modelo" },
      { key: "ano", label: "Ano", type: "number" },
      { key: "km", label: "Quilometragem", type: "number" },
      { key: "combustivel", label: "Combustível", type: "select", options: ["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"] },
      { key: "estado", label: "Estado", type: "select", options: ["Bom", "Regular", "Avariado", "Sucata", "Recuperável"] },
    ],
    detailTabs: [
      { key: "fotos", label: "Fotos" },
      { key: "documentacao", label: "Documentação" },
      { key: "avaliacao", label: "Avaliação" },
      { key: "mercado", label: "Mercado" },
      { key: "liquidez", label: "Liquidez" },
      { key: "fipe", label: "FIPE" },
    ],
  },

  // ─────────── Inteligência ───────────
  {
    key: "inteligencia",
    label: "Pipelines",
    icon: Brain,
    group: "Inteligência",
    parent: "Inteligência",
    description: "Execuções de OCR, parser e análise por IA.",
    columns: [
      { key: "tipo", label: "Pipeline" },
      { key: "alvo", label: "Alvo" },
      COL_STATUS,
      { key: "duracao", label: "Duração (s)" },
      COL_DATA,
    ],
    filters: ["tipo", "status"],
    searchKeys: ["alvo"],
    fields: [
      { key: "tipo", label: "Pipeline", type: "select", options: ["Parser", "OCR"] },
      { key: "alvo", label: "Alvo" },
    ],
  },
  { key: "opportunity", label: "Opportunity", icon: TrendingUp, group: "Inteligência", parent: "Inteligência", description: "Score de oportunidade por lote.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "risk", label: "Risk", icon: ShieldCheck, group: "Inteligência", parent: "Inteligência", description: "Análise de risco.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "pricing", label: "Pricing", icon: TrendingUp, group: "Inteligência", parent: "Inteligência", description: "Modelos de precificação.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "liquidity", label: "Liquidity", icon: Gauge, group: "Inteligência", parent: "Inteligência", description: "Liquidez de mercado.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "document-intelligence", label: "Document Intelligence", icon: ScanSearch, group: "Inteligência", parent: "Inteligência", description: "Extração estruturada de documentos.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "recommendations", label: "Recommendations", icon: Lightbulb, group: "Inteligência", parent: "Inteligência", description: "Recomendações personalizadas.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "knowledge", label: "Knowledge Base", icon: BookOpen, group: "Inteligência", parent: "Inteligência", description: "Base de conhecimento operacional.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },

  // ─────────── Financeiro ───────────
  {
    key: "financeiro",
    label: "Visão geral",
    icon: Wallet,
    group: "Financeiro",
    parent: "Financeiro",
    description: "MRR, churn, receita e inadimplência.",
    columns: [
      { key: "usuario", label: "Cliente" },
      { key: "plano", label: "Plano" },
      COL_STATUS,
      { key: "mrr", label: "MRR", format: fmtMoney },
    ],
    searchKeys: ["usuario"],
    fields: GENERIC_FIELDS,
  },
  {
    key: "pagamentos",
    label: "Pagamentos",
    icon: CreditCard,
    group: "Financeiro",
    parent: "Financeiro",
    description: "Transações PIX, cartão e boleto.",
    columns: [
      { key: "usuario", label: "Cliente" },
      { key: "metodo", label: "Método" },
      { key: "valor", label: "Valor", format: fmtMoney },
      COL_STATUS,
      COL_DATA,
    ],
    filters: ["metodo", "status"],
    searchKeys: ["usuario"],
    fields: [
      { key: "usuario", label: "Cliente" },
      { key: "metodo", label: "Método", type: "select", options: ["PIX", "Cartão", "Boleto"] },
      { key: "valor", label: "Valor (R$)", type: "number" },
    ],
  },
  { key: "faturas", label: "Faturas", icon: Receipt, group: "Financeiro", parent: "Financeiro", description: "Faturas emitidas e baixadas.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  {
    key: "assinaturas",
    label: "Assinaturas",
    icon: RefreshCw,
    group: "Financeiro",
    parent: "Financeiro",
    description: "Planos ativos, trials e renovações.",
    columns: [
      { key: "usuario", label: "Cliente" },
      { key: "plano", label: "Plano" },
      COL_STATUS,
      { key: "mrr", label: "MRR", format: fmtMoney },
      { key: "renovacao", label: "Renovação" },
    ],
    filters: ["plano", "status"],
    searchKeys: ["usuario"],
    fields: GENERIC_FIELDS,
  },
  { key: "cupons", label: "Cupons", icon: Ticket, group: "Financeiro", parent: "Financeiro", description: "Cupons e descontos promocionais.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "produtos", label: "Produtos", icon: Boxes, group: "Financeiro", parent: "Financeiro", description: "Catálogo de produtos comercializáveis.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "planos", label: "Planos", icon: Layers, group: "Financeiro", parent: "Financeiro", description: "Planos de assinatura.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },

  // ─────────── Administração ───────────
  {
    key: "usuarios",
    label: "Usuários",
    icon: Users,
    group: "Administração",
    parent: "Administração",
    description: "Usuários, papéis e permissões.",
    columns: [
      COL_NAME,
      { key: "email", label: "E-mail" },
      { key: "papel", label: "Papel" },
      COL_STATUS,
      { key: "ultimoAcesso", label: "Último acesso" },
    ],
    filters: ["papel", "status"],
    searchKeys: ["nome", "email"],
    fields: [
      COL_NAME,
      { key: "email", label: "E-mail" },
      { key: "papel", label: "Papel", type: "select", options: ["Admin", "Operador", "Analista", "Convidado"] },
      { key: "status", label: "Status", type: "select", options: ["Ativo", "Inativo", "Convidado"] },
    ],
  },
  { key: "roles", label: "Roles", icon: ShieldCheck, group: "Administração", parent: "Administração", description: "Papéis e capacidades.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "permissoes", label: "Permissões", icon: KeyRound, group: "Administração", parent: "Administração", description: "Permissões granulares.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  {
    key: "connectors",
    label: "Connectors",
    icon: Plug,
    group: "Administração",
    parent: "Administração",
    description: "Integrações externas e health checks.",
    columns: [
      COL_NAME,
      { key: "provider", label: "Provider" },
      { key: "categoria", label: "Categoria" },
      COL_STATUS,
      { key: "uptime", label: "Uptime", format: (v) => `${Number(v).toFixed(2)}%` },
      { key: "latencia", label: "Latência", format: (v) => `${v} ms` },
    ],
    filters: ["status", "categoria"],
    searchKeys: ["nome", "provider"],
    fields: [
      COL_NAME,
      { key: "provider", label: "Provider" },
      { key: "categoria", label: "Categoria" },
      { key: "status", label: "Status", type: "select", options: ["Online", "Degradado", "Offline"] },
    ],
  },
  {
    key: "jobs",
    label: "Jobs",
    icon: Cog,
    group: "Administração",
    parent: "Administração",
    description: "Workers, scheduler e filas.",
    columns: [
      { key: "tipo", label: "Tipo" },
      { key: "alvo", label: "Alvo" },
      COL_STATUS,
      { key: "duracao", label: "Duração (s)" },
      COL_DATA,
    ],
    filters: ["tipo", "status"],
    searchKeys: ["alvo"],
    fields: [
      { key: "tipo", label: "Tipo", type: "select", options: ["Parser", "OCR", "Importação", "Sync"] },
      { key: "alvo", label: "Alvo" },
    ],
  },
  {
    key: "monitoring",
    label: "Monitoring",
    icon: Activity,
    group: "Administração",
    parent: "Administração",
    description: "Health e performance de infraestrutura.",
    columns: [
      { key: "servico", label: "Serviço" },
      COL_STATUS,
      { key: "uptime", label: "Uptime", format: (v) => `${v}%` },
      { key: "latencia", label: "Latência", format: (v) => `${v} ms` },
    ],
    filters: ["status"],
    searchKeys: ["servico"],
    fields: [{ key: "servico", label: "Serviço" }],
  },
  {
    key: "developer",
    label: "Developer Center",
    icon: Code2,
    group: "Administração",
    parent: "Administração",
    description: "API keys, webhooks e tokens.",
    columns: [
      { key: "nome", label: "Chave" },
      { key: "escopo", label: "Escopo" },
      { key: "criadoEm", label: "Criada em" },
      { key: "ultimoUso", label: "Último uso" },
      COL_STATUS,
    ],
    filters: ["escopo", "status"],
    searchKeys: ["nome"],
    fields: [
      { key: "nome", label: "Nome da chave" },
      { key: "escopo", label: "Escopo", type: "select", options: ["read", "write", "admin"] },
    ],
  },
  { key: "billing", label: "Billing", icon: CreditCard, group: "Administração", parent: "Administração", description: "Visão admin de billing.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "juridico", label: "Jurídico", icon: Scale, group: "Administração", parent: "Administração", description: "Contratos, termos e processos.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  {
    key: "auditoria",
    label: "Auditoria",
    icon: History,
    group: "Administração",
    parent: "Administração",
    description: "Histórico de eventos e alterações.",
    columns: [
      { key: "ator", label: "Ator" },
      { key: "acao", label: "Ação" },
      { key: "entidade", label: "Entidade" },
      { key: "ip", label: "IP" },
      COL_DATA,
    ],
    filters: ["acao", "entidade"],
    searchKeys: ["ator", "ip"],
    fields: [
      { key: "ator", label: "Ator" },
      { key: "acao", label: "Ação" },
      { key: "entidade", label: "Entidade" },
    ],
  },
  { key: "logs", label: "Logs", icon: ListChecks, group: "Administração", parent: "Administração", description: "Logs estruturados da aplicação.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "feature-flags", label: "Feature Flags", icon: Flag, group: "Administração", parent: "Administração", description: "Flags de release e experimentos.", columns: [{ key: "chave", label: "Flag" }, { key: "valor", label: "Valor" }, { key: "escopo", label: "Escopo" }, COL_STATUS], searchKeys: ["chave"], fields: [{ key: "chave", label: "Chave" }, { key: "valor", label: "Valor" }] },
  { key: "prompts", label: "Prompts", icon: MessageSquare, group: "Administração", parent: "Administração", description: "Prompts versionados do sistema.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "providers", label: "Providers", icon: ServerCog, group: "Administração", parent: "Administração", description: "Providers externos de IA e dados.", columns: GENERIC_COLS, searchKeys: ["nome"], fields: GENERIC_FIELDS },
  { key: "storage", label: "Storage", icon: Database, group: "Administração", parent: "Administração", description: "Buckets e quotas de armazenamento.", columns: [{ key: "bucket", label: "Bucket" }, { key: "arquivos", label: "Arquivos" }, { key: "tamanho", label: "Tamanho" }, { key: "publico", label: "Público" }], searchKeys: ["bucket"], fields: [{ key: "bucket", label: "Bucket" }] },
];

export const MODULES_BY_KEY = Object.fromEntries(MODULES.map((m) => [m.key, m]));

/**
 * Hierarchical sidebar navigation.
 * Top-level groups; nested groups (Inteligência, Financeiro, Administração)
 * collapse into a sub-section. Special slots: dashboard, perfil, uploads,
 * vision (dedicated routes, not part of MODULES).
 */
export type NavLeaf = { key: string; label: string; icon: LucideIcon; to: string };
export type NavSection = { label: string; items: NavLeaf[] };
export type NavGroup = { label: string; sections: NavSection[] };

const moduleLeaf = (key: string): NavLeaf => {
  const m = MODULES_BY_KEY[key]!;
  return { key, label: m.label, icon: m.icon, to: `/app/${key}` };
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Visão geral",
    sections: [
      {
        label: "",
        items: [
          { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/app" },
          { key: "perfil", label: "Meu Perfil", icon: UserIcon, to: "/app/perfil" },
        ],
      },
    ],
  },
  {
    label: "Plataforma",
    sections: [
      {
        label: "",
        items: [
          moduleLeaf("favoritos"),
          moduleLeaf("radar"),
          moduleLeaf("resultados"),
          moduleLeaf("relatorios"),
          moduleLeaf("documentos"),
          { key: "uploads", label: "Upload Center", icon: UploadCloud, to: "/app/uploads" },
          moduleLeaf("assets"),
          moduleLeaf("notificacoes"),
          moduleLeaf("preferencias"),
          moduleLeaf("conta"),
          moduleLeaf("configuracoes"),
        ],
      },
    ],
  },
  {
    label: "Catálogo",
    sections: [
      {
        label: "",
        items: [moduleLeaf("organizadores"), moduleLeaf("leiloes"), moduleLeaf("lotes"), moduleLeaf("veiculos")],
      },
    ],
  },
  {
    label: "Inteligência",
    sections: [
      {
        label: "",
        items: [
          moduleLeaf("inteligencia"),
          moduleLeaf("opportunity"),
          moduleLeaf("risk"),
          moduleLeaf("pricing"),
          moduleLeaf("liquidity"),
          { key: "vision", label: "Vision AI", icon: Eye, to: "/app/vision" },
          moduleLeaf("document-intelligence"),
          moduleLeaf("recommendations"),
          moduleLeaf("knowledge"),
        ],
      },
    ],
  },
  {
    label: "Financeiro",
    sections: [
      {
        label: "",
        items: [
          moduleLeaf("financeiro"),
          moduleLeaf("pagamentos"),
          moduleLeaf("faturas"),
          moduleLeaf("assinaturas"),
          moduleLeaf("cupons"),
          moduleLeaf("produtos"),
          moduleLeaf("planos"),
        ],
      },
    ],
  },
  {
    label: "Administração",
    sections: [
      {
        label: "",
        items: [
          moduleLeaf("usuarios"),
          moduleLeaf("roles"),
          moduleLeaf("permissoes"),
          moduleLeaf("connectors"),
          moduleLeaf("jobs"),
          moduleLeaf("monitoring"),
          moduleLeaf("developer"),
          moduleLeaf("billing"),
          moduleLeaf("juridico"),
          moduleLeaf("auditoria"),
          moduleLeaf("logs"),
          moduleLeaf("feature-flags"),
          moduleLeaf("prompts"),
          moduleLeaf("providers"),
          moduleLeaf("storage"),
        ],
      },
    ],
  },
];

// Re-export icons used by pages that aren't generic modules.
export { Sparkles, FlaskConical, Cloud };
