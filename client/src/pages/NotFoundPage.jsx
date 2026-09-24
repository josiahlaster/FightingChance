import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta';

export default function NotFoundPage() {
  usePageMeta(
    'Page Not Found | Fighting Chance Transitional Restoration',
    'The page you were looking for could not be found.'
  );

  return (
    <section className="notfound">
      <div className="container">
        <p className="eyebrow" style={{ justifyContent: 'center' }}>Page Not Found</p>
        <h1>404</h1>
        <p className="lead" style={{ margin: '0 auto 2rem' }}>
          This page doesn&apos;t exist — but everyone deserves another chance. Let&apos;s get you
          back on track.
        </p>
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn--dark btn--lg">Back to Home</Link>
          <Link to="/referral" className="btn btn--primary btn--lg">Refer Someone</Link>
        </div>
      </div>
    </section>
  );
}
