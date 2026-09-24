import { useState } from 'react';
import Lightbox from './Lightbox';

/**
 * FlyerImage — a flyer shown as a clickable thumbnail that opens in a
 * full-screen lightbox ("click to enlarge"). Presents as a button for
 * keyboard and screen-reader users; the expanded view closes on Escape,
 * backdrop click, or the × button.
 *
 * @param {{ src: string, alt: string }} props
 */
export default function FlyerImage({ src, alt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flyer-thumb"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`${alt} — click to enlarge`}
      >
        <img src={src} alt={alt} loading="lazy" />
        <span className="flyer-thumb__hint" aria-hidden="true">
          <ZoomIcon /> Click to enlarge
        </span>
      </button>
      {open ? <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** Small magnifier glyph used on the hover hint. */
function ZoomIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}
