// Front (passos 5 e 6): monta a página no servidor.
// Quem chama o Estoque e o Pedidos é este container, não o navegador.
// Os endereços vêm das variáveis de ambiente ESTOQUE_URL e PEDIDOS_URL.
const http = require("http");
const os = require("os");

const PORT = process.env.PORT || 80;
const ESTOQUE_URL = process.env.ESTOQUE_URL;
const PEDIDOS_URL = process.env.PEDIDOS_URL;

function esc(texto) {
  return String(texto).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function lerCorpo(req) {
  return new Promise((resolve) => {
    let texto = "";
    req.on("data", (pedaco) => (texto += pedaco));
    req.on("end", () => resolve(new URLSearchParams(texto)));
  });
}

async function chamar(base, caminho, opcoes) {
  if (!base) throw new Error("endereço do serviço não configurado");
  try {
    const resposta = await fetch(base + caminho, opcoes);
    return { ok: resposta.ok, dados: await resposta.json() };
  } catch {
    throw new Error(`não consegui falar com ${base}`);
  }
}

async function montarPagina(mensagem) {
  let produtos = [];
  let pedidos = [];
  const erros = [];

  try {
    produtos = (await chamar(ESTOQUE_URL, "/produtos")).dados;
  } catch (e) {
    erros.push("Estoque: " + e.message);
  }
  try {
    pedidos = (await chamar(PEDIDOS_URL, "/pedidos")).dados;
  } catch (e) {
    erros.push("Pedidos: " + e.message);
  }

  const linhasProdutos = produtos
    .map((p) => `<tr><td>${p.id}</td><td>${esc(p.nome)}</td><td>R$ ${p.preco}</td><td>${p.quantidade}</td></tr>`)
    .join("");
  const opcoes = produtos.map((p) => `<option value="${p.id}">${esc(p.nome)}</option>`).join("");
  const linhasPedidos = pedidos
    .map((p) => `<tr><td>${p.id}</td><td>${p.produtoId}</td><td>${p.quantidade}</td><td>${esc(p.status)}</td></tr>`)
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Loja virtual</title>
  <style>
    body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #1f2a37; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 1.5rem; }
    th, td { text-align: left; padding: .4rem .6rem; border-bottom: 1px solid #d5e3ea; }
    .erro { background: #fdecea; padding: .75rem 1rem; border-radius: 8px; margin-bottom: 1rem; }
    .msg { background: #eaf4f8; padding: .75rem 1rem; border-radius: 8px; margin-bottom: 1rem; }
    small { color: #5f6f7e; }
  </style>
</head>
<body>
  <h1>Loja virtual</h1>
  ${erros.map((e) => `<div class="erro">${esc(e)}</div>`).join("")}
  ${mensagem ? `<div class="msg">${esc(mensagem)}</div>` : ""}

  <h2>Produtos</h2>
  <table>
    <tr><th>ID</th><th>Produto</th><th>Preço</th><th>Em estoque</th></tr>
    ${linhasProdutos}
  </table>

  <h2>Fazer um pedido</h2>
  <form method="POST" action="/comprar">
    <select name="produtoId">${opcoes}</select>
    <input type="number" name="quantidade" value="1" min="1" style="width:4rem">
    <button type="submit">Comprar</button>
  </form>

  <h2>Pedidos</h2>
  <table>
    <tr><th>ID</th><th>Produto</th><th>Qtd</th><th>Status</th></tr>
    ${linhasPedidos}
  </table>

  <small>Respondendo do container: ${os.hostname()}</small>
</body>
</html>`;
}

http
  .createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/comprar") {
      const form = await lerCorpo(req);
      let mensagem;
      try {
        const { ok, dados } = await chamar(PEDIDOS_URL, "/pedidos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ produtoId: Number(form.get("produtoId")), quantidade: Number(form.get("quantidade")) }),
        });
        mensagem = ok ? `Pedido ${dados.id}: ${dados.status}` : `Não foi possível pedir: ${dados.erro}`;
      } catch (e) {
        mensagem = `Não foi possível pedir: ${e.message}`;
      }
      res.writeHead(303, { Location: "/?msg=" + encodeURIComponent(mensagem) });
      return res.end();
    }

    if (req.method === "GET" && req.url.startsWith("/")) {
      const mensagem = new URL(req.url, "http://localhost").searchParams.get("msg");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(await montarPagina(mensagem));
    }

    res.writeHead(404);
    res.end();
  })
  .listen(PORT, () => console.log(`front ouvindo na porta ${PORT}`));
