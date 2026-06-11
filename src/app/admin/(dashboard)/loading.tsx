export default function Loading() {
  return (
    <div className="admin-page" aria-busy="true">
      <div className="admin-page-head">
        <div className="sk sk-title" />
        <div className="sk sk-sub" />
      </div>
      <div className="admin-kpis">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="admin-kpi n-card">
            <div className="sk sk-num" />
            <div className="sk sk-label" />
          </div>
        ))}
      </div>
      <div className="sk sk-block" />
    </div>
  );
}
