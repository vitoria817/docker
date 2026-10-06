# Passo 3: Transformando o exemplo em um Front

**Objetivo:** trocar a imagem pronta (nginx) por um serviço **construído por você**: o Front da loja.

## O que há de novo

A pasta `front/` contém:

- `server.js`: um servidor web em Node que mostra uma página da loja;
- `Dockerfile`: a receita para empacotar esse servidor em uma imagem.

Leia os dois arquivos. Eles são curtos.

## Tarefa

O `compose.yaml` desta pasta ainda é o do passo 2 (nginx). Altere-o para:

1. renomear o serviço de `web` para `front`;
2. trocar `image: nginx` por `build: ./front`, que significa "construa a imagem a partir da pasta `front`";
3. manter a porta `8080:80`.

Depois:

```bash
docker compose up -d --build
docker compose ps
```

Abra a porta 8080. A página mostra o nome do container que respondeu.

**Experimento:** altere o texto da página em `front/server.js`, rode `docker compose up -d --build` de novo e recarregue o navegador.

<details>
<summary>Ver a solução</summary>

```yaml
services:
  front:
    build: ./front
    ports:
      - "8080:80"
```

(Também está em `solucao/compose.yaml`.)

</details>

## Para pensar

- Qual a diferença entre `image:` e `build:`?
- Por que foi preciso usar `--build` depois de mudar o código?
- O Front é uma imagem ou um container? E o nginx do passo anterior?

Quando terminar: `docker compose down`.

**Próximo:** `04-pedidos-e-estoque`.
