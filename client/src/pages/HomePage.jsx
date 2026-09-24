import { Link } from 'react-router-dom';
import { site, locations } from '../data/site';
import flyerFront from '../assets/flyer-front.png';
import { usePageMeta } from '../utils/usePageMeta';
import LogoScene from '../components/LogoScene';
import CityBackdrop from '../components/CityBackdrop';
import FlyerImage from '../components/FlyerImage';
import Reveal from '../components/Reveal';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import LocationCard from '../components/LocationCard';
import CTASection from '../components/CTASection';
import {
  HouseIcon,
  HeartHandsIcon,
  HandshakeIcon,
  ShieldIcon,
  CheckIcon,
  StethoscopeIcon,
  ClipboardIcon,
  ArrowRightIcon,
} from '../components/Icons';

export default function HomePage() {
  usePageMeta(
    'Fighting Chance Transitional Restoration | Transitional Housing in Durham, NC',
    'Fighting Chance Transitional Restoration provides safe, stable transitional housing and connections to reentry support for men rebuilding their lives in Durham, North Carolina.'
  );

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container hero__inner">
          <LogoScene size={280} />

          <h1 className="hero__headline">
            A New Chapter.
            <br />
            <em>A Better Future.</em>
          </h1>

          <p className="hero__text">
            Fighting Chance Transitional Restoration provides safe, stable housing and supportive
            connections for men who are ready to rebuild their lives and move forward with purpose.
          </p>

          <div className="hero__ctas">
            <Link to="/referral" className="btn btn--primary btn--lg">
              Refer Someone
            </Link>
            <Link to="/program" className="btn btn--ghost btn--lg">
              Learn About Our Program
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>3 Locations</strong>
              <span>Serving Durham, NC</span>
            </div>
            <div className="hero__stat">
              <strong>Safe Housing</strong>
              <span>Structured &amp; Supportive</span>
            </div>
            <div className="hero__stat">
              <strong>Reentry Support</strong>
              <span>Trusted Connections</span>
            </div>
          </div>
        </div>
        <div style={{ height: 1 }} aria-hidden="true" />
      </section>

      {/* ================= WHO WE SERVE ================= */}
      <section className="section section--city section--city-full">
        <CityBackdrop tone="light" seed={51} />
        <div className="container">
          <Reveal>
            <div className="split">
              <div>
                <SectionHeader
                  eyebrow="Who We Serve"
                  title="A Foundation for a Better Future"
                  lead="Fighting Chance serves men who are ready to do the work — men rebuilding their lives with purpose and preparing to return to their communities stronger than before."
                />
                <ul className="checklist">
                  <li><CheckIcon width={22} height={22} /><span>Justice impacted</span></li>
                  <li><CheckIcon width={22} height={22} /><span>Motivated to rebuild their lives</span></li>
                  <li><CheckIcon width={22} height={22} /><span>Committed to personal growth</span></li>
                  <li><CheckIcon width={22} height={22} /><span>Working toward a better future</span></li>
                  <li><CheckIcon width={22} height={22} /><span>Preparing to return to their communities</span></li>
                </ul>
              </div>
              <div className="split__media">
                <FlyerImage
                  src={flyerFront}
                  alt="Fighting Chance Transitional Restoration flyer — A New Chapter. A Better Future."
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= WHAT WE PROVIDE ================= */}
      <section className="section section--light section--city">
        <CityBackdrop tone="light" seed={5} />
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="What We Provide"
              title="More Than a Place to Stay"
              lead="A structured foundation that combines stable housing, accountability, and connections to trusted reentry support."
            />
          </Reveal>
          <Reveal>
            <div className="grid-3">
              <ServiceCard icon={<HouseIcon />} title="Safe, Stable Housing">
                A structured, supportive living environment for men committed to change and growth.
              </ServiceCard>
              <ServiceCard icon={<HeartHandsIcon />} title="Sobriety &amp; Support">
                A sober living environment that promotes accountability, healing, and personal responsibility.
              </ServiceCard>
              <ServiceCard icon={<HandshakeIcon />} title="Reentry Support">
                Connections to trusted reentry support services to help individuals take the next step forward.
              </ServiceCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= PROFESSIONAL SUPPORT ================= */}
      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="Professional Support"
              title="Support That Meets the Moment"
              lead="When challenges arise, our residents are never left without professional help."
              dark
            />
          </Reveal>
          <Reveal>
            <div className="grid-3" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              <ServiceCard icon={<StethoscopeIcon />} title="On-Call Clinician">
                On-call clinician support for crisis interventions.
              </ServiceCard>
              <ServiceCard icon={<ClipboardIcon />} title="Certified NC Drug Counselor (CADC)">
                Access to a Certified NC Drug Counselor (CADC) for substance use counseling support.
              </ServiceCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= LOCATIONS PREVIEW ================= */}
      <section className="section section--city">
        <CityBackdrop tone="light" seed={17} flip />
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="Our Locations"
              title="Three Houses. One Mission."
              lead="Contact us for location availability and placement information."
            />
          </Reveal>
          <Reveal>
            <div className="grid-3">
              {locations.map((loc) => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          </Reveal>
          <div style={{ marginTop: '2.2rem', textAlign: 'center' }}>
            <Link to="/locations" className="btn btn--dark">
              View All Locations <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MOTTO STRIP ================= */}
      <section className="section section--dark" style={{ padding: '2.6rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '0.06em' }}>
            {site.motto.map((word, i) => (
              <span key={word} style={{ color: i % 2 === 0 ? '#fff' : 'var(--fc-red-bright)' }}>
                {word}
                {i < site.motto.length - 1 ? '  ' : ''}
              </span>
            ))}
          </p>
          <div className="chain-divider" aria-hidden="true" />
        </div>
      </section>

      {/* ================= CTA ================= */}
      <CTASection />
    </>
  );
}
