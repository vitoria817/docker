// Serviço de Pagamento: simula aprovação ou recusa.
// Regra: aprova valores até 300; acima disso, recusa.
const http = require("http");

const PORT = process.env.PORT || 3000;
const LIMITE = 300;

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
    if (req.method === "POST" && req.url === "/pagar") {
      const { valor } = await lerCorpo(req);
      if (typeof valor !== "number") return json(res, 400, { erro: "informe o valor" });
      return json(res, 200, { valor, status: valor <= LIMITE ? "aprovado" : "recusado" });
    }
    json(res, 404, { erro: "rota não encontrada" });
  })
  .listen(PORT, () => console.log(`pagamento ouvindo na porta ${PORT}`));
