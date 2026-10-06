# Passo 4: Pedidos e Estoque

**Objetivo:** executar mais dois serviços, cada um em seu próprio container.

## O que há de novo

- `estoque/`: serviço com a lista de produtos (`id`, `nome`, `preco`, `quantidade`).
- `pedidos/`: serviço que registra pedidos (`id`, `produtoId`, `quantidade`, `status`).

Cada um tem seu `server.js` e seu `Dockerfile`. São aplicações **diferentes**.

Por enquanto, o Pedidos **não consulta** o Estoque, e o Front não conhece nenhum dos dois.

## Tarefa

No `compose.yaml` (que já tem o Front), acrescente os serviços `estoque` e `pedidos`:

- cada um com `build:` apontando para a própria pasta;
- dentro dos containers os dois escutam a porta **3000**; publique o Estoque em **3001** e o Pedidos em **3002**, para você poder testá-los pelo terminal.

Suba tudo:

```bash
docker compose up -d --build
docker compose ps
```

**Teste o Estoque:**

```bash
curl localhost:3001/produtos
curl localhost:3001/produtos/1
```

**Teste o Pedidos:**

```bash
curl -X POST localhost:3002/pedidos -H "Content-Type: application/json" -d '{"produtoId":1,"quantidade":2}'
curl localhost:3002/pedidos
```

**Observe os logs de cada serviço:**

```bash
docker compose logs estoque
docker compose logs pedidos
```

<details>
<summary>Ver a solução</summary>

```yaml
services:
  front:
    build: ./front
    ports:
      - "8080:80"

  estoque:
    build: ./estoque
    ports:
      - "3001:3000"

  pedidos:
    build: ./pedidos
    ports:
      - "3002:3000"
```

(Também está em `solucao/compose.yaml`.)

</details>

## Para pensar

- Os dois serviços usam a porta 3000 por dentro. Por que isso não causa conflito?
- Faça um pedido do produto `99`, que não existe. O Pedidos aceita? O que está faltando?

Quando terminar: `docker compose down`.

**Próximo:** `05-comunicacao`.
