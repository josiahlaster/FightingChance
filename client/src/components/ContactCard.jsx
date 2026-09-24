export default function ContactCard({ icon, label, children, href = '', note = '' }) {
  return (
    <article className="card contact-card">
      <div className="card__icon">{icon}</div>
      <h3>{label}</h3>
      {href ? (
        <a href={href}>{children}</a>
      ) : (
        <p style={{ fontWeight: 600 }}>{children}</p>
      )}
      {note ? <p className="note">{note}</p> : null}
    </article>
  );
}
