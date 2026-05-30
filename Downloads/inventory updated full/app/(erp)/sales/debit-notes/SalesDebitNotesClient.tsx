'use client'
import { useState } from 'react'
import { fmtMoney } from '@/lib/utils'

const SALES_DN = [
  { id: 'SDN-001', customer: 'Apex Retail', initials: 'AR', order: 'SO-7701', reason: 'Price Adjustment', date: '2025-05-06', status: 'open', amount: 520.00 },
  { id: 'SDN-002', customer: 'BlueStar Trading', initials: 'BS', order: 'SO-7714', reason: 'Late Delivery Fee', date: '2025-05-09', status: 'accepted', amount: 300.00 },
  { id: 'SDN-003', customer: 'Crown Distribution', initials: 'CD', order: 'SO-7722', reason: 'Returns Restocking', date: '2025-05-12', status: 'disputed', amount: 1450.00 },
  { id: 'SDN-004', customer: 'Delta Wholesale', initials: 'DW', order: 'SO-7735', reason: 'Price Adjustment', date: '2025-05-15', status: 'open', amount: 880.75 },
  { id: 'SDN-005', customer: 'Eastline Group', initials: 'EG', order: 'SO-7748', reason: 'Damages Claim', date: '2025-05-17', status: 'applied', amount: 640.50 },
  { id: 'SDN-006', customer: 'Apex Retail', initials: 'AR', order: 'SO-7760', reason: 'Late Delivery Fee', date: '2025-05-21', status: 'open', amount: 250.00 },
  { id: 'SDN-007', customer: 'Fernhill Stores', initials: 'FS', order: 'SO-7772', reason: 'Contract Penalty', date: '2025-05-24', status: 'accepted', amount: 2100.00 },
  { id: 'SDN-008', customer: 'BlueStar Trading', initials: 'BS', order: 'SO-7785', reason: 'Returns Restocking', date: '2025-05-27', status: 'disputed', amount: 760.00 },
]

const REASON_COLOR: Record<string, string> = {
  'Price Adjustment': 'info',
  'Late Delivery Fee': 'warn',
  'Returns Restocking': 'warn',
  'Damages Claim': 'neg',
  'Contract Penalty': 'neg',
}
const STATUS_COLOR: Record<string, string> = {
  open: 'warn',
  accepted: 'pos',
  disputed: 'neg',
  applied: 'info',
}

const AVATAR_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6']
const customerColors: Record<string, string> = {}
SALES_DN.forEach(r => { if (!customerColors[r.customer]) customerColors[r.customer] = AVATAR_COLORS[Object.keys(customerColors).length % AVATAR_COLORS.length] })

export default function SalesDebitNotesClient() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const filtered = SALES_DN.filter(r => {
    if (tab !== 'All' && r.status !== tab.toLowerCase()) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const open = SALES_DN.filter(r => r.status === 'open').length
  const pending = SALES_DN.filter(r => r.status === 'accepted').length
  const appliedMTD = SALES_DN.filter(r => r.status === 'applied').reduce((s, r) => s + r.amount, 0)
  const disputes = SALES_DN.filter(r => r.status === 'disputed').length

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Customer Debit Notes</h1>
          <div className="ph-sub">Charges and adjustments issued to customers</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert('Issue debit note to customer')}
          >
            <i className="fa-solid fa-plus" /> Issue Debit Note
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Open</div>
          <div className="kpi-val" style={{ color: open > 0 ? 'var(--warn)' : undefined }}>{open}</div>
          <div className="kpi-foot">awaiting acceptance</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Pending Acceptance</div>
          <div className="kpi-val">{pending}</div>
          <div className="kpi-foot">accepted, not applied</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Applied MTD</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>{fmtMoney(appliedMTD, 2)}</div>
          <div className="kpi-foot">posted to accounts</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Disputes</div>
          <div className="kpi-val" style={{ color: disputes > 0 ? 'var(--neg)' : undefined }}>{disputes}</div>
          <div className="kpi-foot">contested by customer</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Open', 'Accepted', 'Applied', 'Disputed'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by DN #, customer, order…"
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
                <th>DN #</th>
                <th>Customer</th>
                <th>Source Order</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th className="ta-right">Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="col-id fw-6">{r.id}</td>
                  <td>
                    <div className="cell-with-icon">
                      <span
                        className="thumb"
                        style={{
                          background: customerColors[r.customer],
                          color: '#fff', fontWeight: 700, fontSize: 11,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {r.initials}
                      </span>
                      <span className="fw-6">{r.customer}</span>
                    </div>
                  </td>
                  <td className="col-id">{r.order}</td>
                  <td><span className={`tag ${REASON_COLOR[r.reason] || 'info'}`}>{r.reason}</span></td>
                  <td className="muted">{r.date}</td>
                  <td><span className={`pill ${STATUS_COLOR[r.status] || 'info'}`}>{r.status}</span></td>
                  <td className="ta-right fw-6">{fmtMoney(r.amount, 2)}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" title="View">
                      <i className="fa-solid fa-eye" />
                    </button>
                    {r.status === 'open' && (
                      <button className="btn btn-sm btn-primary" title="Send to customer">
                        <i className="fa-solid fa-paper-plane" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
          {filtered.length} debit note{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
          Total: <strong>{fmtMoney(filtered.reduce((s, r) => s + r.amount, 0), 2)}</strong>
        </div>
      </div>
    </div>
  )
}
