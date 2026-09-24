require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const referralRoutes = require('./routes/referral.routes');
const {
  generalLimiter,
  referralLimiter,
} = require('./middleware/rateLimit');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// --- Security headers ---
app.use(
  helmet({
    // The API returns JSON only; no cross-origin framing of pages is needed.
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// --- CORS: only allow configured client origins ---
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server / curl (no Origin header) and configured origins.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400,
};
app.use(cors(corsOptions));

// --- Body parsing ---
app.use(express.json({ limit: '32kb' }));

// --- Rate limiting ---
// General limiter for the whole API; stricter limiter on the referral
// endpoint since each accepted submission triggers an outbound email.
app.use('/api', generalLimiter);
app.use('/api/referral', referralLimiter);

// --- Routes ---
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'fighting-chance-api',
    time: new Date().toISOString(),
  });
});
app.use('/api/referral', referralRoutes);

// --- 404 for unknown API routes ---
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, message: 'Not found' });
});

// --- Central error handler ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Rate-limit and CORS errors surface as 429/403; everything else is 500.
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ ok: false, message: 'Request not allowed' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ ok: false, message: 'Request body too large' });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, message: 'Invalid JSON body' });
  }
  console.error('[server] Unhandled error:', err.message);
  return res.status(500).json({ ok: false, message: 'Internal server error' });
});

// --- Optional static hosting of the built frontend (single-service deploys) ---
if ((process.env.SERVE_CLIENT_DIST || 'false').toLowerCase() === 'true') {
  const path = require('path');
  const fs = require('fs');
  const distDir = path.join(__dirname, '..', 'client', 'dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    // SPA fallback: send index.html for any non-API GET request.
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ ok: false, message: 'Not found' });
      }
      res.sendFile(path.join(distDir, 'index.html'));
    });
    console.log('[server] Serving static frontend from client/dist');
  } else {
    console.warn('[server] SERVE_CLIENT_DIST=true but client/dist does not exist. Run "npm run build --prefix client" first.');
  }
}

module.exports = app;
