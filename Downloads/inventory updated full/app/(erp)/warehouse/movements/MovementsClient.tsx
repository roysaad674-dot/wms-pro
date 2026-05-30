'use client'
import { useState } from 'react'
import { fmtMoney } from '@/lib/utils'

const TYPE_COLORS: Record<string, string> = {
  PURCHASE: 'pos',
  SALE: 'neg',
  TRANSFER: 'info',
  ADJUSTMENT: 'warn',
  RETURN: 'purple',
}

const TYPE_ICONS: Record<string, string> = {
  PURCHASE: 'fa-arrow-down',
  SALE: 'fa-arrow-up',
  TRANSFER: 'fa-right-left',
  ADJUSTMENT: 'fa-sliders',
  RETURN: 'fa-rotate-left',
}

function isIn(type: string) { return type === 'PURCHASE' || type === 'RETURN' }
function isOut(type: string) { return type === 'SALE' }
function isTransfer(type: string) { return type === 'TRANSFER' }
function isAdjust(type: string) { return type === 'ADJUSTMENT' }

export default function MovementsClient({ data }: { data: any[] }) {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const today = new Date().toDateString()

  const filtered = data.filter((r: any) => {
    if (tab === 'IN' && !isIn(r.type)) return false
    if (tab === 'OUT' && !isOut(r.type)) return false
    if (tab === 'Transfer' && !isTransfer(r.type)) return false
    if (tab === 'Adjust' && !isAdjust(r.type)) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const todayRows = data.filter((r: any) => new Date(r.createdAt).toDateString() === today)
  const inUnits = data.filter((r: any) => isIn(r.type)).reduce((s: number, r: any) => s + (r.qty || 0), 0)
  const outUnits = data.filter((r: any) => isOut(r.type)).reduce((s: number, r: any) => s + (r.qty || 0), 0)
  const adjustCount = data.filter((r: any) => isAdjust(r.type)).length

  const tabs = ['All', 'IN', 'OUT', 'Transfer', 'Adjust']

  function fmtDate(d: string) {
    if (!d) return '—'
    const dt = new Date(d)
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' ' + dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Stock Movements</h1>
          <div className="ph-sub">Inventory in/out log — last 200 records</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert('Record movement — use warehouse adjustment form')}
          >
            <i className="fa-solid fa-plus" /> Record Movement
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Today&apos;s Movements</div>
          <div className="kpi-val">{todayRows.length}</div>
          <div className="kpi-foot">transactions</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Units IN</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>{inUnits.toLocaleString()}</div>
          <div className="kpi-foot">received / returned</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Units OUT</div>
          <div className="kpi-val" style={{ color: 'var(--neg)' }}>{outUnits.toLocaleString()}</div>
          <div className="kpi-foot">sold / dispatched</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Adjustments</div>
          <div className="kpi-val" style={{ color: 'var(--warn)' }}>{adjustCount}</div>
          <div className="kpi-foot">manual corrections</div>
        </div>
      </div>

      <div className="tabs">
        {tabs.map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by product, SKU, reference, user…"
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
                <th>Time</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Type</th>
                <th className="ta-right">Qty</th>
                <th>From</th>
                <th>To</th>
                <th>Reference</th>
                <th>By</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ color: 'var(--muted)', marginBottom: 12 }}>
                      <i className="fa-solid fa-box-archive" style={{ fontSize: 32 }} />
                    </div>
                    <div className="fw-6">No movements found</div>
                    <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                      {data.length === 0 ? 'Record your first stock movement to get started' : 'Try adjusting your search or filters'}
                    </div>
                  </td>
                </tr>
              ) : filtered.map((r: any) => {
                const sign = isIn(r.type) ? '+' : isOut(r.type) ? '-' : ''
                const qtyColor = isIn(r.type) ? 'var(--pos)' : isOut(r.type) ? 'var(--neg)' : 'var(--warn)'
                return (
                  <tr key={r.id}>
                    <td className="muted" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{fmtDate(r.createdAt)}</td>
                    <td className="col-id">{r.product?.sku || '—'}</td>
                    <td>
                      <div className="cell-with-icon">
                        <span className="thumb" style={{ background: 'var(--accent-soft)' }}>
                          <i className="fa-solid fa-box" style={{ fontSize: 11 }} />
                        </span>
                        <span className="fw-6">{r.product?.name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`tag ${TYPE_COLORS[r.type] || 'info'}`}>
                        <i className={`fa-solid ${TYPE_ICONS[r.type] || 'fa-circle'}`} />
                        {r.type}
                      </span>
                    </td>
                    <td className="ta-right fw-6" style={{ color: qtyColor }}>
                      {sign}{Math.abs(r.qty || 0).toLocaleString()}
                      {r.product?.unit ? <span className="muted" style={{ fontSize: 11, marginLeft: 3 }}>{r.product.unit}</span> : null}
                    </td>
                    <td className="muted">{r.fromLocation || '—'}</td>
                    <td className="muted">{r.toLocation || '—'}</td>
                    <td className="col-id">{r.reference || '—'}</td>
                    <td className="muted">{r.user?.name || '—'}</td>
                    <td className="row-actions">
                      <button className="btn btn-ghost btn-sm" title="View details">
                        <i className="fa-solid fa-eye" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
            Showing {filtered.length} of {data.length} movements
          </div>
        )}
      </div>
    </div>
  )
}
