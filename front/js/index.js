document.addEventListener("DOMContentLoaded", () => {
    // Variáveis do jogo
    let palavraSecreta = "";
    let letrasDaPalavra = [];
    let letrasUsadas = [];
    let acertos = 0;
    let erros = 0;

    // Elementos DOM
    const palavraContainer = document.querySelector(".lista");
    const imagemForca = document.getElementById("imagemForca");
    const inputText = document.getElementById("texto");
    const enviarButton = document.getElementById("enviar");
    const letrasUsadasContainer = document.getElementById("letrasUsadasContainer");
    
    // Dialogs e Modais
    const sobreDialog = document.getElementById("sobre");
    const tutorialDialog = document.getElementById("how_play");
    const resultDialog = document.getElementById("resultado");

    // Botões
    const sobreButton = document.getElementById("but_info");
    const tutorialButton = document.getElementById("but_help");
    const fecharSobre = document.getElementById("fecharSobre");
    const fecharTutorial = document.getElementById("fecharTutorial");

    // Criação dinâmica de elementos do resultado
    const palavraRevelada = document.getElementById("text-result");
    const titulo = document.getElementById("titulo");
    const p = document.createElement("p");
    const h2 = document.createElement("h2");
    
    p.className = "palavra-exibida";
    p.style = "font-weight: bold;";
    palavraRevelada.appendChild(p);

    // Fechar o dialog ao clicar fora dele
    resultDialog.addEventListener('click', (e) => {
        if (e.target == resultDialog) resultDialog.close();
    });
    if (sobreDialog) {
        sobreDialog.addEventListener('click', (e) => {
            if (e.target == sobreDialog) sobreDialog.close();
        });
    }
    if (tutorialDialog) {
        tutorialDialog.addEventListener('click', (e) => {
            if (e.target == tutorialDialog) tutorialDialog.close();
        });
    }

    // Função de abrir e fechar o Dialog sobre e tutorial
    if (sobreButton) sobreButton.addEventListener('click', () => sobreDialog.showModal());
    if (fecharSobre) fecharSobre.addEventListener('click', () => sobreDialog.close());
    if (tutorialButton) tutorialButton.addEventListener('click', () => tutorialDialog.showModal());
    if (fecharTutorial) fecharTutorial.addEventListener('click', () => tutorialDialog.close());

    // Função de carregamento da palavra
    function carregarPalavra() {
        fetch("/api/jogar")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Falha ao carregar a palavra do servidor.");
                };
                return response.json();
            })
            .then(palavra => {
                palavraSecreta = palavra.name.toLowerCase();
                p.textContent = palavra.name.toUpperCase();
                letrasDaPalavra = palavraSecreta.split('');
                desenharPalavra();
            })
            .catch(error => {
                console.error("Erro ao carregar palavra: ", error);
                palavraContainer.innerHTML = "<h2>Erro ao carregar o jogo. Tente recarregar a página.</h2>";
            });
    };

    // Função que desenha os traços referentes a cada letra
    function desenharPalavra() {
        palavraContainer.innerHTML = `<h2>${letrasDaPalavra.map((_, i) => `<span id="letra-${i}">_</span>`).join(' ')}</h2>`;
    };

    // Função que processa jogadas
    function jogar() {
        if (erros >= 6 || acertos === letrasDaPalavra.length) {
            return;
        };

        const letra = inputText.value.trim().toLowerCase();

        // Validações de input
        if (!letra) {
            alert("Digite uma letra!");
            return;
        };
        if (letra.length !== 1 || !/^[a-z]$/.test(letra)) {
            alert("Digite apenas uma letra válida(a-z)!");
            inputText.value = "";
            return;
        };
        if (letrasUsadas.includes(letra)) {
            alert("Essa letra já foi usada!");
            inputText.value = "";
            return;
        };

        letrasUsadas.push(letra);
        const spanLetra = document.createElement("span");
        spanLetra.textContent = letra.toUpperCase() + " ";

        const posicoes = [];
        letrasDaPalavra.forEach((char, index) => {
            if (char === letra) {
                posicoes.push(index);
            };
        });

        if (posicoes.length > 0) {
            // Acertou a letra
            posicoes.forEach(posicao => {
                document.getElementById(`letra-${posicao}`).textContent = letra.toUpperCase();
            });
            acertos += posicoes.length;
            spanLetra.classList.add("letra-usada-verde");
        } else {
            // Errou a letra
            erros++;
            if (imagemForca) imagemForca.src = `/img/forca${erros}.png`;
            spanLetra.classList.add("letra-usada-vermelha");
        };

        letrasUsadasContainer.appendChild(spanLetra);
        inputText.value = '';
        inputText.focus();

        if (acertos === letrasDaPalavra.length) {
            h2.textContent = "[ YOU WIN ]";
            h2.style = "color: rgb(34, 253, 34); font-weight: bold;";
            titulo.appendChild(h2);
            resultDialog.showModal();
        } else if (erros >= 6) {
            h2.textContent = "[ GAME OVER ]";
            h2.style = "color: rgb(255, 30, 30); font-weight: bold;";
            titulo.appendChild(h2);
            resultDialog.showModal();
        };
    };

    // Acionar função de jogar
    enviarButton.onclick = jogar;

    inputText.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            jogar();
        };
    });

    carregarPalavra();
});