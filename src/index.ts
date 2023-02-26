import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./mongo/config";
import { router } from "./routes/controller";

const app: Express = express();

dotenv.config();

const PORT = process.env.PORT;

app.set("PORT", PORT);

app.use(express.json());

app.use(cors());

app.use(router);

app.listen(PORT, () => {
  console.log("Server running on port: ", PORT);
});