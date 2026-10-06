// Serviço de Pedidos (passo 5): consulta o Estoque antes de registrar.
// O endereço do Estoque vem da variável de ambiente ESTOQUE_URL.
const http = require("http");

const PORT = process.env.PORT || 3000;
const ESTOQUE_URL = process.env.ESTOQUE_URL;

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

      // Pedidos -> Estoque
      let produto;
      try {
        const resposta = await fetch(`${ESTOQUE_URL}/produtos/${produtoId}`);
        if (!resposta.ok) return json(res, 404, { erro: "produto não existe" });
        produto = await resposta.json();
      } catch {
        return json(res, 503, { erro: `serviço de estoque indisponível (${ESTOQUE_URL})` });
      }

      const status = quantidade <= produto.quantidade ? "confirmado" : "sem estoque";
      const pedido = { id: proximoId++, produtoId, quantidade, status };
      pedidos.push(pedido);
      return json(res, 201, pedido);
    }

    json(res, 404, { erro: "rota não encontrada" });
  })
  .listen(PORT, () => console.log(`pedidos ouvindo na porta ${PORT}`));
