import { Link } from 'react-router-dom';
import { site, footerLinks } from '../data/site';
import Logo from './Logo';
import { PhoneIcon, MailIcon, PinIcon } from './Icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo size={150} light />
            <p className="footer__tagline">{site.tagline}</p>
            <p className="footer__motto">{site.motto.join(' ')}</p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <div className="footer__contactline">
              <PhoneIcon width={18} height={18} />
              <a href={site.phoneHref}>{site.phone}</a>
            </div>
            <div className="footer__contactline">
              <MailIcon width={18} height={18} />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </div>
            <div className="footer__contactline">
              <PinIcon width={18} height={18} />
              <span>{site.city}</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© 2026 Fighting Chance Transitional Restoration</span>
          <span>
            You have another chance. <em style={{ color: 'var(--fc-red-bright)' }}>You don&apos;t have to rebuild alone.</em>
          </span>
        </div>
      </div>
    </footer>
  );
}
