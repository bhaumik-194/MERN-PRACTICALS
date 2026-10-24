
export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "blue",
}) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}>
        {Icon && <Icon size={21} />}
      </div>

      <div className="stat-content">
        <p>{title}</p>
        <h2>{value ?? "—"}</h2>
        {description && <span>{description}</span>}
      </div>
    </article>
  );
}
