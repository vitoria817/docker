# Passo 5: Fazendo os serviços se comunicarem

**Objetivo:** ligar Front, Pedidos e Estoque.

## O que mudou no código

- O **Front** agora lista os produtos (chamando o Estoque), mostra os pedidos e envia novos pedidos (chamando o Pedidos).
- O **Pedidos** agora consulta o Estoque antes de registrar: se a quantidade pedida for maior que a disponível, o status é `sem estoque`.

Os endereços dos outros serviços **não estão escritos no código**. Eles chegam por **variáveis de ambiente**:

| Serviço | Variáveis |
|---|---|
| Front | `ESTOQUE_URL` e `PEDIDOS_URL` |
| Pedidos | `ESTOQUE_URL` |

Quem define essas variáveis? O `compose.yaml`.

## Tarefa

**A. Veja o que acontece sem configurar.** Suba como está e abra o Front:

```bash
docker compose up -d --build
```

O que a página mostra?

**B. Um erro comum.** No `compose.yaml`, acrescente as variáveis com o endereço `localhost`:

```yaml
    environment:
      ESTOQUE_URL: http://localhost:3001
```

(no Front e no Pedidos; no Front, faça o mesmo para `PEDIDOS_URL`, com `http://localhost:3002`). Aplique com `docker compose up -d` e recarregue a página. Funciona? Por quê?

**C. A forma certa.** Troque pelos endereços que usam o **nome do serviço** e a porta de **dentro** da rede (3000):

- `ESTOQUE_URL: http://estoque:3000`
- `PEDIDOS_URL: http://pedidos:3000`

Aplique de novo e abra o Front. Faça pedidos:

- Caderno, quantidade 2;
- Caneta, quantidade 1;
- Mochila, quantidade 5.

<details>
<summary>Ver a solução</summary>

```yaml
services:
  front:
    build: ./front
    ports:
      - "8080:80"
    environment:
      ESTOQUE_URL: http://estoque:3000
      PEDIDOS_URL: http://pedidos:3000

  estoque:
    build: ./estoque
    ports:
      - "3001:3000"

  pedidos:
    build: ./pedidos
    ports:
      - "3002:3000"
    environment:
      ESTOQUE_URL: http://estoque:3000
```

(Também está em `solucao/compose.yaml`.)

</details>

## Para pensar

- Por que `localhost` não funciona dentro de um container para chegar a outro serviço?
- Por que `http://estoque:3000` funciona? De onde vem esse nome?
- Por que a porta é 3000 e não 3001 (a que você publicou)?
- Quem faz a chamada para o Estoque quando você compra algo: o seu navegador ou o container do Pedidos?

Quando terminar: `docker compose down`.

**Próximo:** `06-pagamento`.
