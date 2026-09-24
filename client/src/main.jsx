import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const rootEl = /** @type {HTMLElement} */ (document.getElementById('root'));

// GitHub Pages SPA fallback (see client/public/404.html): when a deep
// link lands on 404.html it stashes the real path, redirects here, and
// we swap in the stashed path before the router mounts.
const redirect = sessionStorage.getItem('fc-redirect');
if (redirect) {
  sessionStorage.removeItem('fc-redirect');
  const base = import.meta.env.PROD
    ? `/${import.meta.env.VITE_REPO_NAME || 'FightingChance'}`
    : '';
  if (redirect.startsWith(base)) {
    history.replaceState(null, '', redirect.slice(base.length) || '/');
  }
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
