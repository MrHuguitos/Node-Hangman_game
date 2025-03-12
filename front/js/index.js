function validar(input) {
    const regex = /^[a-zA-Z]*$/;
    if (!regex.test(input.value)) {
        input.value = input.value.replace(/[^a-zA-Z]/g, ''); 
    };
}; // Função para negar o uso de números ou caracteres especiais

var listar_letras = [];
var letras_usadas = [];
var acertos = 0;
var erros = 0;
var word = "";

async function LoadWord() {
    try {
        const resposta = await fetch("http://127.0.0.1:3000/jogar"); // Acessar a rota
        const wordRandom = await resposta.json(); // Acessar a resposta da rota no formato json
        word = wordRandom.name; // Atribuir o nome da palavra à variavél word
        listar_letras = word.split(''); // Transdormar a variavél numa lista de letras
    } catch(error) {
        console.error("Erro ao carregar palavra: ", error);
    };
}; // Função para pegar uma palavra aleatoria no db

LoadWord().then(() => {  // Espera a palavra ser carregada antes de permitir jogar
    document.querySelector(".lista h2").innerHTML = listar_letras.map((_, i) => `<span id="${i}">_</span>`).join(''); // Para cada item no array listar_letras, cria uma string de HTML no formato <span id="i">_</span>, onde i é o índice. Então, .join('') junta todos os elementos em uma única string sem separadores e a define como conteúdo HTML do <h2>

    const button = document.getElementById("enviar"); // Botão de enviar letra
    const inputText = document.getElementById("texto"); // Letra enviada

    function jogar() {
        if (erros < 6) {
            var letra = inputText.value.trim().toLowerCase(); // Torna a letra minúscula e remove qualquer espaço antes ou depois dela

            if (letra.length !== 1) {
                alert("Digite apenas uma letra válida!");
                inputText.value = "";
                return;
            } // Não permite que o user invie o campo vazio ou com espeço

            if (letras_usadas.includes(letra)) {
                alert("Essa letra já foi usada!"); 
            } else {
                letras_usadas.push(letra); // Adiciona a letra na lista de usadas
                const letrasUsadasContainer = document.getElementById("letrasUsadasContainer");
                const spanLetra = document.createElement("span"); // Cria um elemento span
                spanLetra.textContent = letra.toUpperCase();                        
                
                var posicoes = [];

                listar_letras.forEach((item, index) => {
                    if (item === letra) { // Se o item da lista for igual à letra digitada
                        posicoes.push(index); // Adiciona o index do item à lista posicoes
                    }
                }); 

                if (posicoes.length > 0) {
                    posicoes.forEach(posicao => {
                        document.getElementById(posicao).textContent = letra; // Se algum elemento tiver id = posicao, seu texto será a letra digitada
                    }); 
                    acertos += posicoes.length; // Adiciona pontos iguais ao número de acertos na variavel acertos
                    spanLetra.classList.add("letra-usada-verde"); 
                    if (acertos === listar_letras.length) { 
                        document.querySelector("#vitoria").showModal();
                    }
                } else {
                    erros++; // Caso a letra esteja incorreta, 1 ponto será adicionado na variavel erros
                    spanLetra.classList.add("letra-usada-vermelha");
                    document.getElementById('imagemForca').src = `img/forca${erros}.png`;
                    if (erros >= 6) {
                        document.querySelector("#derrota").showModal();
                    }
                }  

                letrasUsadasContainer.appendChild(spanLetra);
            }
            document.getElementById('texto').value = ''; 
        };
    };
    button.addEventListener("click", jogar); // Clicar no botão ativa a função
    inputText.addEventListener("keydown", function(event) { // Clicar na tecla enter também ativa a função
        if (event.key === "Enter") {
            event.preventDefault();
            jogar();
        };
    });
});