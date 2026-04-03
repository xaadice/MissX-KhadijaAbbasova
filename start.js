const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const fs = require('fs');

// ─── Renkli konsol çıktısı ───────────────────────────────────────────────────
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(prefix, color, message) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

// ─── Backend başlat (Node / Nodemon) ─────────────────────────────────────────
const backendDir = path.join(__dirname, 'backend');
const useNodemon = fs.existsSync(path.join(backendDir, 'node_modules', '.bin', 'nodemon'));
const backendCmd = useNodemon ? 'npx' : 'node';
const backendArgs = useNodemon ? ['nodemon', 'server.js'] : ['server.js'];

const backend = spawn(backendCmd, backendArgs, {
  cwd: backendDir,
  shell: true,
  env: { ...process.env },
});

backend.stdout.on('data', (data) => {
  data.toString().trim().split('\n').forEach((line) => {
    log('BACKEND', colors.green, line);
  });
});

backend.stderr.on('data', (data) => {
  data.toString().trim().split('\n').forEach((line) => {
    log('BACKEND', colors.red, line);
  });
});

backend.on('close', (code) => {
  log('BACKEND', colors.red, `Durdu. Çıkış kodu: ${code}`);
});

// ─── Frontend başlat (basit HTTP sunucu) ─────────────────────────────────────
const frontendDir = path.join(__dirname, 'frontend');
const FRONTEND_PORT = 3000;

const frontendServer = http.createServer((req, res) => {
  let filePath = path.join(frontendDir, req.url === '/' ? 'index.html' : req.url);

  // Uzantısı yoksa index.html döndür (SPA desteği)
  if (!path.extname(filePath)) {
    filePath = path.join(frontendDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Dosya bulunamazsa index.html döndür
        fs.readFile(path.join(frontendDir, 'index.html'), (e, c) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(c, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Sunucu Hatası: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content, 'utf-8');
    }
  });
});

frontendServer.listen(FRONTEND_PORT, () => {
  log('FRONTEND', colors.blue, `http://localhost:${FRONTEND_PORT} adresinde çalışıyor ✅`);
});

// ─── Temiz kapanma ────────────────────────────────────────────────────────────
process.on('SIGINT', () => {
  log('SİSTEM', colors.yellow, 'Kapatılıyor...');
  backend.kill();
  frontendServer.close();
  process.exit(0);
});

log('SİSTEM', colors.cyan, '🚀 TalentLoop başlatılıyor...');
log('SİSTEM', colors.cyan, `   Backend  → http://localhost:8080`);
log('SİSTEM', colors.cyan, `   Frontend → http://localhost:${FRONTEND_PORT}`);
log('SİSTEM', colors.yellow, '   Durdurmak için Ctrl+C\n');