import { boolean, date, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("usuarios_login", {
  id: int("id").autoincrement().primaryKey(),
  // OAuth openId (if using external auth)
  openId: varchar("openId", { length: 64 }).default(''),
  // Optional username for local auth
  username: varchar("username", { length: 64 }).default(''),
  // Existing legacy password column (senha) kept for compatibility
  senha: varchar("senha", { length: 255 }).default(''),
  // Optional passwordHash field (some code may reference this)
  passwordHash: varchar("passwordHash", { length: 255 }).default(''),
  name: text("name"),
  // Email can be nullable for legacy records that don't have it
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }).default('local'),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // legacy creation timestamp column name support
  data_criacao: timestamp("data_criacao").defaultNow().notNull(),
  status: mysqlEnum("status", ["ativo", "inativo"]).default("ativo"),
});

export const resetPasswordTokens = mysqlTable("reset_password_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  token: varchar("token", { length: 6 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  used: boolean("used").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Tabela de Associados Beneficiários
 */
export const associadosBeneficiarios = mysqlTable("associados_beneficiarios", {
  id: int("id").autoincrement().primaryKey(),
  nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
  sexo: mysqlEnum("sexo", ["Masculino", "Feminino"]).notNull(),
  naturalidade: varchar("naturalidade", { length: 100 }),
  naturalidadeUf: varchar("naturalidadeUf", { length: 2 }),
  dataNascimento: date("dataNascimento").notNull(),
  ramo: varchar("ramo", { length: 50 }),
  escolaridade: varchar("escolaridade", { length: 100 }),
  corRaca: varchar("corRaca", { length: 50 }),
  endereco: varchar("endereco", { length: 255 }),
  enderecoNumero: varchar("enderecoNumero", { length: 20 }),
  enderecoComplemento: varchar("enderecoComplemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  uf: varchar("uf", { length: 2 }),
  cep: varchar("cep", { length: 9 }),
  telCelular: varchar("telCelular", { length: 20 }),
  telContato1: varchar("telContato1", { length: 20 }),
  telContato2: varchar("telContato2", { length: 20 }),
  email: varchar("email", { length: 255 }),
  profissao: varchar("profissao", { length: 100 }),
  localTrabalho: varchar("localTrabalho", { length: 255 }),
  rg: varchar("rg", { length: 20 }),
  rgOrgaoExpedidor: varchar("rgOrgaoExpedidor", { length: 20 }),
  cpf: varchar("cpf", { length: 14 }),
  clubeServico: varchar("clubeServico", { length: 100 }),
  religiao: varchar("religiao", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssociadoBeneficiario = typeof associadosBeneficiarios.$inferSelect;
export type InsertAssociadoBeneficiario = typeof associadosBeneficiarios.$inferInsert;

/**
 * Tabela de Responsáveis Legais
 */
export const responsaveisLegais = mysqlTable("responsaveis_legais", {
  id: int("id").autoincrement().primaryKey(),
  associadoId: int("associadoId").notNull(),
  nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
  parentesco: mysqlEnum("parentesco", ["Pai", "Mãe", "Tutor"]).notNull(),
  sexo: mysqlEnum("sexo", ["Masculino", "Feminino"]).notNull(),
  naturalDe: varchar("naturalDe", { length: 255 }),
  naturalUf: varchar("naturalUf", { length: 2 }),
  dataNascimento: date("dataNascimento"),
  escolaridade: varchar("escolaridade", { length: 100 }),
  corRaca: varchar("corRaca", { length: 100 }),
  endereco: varchar("endereco", { length: 255 }),
  enderecoNumero: varchar("enderecoNumero", { length: 20 }),
  enderecoComplemento: varchar("enderecoComplemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }),
  cidade: varchar("cidade", { length: 100 }),
  uf: varchar("uf", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  telCelular: varchar("telCelular", { length: 20 }),
  telContato1: varchar("telContato1", { length: 20 }),
  telContato2: varchar("telContato2", { length: 20 }),
  email: varchar("email", { length: 320 }),
  profissao: varchar("profissao", { length: 100 }),
  localTrabalho: varchar("localTrabalho", { length: 255 }),
  rg: varchar("rg", { length: 20 }),
  rgOrgaoExpedidor: varchar("rgOrgaoExpedidor", { length: 50 }),
  cpf: varchar("cpf", { length: 14 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ResponsavelLegal = typeof responsaveisLegais.$inferSelect;
export type InsertResponsavelLegal = typeof responsaveisLegais.$inferInsert;

/**
 * Tabela de Fichas Médicas - COMPLETA conforme database_schema.sql
 */
export const fichasMedicas = mysqlTable("fichas_medicas", {
  id: int("id").autoincrement().primaryKey(),
  associadoId: int("associadoId").notNull().unique(),
  
  // Informações Gerais
  tipoSanguineo: varchar("tipoSanguineo", { length: 5 }),
  fatorRh: mysqlEnum("fatorRh", ["+", "-"]),
  peso: varchar("peso", { length: 10 }),
  altura: varchar("altura", { length: 10 }),
  equipamentoAuxilio: mysqlEnum("equipamentoAuxilio", ["Nenhum", "Óculos", "Lente de Contato", "Aparelho Auditivo", "Prótese", "Outro"]),
  equipamentoAuxilioOutro: text("equipamentoAuxilioOutro"),
  saudeFisica: mysqlEnum("saudeFisica", ["Normal", "Alterada"]),
  saudeFisicaObs: text("saudeFisicaObs"),
  medicamentoUso: mysqlEnum("medicamentoUso", ["Nenhum", "Sim"]),
  medicamentoUsoLista: text("medicamentoUsoLista"),
  sabeNadar: mysqlEnum("sabeNadar", ["Sim", "Não"]),
  restricaoAlimentar: text("restricaoAlimentar"),
  
  // Alergias
  temAlergias: mysqlEnum("temAlergias", ["Nenhuma", "Sim"]),
  alergiaPicadaInseto: boolean("alergiaPicadaInseto").default(false),
  alergiaPicadaInsetoCite: text("alergiaPicadaInsetoCite"),
  alergiaMedicamentos: boolean("alergiaMedicamentos").default(false),
  alergiaMedicamentosCite: text("alergiaMedicamentosCite"),
  alergiaPlantas: boolean("alergiaPlantas").default(false),
  alergiaPlantasCite: text("alergiaPlantasCite"),
  alergiaAlimentos: boolean("alergiaAlimentos").default(false),
  alergiaAlimentosCite: text("alergiaAlimentosCite"),
  alergiaAcaros: boolean("alergiaAcaros").default(false),
  alergiaAcarosCite: text("alergiaAcarosCite"),
  alergiaFungos: boolean("alergiaFungos").default(false),
  alergiaFungosCite: text("alergiaFungosCite"),
  alergiaOutro: boolean("alergiaOutro").default(false),
  alergiaOutroCite: text("alergiaOutroCite"),
  
  // Emergências Médicas
  jaTeveConvulsao: mysqlEnum("jaTeveConvulsao", ["Sim", "Não"]),
  jaTeveConvulsaoObs: text("jaTeveConvulsaoObs"),
  jaDesmaiou: mysqlEnum("jaDesmaiou", ["Sim", "Não"]),
  jaDesmaiouObs: text("jaDesmaiouObs"),
  jaSofreuCirurgia: mysqlEnum("jaSofreuCirurgia", ["Sim", "Não"]),
  jaSofreuCirurgiaObs: text("jaSofreuCirurgiaObs"),
  jaFoiInternado: mysqlEnum("jaFoiInternado", ["Sim", "Não"]),
  jaFoiInternadoObs: text("jaFoiInternadoObs"),
  jaTeveDoencaGrave: mysqlEnum("jaTeveDoencaGrave", ["Sim", "Não"]),
  jaTeveDoencaGraveObs: text("jaTeveDoencaGraveObs"),
  
  // Saúde Mental
  acompanhamentoPsicologico: mysqlEnum("acompanhamentoPsicologico", ["Sim", "Não"]),
  acompanhamentoPsicologicoObs: text("acompanhamentoPsicologicoObs"),
  acompanhamentoPsiquiatrico: mysqlEnum("acompanhamentoPsiquiatrico", ["Sim", "Não"]),
  acompanhamentoPsiquiatricoObs: text("acompanhamentoPsiquiatricoObs"),
  acompanhamentoNeurologico: mysqlEnum("acompanhamentoNeurologico", ["Sim", "Não"]),
  acompanhamentoNeurologicoObs: text("acompanhamentoNeurologicoObs"),
  acompanhamentoFonoaudiologo: mysqlEnum("acompanhamentoFonoaudiologo", ["Sim", "Não"]),
  acompanhamentoFonoaudiologoObs: text("acompanhamentoFonoaudiologoObs"),
  
  // Deficiências
  temDeficiencias: mysqlEnum("temDeficiencias", ["Não", "Sim"]),
  deficienciaFisica: boolean("deficienciaFisica").default(false),
  deficienciaFisicaCite: text("deficienciaFisicaCite"),
  deficienciaVisual: boolean("deficienciaVisual").default(false),
  deficienciaVisualCite: text("deficienciaVisualCite"),
  deficienciaAuditiva: boolean("deficienciaAuditiva").default(false),
  deficienciaAuditivaCite: text("deficienciaAuditivaCite"),
  deficienciaIntelectual: boolean("deficienciaIntelectual").default(false),
  deficienciaIntelectualCite: text("deficienciaIntelectualCite"),
  deficienciaOutra: boolean("deficienciaOutra").default(false),
  deficienciaOutraCite: text("deficienciaOutraCite"),
  
  // Apresenta no Comportamento
  comportamentoHiperatividade: mysqlEnum("comportamentoHiperatividade", ["Sim", "Não"]),
  comportamentoHiperatividadeDesc: text("comportamentoHiperatividadeDesc"),
  comportamentoDeficitAtencao: mysqlEnum("comportamentoDeficitAtencao", ["Sim", "Não"]),
  comportamentoDeficitAtencaoDesc: text("comportamentoDeficitAtencaoDesc"),
  comportamentoAgressividade: mysqlEnum("comportamentoAgressividade", ["Sim", "Não"]),
  comportamentoAgressividadeDesc: text("comportamentoAgressividadeDesc"),
  comportamentoTimidez: mysqlEnum("comportamentoTimidez", ["Sim", "Não"]),
  comportamentoTimidezDesc: text("comportamentoTimidezDesc"),
  comportamentoAnsiedade: mysqlEnum("comportamentoAnsiedade", ["Sim", "Não"]),
  comportamentoAnsiedadeDesc: text("comportamentoAnsiedadeDesc"),
  comportamentoDepressao: mysqlEnum("comportamentoDepressao", ["Sim", "Não"]),
  comportamentoDepressaoDesc: text("comportamentoDepressaoDesc"),
  comportamentoDificuldadeAprendizado: mysqlEnum("comportamentoDificuldadeAprendizado", ["Sim", "Não"]),
  comportamentoDificuldadeAprendizadoDesc: text("comportamentoDificuldadeAprendizadoDesc"),
  comportamentoDificuldadeSocializacao: mysqlEnum("comportamentoDificuldadeSocializacao", ["Sim", "Não"]),
  comportamentoDificuldadeSocializacaoDesc: text("comportamentoDificuldadeSocializacaoDesc"),
  comportamentoOutros: mysqlEnum("comportamentoOutros", ["Sim", "Não"]),
  comportamentoOutrosDesc: text("comportamentoOutrosDesc"),
  
  // Observações Gerais
  observacoesGerais: text("observacoesGerais"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FichaMedica = typeof fichasMedicas.$inferSelect;
export type InsertFichaMedica = typeof fichasMedicas.$inferInsert;
