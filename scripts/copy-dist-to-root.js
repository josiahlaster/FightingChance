/**
 * copy-dist-to-root.js — GitHub Pages helper.
 *
 * The Pages site deploys from the main branch ROOT, so the built client
 * (client/dist) must be copied to the repository root before pushing:
 *
 *   client/dist/index.html  ->  ./index.html
 *   client/dist/404.html    ->  ./404.html   (SPA deep-link fallback)
 *   client/dist/assets/     ->  ./assets/
 *   client/dist/*           ->  ./*         (favicon, images, etc.)
 *
 * Run via `npm run build:pages`.
 */

import { cpSync, existsSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'client', 'dist');

if (!existsSync(dist)) {
  console.error('client/dist not found — run `npm run build` first.');
  process.exit(1);
}

// Clear stale build output at the root (keeps git history clean).
for (const entry of ['assets', 'index.html', '404.html', 'favicon.svg']) {
  rmSync(join(root, entry), { recursive: true, force: true });
}

cpSync(dist, root, { recursive: true });

// `.nojekyll` disables GitHub Pages' Jekyll processor so built assets
// (underscore-free but hashed/JS-heavy) are served exactly as pushed.
writeFileSync(join(root, '.nojekyll'), '');

console.log('Copied client/dist -> repo root (GitHub Pages root deploy).');
