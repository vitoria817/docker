// Front (passo 3): serve uma página simples.
// Ainda não conversa com nenhum outro serviço.
const http = require("http");
const os = require("os");

const PORT = process.env.PORT || 80;

const pagina = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Loja virtual</title>
  <style>
    body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; color: #1f2a37; }
    .aviso { background: #eaf4f8; padding: 1rem; border-radius: 8px; }
    small { color: #5f6f7e; }
  </style>
</head>
<body>
  <h1>Loja virtual</h1>
  <p class="aviso">O Front está no ar! Ainda não há produtos: o serviço de Estoque não está conectado.</p>
  <small>Respondendo do container: ${os.hostname()}</small>
</body>
</html>`;

http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(pagina);
  })
  .listen(PORT, () => console.log(`front ouvindo na porta ${PORT}`));
