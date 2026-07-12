// lib/content/types.ts
import { z } from "zod";
import {
  objetivoSchema,
  estiloDeVidaSchema,
  mapaDoMercadoSchema,
  mapaEImaDeProblemasSchema,
  perfilIdealDeClienteSchema,
  teseDeValorSchema,
  ofertaSchema,
  primeirosPassosSchema,
  fluxoDeCaixaSchema,
  erpSchema,
} from "./schemas";

export type ObjetivoContent = z.infer<typeof objetivoSchema>;
export type EstiloDeVidaContent = z.infer<typeof estiloDeVidaSchema>;
export type MapaDoMercadoContent = z.infer<typeof mapaDoMercadoSchema>;
export type MapaEImaDeProblemasContent = z.infer<typeof mapaEImaDeProblemasSchema>;
export type PerfilIdealDeClienteContent = z.infer<typeof perfilIdealDeClienteSchema>;
export type TeseDeValorContent = z.infer<typeof teseDeValorSchema>;
export type OfertaContent = z.infer<typeof ofertaSchema>;
export type PrimeirosPassosContent = z.infer<typeof primeirosPassosSchema>;
export type FluxoDeCaixaContent = z.infer<typeof fluxoDeCaixaSchema>;
export type ErpContent = z.infer<typeof erpSchema>;
