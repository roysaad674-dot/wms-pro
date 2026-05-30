'use client'
import { useState } from 'react'
import { fmtMoney } from '@/lib/utils'

const INVOICES = [
  { id: 'INV-2501', supplier: 'TechParts Global', initials: 'TG', po: 'PO-8821', invoiceDate: '2025-05-10', dueDate: '2025-06-09', status: 'matched', amount: 14820.00 },
  { id: 'INV-2502', supplier: 'SteelForge Ltd', initials: 'SF', po: 'PO-8834', invoiceDate: '2025-05-14', dueDate: '2025-06-13', status: 'awaiting_match', amount: 6440.50 },
  { id: 'INV-2503', supplier: 'LogiSupply Co', initials: 'LS', po: 'PO-8798', invoiceDate: '2025-05-15', dueDate: '2025-06-14', status: 'ready', amount: 3200.00 },
  { id: 'INV-2504', supplier: 'Nordic Packaging', initials: 'NP', po: 'PO-8845', invoiceDate: '2025-05-17', dueDate: '2025-06-16', status: 'awaiting_match', amount: 9100.75 },
  { id: 'INV-2505', supplier: 'FastFreight AU', initials: 'FF', po: 'PO-8802', invoiceDate: '2025-05-18', dueDate: '2025-06-17', status: 'disputed', amount: 2780.00 },
  { id: 'INV-2506', supplier: 'TechParts Global', initials: 'TG', po: 'PO-8856', invoiceDate: '2025-05-20', dueDate: '2025-06-19', status: 'ocr_queue', amount: 5600.00 },
  { id: 'INV-2507', supplier: 'SteelForge Ltd', initials: 'SF', po: 'PO-8811', invoiceDate: '2025-05-22', dueDate: '2025-06-21', status: 'paid', amount: 18300.00 },
  { id: 'INV-2508', supplier: 'GreenPack Supplies', initials: 'GP', po: 'PO-8869', invoiceDate: '2025-05-25', dueDate: '2025-06-24', status: 'ready', amount: 4150.25 },
  { id: 'INV-2509', supplier: 'LogiSupply Co', initials: 'LS', po: 'PO-8877', invoiceDate: '2025-05-28', dueDate: '2025-06-27', status: 'awaiting_match', amount: 7620.00 },
]

const STATUS_COLOR: Record<string, string> = {
  pending: 'warn',
  awaiting_match: 'warn',
  ready: 'pos',
  matched: 'pos',
  disputed: 'neg',
  paid: 'info',
  ocr_queue: 'muted',
}
const STATUS_LABEL: Record<string, string> = {
  awaiting_match: 'Awaiting Match',
  ready: 'Ready to Bill',
  matched: 'Matched',
  disputed: 'Disputed',
  paid: 'Paid',
  ocr_queue: 'OCR Queue',
}

const AVATAR_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6']

export default function PurchaseInvoicesClient() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const filtered = INVOICES.filter(r => {
    if (tab === 'Awaiting match' && r.status !== 'awaiting_match') return false
    if (tab === 'Ready' && r.status !== 'ready') return false
    if (tab === 'Matched' && !['matched', 'paid'].includes(r.status)) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const awaitingMatch = INVOICES.filter(r => r.status === 'awaiting_match').length
  const ready = INVOICES.filter(r => r.status === 'ready').length
  const monthTotal = INVOICES.reduce((s, r) => s + r.amount, 0)
  const ocrQueue = INVOICES.filter(r => r.status === 'ocr_queue').length

  const supplierColors: Record<string, string> = {}
  INVOICES.forEach((r, i) => { if (!supplierColors[r.supplier]) supplierColors[r.supplier] = AVATAR_COLORS[Object.keys(supplierColors).length % AVATAR_COLORS.length] })

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Purchase Invoices</h1>
          <div className="ph-sub">Supplier invoices and 3-way matching</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert('Upload supplier invoice or enter manually')}
          >
            <i className="fa-solid fa-plus" /> New Invoice
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Awaiting Match</div>
          <div className="kpi-val" style={{ color: 'var(--warn)' }}>{awaitingMatch}</div>
          <div className="kpi-foot">need 3-way match</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Ready to Bill</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>{ready}</div>
          <div className="kpi-foot">approved for payment</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Total This Month</div>
          <div className="kpi-val" style={{ fontSize: 18 }}>{fmtMoney(monthTotal)}</div>
          <div className="kpi-foot">all invoices</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">OCR Queue</div>
          <div className="kpi-val">{ocrQueue}</div>
          <div className="kpi-foot">processing</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Awaiting match', 'Ready', 'Matched'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by invoice #, supplier, PO…"
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
                <th>Invoice #</th>
                <th>Supplier</th>
                <th>PO Ref</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
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
                  <td className="col-id">{r.po}</td>
                  <td className="muted">{r.invoiceDate}</td>
                  <td className="muted">{r.dueDate}</td>
                  <td>
                    <span className={`pill ${STATUS_COLOR[r.status] || 'info'}`}>
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </td>
                  <td className="ta-right fw-6">{fmtMoney(r.amount, 2)}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" title="View invoice">
                      <i className="fa-solid fa-eye" />
                    </button>
                    {r.status === 'awaiting_match' && (
                      <button className="btn btn-sm btn-primary" title="Match now">
                        <i className="fa-solid fa-link" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
          {filtered.length} invoice{filtered.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
          Total: <strong>{fmtMoney(filtered.reduce((s, r) => s + r.amount, 0), 2)}</strong>
        </div>
      </div>
    </div>
  )
}
