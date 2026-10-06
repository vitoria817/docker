# Passo 1: Primeiro container

**Objetivo:** ver, na prática, a diferença entre **imagem** (o pacote) e **container** (a instância em execução).

Neste passo não há arquivos: tudo é feito no terminal.

## Tarefa

**1. Suba um servidor web (nginx):**

```bash
docker run -d --name loja-1 -p 8080:80 nginx
```

O que cada parte significa:

- `-d`: roda em segundo plano;
- `--name loja-1`: dá um nome ao container;
- `-p 8080:80`: liga a porta **8080** do ambiente à porta **80** do container;
- `nginx`: a **imagem** usada como base.

**2. Abra a porta 8080** na aba **PORTAS** (ícone de globo). Você deve ver a página de boas-vindas do nginx.

**3. Observe o que existe agora:**

```bash
docker images        # imagens disponíveis
docker ps            # containers em execução
docker logs loja-1   # o que o container escreveu
```

**4. Crie um segundo container a partir da mesma imagem:**

```bash
docker run -d --name loja-2 -p 8081:80 nginx
docker ps
```

**5. Tente repetir a porta e veja o erro:**

```bash
docker run -d --name loja-3 -p 8080:80 nginx
```

**6. Limpe tudo:**

```bash
docker rm -f loja-1 loja-2 loja-3
```

## Para pensar

- Quantas imagens `nginx` você tem? Quantos containers?
- Por que o `loja-2` precisou de outra porta no ambiente (8081), mas continuou usando a 80 dentro do container?
- Se você apagar o container, a imagem some também?

**Próximo:** `02-docker-compose`.
