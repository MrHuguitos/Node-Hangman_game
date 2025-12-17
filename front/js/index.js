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
    const sobreButton = document.getElementById("but_info");
    const sobreDialog = document.getElementById("sobre");
    const tutorialButton = document.getElementById("but_help");
    const tutorialDialog = document.getElementById("how_play");
    const fecharSobre = document.getElementById("fecharSobre");
    const fecharTutorial = document.getElementById("fecharTutorial");
    const victoryDialog = document.getElementById("vitoria");
    const defeatDialog = document.getElementById("derrota");

    // Fechar o dialog ao clicar fora dele
    victoryDialog.addEventListener('click', (e) => {
        if (e.target == victoryDialog) {
            victoryDialog.close();
        };
    });
    defeatDialog.addEventListener('click', (e) => {
        if (e.target == defeatDialog) {
            defeatDialog.close();
        };
    });
    sobreDialog.addEventListener('click', (e) => {
        if (e.target == sobreDialog) {
            sobreDialog.close();
        };
    });
    tutorialDialog.addEventListener('click', (e) => {
        if (e.target == tutorialDialog) {
            tutorialDialog.close();
        };
    });

    // Função de abrir e fechar o Dialog sobre e tutorial
    sobreButton.addEventListener('click', () => {
        sobreDialog.showModal();
    });
    fecharSobre.addEventListener('click', () => {
        sobreDialog.close();
    });
    tutorialButton.addEventListener('click', () => {
        tutorialDialog.showModal();
    });
    fecharTutorial.addEventListener('click', () => {
        tutorialDialog.close();
    });

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
        spanLetra.textContent = letra.toUpperCase();

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
            imagemForca.src = `/img/forca${erros}.png`;
            spanLetra.classList.add("letra-usada-vermelha");
        };

        letrasUsadasContainer.appendChild(spanLetra);
        inputText.value = '';
        inputText.focus();

        if (acertos === letrasDaPalavra.length) {
            victoryDialog.showModal();
        } else if (erros >= 6) {
            defeatDialog.showModal();
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