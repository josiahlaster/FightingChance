import { Link } from 'react-router-dom';

/**
 * Bold closing call-to-action band. Used at the bottom of most pages to
 * drive visitors toward the primary action: referring someone.
 */
export default function CTASection({
  title = 'You don\u2019t have to do this alone.',
  text = 'We\u2019ll walk with you the rest of the way. Reach out for location availability, placement information, or to refer someone today.',
  primary = { to: '/referral', label: 'Refer Someone' },
  secondary = /** @type {{ to: string, label: string } | null} */ (null),
}) {
  return (
    <section className="cta-section" aria-labelledby="cta-heading">
      <div className="container">
        <h2 id="cta-heading">{title}</h2>
        <p>{text}</p>
        <div className="btn-row">
          <Link to={primary.to} className="btn btn--primary btn--lg">
            {primary.label}
          </Link>
          {secondary ? (
            <Link to={secondary.to} className="btn btn--ghost btn--lg">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
