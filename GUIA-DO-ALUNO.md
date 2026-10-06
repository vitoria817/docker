# Oficina: microsserviços com Docker e Docker Compose

_Arquitetura de Software · Roteiro do aluno_

Nesta oficina você monta uma **loja virtual simplificada** feita de vários serviços, cada um em seu próprio container. Tudo roda na nuvem, no **GitHub Codespaces**: você não precisa instalar nada no computador.

Ao final de cada exercício, você tira **um print** para entregar. São **5 prints** no total.

## 1. Antes da aula (cerca de 15 minutos)

1. **Crie uma conta no GitHub** em github.com/signup e confirme o e-mail que o GitHub enviar. Se você já tem conta, pule esta etapa.
2. **Crie o seu repositório a partir do modelo.** Neste endereço (que é o repositório modelo), clique no botão verde **Use this template**, escolha **Create a new repository**, deixe o seu usuário em **Owner**, mantenha o nome sugerido e clique em **Create repository**.
3. **Abra o ambiente.** No **seu** repositório (o que você acabou de criar), clique em **Code**, abra a aba **Codespaces** e clique em **Create codespace on main**. Aguarde de 1 a 2 minutos: abrirá um editor de código no navegador.
4. **Confira o Docker.** No terminal, na parte de baixo do editor (se não aparecer, abra pelo menu **Terminal → New Terminal**), rode os comandos abaixo. Os dois devem mostrar uma versão, sem erro.

```bash
docker version
docker compose version
```

**Conheça a tela do editor:**

| Onde | Para quê |
|---|---|
| **Explorador** (lado esquerdo) | Lista as pastas e arquivos. As pastas `01-...` até `07-...` são os passos |
| **Editor** (centro) | Onde você abre e altera arquivos, como o `compose.yaml` |
| **Terminal** (embaixo) | Onde você digita os comandos |
| **PORTAS** (embaixo, ao lado do terminal) | Lista as portas abertas pelos containers. É por aqui que você abre a loja no navegador: clique no ícone de globo ao lado da porta 8080 |

Quando não for mais usar o ambiente, **pare o Codespace** para não gastar a sua cota gratuita: no GitHub, em **Code → Codespaces**, clique nos três pontinhos (**⋯**) ao lado do seu Codespace e escolha **Stop codespace**. Seus arquivos ficam guardados.

## 2. Como funciona a oficina

- Cada passo tem uma **pasta** (`01-primeiro-container` até `07-observando-falhas`) com um `README.md` com a tarefa e perguntas para pensar. Leia o README do passo.
- Antes de rodar comandos, **entre na pasta do passo**. Exemplo: `cd 03-front`.
- O código dos serviços (`server.js` e `Dockerfile`) já vem pronto. **Leia, mas não precisa alterar.** O seu trabalho é o `compose.yaml`.
- A resposta de cada passo está no README (em "Ver a solução") e em `solucao/compose.yaml`. **Tente antes de olhar.** Se for copiar, copie o **conteúdo** para o `compose.yaml` da pasta do passo e rode os comandos de dentro da pasta do passo.
- Ao terminar um exercício, **tire o print primeiro** e só depois rode `docker compose down`. O `down` apaga os containers, e você perderia o que mostrar.
- Travou? Os passos são independentes: a pasta do passo seguinte já traz tudo o que você precisa para continuar.

Os 5 exercícios, com o tempo de referência. Quem não terminar na aula pode continuar em casa ou na próxima aula.

| Exercício | Passos e pastas | Tempo |
|---|---|---|
| **1** | Passos 1 e 2: primeiro container e Docker Compose (`01-primeiro-container`, `02-docker-compose`) | ~20 min |
| **2** | Passo 3: Front (`03-front`) | ~15 min |
| **3** | Passos 4 e 5: Pedidos, Estoque e comunicação (`04-pedidos-e-estoque`, `05-comunicacao`) | ~25 min |
| **4** | Passo 6: Pagamento (`06-pagamento`) | ~10 min |
| **5** | Passo 7: derrubar o Estoque e observar (`07-observando-falhas`) | ~15 min |

## 3. Os exercícios

### Exercício 1 · Passos 1 e 2: primeiro container e Docker Compose

