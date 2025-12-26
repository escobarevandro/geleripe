import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { generateImage } from "./_core/imageGeneration";
import { transcribeAudio } from "./_core/voiceTranscription";
import { z } from "zod";
import * as db from "./db";
import { determinarRamo } from "../shared/ramoUtils";

// Schema de validação para Associado Beneficiário
const associadoBeneficiarioSchema = z.object({
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  sexo: z.enum(["Masculino", "Feminino"]),
  naturalidade: z.string().optional(),
  naturalidadeUf: z.string().max(2).optional(),
  dataNascimento: z.string().transform(str => new Date(str)),
  escolaridade: z.string().optional(),
  corRaca: z.string().optional(),
  endereco: z.string().optional(),
  enderecoNumero: z.string().optional(),
  enderecoComplemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().max(2).optional(),
  cep: z.string().optional(),
  telCelular: z.string().optional(),
  telContato1: z.string().optional(),
  telContato2: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  profissao: z.string().optional(),
  localTrabalho: z.string().optional(),
  rg: z.string().optional(),
  rgOrgaoExpedidor: z.string().optional(),
  cpf: z.string().optional(),
  clubeServico: z.string().optional(),
  religiao: z.string().optional(),
});

// Schema de validação para Responsável Legal
const responsavelLegalSchema = z.object({
  associadoId: z.number(),
  nomeCompleto: z.string().min(1, "Nome completo é obrigatório"),
  parentesco: z.enum(["Pai", "Mãe", "Tutor"]),
  sexo: z.enum(["Masculino", "Feminino"]),
  naturalDe: z.string().optional(),
  naturalUf: z.string().max(2).optional(),
  dataNascimento: z.string().transform(str => str ? new Date(str) : undefined).optional(),
  escolaridade: z.string().optional(),
  corRaca: z.string().optional(),
  endereco: z.string().optional(),
  enderecoNumero: z.string().optional(),
  enderecoComplemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().max(2).optional(),
  cep: z.string().optional(),
  telCelular: z.string().optional(),
  telContato1: z.string().optional(),
  telContato2: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  profissao: z.string().optional(),
  localTrabalho: z.string().optional(),
  rg: z.string().optional(),
  rgOrgaoExpedidor: z.string().optional(),
  cpf: z.string().optional(),
});

