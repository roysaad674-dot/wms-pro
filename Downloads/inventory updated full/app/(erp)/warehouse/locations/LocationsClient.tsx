'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TYPE_COLOR: Record<string, string> = {
  WAREHOUSE: 'info',
  ZONE: 'pos',
  AISLE: 'warn',
  BIN: 'purple',
  SHELF: 'neg',
}

export default function LocationsClient({ data }: { data: any[] }) {
  const router = useRouter()
  const [q, setQ] = useState('')

  const filtered = data.filter((r: any) =>
    !q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  )

  const total = data.length
  const warehouses = data.filter((r: any) => r.type === 'WAREHOUSE').length
  const zones = data.filter((r: any) => r.type === 'ZONE').length
  const bins = data.filter((r: any) => r.type === 'BIN').length

  function fmtDate(d: string) {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Locations</h1>
          <div className="ph-sub">Warehouses, zones, aisles, bins and shelving</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button className="btn btn-primary" onClick={() => router.push('/warehouse/locations/new')}>
            <i className="fa-solid fa-plus" /> New Location
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Total Locations</div>
          <div className="kpi-val">{total}</div>
          <div className="kpi-foot">all types</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Warehouses</div>
          <div className="kpi-val">{warehouses}</div>
          <div className="kpi-foot">top-level</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Zones</div>
          <div className="kpi-val">{zones}</div>
          <div className="kpi-foot">sub-areas</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Bins</div>
          <div className="kpi-val">{bins}</div>
          <div className="kpi-foot">storage slots</div>
        </div>
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by name or type…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Type</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ color: 'var(--muted)', marginBottom: 12 }}>
                      <i className="fa-solid fa-warehouse" style={{ fontSize: 32 }} />
                    </div>
                    <div className="fw-6">No locations found</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                      {data.length === 0
                        ? <><button className="btn btn-primary btn-sm" onClick={() => router.push('/warehouse/locations/new')}>Create first location</button></>
                        : 'Try adjusting your search'}
                    </div>
                  </td>
                </tr>
              ) : filtered.map((r: any) => (
                <tr key={r.id}>
                  <td className="col-id">{r.id}</td>
                  <td>
                    <div className="cell-with-icon">
                      <span className="thumb" style={{ background: 'var(--accent-soft)' }}>
                        <i className="fa-solid fa-location-dot" style={{ fontSize: 11 }} />
                      </span>
                      <span className="fw-6">{r.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`tag ${TYPE_COLOR[r.type] || 'info'}`}>
                      {r.type || '—'}
                    </span>
                  </td>
                  <td className="muted">{fmtDate(r.createdAt)}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => router.push(`/warehouse/locations/${r.id}/edit`)}>
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: 'var(--neg)' }}>
                      <i className="fa-solid fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
            {filtered.length} location{filtered.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
