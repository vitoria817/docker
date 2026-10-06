# Oficina: microsserviços com Docker e Docker Compose

Material da disciplina de **Arquitetura de Software**.

Nesta oficina você monta, passo a passo, uma **loja virtual simplificada** feita de vários serviços, cada um em seu próprio container:

```
Front  →  Pedidos  →  Estoque
              └────→  Pagamento
```

Tudo roda na nuvem, no **GitHub Codespaces**. Você não precisa instalar nada no computador.

## Comece por aqui

**Leia o [GUIA-DO-ALUNO.md](GUIA-DO-ALUNO.md).** Ele explica como criar o seu repositório a partir deste modelo, abrir o ambiente e seguir os passos.

## Os passos

| Pasta | O que você faz |
|---|---|
| `01-primeiro-container` | Executa o primeiro container e vê a diferença entre imagem e container |
| `02-docker-compose` | Escreve seu primeiro `compose.yaml` |
| `03-front` | Transforma o exemplo em um Front construído por você |
| `04-pedidos-e-estoque` | Sobe mais dois serviços, cada um em seu container |
| `05-comunicacao` | Faz os serviços conversarem entre si |
| `06-pagamento` | Acrescenta o serviço de Pagamento |
| `07-observando-falhas` | Derruba serviços e observa o que acontece |

Cada pasta tem um `README.md` com o objetivo, a tarefa e perguntas para pensar. O código dos serviços já vem pronto: o seu trabalho é o `compose.yaml`.