// Schema de validação para Ficha Médica - COMPLETO conforme database_schema.sql
const fichaMedicaSchema = z.object({
  associadoId: z.number(),
  
  // Informações Gerais
  tipoSanguineo: z.string().optional(),
  fatorRh: z.enum(["+", "-"]).optional(),
  peso: z.string().optional(),
  altura: z.string().optional(),
  equipamentoAuxilio: z.enum(["Nenhum", "Óculos", "Lente de Contato", "Aparelho Auditivo", "Prótese", "Outro"]).optional(),
  equipamentoAuxilioOutro: z.string().optional(),
  saudeFisica: z.enum(["Normal", "Alterada"]).optional(),
  saudeFisicaObs: z.string().optional(),
  medicamentoUso: z.enum(["Nenhum", "Sim"]).optional(),
  medicamentoUsoLista: z.string().optional(),
  sabeNadar: z.enum(["Sim", "Não"]).optional(),
  restricaoAlimentar: z.string().optional(),
  
  // Alergias
  temAlergias: z.enum(["Nenhuma", "Sim"]).optional(),
  alergiaPicadaInseto: z.boolean().optional(),
  alergiaPicadaInsetoCite: z.string().optional(),
  alergiaMedicamentos: z.boolean().optional(),
  alergiaMedicamentosCite: z.string().optional(),
  alergiaPlantas: z.boolean().optional(),
  alergiaPlantasCite: z.string().optional(),
  alergiaAlimentos: z.boolean().optional(),
  alergiaAlimentosCite: z.string().optional(),
  alergiaAcaros: z.boolean().optional(),
  alergiaAcarosCite: z.string().optional(),
  alergiaFungos: z.boolean().optional(),
  alergiaFungosCite: z.string().optional(),
  alergiaOutro: z.boolean().optional(),
  alergiaOutroCite: z.string().optional(),
  
  // Emergências Médicas
  jaTeveConvulsao: z.enum(["Sim", "Não"]).optional(),
  jaTeveConvulsaoObs: z.string().optional(),
  jaDesmaiou: z.enum(["Sim", "Não"]).optional(),
  jaDesmaiouObs: z.string().optional(),
  jaSofreuCirurgia: z.enum(["Sim", "Não"]).optional(),
  jaSofreuCirurgiaObs: z.string().optional(),
  jaFoiInternado: z.enum(["Sim", "Não"]).optional(),
  jaFoiInternadoObs: z.string().optional(),
  jaTeveDoencaGrave: z.enum(["Sim", "Não"]).optional(),
  jaTeveDoencaGraveObs: z.string().optional(),
  
  // Saúde Mental
  acompanhamentoPsicologico: z.enum(["Sim", "Não"]).optional(),
  acompanhamentoPsicologicoObs: z.string().optional(),
  acompanhamentoPsiquiatrico: z.enum(["Sim", "Não"]).optional(),
  acompanhamentoPsiquiatricoObs: z.string().optional(),
  acompanhamentoNeurologico: z.enum(["Sim", "Não"]).optional(),
  acompanhamentoNeurologicoObs: z.string().optional(),
  acompanhamentoFonoaudiologo: z.enum(["Sim", "Não"]).optional(),
  acompanhamentoFonoaudiologoObs: z.string().optional(),
  
  // Deficiências
  temDeficiencias: z.enum(["Não", "Sim"]).optional(),
  deficienciaFisica: z.boolean().optional(),
  deficienciaFisicaCite: z.string().optional(),
  deficienciaVisual: z.boolean().optional(),
  deficienciaVisualCite: z.string().optional(),
  deficienciaAuditiva: z.boolean().optional(),
  deficienciaAuditivaCite: z.string().optional(),
  deficienciaIntelectual: z.boolean().optional(),
  deficienciaIntelectualCite: z.string().optional(),
  deficienciaOutra: z.boolean().optional(),
  deficienciaOutraCite: z.string().optional(),
  
  // Apresenta no Comportamento
  comportamentoHiperatividade: z.enum(["Sim", "Não"]).optional(),
  comportamentoHiperatividadeDesc: z.string().optional(),
  comportamentoDeficitAtencao: z.enum(["Sim", "Não"]).optional(),
  comportamentoDeficitAtencaoDesc: z.string().optional(),
  comportamentoAgressividade: z.enum(["Sim", "Não"]).optional(),
  comportamentoAgressividadeDesc: z.string().optional(),
  comportamentoTimidez: z.enum(["Sim", "Não"]).optional(),
  comportamentoTimidezDesc: z.string().optional(),
  comportamentoAnsiedade: z.enum(["Sim", "Não"]).optional(),
  comportamentoAnsiedadeDesc: z.string().optional(),
  comportamentoDepressao: z.enum(["Sim", "Não"]).optional(),
  comportamentoDepressaoDesc: z.string().optional(),
  comportamentoDificuldadeAprendizado: z.enum(["Sim", "Não"]).optional(),
  comportamentoDificuldadeAprendizadoDesc: z.string().optional(),
  comportamentoDificuldadeSocializacao: z.enum(["Sim", "Não"]).optional(),
  comportamentoDificuldadeSocializacaoDesc: z.string().optional(),
  comportamentoOutros: z.enum(["Sim", "Não"]).optional(),
  comportamentoOutrosDesc: z.string().optional(),
  
  // Observações Gerais
  observacoesGerais: z.string().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  associados: router({
    list: protectedProcedure.query(async () => {
      return db.getAllAssociadosComFichas();
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const associado = await db.getAssociadoBeneficiarioById(input.id);
        const responsavel = await db.getResponsavelByAssociadoId(input.id);
        const fichaMedica = await db.getFichaMedicaByAssociadoId(input.id);
        
        return {
          associado,
          responsavel,
          fichaMedica,
        };
      }),
    
    create: protectedProcedure
      .input(associadoBeneficiarioSchema)
      .mutation(async ({ input }) => {
        // Calcular ramo automaticamente baseado na data de nascimento
        const ramoInfo = determinarRamo(input.dataNascimento);
        const dataComRamo = {
          ...input,
          ramo: ramoInfo.nome,
        } as any;
        return db.createAssociadoBeneficiario(dataComRamo);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: associadoBeneficiarioSchema.partial(),
      }))
      .mutation(async ({ input }) => {
        // Recalcular ramo se data de nascimento foi alterada
        let dataAtualizada = input.data;
        if (input.data.dataNascimento) {
          const ramoInfo = determinarRamo(input.data.dataNascimento);
          dataAtualizada = {
            ...input.data,
            ramo: ramoInfo.nome,
          } as any;
        }
        return db.updateAssociadoBeneficiario(input.id, dataAtualizada);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteAssociadoBeneficiario(input.id);
        return { success: true };
    }),

    responsaveis: router({
      getByAssociadoId: protectedProcedure
        .input(z.object({ associadoId: z.number() }))
        .query(async ({ input }) => {
          return db.getResponsavelByAssociadoId(input.associadoId);
        }),

      create: protectedProcedure
        .input(responsavelLegalSchema)
        .mutation(async ({ input }) => {
          return db.createResponsavelLegal(input);
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          data: responsavelLegalSchema.partial(),
        }))
        .mutation(async ({ input }) => {
          return db.updateResponsavelLegal(input.id, input.data);
        }),
    }),

    fichasMedicas: router({
      getByAssociadoId: protectedProcedure
        .input(z.object({ associadoId: z.number() }))
        .query(async ({ input }) => {
          return db.getFichaMedicaByAssociadoId(input.associadoId);
        }),

      create: protectedProcedure
        .input(fichaMedicaSchema)
        .mutation(async ({ input }) => {
          return db.createFichaMedica(input as any);
        }),

      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          data: fichaMedicaSchema.partial(),
        }))
        .mutation(async ({ input }) => {
          return db.updateFichaMedica(input.id, input.data as any);
        }),
    }),
  }),

  // Image generation via internal image service
  image: router({
    generate: protectedProcedure
      .input(
        z.object({
          prompt: z.string().min(1),
          originalImages: z
            .array(
              z.object({
                url: z.string().optional(),
                b64Json: z.string().optional(),
                mimeType: z.string().optional(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await generateImage(input as any);
          if (!result || !result.url) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Image generation failed" });
          }
          return result;
        } catch (err) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err instanceof Error ? err.message : String(err) });
        }
      }),
  }),

  // Voice transcription via internal whisper service
  voice: router({
    transcribe: protectedProcedure
      .input(
        z.object({
          audioUrl: z.string().url(),
          language: z.string().optional(),
          prompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await transcribeAudio(input as any);
          if ("error" in result) {
            throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
          }
          return result;
        } catch (err) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: err instanceof Error ? err.message : String(err) });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
