const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Configuração de CORS (Essencial para suas chamadas Axios de outros sites)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Rota Principal
  if (req.url === '/' || req.url === '/status') {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "online",
      // Altere esta linha no seu código local:
      message: "📍 O Servidor MeuGPS.tech operando com Deploy Automático! v1.1",
      owner: "Relton Lima",
      stack: "Node.js + Nginx + GCP",
      db: "Supabase Connected"
    }));
  }

  // Rota de Erro 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: "Rota não encontrada" }));
});

server.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
}); // Server online?