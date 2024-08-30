import mysql.connector

banco = mysql.connector.connect(host="localhost",
                                database="forca",
                                user="root",
                                password="labhugo"
                                )

cursor = banco.cursor(dictionary=True)

while True:
    print("----------- Jogo da Forca -----------")
    print("[1] Iniciar")
    print("[2] Adicionar palavra")
    print("[3] Sair")

    op = input("? ")

    if op == '1':
        cursor.execute("SELECT nome FROM palavra ORDER BY RAND() LIMIT 1;")
        palavra = cursor.fetchone()['nome']
            
        lista_letras = list(palavra) #Lista com cada letra da palavra
        letras_usadas = []
        erros = 0
        acertos = 0

        lista_game = ['_' for letra in lista_letras] # Criando uma lista com o mesmo número de elementos que lista_letras, mas todos os elementos são '_'
        print(" ".join(lista_game)) #Unir os elementos da lista, sem as aspas
        
        while erros < 5:
            letra = input("Digite uma letra: ")
            if letra in letras_usadas: #Caso a letra já tenha sido usada
                print("Essa letra já foi usada!")
            else:
                letras_usadas.append(letra) # Adiciona a letra na lista de listas já usadas
                if letra in lista_letras: # Caso a letra esteja na palavra
                    posicoes = [index for index, item in enumerate(lista_letras) if item == letra] # Encontre todas as posições do valor na lista
                    
                    ''' for index, item in enumerate(lista_letras):
                            if item == letra:
                                posicoes = index 
                    '''

                    for posicao in posicoes: # Substitua o "_" nas posições pelos valores correspondentes
                        lista_game[posicao] = letra 
                    print(" ".join(lista_game))
                    acertos += len(posicoes) #Quantidade de posições que a letra estava
                    if acertos == len(lista_letras): #Se a quantidade de letras certas for igual a quantidade de letras no jogo, o jogo será encerrado
                        print("Você ganhou!")
                        print("Voltando...\n")
                        break
                else:
                    if erros >= 5:
                        print("Você Perdeu!")
                        print("Voltando...\n")
                        break
                    else:
                        erros += 1
                        print("Tente novamente!")

    elif op == '2':
        palavra = str(input("Qual a palavra? "))
        
        cursor.execute("INSERT INTO palavra(nome) VALUES (%s);", (palavra, ))
        banco.commit()
        print(">>> Palavra aceita!\n")
    elif op == '3':
        print("Encerrando...")
        break
    else:
        print("Isso não é uma opção...\ntente novamente!")