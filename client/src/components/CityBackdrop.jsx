import CitySkyline from './CitySkyline';

/**
 * CityBackdrop — layered, realistic skyline for the base of a section.
 *
 * Three depth layers create real parallax-style depth:
 *   1. distant hazy towers (back)
 *   2. detailed mid-ground blocks (mid)
 *   3. a dark rooftop row hugging the section base (front)
 *
 * Position as the first child of a `position: relative` section;
 * the section's `.container` stays above it via z-index.
 *
 * @param {{ tone?: 'dark'|'light', seed?: number, flip?: boolean }} props
 */
export default function CityBackdrop({ tone = 'light', seed = 5, flip = false }) {
  return (
    <div className={`city-backdrop${flip ? ' city-backdrop--flip' : ''}`} aria-hidden="true">
      <CitySkyline className="city-backdrop__layer city-backdrop__layer--back" depth="back" tone={tone} seed={seed} fit="slice" />
      <CitySkyline className="city-backdrop__layer city-backdrop__layer--mid" depth="mid" tone={tone} seed={seed + 40} flip={flip} fit="slice" />
      <CitySkyline className="city-backdrop__layer city-backdrop__layer--front" depth="front" tone={tone} seed={seed + 80} flip={flip} fit="slice" />
    </div>
  );
}
