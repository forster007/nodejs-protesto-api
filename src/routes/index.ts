import axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import Joi from "joi";
import { v4 } from "uuid";

import ProtestoController from "../controllers/protestoController";
import { ProtestoInterface } from "../models/protestoModel";
import protestoValidationSchema from "../validation/protestoValidation";

export const indexRouter = Router();
const protestoController = new ProtestoController();

indexRouter.post(
  "/inserirNovoTitulo",
  async (req: Request, res: Response, next: NextFunction) => {
    const options: Joi.ValidationOptions = {
      abortEarly: true,
      allowUnknown: true,
      noDefaults: true,
      stripUnknown: true,
    };

    const { error } = protestoValidationSchema.validate(req.body, options);

    if (!error) return next();

    const message = error.details.map((i) => i.message).join(",");

    return res.status(422).json({ error: message });
  },
  async (req: Request, res: Response) => {
    const transactionId = v4();

    const obj: ProtestoInterface = {
      transactionId,
      request: req.body,
      responses: [],
    };

    try {
      const { data } = await axios.post(`${process.env.PROTESTO_API_URL}/v1/titulo`, req.body, {
        headers: { Authorization: process.env.PROTESTO_API_TOKEN },
      });

      obj.responses = [data];
      await protestoController.save(obj);
      res.json({
        id: data.id,
        situacao: "AGUARDANDO_COLETA",
        transactionId,
      });
    } catch (error) {
      res.status(400).json({ message: "Erro ao retornar os dados", transactionId });
      obj.responses = error.response.data;
      await protestoController.save(obj);
    }
  }
);

indexRouter.get("/consultarTitulo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const titulo = await protestoController.findById({ id: Number(id) });

  if (titulo && Object.keys(titulo).length) {
    try {
      const { data } = await axios.get(`${process.env.PROTESTO_API_URL}/v1/titulo/${id}`, {
        headers: { Authorization: process.env.PROTESTO_API_TOKEN },
      });

      if (data.situacao !== titulo.responses[titulo.responses.length - 1].situacao) {
        titulo.responses.push(data);
        await protestoController.findByIdAndUpdate({ id: Number(id), update: titulo });
      }

      res.json({ data });
    } catch (error) {
      res.status(400).json({ message: "Erro ao retornar os dados" });
    }
  }

  res.status(400).json({ message: "Nenhum titulo cadastrado com esse ID" });
});
