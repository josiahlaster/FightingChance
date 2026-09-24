import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

/**
 * SplashScreen — opening brand moment.
 *
 * Sequence (total ~3.6s):
 *   1. Logo pops into the center of a black screen.          (pop)
 *   2. Chains slide out from behind the logo to both edges.  (chain-out)
 *   3. The chains break away — links snap loose and fall,
 *      staggered from the outermost inward.                  (link break)
 *   4. The overlay fades, revealing the home page underneath.(fade-out)
 *
 * Plays on every full page load, respects prefers-reduced-motion by
 * fading out almost immediately, and calls onDone when the overlay is
 * fully gone. Route changes (client-side navigation) never re-trigger it.
 */

const LINKS_PER_SIDE = 7;
const CORNER_LINKS = 12;

/**
 * One chain link, rendered with SVG. Chains alternate between a flat
 * ring (viewed face-on) and a narrow edge-on link, overlapping so the
 * row reads as a real interlocking chain.
 */
function ChainLink({ i }) {
  /** @type {any} */
  const style = { '--link-i': i };
  const edge = i % 2 === 1;
  return (
    <svg
      className={`splash__link${edge ? ' splash__link--edge' : ''}`}
      style={style}
      viewBox="0 0 46 26"
      aria-hidden="true"
      focusable="false"
    >
      {edge ? (
        <ellipse cx="23" cy="13" rx="5.5" ry="10" fill="none" stroke="currentColor" strokeWidth="5" />
      ) : (
        <g>
          <rect x="3" y="3" width="40" height="20" rx="10" fill="none" stroke="currentColor" strokeWidth="5" />
          <path d="M8 8 Q 23 3.5 38 8" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('pop'); // pop -> chain-out -> break -> fade -> gone
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    if (mq.matches) {
      // Skip the theatrics: quick fade only.
      setPhase('fade');
      const t = setTimeout(() => {
        setPhase('gone');
        onDone?.();
      }, 500);
      return () => clearTimeout(t);
    }

    const timers = [
      setTimeout(() => setPhase('chain-out'), 700),
      setTimeout(() => setPhase('break'), 1500),
      setTimeout(() => setPhase('fade'), 3100),
      setTimeout(() => {
        setPhase('gone');
        onDone?.();
      }, 3900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  if (phase === 'gone') return null;

  const breaking = phase === 'break' || phase === 'fade';
  const chainsOut = phase === 'chain-out' || breaking;

  return (
    <div className={`splash${phase === 'fade' ? ' splash--fade' : ''}`} role="presentation">
      <div className="splash__stage">
        <div className={`splash__chain splash__chain--left${chainsOut ? ' splash__chain--out' : ''}${breaking ? ' splash__chain--break' : ''}`}>
          {Array.from({ length: LINKS_PER_SIDE }, (_, i) => (
            <ChainLink key={`l${i}`} i={i} />
          ))}
        </div>

        <img
          src={logo}
          alt=""
          className={`splash__logo${phase === 'pop' ? ' splash__logo--pop' : ''}`}
          width="300"
        />

        <div className={`splash__chain splash__chain--right${chainsOut ? ' splash__chain--out' : ''}${breaking ? ' splash__chain--break' : ''}`}>
          {Array.from({ length: LINKS_PER_SIDE }, (_, i) => (
            <ChainLink key={`r${i}`} i={i} />
          ))}
        </div>

        {/* Four diagonal chains anchored at the logo's corners */}
        {['tl', 'tr', 'bl', 'br'].map((pos) => (
          <div
            key={pos}
            className={`splash__chain splash__chain--${pos}${chainsOut ? ' splash__chain--out' : ''}${breaking ? ' splash__chain--break' : ''}`}
          >
            {Array.from({ length: CORNER_LINKS }, (_, i) => (
              <ChainLink key={`${pos}${i}`} i={i} />
            ))}
          </div>
        ))}
      </div>

      <p className={`splash__tag${phase !== 'pop' ? ' splash__tag--show' : ''}`}>
        Rebuild. Restore. Rise. Redeem.
      </p>
      <span className="sr-only">Fighting Chance Transitional Restoration</span>
    </div>
  );
}

