# Passo 2: Docker Compose

**Objetivo:** escrever em um arquivo o que antes era uma linha de comando.

## Tarefa

Nesta pasta, crie um arquivo chamado `compose.yaml` que faça o mesmo que o `docker run` do passo 1:

```bash
docker run -d --name loja-1 -p 8080:80 nginx
```

Dicas:

- o arquivo começa com `services:`;
- dentro dele, dê um nome ao serviço (por exemplo `web`);
- a imagem usa a chave `image:`;
- as portas usam a chave `ports:`, com uma lista (`- "8080:80"`).

Depois rode:

```bash
docker compose up -d
docker compose ps
docker compose logs
```

Abra a porta 8080 e confira. Quando terminar:

```bash
docker compose down
```

<details>
<summary>Ver a solução</summary>

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

(Também está em `solucao/compose.yaml`.)

</details>

## Para pensar

- Que parte do `docker run` virou cada linha do arquivo?
- Qual a vantagem de ter isso escrito em um arquivo, em vez de digitado no terminal?
- O que muda quando houver 3 ou 4 serviços em vez de 1?

**Próximo:** `03-front`.
