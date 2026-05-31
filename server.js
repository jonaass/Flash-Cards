const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 3001;

function loadEnv() {
  try {
    fs.readFileSync(path.join(__dirname, ".env"), "utf-8")
      .split("\n")
      .forEach((line) => {
        const [key, ...rest] = line.split("=");
        if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
      });
  } catch {}
}
loadEnv();

const API_KEY = process.env.GROQ_API_KEY;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon",
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders());
    return res.end();
  }

  const pathname = new URL(req.url, `http://localhost:${PORT}`).pathname;

  if (req.method === "POST" && pathname === "/api/flashcards") {
    return handleProxy(req, res);
  }

  return serveStatic(res, pathname);
});

function handleProxy(req, res) {
  if (!API_KEY) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({ error: "GROQ_API_KEY não configurada no .env" }),
    );
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      console.error("[server] Erro ao parsear body:", e.message);
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Body inválido" }));
    }

    // Pega o prompt das mensagens recebidas
    const userMessage = parsed.messages?.[0]?.content || "";

    const groqPayload = JSON.stringify({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 1500,
      temperature: 0.7,
    });

    console.log(
      "[server] Enviando para Groq, tamanho do prompt:",
      userMessage.length,
      "chars",
    );

    const opts = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(groqPayload),
      },
    };

    const pr = https.request(opts, (apiRes) => {
      let data = "";
      apiRes.on("data", (chunk) => {
        data += chunk;
      });
      apiRes.on("end", () => {
        console.log("[server] Resposta Groq status:", apiRes.statusCode);

        if (apiRes.statusCode !== 200) {
          console.error("[server] Erro Groq:", data);
          res.writeHead(apiRes.statusCode, {
            "Content-Type": "application/json",
            ...corsHeaders(),
          });
          return res.end(data);
        }

        try {
          const groqData = JSON.parse(data);
          const text = groqData.choices?.[0]?.message?.content || "";
          const converted = JSON.stringify({
            content: [{ type: "text", text }],
          });
          res.writeHead(200, {
            "Content-Type": "application/json",
            ...corsHeaders(),
          });
          res.end(converted);
          console.log("[server] Flashcards gerados com sucesso!");
        } catch (e) {
          console.error("[server] Erro ao processar resposta:", e.message);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: "Erro ao processar resposta da Groq" }),
          );
        }
      });
    });

    pr.on("error", (err) => {
      console.error("[server] Erro de conexão:", err.message);
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    });

    pr.write(groqPayload);
    pr.end();
  });
}

function serveStatic(res, pathname) {
  if (pathname === "/") pathname = "/index.html";
  const filePath = path.join(__dirname, "dist", pathname);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(__dirname, "dist", "index.html"), (e2, html) => {
        if (e2) {
          res.writeHead(404);
          return res.end("Not found");
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(content);
  });
}

server.listen(PORT, () => {
  console.log("");
  console.log(`  ✓ Servidor rodando em http://localhost:${PORT}`);
  if (!API_KEY) {
    console.log("  ⚠ GROQ_API_KEY não encontrada! Configure o arquivo .env");
  } else {
    console.log("  ✓ Groq API Key carregada");
    console.log("  ✓ Modelo: llama3-70b-8192");
  }
  console.log("");
});
