const http = require('http');

const server = http.createServer((req, res) => {
  // Lista de origens permitidas
  const allowedOrigins = [
    'https://meugps.tech',
    'http://localhost:3000',
    'http://localhost:5500', // Comum se usar Live Server do VS Code
    'http://127.0.0.1:5500'
  ];

  const origin = req.headers.origin;

  // Se a origem da requisição estiver na nossa lista, nós a liberamos
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Responder a pre-flight requests (importante para o navegador não bloquear)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Sua rota de status
  if (req.url === '/status') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "online",
      message: "API MeuGPS acessível local e remotamente!",
      environment: process.env.NODE_ENV || 'production'
    }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});