**Passo 1** (`01-primeiro-container`): rode um servidor web sem escrever nenhum arquivo, abra a porta 8080 e compare `docker images` com `docker ps`. Depois, remova os containers criados:

```bash
docker run -d --name loja-1 -p 8080:80 nginx
docker rm -f loja-1 loja-2 loja-3
```

**Passo 2** (`02-docker-compose`): crie nesta pasta um `compose.yaml` equivalente ao comando do passo 1 e suba:

```bash
cd 02-docker-compose
docker compose up -d
docker compose ps
```

**Terminou quando:** a página do nginx abre na porta 8080, agora vinda do Compose.

**Print deste exercício:** o **terminal** com o resultado de `cat compose.yaml`, seguido de `docker compose ps`.

Depois do print: `docker compose down`.

### Exercício 2 · Passo 3: Front

Em `03-front`, altere o `compose.yaml`: renomeie o serviço `web` para `front` e troque `image: nginx` por `build: ./front` ("construa a imagem a partir da pasta `front`"). Leia o `server.js` e o `Dockerfile` da pasta `front`.

```bash
cd 03-front
docker compose up -d --build
```

**Terminou quando:** a página "Loja virtual" abre na porta 8080 e mostra o nome do container.

**Print deste exercício:** o **navegador** com a página "Loja virtual" aberta, com a barra de endereço visível.

Depois do print: `docker compose down`.

### Exercício 3 · Passos 4 e 5: Pedidos, Estoque e comunicação

**Passo 4** (`04-pedidos-e-estoque`): acrescente ao `compose.yaml` os serviços `estoque` (porta `3001:3000`) e `pedidos` (porta `3002:3000`), cada um com `build:` apontando para a própria pasta. Suba e teste pelo terminal:

```bash
cd 04-pedidos-e-estoque
docker compose up -d --build
curl localhost:3001/produtos
```

Ao terminar o passo 4, rode `docker compose down` (para liberar as portas) e siga para o passo 5.

**Passo 5** (`05-comunicacao`): os serviços recebem o endereço dos outros por **variáveis de ambiente**. No `compose.yaml`, configure no Front `ESTOQUE_URL` e `PEDIDOS_URL`, e no Pedidos `ESTOQUE_URL`, usando o **nome do serviço** e a porta de dentro da rede (`http://estoque:3000`). Depois, no Front, faça pedidos de Caderno x2, Caneta x1 e Mochila x5.

```bash
cd 05-comunicacao
docker compose up -d --build
```

**Terminou quando:** o Front mostra a lista de produtos, o pedido de Caderno x2 aparece como `confirmado` e o de Caneta ou Mochila x5 aparece como `sem estoque`.

**Print deste exercício:** o **navegador** com o Front mostrando os produtos e pelo menos um pedido `confirmado` e um `sem estoque`.

Depois do print: `docker compose down`.

### Exercício 4 · Passo 6: Pagamento

Em `06-pagamento`, acrescente o serviço `pagamento` (porta `3003:3000`) e a variável `PAGAMENTO_URL` no serviço `pedidos`, apontando para o Pagamento pelo nome do serviço. O Pagamento aprova valores até 300 e recusa acima disso. Faça pedidos de Caderno x10 e de Mochila x3.

```bash
cd 06-pagamento
docker compose up -d --build
```

**Terminou quando:** Caderno x10 aparece como `pago` e Mochila x3 aparece como `recusado`.

**Print deste exercício:** o **navegador** com o Front mostrando um pedido `pago` e um `recusado` na lista.

**Não derrube o ambiente agora:** o exercício 5 continua com tudo no ar.

### Exercício 5 · Passo 7: derrubar o Estoque e observar

Continue na pasta `06-pagamento`, com os 4 containers no ar. Pare o Estoque, recarregue o Front e tente fazer um pedido. Em seguida, religue o Estoque e veja o sistema voltar. Responda às perguntas do `README.md` da pasta `07-observando-falhas`.

```bash
docker compose stop estoque
docker compose start estoque
```

**Terminou quando:** você viu o que muda no Front e nos pedidos com o Estoque parado e respondeu às perguntas do README do passo 7.

**Print deste exercício:** o **navegador** com o Front mostrando a caixa vermelha de erro, **com o Estoque parado** (tire o print antes do `docker compose start estoque`).

Depois do print: `docker compose start estoque` e, ao terminar, `docker compose down`.

