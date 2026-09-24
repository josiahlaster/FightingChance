export default function ServiceCard({ icon, title, children }) {
  return (
    <article className="card">
      <div className="card__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </article>
  );
}
