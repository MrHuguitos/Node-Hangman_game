import "dotenv/config";
import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO); // Faz a conexão com o banco

export async function getPalavras() {
    const db = conexao.db("Hangman-game");
    const colecao = db.collection("words");

    return colecao.find().toArray(); // Retorna uma lista com todas as palavras
};