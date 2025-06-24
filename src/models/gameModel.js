import clientPromise from "../config/dbconfig.js";

let db;

async function init() {
    if (db) return;
    try {
        const client = await clientPromise;
        db = client.db("Hangman-game");
    } catch (error) {
        console.error("Falha ao conectar ao banco de dados: ", error);
        throw new Error("Não foi possível conectar ao banco de dados.");
    };
};

export async function getPalavras() {
    await init();
    const colecao = db.collection("words");
    return colecao.find().toArray(); // Retorna uma lista com todas as palavras
};