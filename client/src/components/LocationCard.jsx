import { mapsDirectionsUrl } from '../data/site';
import { PinIcon, ArrowRightIcon } from './Icons';

export default function LocationCard({ location }) {
  const { name, street, city, state, zip, mapsQuery } = location;
  const address = `${street}, ${city}, ${state} ${zip}`;

  return (
    <article className="card location-card">
      <div className="card__icon" aria-hidden="true">
        <PinIcon />
      </div>
      <div className="location-card__body">
        <h3>{name}</h3>
        <address>
          {street}
          <br />
          {city}, {state} {zip}
        </address>
      </div>
      <a
        className="btn btn--outline"
        href={mapsDirectionsUrl(mapsQuery)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Get directions to ${name} — ${address}`}
      >
        Get Directions
        <ArrowRightIcon width={18} height={18} />
      </a>
    </article>
  );
}
