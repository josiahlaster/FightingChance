const http = require('http');
const app = require('./server');

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[server] Fighting Chance API listening on port ${PORT}`);
  console.log(
    `[server] Email provider: ${process.env.EMAIL_PROVIDER || 'smtp (default)'}`
  );
  console.log(
    `[server] Referral inbox: ${process.env.REFERRAL_EMAIL || 'fightingchancetransitional@gmail.com (default)'}`
  );
});

// --- Graceful shutdown ---
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    console.log(`[server] ${signal} received — shutting down`);
    server.close(() => process.exit(0));
  });
}
