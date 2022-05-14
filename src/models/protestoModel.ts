import { number } from "joi";
import { model, Schema } from "mongoose";

export interface CredorInterface {
  documento?: string;
  nome?: string;
  cep?: string;
  uf?: string;
  bairro?: string;
  municipio?: string;
  endereco?: string;
}

export interface DevedoresInterface {
  documento: string;
  nome: string;
  cep: string;
  uf: string;
  bairro: string;
  municipio: string;
  endereco: string;
  email?: string;
  celular?: string;
}

export interface ProcuracaoInterface {
  nome: string;
  conteudo: string;
}

export interface ImagensInterface {
  nome: string;
  conteudo: string;
}

export interface ProtestoInterface {
  tituloId: string;
  transactionId: string;
  request: {
    tipo: "DM" | "DS" | "CT" | string;
    numero: string;
    valor: string;
    saldo: string;
    data_emissao: string;
    data_vencimento: string;
    devedores: DevedoresInterface[];
    imagens?: ImagensInterface[];
    fins_falimentares?: boolean;
    credor?: CredorInterface;
    procuracao?: ProcuracaoInterface;
  };
  responses: any[];
}

const requiredString = { type: String, required: true };
const optionalBoolean = { type: Boolean, required: false };
const optionalString = { type: String, required: false };

const schema = new Schema<ProtestoInterface>(
  {
    tituloId: requiredString,
    transactionId: requiredString,
    request: {
      tipo: { enum: ["DM", "DS", "CT"], type: String, required: true },
      numero: requiredString,
      valor: requiredString,
      saldo: requiredString,
      data_emissao: requiredString,
      data_vencimento: requiredString,
      devedores: [
        {
          documento: requiredString,
          nome: requiredString,
          cep: requiredString,
          uf: requiredString,
          bairro: requiredString,
          municipio: requiredString,
          endereco: requiredString,
          email: optionalString,
          celular: optionalString,
        },
      ],
      imagens: [
        {
          nome: requiredString,
          conteudo: requiredString,
        },
      ],
      fins_falimentares: optionalBoolean,
      credor: {
        documento: optionalString,
        nome: optionalString,
        cep: optionalString,
        uf: optionalString,
        bairro: optionalString,
        municipio: optionalString,
        endereco: optionalString,
      },
      procuracao: {
        nome: optionalString,
        conteudo: optionalString,
      },
    },
    responses: [],
  },
  {
    id: true,
    timestamps: true,
  }
);

export const ProtestoModel = model<ProtestoInterface>("ProtestoModel", schema);
