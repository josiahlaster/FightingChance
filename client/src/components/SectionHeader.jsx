export default function SectionHeader({
  eyebrow = '',
  title,
  lead = '',
  dark = false,
  center = false,
}) {
  return (
    <div className="section-head" style={center ? { marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' } : undefined}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
      {lead ? <p className="lead" style={center ? { margin: '0 auto' } : undefined}>{lead}</p> : null}
      {dark ? null : null}
    </div>
  );
}
