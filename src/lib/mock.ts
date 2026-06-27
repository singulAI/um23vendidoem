// Mock data store for 123Vendido. Deterministic via seeded RNG.

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(123456);
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const num = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const id = (p: string, i: number) => `${p}-${String(i).padStart(5, "0")}`;

export const ORGANIZADORES = [
  "Receita Federal",
  "Sodré Santoro",
  "Copart",
  "Freitas Leiloeiro",
  "VIP Leilões",
  "Detran SP",
  "Detran RJ",
  "Caixa Econômica",
  "Banco do Brasil",
  "Mega Leilões",
  "Zukerman",
  "Lance Já",
];

const CIDADES = ["São Paulo/SP", "Rio de Janeiro/RJ", "Belo Horizonte/MG", "Curitiba/PR", "Porto Alegre/RS", "Salvador/BA", "Recife/PE", "Fortaleza/CE", "Brasília/DF", "Goiânia/GO"];
const MARCAS = ["Volkswagen", "Fiat", "Chevrolet", "Ford", "Toyota", "Honda", "Hyundai", "Renault", "Jeep", "Nissan"];
const MODELOS: Record<string, string[]> = {
  Volkswagen: ["Gol", "Polo", "T-Cross", "Voyage", "Saveiro"],
  Fiat: ["Argo", "Mobi", "Strada", "Toro", "Cronos"],
  Chevrolet: ["Onix", "Tracker", "S10", "Cruze", "Spin"],
  Ford: ["Ka", "Fiesta", "Ranger", "EcoSport", "Focus"],
  Toyota: ["Corolla", "Hilux", "Yaris", "Etios", "SW4"],
  Honda: ["Civic", "Fit", "HR-V", "City", "WR-V"],
  Hyundai: ["HB20", "Creta", "Tucson", "ix35", "Azera"],
  Renault: ["Sandero", "Kwid", "Logan", "Duster", "Captur"],
  Jeep: ["Renegade", "Compass", "Commander"],
  Nissan: ["March", "Versa", "Kicks", "Frontier"],
};
const STATUS_LEILAO = ["Aberto", "Encerrado", "Em breve", "Cancelado"] as const;
const TIPO_LEILAO = ["Judicial", "Extrajudicial", "Administrativo"] as const;
const SCORES = ["Alta", "Média", "Baixa"] as const;

export type Leilao = {
  id: string;
  numero: string;
  organizador: string;
  tipo: typeof TIPO_LEILAO[number];
  cidade: string;
  data: string;
  lotes: number;
  status: typeof STATUS_LEILAO[number];
  score: number;
};

export type Lote = {
  id: string;
  leilaoId: string;
  numero: string;
  titulo: string;
  categoria: string;
  lance: number;
  fipe: number;
  desconto: number;
  liquidez: typeof SCORES[number];
  score: number;
};

export type Veiculo = {
  id: string;
  loteId: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  km: number;
  cor: string;
  combustivel: string;
  fipe: number;
  estado: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  papel: "Admin" | "Operador" | "Analista" | "Convidado";
  status: "Ativo" | "Inativo" | "Convidado";
  ultimoAcesso: string;
};

export type Pagamento = {
  id: string;
  usuario: string;
  valor: number;
  metodo: "PIX" | "Cartão" | "Boleto";
  status: "Pago" | "Pendente" | "Estornado";
  data: string;
};

export type Assinatura = {
  id: string;
  usuario: string;
  plano: "Starter" | "Pro" | "Business" | "Enterprise";
  status: "Ativa" | "Trial" | "Cancelada" | "Inadimplente";
  renovacao: string;
  mrr: number;
};

export type Connector = {
  id: string;
  nome: string;
  provider: string;
  status: "Online" | "Degradado" | "Offline";
  uptime: number;
  latencia: number;
  categoria: string;
};

export type Alerta = {
  id: string;
  titulo: string;
  tipo: "Edital novo" | "Mudança" | "Oportunidade" | "Risco";
  severidade: "Crítico" | "Alto" | "Médio" | "Baixo";
  data: string;
  lido: boolean;
};

export type Job = {
  id: string;
  tipo: "Parser" | "OCR" | "Importação" | "Sync";
  alvo: string;
  status: "Concluído" | "Em execução" | "Falha" | "Agendado";
  duracao: number;
  data: string;
};

export type LogEvento = {
  id: string;
  ator: string;
  acao: string;
  entidade: string;
  ip: string;
  data: string;
};

