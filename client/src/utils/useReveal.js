import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll: returns a ref + visibility flag. Elements fade/slide
 * in the first time they enter the viewport. Falls back to visible when
 * IntersectionObserver is unavailable.
 */
export function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible ? 'reveal reveal--visible' : 'reveal'];
}
