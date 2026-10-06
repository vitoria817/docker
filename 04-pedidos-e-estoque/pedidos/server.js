// Serviço de Pedidos (passo 4): apenas registra o pedido.
// Ainda NÃO consulta o Estoque.
const http = require("http");

const PORT = process.env.PORT || 3000;

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
      const pedido = { id: proximoId++, produtoId, quantidade, status: "criado" };
      pedidos.push(pedido);
      return json(res, 201, pedido);
    }

    json(res, 404, { erro: "rota não encontrada" });
  })
  .listen(PORT, () => console.log(`pedidos ouvindo na porta ${PORT}`));
