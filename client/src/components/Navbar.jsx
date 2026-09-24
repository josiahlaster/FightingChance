import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navLinks } from '../data/site';
import { BrandLockup } from './Logo';
import { MenuIcon, CloseIcon } from './Icons';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkClass = ({ isActive }) => `navbar__link${isActive ? ' active' : ''}`;

  // The red "Refer Someone" CTA already points at /referral, so the
  // plain "Referral" nav link would duplicate it. Keep exactly one
  // referral entry point in the navigation.
  const links = navLinks.filter((link) => link.path !== '/referral');

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <BrandLockup />

        <nav aria-label="Primary">
          <ul className="navbar__links">
            {links.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={linkClass} end={link.path === '/'}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <Link to="/referral" className="btn btn--primary navbar__cta navbar__mobile-cta">
            Refer Someone
          </Link>
          <button
            type="button"
            className="navbar__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          <ul>
            {links.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={({ isActive }) => (isActive ? 'active' : '')} end={link.path === '/'}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/referral" className="btn btn--primary btn--lg">
            Refer Someone
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
