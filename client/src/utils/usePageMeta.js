import { useEffect } from 'react';

/**
 * Sets the document title + meta description per page (SEO) and scrolls
 * to the top on route change.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
    window.scrollTo(0, 0);
  }, [title, description]);
}
