'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LEAVE_DATA = [
  { id: 'LV-001', employee: 'Alice Nguyen', initials: 'AN', dept: 'Warehouse', type: 'Annual', from: '2025-06-02', to: '2025-06-06', days: 5, reason: 'Family holiday', status: 'pending' },
  { id: 'LV-002', employee: 'Ben Okafor', initials: 'BO', dept: 'Logistics', type: 'Sick', from: '2025-05-29', to: '2025-05-30', days: 2, reason: 'Medical appointment', status: 'approved' },
  { id: 'LV-003', employee: 'Cara Lee', initials: 'CL', dept: 'Sales', type: 'Annual', from: '2025-06-16', to: '2025-06-27', days: 10, reason: 'Pre-planned vacation', status: 'approved' },
  { id: 'LV-004', employee: 'David Kim', initials: 'DK', dept: 'Purchasing', type: 'Personal', from: '2025-06-03', to: '2025-06-03', days: 1, reason: 'Moving house', status: 'pending' },
  { id: 'LV-005', employee: 'Elena Rossi', initials: 'ER', dept: 'Admin', type: 'Maternity', from: '2025-07-01', to: '2025-09-26', days: 90, reason: 'Maternity leave', status: 'approved' },
  { id: 'LV-006', employee: 'Frank Müller', initials: 'FM', dept: 'IT', type: 'Sick', from: '2025-05-28', to: '2025-05-28', days: 1, reason: 'Flu', status: 'rejected' },
  { id: 'LV-007', employee: 'Grace Park', initials: 'GP', dept: 'Warehouse', type: 'Compensatory', from: '2025-06-09', to: '2025-06-10', days: 2, reason: 'OT from last month', status: 'pending' },
  { id: 'LV-008', employee: 'Hiro Tanaka', initials: 'HT', dept: 'Operations', type: 'Annual', from: '2025-04-14', to: '2025-04-18', days: 5, reason: 'Easter break', status: 'approved' },
]

const TYPE_COLOR: Record<string, string> = {
  Annual: 'info',
  Sick: 'neg',
  Maternity: 'purple',
  Personal: 'warn',
  Compensatory: 'pos',
  Paternity: 'info',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'warn',
  approved: 'pos',
  rejected: 'neg',
}

const AVATAR_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#14b8a6']

export default function LeaveClient() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const today = '2025-05-30'

  const filtered = LEAVE_DATA.filter(r => {
    if (tab === 'Pending' && r.status !== 'pending') return false
    if (tab === 'Upcoming' && (r.status !== 'approved' || r.from <= today)) return false
    if (tab === 'History' && r.to >= today) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const pending = LEAVE_DATA.filter(r => r.status === 'pending').length
  const onLeaveToday = LEAVE_DATA.filter(r => r.status === 'approved' && r.from <= today && r.to >= today).length
  const avgBalance = 12.5

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Leave Tracker</h1>
          <div className="ph-sub">Employee leave requests and approvals</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button className="btn btn-primary" onClick={() => router.push('/employees/leave/new')}>
            <i className="fa-solid fa-plus" /> New Request
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Pending Requests</div>
          <div className="kpi-val" style={{ color: pending > 0 ? 'var(--warn)' : undefined }}>{pending}</div>
          <div className="kpi-foot">awaiting approval</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">On Leave Today</div>
          <div className="kpi-val">{onLeaveToday}</div>
          <div className="kpi-foot">staff absent</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Avg Balance</div>
          <div className="kpi-val">{avgBalance}</div>
          <div className="kpi-foot">days remaining</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Coverage Gaps</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>0</div>
          <div className="kpi-foot">critical roles covered</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Pending', 'Upcoming', 'History'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by employee, department, type…"
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
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th className="ta-right">Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <div className="cell-with-icon">
                      <span
                        className="thumb"
                        style={{
                          background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: 11,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        {r.initials}
                      </span>
                      <div>
                        <div className="fw-6">{r.employee}</div>
                        <div className="muted" style={{ fontSize: 12 }}>{r.dept}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`tag ${TYPE_COLOR[r.type] || 'info'}`}>{r.type}</span></td>
                  <td>{r.from}</td>
                  <td>{r.to}</td>
                  <td className="ta-right fw-6">{r.days}</td>
                  <td className="muted">{r.reason}</td>
                  <td>
                    <span className={`pill ${STATUS_COLOR[r.status] || 'info'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="row-actions">
                    {r.status === 'pending' && (
                      <>
                        <button className="btn btn-sm" style={{ color: 'var(--pos)', borderColor: 'var(--pos)' }} title="Approve">
                          <i className="fa-solid fa-check" />
                        </button>
                        <button className="btn btn-sm" style={{ color: 'var(--neg)', borderColor: 'var(--neg)' }} title="Reject">
                          <i className="fa-solid fa-xmark" />
                        </button>
                      </>
                    )}
                    <button className="btn btn-ghost btn-sm" title="View">
                      <i className="fa-solid fa-eye" />
                    </button>
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
