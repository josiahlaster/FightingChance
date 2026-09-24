import { usePageMeta } from '../utils/usePageMeta';
import Reveal from '../components/Reveal';
import CityBackdrop from '../components/CityBackdrop';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import CTASection from '../components/CTASection';
import {
  HouseIcon,
  HeartHandsIcon,
  HandshakeIcon,
  StethoscopeIcon,
  ClipboardIcon,
  ShieldIcon,
} from '../components/Icons';

export default function ProgramPage() {
  usePageMeta(
    'Our Program | Fighting Chance Transitional Restoration',
    'Safe and stable housing, sobriety and support, reentry connections, on-call clinician crisis intervention, and a Certified NC Drug Counselor (CADC).'
  );

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <span className="eyebrow">Our Program</span>
          <h1>A structure for starting over.</h1>
          <p>
            Fighting Chance combines safe, stable housing with accountability, sobriety support,
            and connections to trusted reentry resources — so men can rebuild with confidence.
          </p>
        </div>
      </section>

      <section className="section section--city">
        <CityBackdrop tone="light" seed={13} />
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="How It Works"
              title="What the Program Provides"
              lead="Every element of the program is designed to remove chaos and build momentum — one stable step at a time."
            />
          </Reveal>
          <Reveal>
            <div className="grid-3">
              <ServiceCard icon={<HouseIcon />} title="Safe &amp; Stable Housing">
                A structured, supportive living environment. Residents have a safe, stable place
                to sleep, regroup, and focus on the work of rebuilding — surrounded by a community
                that is committed to the same goal.
              </ServiceCard>
              <ServiceCard icon={<HeartHandsIcon />} title="Sobriety &amp; Support">
                A sober living environment that promotes accountability, healing, and personal
                responsibility. Residents support one another while building the habits that make
                recovery sustainable.
              </ServiceCard>
              <ServiceCard icon={<HandshakeIcon />} title="Reentry Support">
                Warm hand-offs to trusted reentry support services — so individuals take the next
                step forward with guidance instead of guesswork.
              </ServiceCard>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <Reveal>
            <SectionHeader
              eyebrow="Professional Support"
              title="Crisis Intervention &amp; Substance Use Support"
              lead="Professional help is available when it matters most."
              dark
            />
          </Reveal>
          <Reveal>
            <div className="grid-3" style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))' }}>
              <ServiceCard icon={<StethoscopeIcon />} title="Crisis Intervention">
                An on-call clinician is available for crisis interventions — professional support
                during the moments when stability is at stake.
              </ServiceCard>
              <ServiceCard icon={<ClipboardIcon />} title="Substance Use Support">
                A Certified NC Drug Counselor (CADC) provides substance use counseling support for
                residents working a program of recovery.
              </ServiceCard>
            </div>
          </Reveal>
          <Reveal>
            <div className="card card--dark" style={{ marginTop: '1.4rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <ShieldIcon style={{ flex: 'none', color: 'var(--fc-red-bright)' }} />
              <p style={{ margin: 0 }}>
                Fighting Chance is not a medical facility. We do not provide medical treatment,
                detox, or psychiatric services — we provide the stable, sober foundation and
                trusted connections that make rebuilding possible.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection
        title="Ready to take the next step?"
        text="Refer someone to Fighting Chance or contact us for location availability and placement information."
        secondary={{ to: '/locations', label: 'See Our Locations' }}
      />
    </>
  );
}
