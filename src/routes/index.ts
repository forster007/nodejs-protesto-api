import { Request, Response, Router } from "express";
import { v4 } from "uuid";

import IndexController from "../controllers";
import { IndexInterface } from "../models";
import makeLogger from "../services/logger.service";
import queueService from "../services/queue.service";

export const indexRouter = Router();
const indexController = new IndexController();

indexRouter.get("/villelaBrasilQueueOne", async (req: Request, res: Response) => {
  const transactionId = v4();
  const logger = makeLogger(transactionId, process.env.LOG_LEVEL);
  const { cnpj } = req.query;
  const obj: IndexInterface = {
    cnpj: cnpj as string,
    name: "villelaBrasilQueueOne",
    responses: {
      exatodigital: {
        data: {},
        status: "requested",
      },
      neoway: {
        data: {},
        status: "requested",
      },
      serasa: {
        data: {},
        status: "requested",
      },
    },
    status: "requested",
    transactionId,
  };

  logger.info(`Sending object to store on MongoDB: ${JSON.stringify(obj)}`);
  await indexController.save(obj);
  logger.success(`Object sended successfully to Database`);

  logger.info(`Sending object to process on Azure Service Bus: ${JSON.stringify(obj)}`);
  await queueService.NeoWay.sendToQueue(obj);
  logger.success(`Object sended successfully to Queue`);

  res.json({ message: "All steps finished successfully on request", transactionId });
});
