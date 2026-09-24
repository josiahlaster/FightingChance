# Fighting Chance Transitional Restoration — Website

A New Chapter. A Better Future.

Professional, responsive website for **Fighting Chance Transitional Restoration**, a transitional
housing and restoration organization serving men in Durham, North Carolina.

Built with **React (Vite)** on the frontend and **Node.js + Express** on the backend, with a
provider-configurable referral email service (SMTP/Nodemailer, Resend, or SendGrid).

---

## Quick Start

### Prerequisites
- **Node.js 18+** (20+ recommended)

### 1. Install dependencies

```bash
# from the project root — installs root, server, and client in one command
npm run setup
```

Or manually:

```bash
npm install              # root tooling
npm install --prefix server
npm install --prefix client
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
```

Then open `server/.env` and fill in your email provider credentials (see
[Email provider configuration](#email-provider-configuration) below).

At minimum set:

```ini
EMAIL_PROVIDER=smtp
SMTP_USER=fightingchancetransitional@gmail.com
SMTP_PASSWORD=<16-character Gmail App Password>
REFERRAL_EMAIL=fightingchancetransitional@gmail.com
```

> **Gmail note:** regular Gmail passwords will NOT work. Enable 2-Step Verification on the
> account, then create an **App Password** at <https://myaccount.google.com/apppasswords>
> and use that 16-character password as `SMTP_PASSWORD`.

### 3. Run the app

```bash
# Run backend + frontend together (recommended)
npm run dev
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:5001/api/health>

Or run them separately:

```bash
npm run dev:server   # Express API on :5001
npm run dev:client   # Vite dev server on :5173 (proxies /api to :5001)
```

---

## Email Provider Configuration

The referral endpoint is **provider-agnostic** — switch providers by changing one env var.
The frontend never changes.

| Provider   | `EMAIL_PROVIDER` | Required variables |
| ---------- | ---------------- | ------------------ |
| SMTP (Gmail etc.) | `smtp`    | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` |
| Resend     | `resend`         | `RESEND_API_KEY`, `RESEND_FROM` |
| SendGrid   | `sendgrid`       | `SENDGRID_API_KEY`, `SENDGRID_FROM` |

Deliver-to address: `REFERRAL_EMAIL` (defaults to
`fightingchancetransitional@gmail.com`).

### Option A — SMTP with Gmail (simplest)

1. On the Gmail account, enable **2-Step Verification**.
2. Create an **App Password**: <https://myaccount.google.com/apppasswords>
3. Set:

```ini
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=fightingchancetransitional@gmail.com
SMTP_PASSWORD=your16characterapppassword
SMTP_FROM="Fighting Chance Website <fightingchancetransitional@gmail.com>"
```

### Option B — Resend

1. Create an account at <https://resend.com> and verify your sending domain.
2. Create an API key.
3. Set:

```ini
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM="Fighting Chance Website <referrals@yourdomain.org>"
```

### Option C — SendGrid

1. Create a SendGrid account with a verified sender/domain.
2. Create an API key with Mail Send permission.
3. Set:

```ini
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM="Fighting Chance Website <referrals@yourdomain.org>"
```

### Switching providers later

Change `EMAIL_PROVIDER` and the relevant credentials in `server/.env`, restart the server.
No code changes and no frontend rebuild required.

---

## Scripts

| Location | Script | What it does |
| -------- | ------ | ------------ |
| root | `npm run setup` | Installs root, server, and client dependencies |
| root | `npm run dev` | Runs API (`:5001`) + client (`:5173`) together |
| root | `npm run build` | Production build of the client to `client/dist` |
| root | `npm start` | Starts the Express server (used in production) |
| root | `npm run check` | Type-checks the client with `tsc --noEmit` |
| server | `npm run dev` | Express with watch/restart on file changes |
| client | `npm run dev` | Vite dev server with hot reload |

---

## Production Build & Deployment

### Build the frontend

```bash
npm run build
```

Static files are emitted to `client/dist/`.

### Option 1 — Single service (Express serves the built frontend)

1. Build the client: `npm run build`
2. In `server/.env`, set:

```ini
SERVE_CLIENT_DIST=true
CLIENT_ORIGIN=https://yourdomain.org
```

3. Start the server: `npm start`
4. Point your host at port `5001` (or set `PORT`).

Express will serve `client/dist/` and fall back to `index.html` for SPA routes.

### Option 2 — Separate hosting (recommended for scale)

- **Frontend** → Netlify / Vercel / Cloudflare Pages / any static host
  - Build command: `npm run build` (run in `client/`)
  - Publish directory: `client/dist`
  - SPA fallback: redirect all routes to `/index.html`
  - Set an environment variable/redirect so `/api/*` proxies to the backend
    (e.g. Netlify `_redirects`: `/api/* https://api.yourdomain.org/:splat 200`)
- **Backend** → Render / Railway / Fly.io / any Node host
  - Start command: `npm start` (run in `server/`)
  - Set `CLIENT_ORIGIN=https://yourdomain.org` (CORS allow-list)
  - Keep `.env` values in the host's dashboard — never commit them

### Deployment checklist

- [ ] `NODE_ENV=production`
- [ ] All email credentials set on the host (never in the repo)
- [ ] `CLIENT_ORIGIN` set to the real frontend URL
- [ ] `REFERRAL_EMAIL` set to the inbox that receives referrals
- [ ] HTTPS enabled (required for production form traffic)
- [ ] `POST /api/health` returns `{"ok":true}` after deploy
- [ ] Submit a test referral and confirm delivery

### GitHub Pages (current frontend hosting)

The frontend is deployed to GitHub Pages as a **project site served from
the `main` branch root**: https://josiahlaster.github.io/FightingChance/

To redeploy after changes:

```bash
npm run build:pages     # builds client + copies dist to the repo root + writes .nojekyll
git add -A && git commit -m "Rebuild Pages site" && git push
```

How it works:

- `.nojekyll` disables Jekyll so the built files are served as pushed.
- The production build uses base path `/FightingChance/` (override with
  `REPO_NAME` if the repo is ever renamed).
- Deep links like `/FightingChance/referral` are handled by the SPA
  fallback: Pages serves `404.html`, which stashes the path and
  redirects to `index.html` (see `client/public/404.html` + `main.jsx`).
- The referral API is NOT hosted by Pages. When the Express backend is
  deployed (Render/Railway/etc.), rebuild with `VITE_API_BASE` pointing
  at it, e.g.:

  ```bash
  VITE_API_BASE=https://your-api.onrender.com npm run build:pages
  ```

  Until then the form shows the graceful "unable to submit" error with
  the phone number, as designed.

---

## How Referral Emails Work

1. Visitor submits `/referral` form.
2. Client-side validation runs first (instant feedback).
3. `POST /api/referral` re-validates and sanitizes everything server-side.
4. Spam checks: honeypot field + minimum fill-time + IP rate limiting
   (5 referrals/hour/IP, 300 API requests/15 min/IP).
5. A formatted HTML email (with plain-text alternative) is sent to
   `REFERRAL_EMAIL` via the configured provider, with **Reply-To** set to
   the referral source's email.
6. Nothing is stored in a database — **the email is the system of record**.
   No referral details are written to server logs.

---

## Project Structure

```
fighting-chance/
├── client/                     # React frontend (Vite)
│   ├── public/                 # favicon.svg, og-image.png (add before launch)
│   ├── src/
│   │   ├── assets/             # logo.png, flyer images
│   │   ├── components/         # Navbar, Footer, Logo, cards, form…
│   │   ├── data/site.js        # ⭐ centralized org info + LOCATIONS
│   │   ├── pages/              # Home, About, Program, Locations, …
│   │   ├── utils/              # validation, SEO + reveal hooks
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css          # design tokens + full stylesheet
│   ├── index.html              # SEO + Open Graph metadata
│   └── package.json
├── server/                     # Express API
│   ├── controllers/            # request handling
│   ├── middleware/             # rate limiting
│   ├── routes/                 # /api/referral
│   ├── services/               # email.service (smtp/resend/sendgrid)
│   │   └── validators/         # server-side validation + sanitization
│   ├── server.js
│   ├── index.js
│   └── package.json
├── .env.example
├── .gitignore
├── package.json                # root orchestration scripts
└── README.md
```

### Adding a location later

Edit **`client/src/data/site.js`** and append an entry to the `locations` array —
the Locations page and homepage update automatically:

```js
{
  id: 'new-house',
  name: 'New House',
  street: '123 New St',
  city: 'Durham',
  state: 'NC',
  zip: '27701',
  mapsQuery: '123 New St, Durham, NC 27701',
},
```

### Changing org-wide info (phone, email, tagline)

Also in `client/src/data/site.js` — one edit updates the navbar, footer,
contact page, and referral page everywhere.

---

## Security Notes

- Server-side validation + sanitization on every submission (never trust the client).
- Strict CORS allow-list via `CLIENT_ORIGIN`.
- Rate limiting on the referral endpoint and the whole API.
- Honeypot field + minimum form fill time for spam resistance.
- Input length caps and control-character stripping before email rendering.
- All user content is HTML-escaped in the email template.
- Credentials live only in `server/.env` (git-ignored) — never in frontend code.
- No referral details are logged or persisted; email is the only destination.

## Accessibility

- Semantic landmarks and heading hierarchy
- Labeled form fields with `aria-invalid` + `aria-describedby` error wiring
- Error summary that receives keyboard focus on failed submission
- Visible focus rings, 48px minimum touch targets
- `prefers-reduced-motion` support for all animations

---

© 2026 Fighting Chance Transitional Restoration
