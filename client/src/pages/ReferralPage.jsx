import { usePageMeta } from '../utils/usePageMeta';
import ReferralForm from '../components/ReferralForm';
import Reveal from '../components/Reveal';
import CityBackdrop from '../components/CityBackdrop';
import { CheckIcon } from '../components/Icons';

export default function ReferralPage() {
  usePageMeta(
    'Refer Someone | Fighting Chance Transitional Restoration',
    'Submit a referral to Fighting Chance Transitional Restoration. Safe, stable transitional housing for men rebuilding their lives in Durham, NC.'
  );

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Referral</span>
          <h1>Refer Someone</h1>
          <p>
            Organizations, professionals, family members, and other appropriate referral sources
            can use this form to submit a referral for review. Our team follows up promptly.
          </p>
        </div>
      </section>

      <section className="section section--city form-section">
        <CityBackdrop tone="light" seed={37} flip />
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: 760, margin: '0 auto' }}>
              <div className="card" style={{ marginBottom: '2rem', background: 'var(--fc-off-white)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.6rem' }}>Before you begin</h2>
                <ul className="checklist" style={{ marginTop: '0.4rem' }}>
                  <li><CheckIcon width={20} height={20} /><span>Please have the individual&apos;s contact details and current housing situation available.</span></li>
                  <li><CheckIcon width={20} height={20} /><span>Fields marked with <span className="req">*</span> are required.</span></li>
                  <li><CheckIcon width={20} height={20} /><span>Referrals are reviewed in the order received. Submission does not guarantee placement.</span></li>
                  <li>
                    <CheckIcon width={20} height={20} />
                    <span>
                      Prefer to talk it through first? Call us at{' '}
                      <a href="tel:+19196850569" style={{ fontWeight: 600 }}>919-685-0569</a>.
                    </span>
                  </li>
                </ul>
              </div>

              <ReferralForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
