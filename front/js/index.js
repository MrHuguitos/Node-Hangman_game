function validar(input) {
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(input.value)) {
        input.value = input.value.replace(/[^a-zA-Z]/g, ''); 
    };
};

var listar_letras = [];
var letras_usadas = [];
var acertos = 0;
var erros = 0;
var word = "";

async function LoadWord() {
    try {
        const response = await fetch("http://127.0.0.1:3000/jogar");
        const wordRandom = await response.json();
        word = wordRandom.name;
        listar_letras = word.split('');
    } catch(error) {
        console.error("Erro ao carregar palavra: ", error);
    };
};

LoadWord().then(() => {  // Espera a palavra ser carregada antes de permitir jogar
    document.querySelector(".lista h2").innerHTML = listar_letras.map((_, i) => `<span id="${i}">_</span>`).join('');

    const botaoJogar = document.getElementById("enviar");

    botaoJogar.addEventListener("click", function () {
        if (erros < 6) {
            var letra = document.getElementById('texto').value.toLowerCase(); // Torna a letra minúscula

            if (letras_usadas.includes(letra)) {
                console.log("Essa letra já foi usada!"); 
            } else {
                letras_usadas.push(letra);                                                       // Adiciona a letra na lista de usadas
                const letrasUsadasContainer = document.getElementById("letrasUsadasContainer");
                const spanLetra = document.createElement("span");
                spanLetra.textContent = letra.toUpperCase();                            
                
                var posicoes = [];

                listar_letras.forEach((item, index) => {
                    if (item === letra) {
                        posicoes.push(index);
                    }
                }); // Percorre todos os itens de 'listar_letras' e, se o item for igual ao input, seu index vai para a lista posicoes

                if (posicoes.length > 0) {
                    posicoes.forEach(posicao => {
                        document.getElementById(posicao).textContent = letra;
                    }); // percorre a lista 'posicoes' e, se o seu valor for igual ao ID do elemento '_', substitui o elemento pelo input
                    acertos += posicoes.length; // Adiciona pontos iguais ao número de acertos na variavel acertos
                    spanLetra.classList.add("letra-usada-verde"); // Classe CSS para estilização
                    if (acertos === listar_letras.length) { 
                        document.querySelector("#vitoria").showModal();
                    }
                } else {
                    erros++;
                    spanLetra.classList.add("letra-usada-vermelha"); // Classe CSS para estilização
                    document.getElementById('imagemForca').src = `img/forca${erros}.png`;
                    if (erros >= 6) {
                        document.querySelector("#derrota").showModal();
                    }
                } // Caso o input não esteja correto, 1 ponto será adicionado na variavel de erros 

                letrasUsadasContainer.appendChild(spanLetra);
            }
            document.getElementById('texto').value = ''; 
        }
    });
});