import express from "express";
import { UsarHTML, PalavraRandom } from "../controllers/gameController.js";

const routes = (app) => {
    app.use(express.json());

    app.get("/", UsarHTML); // Retorna a página HTML
    app.get("/jogar", PalavraRandom); // Retorna uma palavra aleatoria
};

export default routes;