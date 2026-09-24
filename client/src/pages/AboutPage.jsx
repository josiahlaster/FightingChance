import { usePageMeta } from '../utils/usePageMeta';
import Reveal from '../components/Reveal';
import CityBackdrop from '../components/CityBackdrop';
import FlyerImage from '../components/FlyerImage';
import SectionHeader from '../components/SectionHeader';
import CTASection from '../components/CTASection';
import { BrokenChainIcon, RefreshIcon, StepsIcon, PeopleIcon } from '../components/Icons';
import flyerTri from '../assets/flyer-tri.png';

export default function AboutPage() {
  usePageMeta(
    'About Us | Fighting Chance Transitional Restoration',
    'Fighting Chance Transitional Restoration believes every man deserves a second chance — a foundation for rebuilding, restoration, responsibility, and moving forward.'
  );

  const chances = [
    { icon: <RefreshIcon />, title: 'Break old patterns.', text: 'Leave behind the cycles that led to incarceration, addiction, or instability — and choose a new direction.' },
    { icon: <StepsIcon />, title: 'Build a better future.', text: 'Stability, structure, and support create the foundation for lasting change and personal growth.' },
    { icon: <PeopleIcon />, title: 'Return to your community stronger than before.', text: 'Reenter your community with accountability, confidence, and the tools to stay on track.' },
  ];

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1>Every man deserves a second chance.</h1>
          <p>
            Fighting Chance Transitional Restoration believes in restoration — not just housing.
            We provide more than simply a place to stay: we provide a foundation for rebuilding,
            restoration, responsibility, and moving forward.
          </p>
        </div>
      </section>

      <section className="section section--city">
        <CityBackdrop tone="light" seed={9} />
        <div className="container">
          <Reveal>
            <div className="split">
              <div className="split__media">
                <FlyerImage
                  src={flyerTri}
                  alt="Fighting Chance Transitional Restoration tri-fold brochure — mission, who we serve, and what we provide"
                />
              </div>
              <div>
                <SectionHeader
                  eyebrow="Who We Are"
                  title="More Than a Place to Stay"
                />
                <p className="lead">
                  At Fighting Chance Transitional Restoration, we believe every man deserves a
                  second chance. We provide more than just a place to stay — we provide a
                  foundation to rebuild your life and move forward with purpose.
                </p>
                <p className="lead" style={{ marginTop: '1rem' }}>
                  Our approach is built on structure, accountability, and connection. Residents
                  live in a sober, supportive environment while they work toward personal goals,
                  rebuild stability, and prepare to return to their communities as productive
                  members of society.
                </p>
                <div className="chain-divider" style={{ margin: '2rem auto 0', maxWidth: 180 }} aria-hidden="true" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="This Is Your Chance To"
              title="Rebuild. Restore. Rise. Redeem."
              lead="A second chance is not just a slogan — it is a daily choice. Here is what that choice makes possible."
              dark
            />
          </Reveal>
          <Reveal>
            <div className="grid-3">
              {chances.map((c) => (
                <article key={c.title} className="card card--dark">
                  <div className="card__icon">{c.icon}</div>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="You\u2019ve done the time. Now let us help you build your tomorrow."
        text="If you or someone you know is ready for a new chapter, we\u2019re ready to walk with you."
        secondary={{ to: '/contact', label: 'Contact Us' }}
      />
    </>
  );
}
