import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

/**
 * Brand logo with graceful fallback. The logo's own background is black,
 * so on dark backgrounds we only round the corners; on light backgrounds
 * we also add a subtle border ring for definition.
 */
export default function Logo({ className = '', size = 190, light = false }) {
  return (
    <img
      src={logo}
      alt="Fighting Chance Transitional Restoration logo"
      width={size}
      height={Math.round(size * (502 / 500))}
      className={className}
      style={{
        width: size,
        height: 'auto',
        borderRadius: 12,
        boxShadow: light ? '0 0 0 1px rgba(0,0,0,0.15)' : 'none',
      }}
    />
  );
}

/** Compact text lockup used in the navbar. */
export function BrandLockup() {
  return (
    <Link to="/" className="navbar__brand" aria-label="Fighting Chance Transitional Restoration — Home">
      <Logo size={46} />
      <span className="navbar__brand-text">
        <span className="navbar__brand-name">Fighting Chance</span>
        <span className="navbar__brand-tag">Transitional Restoration</span>
      </span>
    </Link>
  );
}
