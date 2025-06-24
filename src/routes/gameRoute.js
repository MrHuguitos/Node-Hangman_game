import express from "express";
import { PalavraRandom } from "../controllers/gameController.js";

const router = express.Router();

router.get("/jogar", PalavraRandom); // Retorna uma palavra aleatoria

export default router;