from flask import Flask, render_template
import mysql.connector

banco = mysql.connector.connect (
    host = "localhost",
    user = "root",
    password = "labhugo",
    database = "forca"
)

cursor = banco.cursor(dictionary=True)

app = Flask(__name__)
app.secret_key = 'supersecretkey'

@app.route('/')  # Página Principal do Jogo
def home():
    cursor.execute("SELECT nome FROM palavra ORDER BY RAND() LIMIT 1;")
    lista_letras = list(cursor.fetchone()['nome'])
    letras = len(lista_letras)

    return render_template("principal.html", letras = letras, lista_letras = lista_letras)

if __name__ == "__main__":
    app.run(debug=True)