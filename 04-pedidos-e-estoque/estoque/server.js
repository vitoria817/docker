// Serviço de Estoque: produtos e quantidade disponível.
// Dados em memória (somem se o container reiniciar).
const http = require("http");

const PORT = process.env.PORT || 3000;

const produtos = [
  { id: 1, nome: "Caderno", preco: 25, quantidade: 10 },
  { id: 2, nome: "Caneta", preco: 5, quantidade: 0 },
  { id: 3, nome: "Mochila", preco: 120, quantidade: 3 },
];

function json(res, status, corpo) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(corpo));
}

http
  .createServer((req, res) => {
    if (req.method === "GET" && req.url === "/produtos") {
      return json(res, 200, produtos);
    }

    const m = req.url.match(/^\/produtos\/(\d+)$/);
    if (req.method === "GET" && m) {
      const produto = produtos.find((p) => p.id === Number(m[1]));
      return produto ? json(res, 200, produto) : json(res, 404, { erro: "produto não encontrado" });
    }

    json(res, 404, { erro: "rota não encontrada" });
  })
  .listen(PORT, () => console.log(`estoque ouvindo na porta ${PORT}`));
