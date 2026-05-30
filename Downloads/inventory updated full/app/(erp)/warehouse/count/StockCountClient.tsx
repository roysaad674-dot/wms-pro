'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { fmtMoney } from '@/lib/utils'

const SAMPLE_COUNTS = [
  { id: 'SC-001', type: 'FULL', scope: 'All Warehouses', started: '2025-05-01', status: 'completed', progress: 100, variance: -1240, items: 312 },
  { id: 'SC-002', type: 'CYCLE', scope: 'Zone A — Rack 1-10', started: '2025-05-15', status: 'completed', progress: 100, variance: 0, items: 48 },
  { id: 'SC-003', type: 'SPOT', scope: 'SKU: EL-0047, EL-0048', started: '2025-05-20', status: 'completed', progress: 100, variance: -80, items: 2 },
  { id: 'SC-004', type: 'CYCLE', scope: 'Zone B — Rack 11-20', started: '2025-05-25', status: 'in_progress', progress: 62, variance: null, items: 74 },
  { id: 'SC-005', type: 'SPOT', scope: 'SKU: CL-0012', started: '2025-05-28', status: 'in_progress', progress: 100, variance: null, items: 1 },
  { id: 'SC-006', type: 'FULL', scope: 'All Warehouses', started: '2025-05-30', status: 'draft', progress: 0, variance: null, items: 0 },
  { id: 'SC-007', type: 'CYCLE', scope: 'Zone C — Cold Storage', started: '2025-04-10', status: 'completed', progress: 100, variance: 320, items: 28 },
  { id: 'SC-008', type: 'SPOT', scope: 'SKU: ST-0091, ST-0092, ST-0093', started: '2025-04-22', status: 'cancelled', progress: 30, variance: null, items: 3 },
]

const STATUS_COLOR: Record<string, string> = {
  draft: 'muted',
  in_progress: 'warn',
  completed: 'pos',
  cancelled: 'neg',
}
const TYPE_COLOR: Record<string, string> = {
  FULL: 'info',
  CYCLE: 'pos',
  SPOT: 'warn',
}

export default function StockCountClient() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const filtered = SAMPLE_COUNTS.filter(r => {
    if (tab === 'Active' && !['draft', 'in_progress'].includes(r.status)) return false
    if (tab === 'Completed' && r.status !== 'completed') return false
    if (tab === 'Draft' && r.status !== 'draft') return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const active = SAMPLE_COUNTS.filter(r => r.status === 'in_progress').length
  const lastFull = SAMPLE_COUNTS.filter(r => r.type === 'FULL' && r.status === 'completed')
    .sort((a, b) => b.started.localeCompare(a.started))[0]
  const completedVariances = SAMPLE_COUNTS.filter(r => r.status === 'completed' && r.variance !== null)
  const totalVariance = completedVariances.reduce((s, r) => s + (r.variance || 0), 0)
  const accuracy = 98.4

  function progressBar(pct: number) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, minWidth: 80 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? 'var(--pos)' : 'var(--accent)', borderRadius: 3, transition: 'width .3s' }} />
        </div>
        <span className="muted" style={{ fontSize: 12, minWidth: 28 }}>{pct}%</span>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Stock Count</h1>
          <div className="ph-sub">Physical inventory counts — full, cycle and spot checks</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button className="btn btn-primary" onClick={() => router.push('/warehouse/count/new')}>
            <i className="fa-solid fa-plus" /> New Count
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Active Counts</div>
          <div className="kpi-val" style={{ color: active > 0 ? 'var(--warn)' : undefined }}>{active}</div>
          <div className="kpi-foot">in progress</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Last Full Count</div>
          <div className="kpi-val" style={{ fontSize: 18 }}>{lastFull ? lastFull.started : '—'}</div>
          <div className="kpi-foot">full warehouse</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Accuracy YTD</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>{accuracy}%</div>
          <div className="kpi-foot">count accuracy</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Variance Value</div>
          <div className="kpi-val" style={{ color: totalVariance < 0 ? 'var(--neg)' : 'var(--pos)' }}>
            {fmtMoney(Math.abs(totalVariance))}
          </div>
          <div className="kpi-foot">{totalVariance < 0 ? 'shrinkage' : 'surplus'} YTD</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Active', 'Completed', 'Draft'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by count #, scope…"
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
                <th>Count #</th>
                <th>Type</th>
                <th>Scope</th>
                <th>Started</th>
                <th>Status</th>
                <th>Progress</th>
                <th className="ta-right">Variance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="col-id fw-6">{r.id}</td>
                  <td><span className={`tag ${TYPE_COLOR[r.type] || 'info'}`}>{r.type}</span></td>
                  <td>{r.scope}</td>
                  <td className="muted">{r.started}</td>
                  <td>
                    <span className={`pill ${STATUS_COLOR[r.status] || 'info'}`}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ minWidth: 140 }}>{progressBar(r.progress)}</td>
                  <td className="ta-right fw-6">
                    {r.variance === null ? <span className="muted">—</span> : (
                      <span style={{ color: r.variance < 0 ? 'var(--neg)' : r.variance > 0 ? 'var(--pos)' : 'var(--muted)' }}>
                        {r.variance > 0 ? '+' : ''}{fmtMoney(r.variance, 0)}
                      </span>
                    )}
                  </td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" title="Open count">
                      <i className="fa-solid fa-eye" />
                    </button>
                    {r.status === 'in_progress' && (
                      <button className="btn btn-sm btn-primary" title="Continue counting">
                        <i className="fa-solid fa-play" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
