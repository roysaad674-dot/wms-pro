export default function Page() {
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Stock Movements</h1>
          <div className="ph-sub">This module is being set up.</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-primary">
            <i className="fa-solid fa-plus" /> New
          </button>
        </div>
      </div>
      <div className="banner info" style={{ marginTop: 16 }}>
        <i className="fa-solid fa-circle-info" />
        <div>
          <strong>Stock Movements</strong> — coming soon. Full CRUD with database support will be available here.
        </div>
      </div>
    </div>
  )
}
