'use client'
import { useState } from 'react'
import { fmtMoney } from '@/lib/utils'

const DEBIT_NOTES = [
  { id: 'DN-V001', supplier: 'TechParts Global', initials: 'TG', grn: 'GRN-4401', reason: 'Short Shipment', date: '2025-05-05', status: 'open', amount: 840.00 },
  { id: 'DN-V002', supplier: 'SteelForge Ltd', initials: 'SF', grn: 'GRN-4388', reason: 'Damaged Goods', date: '2025-05-08', status: 'sent', amount: 2200.50 },
  { id: 'DN-V003', supplier: 'LogiSupply Co', initials: 'LS', grn: 'GRN-4412', reason: 'Wrong Item', date: '2025-05-11', status: 'applied', amount: 1100.00 },
  { id: 'DN-V004', supplier: 'Nordic Packaging', initials: 'NP', grn: 'GRN-4420', reason: 'Quality Rejection', date: '2025-05-14', status: 'open', amount: 3600.00 },
  { id: 'DN-V005', supplier: 'FastFreight AU', initials: 'FF', grn: 'GRN-4398', reason: 'Overcharge', date: '2025-05-16', status: 'sent', amount: 450.75 },
  { id: 'DN-V006', supplier: 'TechParts Global', initials: 'TG', grn: 'GRN-4435', reason: 'Short Shipment', date: '2025-05-20', status: 'open', amount: 680.00 },
  { id: 'DN-V007', supplier: 'GreenPack Supplies', initials: 'GP', grn: 'GRN-4441', reason: 'Expired Product', date: '2025-05-22', status: 'applied', amount: 960.25 },
  { id: 'DN-V008', supplier: 'SteelForge Ltd', initials: 'SF', grn: 'GRN-4450', reason: 'Damaged Goods', date: '2025-05-26', status: 'open', amount: 1880.00 },
]

const REASON_COLOR: Record<string, string> = {
  'Short Shipment': 'warn',
  'Damaged Goods': 'neg',
  'Wrong Item': 'neg',
  'Quality Rejection': 'neg',
  'Overcharge': 'warn',
  'Expired Product': 'neg',
}
const STATUS_COLOR: Record<string, string> = {
  open: 'warn',
  sent: 'info',
  applied: 'pos',
}

const AVATAR_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6']
const supplierColors: Record<string, string> = {}
DEBIT_NOTES.forEach((r, i) => { if (!supplierColors[r.supplier]) supplierColors[r.supplier] = AVATAR_COLORS[Object.keys(supplierColors).length % AVATAR_COLORS.length] })

export default function VendorDebitNotesClient() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const filtered = DEBIT_NOTES.filter(r => {
    if (tab !== 'All' && r.status !== tab.toLowerCase()) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const open = DEBIT_NOTES.filter(r => r.status === 'open').length
  const sent = DEBIT_NOTES.filter(r => r.status === 'sent').length
  const recoveredMTD = DEBIT_NOTES.filter(r => r.status === 'applied').reduce((s, r) => s + r.amount, 0)
  const avgRecovery = 12

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Vendor Debit Notes</h1>
          <div className="ph-sub">Claims raised against suppliers for short/damaged deliveries</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert('Create debit note from a GRN discrepancy')}
          >
            <i className="fa-solid fa-plus" /> New Debit Note
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Open Debit Notes</div>
          <div className="kpi-val" style={{ color: open > 0 ? 'var(--warn)' : undefined }}>{open}</div>
          <div className="kpi-foot">unresolved</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Pending Supplier</div>
          <div className="kpi-val">{sent}</div>
          <div className="kpi-foot">awaiting response</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Recovered MTD</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>{fmtMoney(recoveredMTD, 2)}</div>
          <div className="kpi-foot">credit applied</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Avg Recovery</div>
          <div className="kpi-val">{avgRecovery} days</div>
          <div className="kpi-foot">time to settle</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Open', 'Sent', 'Applied'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by DN #, supplier, GRN…"
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
                <th>Supplier</th>
                <th>Source GRN</th>
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
                          background: supplierColors[r.supplier],
                          color: '#fff', fontWeight: 700, fontSize: 11,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {r.initials}
                      </span>
                      <span className="fw-6">{r.supplier}</span>
                    </div>
                  </td>
                  <td className="col-id">{r.grn}</td>
                  <td><span className={`tag ${REASON_COLOR[r.reason] || 'warn'}`}>{r.reason}</span></td>
                  <td className="muted">{r.date}</td>
                  <td><span className={`pill ${STATUS_COLOR[r.status] || 'info'}`}>{r.status}</span></td>
                  <td className="ta-right fw-6">{fmtMoney(r.amount, 2)}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" title="View">
                      <i className="fa-solid fa-eye" />
                    </button>
                    {r.status === 'open' && (
                      <button className="btn btn-sm btn-primary" title="Send to supplier">
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