## 4. O que entregar

Entregue **um único arquivo (PDF ou Word) com 5 prints**, um por exercício, cada um com o título "Exercício 1", "Exercício 2" e assim por diante. Escreva o seu nome no início do arquivo.

**Envie para:** [o professor informa onde e até quando].

| Exercício | Tipo de print | O que deve aparecer |
|---|---|---|
| **1** | Terminal | `cat compose.yaml` e depois `docker compose ps` |
| **2** | Navegador | Página "Loja virtual" |
| **3** | Navegador | Produtos listados, um pedido `confirmado` e um `sem estoque` |
| **4** | Navegador | Um pedido `pago` e um `recusado` |
| **5** | Navegador | Caixa vermelha de erro, com o Estoque parado |

Regras para os prints:

- **Tire o print com o sistema rodando**, antes do `docker compose down`.
- **Print de terminal:** mostre o comando que você digitou e o resultado completo. A linha do terminal começa com o seu usuário do GitHub, e é isso que identifica o print como seu.
- **Print de navegador:** deixe a barra de endereço visível.
- Garanta que o texto esteja legível. Se for preciso, aumente o zoom do navegador (`Ctrl` e `+`) antes de capturar.
- **Como tirar o print:** no Windows, `Windows` + `Shift` + `S`; no macOS, `Command` + `Shift` + `4`; no Chromebook, `Ctrl` + `Shift` + tecla de janelas.

**Não conseguiu terminar um exercício?** Entregue mesmo assim o print da mensagem de erro que apareceu e escreva uma linha dizendo o que você tentou. Isso ajuda o professor a entender onde a dificuldade está.

## 5. Comandos que você vai usar

```bash
docker compose up -d --build    # constrói e sobe tudo
docker compose ps               # lista os containers do projeto
docker compose logs pedidos     # mostra os logs de um serviço
docker compose stop estoque     # para um serviço
docker compose start estoque    # liga o serviço de novo
docker compose down             # derruba tudo
docker ps                       # lista todos os containers em execução
```

## 6. Quando algo der errado

| Problema | O que fazer |
|---|---|
| `port is already allocated` | Algum container antigo ainda usa a porta. Rode `docker compose down` na pasta do passo anterior. Se não resolver, `docker ps` mostra quem está rodando e `docker rm -f NOME` remove. |
| Mudei o código e nada mudou | Reconstrua a imagem: `docker compose up -d --build`. |
| Mudei o `compose.yaml` e nada mudou | Rode `docker compose up -d` de novo. O Compose recria só o que mudou. |
| Erro ao subir, como `mapping values are not allowed` | Quase sempre é **indentação** no `compose.yaml`. Use só espaços (nunca tab), com 2 espaços a mais a cada nível. Compare com a solução do passo. |
| `no configuration file provided: not found` | Você está na pasta errada. Confira com `pwd` e entre na pasta do passo (`cd 05-comunicacao`). |
| O Front abre, mas mostra uma caixa vermelha de erro | Leia a mensagem: ela diz qual serviço não foi encontrado. Confira `ESTOQUE_URL` e `PEDIDOS_URL` no `compose.yaml` e veja se o serviço está de pé em `docker compose ps`. |
| A porta 8080 não aparece na aba PORTAS | Confirme que o container está rodando (`docker compose ps`). Se estiver, clique em **Forward a Port** e digite `8080`. |
| O Codespace "dormiu" | Reabra pelo GitHub (**Code → Codespaces**, clicando no nome dele). Seus arquivos continuam lá, mas os containers precisam subir de novo (`docker compose up -d`). |
| Não consigo criar o Codespace, ou aparece aviso de cota | Verifique se você criou o Codespace a partir do repositório **da sua conta**, e não do repositório modelo. Se a cota do mês acabou, avise o professor. |
| `docker: command not found` | Você provavelmente está em um terminal fora do Codespace. Use o terminal dentro do editor, no navegador. |

## 7. Para continuar em casa

- Refaça os passos 4 a 6 **sem consultar a solução**.
- Mude o limite de aprovação do Pagamento (em `pagamento/server.js`) e reconstrua só esse serviço: `docker compose up -d --build pagamento`.
- Desenhe o diagrama da loja com as setas entre os serviços e compare com o que você viu em aula.
