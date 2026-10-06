# Passo 6: Acrescentando o Pagamento

**Objetivo:** adicionar um quarto serviço e ver como o sistema cresce.

## O que há de novo

- `pagamento/`: serviço que simula a aprovação ou recusa de um pagamento. **Regra:** aprova valores até 300; acima disso, recusa.
- O **Pedidos** agora, depois de confirmar o estoque, chama o Pagamento. O status do pedido passa a ser `pago` ou `recusado` (ou `sem estoque`, como antes).
- O **Front não mudou**.

## Tarefa

No `compose.yaml`:

1. acrescente o serviço `pagamento` (`build: ./pagamento`, porta `3003:3000`);
2. acrescente ao Pedidos a variável `PAGAMENTO_URL`, apontando para o Pagamento pelo nome do serviço.

Suba e teste pelo Front:

```bash
docker compose up -d --build
```

| Pedido | Valor | Resultado esperado |
|---|---|---|
| Caderno x10 | 250 | pago |
| Mochila x2 | 240 | pago |
| Mochila x3 | 360 | recusado |
| Caneta x1 | (sem estoque) | sem estoque |

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
      PAGAMENTO_URL: http://pagamento:3000

  pagamento:
    build: ./pagamento
    ports:
      - "3003:3000"
```

(Também está em `solucao/compose.yaml`.)

</details>

## Para pensar

- O código do Front não mudou. O que isso diz sobre a divisão de responsabilidades?
- Quantos arquivos você precisou alterar para incluir o Pagamento? Quais?
- Desenhe o diagrama do sistema agora. Ele bate com a terceira etapa da aula?

**Próximo:** `07-observando-falhas`. Deixe o sistema no ar.
