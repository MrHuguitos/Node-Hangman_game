import { getPalavras } from "../models/gameModel.js";

export async function PalavraRandom(req, res) {
    try {
        const palavra = await getPalavras(); // Lista de palavras
        const wordRandom = palavra[Math.floor(Math.random() * palavra.length)]; // Escolhe uma palavra aleatoria
        res.status(200).json(wordRandom);
    } catch (error) {
        console.error("Erro ao escolher palavra: ", error.message);
        res.status(500).json({ "Erro": "Falha ao buscar palavra no servidor." });
    };
};