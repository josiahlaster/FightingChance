import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from './Icons';

/**
 * Lightbox — full-screen image viewer with an accessible dialog pattern.
 *
 * - Click the dimmed backdrop or the × button, or press Escape, to close.
 * - Traps Tab focus inside the dialog while open.
 * - Locks body scroll; renders through a portal to document.body so no
 *   ancestor stacking context (e.g. Reveal transforms) can trap it.
 *
 * @param {{ src: string, alt: string, onClose: () => void }} props
 */
export default function Lightbox({ src, alt, onClose }) {
  // Escape to close + focus management.
  const onKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        // Single focusable element: keep focus cycling on the close button.
        const btn = /** @type {HTMLButtonElement | null} */ (
          document.querySelector('.lightbox__close')
        );
        if (btn) {
          e.preventDefault();
          btn.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the close button so keyboard users land inside the dialog.
    const btn = /** @type {HTMLButtonElement | null} */ (
      document.querySelector('.lightbox__close')
    );
    btn?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onKey]);

  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <figure className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
        <button
          type="button"
          className="lightbox__close"
          aria-label="Close image viewer"
          onClick={onClose}
        >
          <CloseIcon width={26} height={26} />
        </button>
      </figure>
    </div>,
    document.body
  );
}
