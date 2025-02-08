import path from "path";
import Configurar from "../../dirconfig.js";
import { getPalavras } from "../models/gameModel.js";

export async function UsarHTML(req, res) {
    res.status(200).sendFile(path.resolve(Configurar() + "/front/html/index.html"));
};

export async function PalavraRandom(req, res) {
    const palavra = await getPalavras(); // Lista de palavras
    const wordRandom = palavra[Math.floor(Math.random() * palavra.length)]; // Escolhe uma palavra aleatoria

    res.status(200).json(wordRandom);
};