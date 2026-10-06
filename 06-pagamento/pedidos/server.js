// Serviço de Pedidos (passo 6): consulta o Estoque e depois chama o Pagamento.
// Os endereços vêm das variáveis de ambiente ESTOQUE_URL e PAGAMENTO_URL.
const http = require("http");

const PORT = process.env.PORT || 3000;
const ESTOQUE_URL = process.env.ESTOQUE_URL;
const PAGAMENTO_URL = process.env.PAGAMENTO_URL;

const pedidos = [];
let proximoId = 1;

function json(res, status, corpo) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(corpo));
}

function lerCorpo(req) {
  return new Promise((resolve) => {
    let texto = "";
    req.on("data", (pedaco) => (texto += pedaco));
    req.on("end", () => {
      try {
        resolve(JSON.parse(texto || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

http
  .createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/pedidos") {
      return json(res, 200, pedidos);
    }

    if (req.method === "POST" && req.url === "/pedidos") {
      const { produtoId, quantidade } = await lerCorpo(req);
      if (!Number.isInteger(produtoId) || !Number.isInteger(quantidade) || quantidade < 1) {
        return json(res, 400, { erro: "informe produtoId e quantidade (números inteiros)" });
      }
      if (!ESTOQUE_URL) return json(res, 500, { erro: "ESTOQUE_URL não configurada" });
      if (!PAGAMENTO_URL) return json(res, 500, { erro: "PAGAMENTO_URL não configurada" });

      // Pedidos -> Estoque
      let produto;
      try {
        const resposta = await fetch(`${ESTOQUE_URL}/produtos/${produtoId}`);
        if (!resposta.ok) return json(res, 404, { erro: "produto não existe" });
        produto = await resposta.json();
      } catch {
        return json(res, 503, { erro: `serviço de estoque indisponível (${ESTOQUE_URL})` });
      }

      let status;
      if (quantidade > produto.quantidade) {
        status = "sem estoque";
      } else {
        // Pedidos -> Pagamento
        try {
          const resposta = await fetch(`${PAGAMENTO_URL}/pagar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ valor: produto.preco * quantidade }),
          });
          const pagamento = await resposta.json();
          status = pagamento.status === "aprovado" ? "pago" : "recusado";
        } catch {
          return json(res, 503, { erro: `serviço de pagamento indisponível (${PAGAMENTO_URL})` });
        }
      }

      const pedido = { id: proximoId++, produtoId, quantidade, status };
      pedidos.push(pedido);
      return json(res, 201, pedido);
    }

    json(res, 404, { erro: "rota não encontrada" });
  })
  .listen(PORT, () => console.log(`pedidos ouvindo na porta ${PORT}`));
