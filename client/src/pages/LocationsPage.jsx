import { usePageMeta } from '../utils/usePageMeta';
import { locations } from '../data/site';
import Reveal from '../components/Reveal';
import CityBackdrop from '../components/CityBackdrop';
import SectionHeader from '../components/SectionHeader';
import LocationCard from '../components/LocationCard';
import CTASection from '../components/CTASection';
import { PhoneIcon } from '../components/Icons';

export default function LocationsPage() {
  usePageMeta(
    'Locations | Fighting Chance Transitional Restoration',
    'Fighting Chance Transitional Restoration operates three transitional housing locations in Durham, North Carolina. Contact us for availability and placement.'
  );

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Locations</span>
          <h1>Three houses. One mission.</h1>
          <p>
            All Fighting Chance homes are located in Durham, North Carolina. Because availability
            changes, please contact the organization directly for location availability and
            placement information.
          </p>
        </div>
      </section>

      <section className="section section--city">
        <CityBackdrop tone="light" seed={23} flip />
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="Where We Are"
              title="Our Durham Locations"
              lead="Call 919-685-0569 to ask about beds, placement, and which house is the right fit."
            />
          </Reveal>
          <Reveal>
            <div className="grid-3">
              {locations.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="card" style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <PhoneIcon style={{ flex: 'none', color: 'var(--fc-red)' }} />
              <p style={{ margin: 0 }}>
                <strong>Need placement information?</strong> We do not publish per-location phone
                numbers. Please call the organization directly and our team will help you find the
                right location.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Looking for a bed for someone you know?"
        text="Submit a referral and our team will follow up promptly."
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}
