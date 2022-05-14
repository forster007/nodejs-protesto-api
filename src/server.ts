import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { indexRouter } from "./routes";
import mongoService from "./services/mongo.service";

const SERVER_PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(indexRouter);

app.listen(SERVER_PORT, async () => {
  try {
    await mongoService();
    console.log(`Servico iniciado na porta ${SERVER_PORT}`);
  } catch (err) {
    process.exit(1);
  }
});