export type Relatorio = {
  id: string;
  nome: string;
  tipo: "Financeiro" | "Operacional" | "Usuários" | "Leilões" | "Veículos";
  periodo: string;
  gerado: string;
  tamanho: string;
};

const now = Date.now();
const dateOffset = (days: number) =>
  new Date(now + days * 86400000).toISOString().slice(0, 10);

export const leiloes: Leilao[] = Array.from({ length: 240 }, (_, i) => {
  const lotes = num(20, 480);
  return {
    id: id("leilao", i + 1),
    numero: `${num(1000, 9999)}/${2024 + (i % 3)}`,
    organizador: pick(ORGANIZADORES),
    tipo: pick(TIPO_LEILAO as unknown as string[]) as Leilao["tipo"],
    cidade: pick(CIDADES),
    data: dateOffset(num(-60, 120)),
    lotes,
    status: pick(STATUS_LEILAO as unknown as string[]) as Leilao["status"],
    score: num(40, 99),
  };
});

export const lotes: Lote[] = Array.from({ length: 1200 }, (_, i) => {
  const fipe = num(15000, 180000);
  const lance = Math.round(fipe * (0.3 + rng() * 0.6));
  return {
    id: id("lote", i + 1),
    leilaoId: leiloes[i % leiloes.length].id,
    numero: String(num(1, 999)),
    titulo: `${pick(MARCAS)} ${num(2010, 2024)}`,
    categoria: pick(["Veículo leve", "Veículo pesado", "Moto", "Equipamento", "Sucata"]),
    lance,
    fipe,
    desconto: Math.round(((fipe - lance) / fipe) * 100),
    liquidez: pick(SCORES as unknown as string[]) as Lote["liquidez"],
    score: num(30, 99),
  };
});

export const veiculos: Veiculo[] = Array.from({ length: 1500 }, (_, i) => {
  const marca = pick(MARCAS);
  const modelo = pick(MODELOS[marca]);
  return {
    id: id("veiculo", i + 1),
    loteId: lotes[i % lotes.length].id,
    placa: `${String.fromCharCode(65 + num(0, 25))}${String.fromCharCode(65 + num(0, 25))}${String.fromCharCode(65 + num(0, 25))}${num(0, 9)}${pick(["A", "B", "C", "D"])}${num(0, 9)}${num(0, 9)}`,
    marca,
    modelo,
    ano: num(2008, 2024),
    km: num(10000, 250000),
    cor: pick(["Branco", "Prata", "Preto", "Cinza", "Vermelho", "Azul"]),
    combustivel: pick(["Flex", "Gasolina", "Diesel", "Híbrido", "Elétrico"]),
    fipe: num(15000, 180000),
    estado: pick(["Bom", "Regular", "Avariado", "Sucata", "Recuperável"]),
  };
});

export const usuarios: Usuario[] = Array.from({ length: 80 }, (_, i) => ({
  id: id("user", i + 1),
  nome: `${pick(["Ana", "Bruno", "Carla", "Daniel", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João"])} ${pick(["Silva", "Souza", "Costa", "Pereira", "Oliveira", "Lima", "Carvalho", "Almeida"])}`,
  email: `usuario${i + 1}@123vendido.com.br`,
  papel: pick(["Admin", "Operador", "Analista", "Convidado"]) as Usuario["papel"],
  status: pick(["Ativo", "Ativo", "Ativo", "Inativo", "Convidado"]) as Usuario["status"],
  ultimoAcesso: dateOffset(-num(0, 60)),
}));

export const pagamentos: Pagamento[] = Array.from({ length: 320 }, (_, i) => ({
  id: id("pay", i + 1),
  usuario: usuarios[i % usuarios.length].nome,
  valor: num(49, 1299),
  metodo: pick(["PIX", "Cartão", "Boleto"]) as Pagamento["metodo"],
  status: pick(["Pago", "Pago", "Pago", "Pendente", "Estornado"]) as Pagamento["status"],
  data: dateOffset(-num(0, 180)),
}));

export const assinaturas: Assinatura[] = Array.from({ length: 64 }, (_, i) => ({
  id: id("sub", i + 1),
  usuario: usuarios[i % usuarios.length].nome,
  plano: pick(["Starter", "Pro", "Business", "Enterprise"]) as Assinatura["plano"],
  status: pick(["Ativa", "Ativa", "Trial", "Cancelada", "Inadimplente"]) as Assinatura["status"],
  renovacao: dateOffset(num(1, 365)),
  mrr: num(49, 1299),
}));

