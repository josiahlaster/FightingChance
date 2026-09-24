import { usePageMeta } from '../utils/usePageMeta';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import Reveal from '../components/Reveal';
import CityBackdrop from '../components/CityBackdrop';
import SectionHeader from '../components/SectionHeader';
import ContactCard from '../components/ContactCard';
import CTASection from '../components/CTASection';
import { PhoneIcon, MailIcon, PinIcon } from '../components/Icons';

export default function ContactPage() {
  usePageMeta(
    'Contact Us | Fighting Chance Transitional Restoration',
    'Contact Fighting Chance Transitional Restoration in Durham, NC. Call 919-685-0569 or email fightingchancetransitional@gmail.com for location availability and placement.'
  );

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Contact</span>
          <h1>Let&apos;s talk.</h1>
          <p>
            Whether you are ready to refer someone, looking for placement information, or simply
            have a question — we are here to help.
          </p>
        </div>
      </section>

      <section className="section section--city">
        <CityBackdrop tone="light" seed={31} />
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="Get In Touch"
              title="Fighting Chance Transitional Restoration"
              lead="Because we operate multiple homes, please contact the organization directly for location availability and placement information."
            />
          </Reveal>

          <Reveal>
            <div className="contact-grid">
              <ContactCard icon={<PhoneIcon />} label="Phone" href={site.phoneHref} note="Call us for location availability and placement information.">
                {site.phone}
              </ContactCard>
              <ContactCard icon={<MailIcon />} label="Email" href={`mailto:${site.email}`} note="We respond to email as quickly as we can.">
                {site.email}
              </ContactCard>
              <ContactCard icon={<PinIcon />} label="Location" note="Our three homes are all located in the Durham area. See the Locations page for addresses.">
                {site.city}
              </ContactCard>
            </div>
          </Reveal>

          <Reveal>
            <div className="card" style={{ marginTop: '2rem', textAlign: 'center', padding: '2.2rem' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>Contact Us</h2>
              <p className="lead" style={{ margin: '0 auto 1.4rem' }}>
                Reach out for location availability, placement information, or general questions.
              </p>
              <div className="btn-row" style={{ justifyContent: 'center' }}>
                <a href={site.phoneHref} className="btn btn--primary btn--lg">Call 919-685-0569</a>
                <a href={`mailto:${site.email}`} className="btn btn--outline btn--lg">Email Us</a>
                <Link to="/referral" className="btn btn--dark btn--lg">Refer Someone</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="You have another chance."
        text="You don't have to rebuild alone. We'll walk with you the rest of the way."
        secondary={{ to: '/program', label: 'Learn About Our Program' }}
      />
    </>
  );
}
