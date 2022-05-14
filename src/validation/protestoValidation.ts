import Joi from "joi";

const requiredString = Joi.string().required();
const optionalBoolean = Joi.boolean().optional();
const optionalString = Joi.string().optional();

const protestoValidation = Joi.object()
  .keys({
    tipo: requiredString.valid("DM", "DS", "CT"),
    numero: requiredString,
    valor: requiredString,
    saldo: requiredString,
    data_emissao: requiredString,
    data_vencimento: requiredString,
    devedores: Joi.array()
      .items(
        Joi.object().keys({
          documento: requiredString,
          nome: requiredString,
          cep: requiredString,
          uf: requiredString,
          bairro: requiredString,
          municipio: requiredString,
          endereco: requiredString,
          email: optionalString,
          celular: optionalString,
        })
      )
      .required(),
    imagens: Joi.array()
      .items(
        Joi.object().keys({
          nome: requiredString,
          conteudo: requiredString,
        })
      )
      .optional(),
    fins_falimentares: optionalBoolean,
    credor: Joi.object()
      .keys({
        documento: optionalString,
        nome: optionalString,
        cep: optionalString,
        uf: optionalString,
        bairro: optionalString,
        municipio: optionalString,
        endereco: optionalString,
      })
      .optional(),
    procuracao: Joi.object({
      nome: requiredString,
      conteudo: requiredString,
    }).optional(),
  })
  .required();

export default protestoValidation;
