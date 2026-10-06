# Passo 7: Observando o comportamento do sistema

**Objetivo:** ver, na prática, o que significa **autonomia**, **dependência** e **isolamento de falhas**.

Não há código novo. Continue na pasta `06-pagamento`, com tudo no ar (`docker compose ps` deve mostrar 4 containers).

## Experimentos

Para cada experimento, **faça uma previsão antes** e depois confira.

**1. Derrubar o Estoque**

```bash
docker compose stop estoque
```

- O Front continua abrindo? O que ele mostra no lugar dos produtos?
- Dá para fazer um pedido? Que mensagem aparece?
- A lista de pedidos ainda aparece?

Religue e veja se tudo volta sem mexer nos outros serviços:

```bash
docker compose start estoque
```

**2. Derrubar o Pagamento**

```bash
docker compose stop pagamento
```

- Pedir um produto com estoque dá certo? E um produto `sem estoque`? Por que a resposta é diferente?

```bash
docker compose start pagamento
```

**3. Derrubar o Pedidos**

```bash
docker compose stop pedidos
docker compose start pedidos
```

- O que acontece com a lista de pedidos depois de ligar de novo? Por quê?

**4. Acompanhar os logs**

```bash
docker compose logs -f pedidos
```

Faça um pedido pelo Front e veja o que aparece. (`Ctrl+C` para sair.)

## Discussão

- Cada serviço **depende** de outro? Isso contradiz a ideia de **autonomia**?
- Que falhas derrubam o sistema inteiro? Quais derrubam só uma parte?
- Pense no que seria diferente se Front, Pedidos, Estoque e Pagamento fossem **um único programa** (um monólito).
- Voltando à pergunta da aula: ter vários containers significa ter microsserviços? Neste exemplo, o que você analisaria para responder?

## Ideias para continuar em casa

- Mude o limite de aprovação do Pagamento (em `pagamento/server.js`) e reconstrua só esse serviço: `docker compose up -d --build pagamento`.
- Acrescente um produto novo na lista do Estoque.
- Faça o Pedidos mostrar mais detalhes (por exemplo, o nome do produto) e veja quais serviços precisam mudar.

Quando terminar: `docker compose down`.