export const connectors: Connector[] = [
  { nome: "FIPE", provider: "fipe.org.br", categoria: "Dados públicos" },
  { nome: "BrasilAPI", provider: "brasilapi.com.br", categoria: "Dados públicos" },
  { nome: "Google Maps", provider: "Google Cloud", categoria: "Geo" },
  { nome: "OpenStreetMap", provider: "OSM Foundation", categoria: "Geo" },
  { nome: "Receita Federal", provider: "gov.br", categoria: "Governo" },
  { nome: "SERPRO", provider: "serpro.gov.br", categoria: "Governo" },
  { nome: "Detran SP", provider: "detran.sp.gov.br", categoria: "Governo" },
  { nome: "Mercado Livre", provider: "mercadolibre.com", categoria: "Marketplace" },
  { nome: "OLX", provider: "olx.com.br", categoria: "Marketplace" },
  { nome: "Webmotors", provider: "webmotors.com.br", categoria: "Marketplace" },
  { nome: "OpenAI", provider: "openai.com", categoria: "IA" },
  { nome: "Ollama", provider: "self-hosted", categoria: "IA" },
  { nome: "n8n", provider: "self-hosted", categoria: "Automação" },
  { nome: "FastAPI", provider: "interno", categoria: "Plataforma" },
].map((c, i) => ({
  id: id("conn", i + 1),
  ...c,
  status: pick(["Online", "Online", "Online", "Degradado", "Offline"]) as Connector["status"],
  uptime: 95 + rng() * 5,
  latencia: num(40, 800),
}));

export const alertas: Alerta[] = Array.from({ length: 60 }, (_, i) => ({
  id: id("alert", i + 1),
  titulo: pick([
    "Novo edital de veículos publicado",
    "Mudança em edital favorito",
    "Oportunidade detectada com score alto",
    "Risco fiscal identificado em lote",
    "Encerramento próximo: leilão acompanhado",
  ]),
  tipo: pick(["Edital novo", "Mudança", "Oportunidade", "Risco"]) as Alerta["tipo"],
  severidade: pick(["Crítico", "Alto", "Médio", "Baixo"]) as Alerta["severidade"],
  data: dateOffset(-num(0, 14)),
  lido: rng() > 0.4,
}));

export const jobs: Job[] = Array.from({ length: 120 }, (_, i) => ({
  id: id("job", i + 1),
  tipo: pick(["Parser", "OCR", "Importação", "Sync"]) as Job["tipo"],
  alvo: pick(ORGANIZADORES),
  status: pick(["Concluído", "Concluído", "Em execução", "Falha", "Agendado"]) as Job["status"],
  duracao: num(2, 480),
  data: dateOffset(-num(0, 14)),
}));

export const auditoria: LogEvento[] = Array.from({ length: 200 }, (_, i) => ({
  id: id("log", i + 1),
  ator: usuarios[i % usuarios.length].nome,
  acao: pick(["criou", "atualizou", "removeu", "exportou", "acessou"]),
  entidade: pick(["Leilão", "Lote", "Veículo", "Usuário", "Plano", "Conector"]),
  ip: `${num(1, 254)}.${num(0, 254)}.${num(0, 254)}.${num(0, 254)}`,
  data: dateOffset(-num(0, 30)),
}));

export const relatorios: Relatorio[] = Array.from({ length: 24 }, (_, i) => ({
  id: id("rel", i + 1),
  nome: `Relatório ${["Financeiro", "Operacional", "Usuários", "Leilões", "Veículos"][i % 5]} ${["Mensal", "Semanal", "Trimestral"][i % 3]}`,
  tipo: ["Financeiro", "Operacional", "Usuários", "Leilões", "Veículos"][i % 5] as Relatorio["tipo"],
  periodo: `${dateOffset(-30 - i * 10)} → ${dateOffset(-i * 10)}`,
  gerado: dateOffset(-num(0, 10)),
  tamanho: `${num(120, 9800)} KB`,
}));

export const organizadores = ORGANIZADORES.map((nome, i) => ({
  id: id("org", i + 1),
  nome,
  leiloes: leiloes.filter((l) => l.organizador === nome).length,
  uf: pick(["SP", "RJ", "MG", "RS", "PR", "BA", "DF"]),
  status: pick(["Ativo", "Ativo", "Em revisão"]),
  contato: `contato@${nome.toLowerCase().replace(/[^a-z]/g, "")}.com.br`,
}));
