'use client'
import { useState } from 'react'

const UNITS = [
  { id: 1, name: 'Piece', symbol: 'pcs', type: 'Count', conversion: '1 pcs = 1 pcs (base)', products: 142, custom: false },
  { id: 2, name: 'Box', symbol: 'box', type: 'Count', conversion: '1 box = 12 pcs', products: 38, custom: false },
  { id: 3, name: 'Set', symbol: 'set', type: 'Count', conversion: '1 set = varies', products: 14, custom: false },
  { id: 4, name: 'Pallet', symbol: 'pallet', type: 'Count', conversion: '1 pallet = 40 boxes', products: 9, custom: false },
  { id: 5, name: 'Case', symbol: 'case', type: 'Count', conversion: '1 case = 24 pcs', products: 22, custom: false },
  { id: 6, name: 'Kilogram', symbol: 'kg', type: 'Weight', conversion: '1 kg = 1000 g', products: 31, custom: false },
  { id: 7, name: 'Gram', symbol: 'g', type: 'Weight', conversion: 'base weight unit', products: 7, custom: false },
  { id: 8, name: 'Litre', symbol: 'L', type: 'Volume', conversion: '1 L = 1000 mL', products: 18, custom: false },
  { id: 9, name: 'Millilitre', symbol: 'mL', type: 'Volume', conversion: 'base volume unit', products: 5, custom: false },
  { id: 10, name: 'Metre', symbol: 'm', type: 'Length', conversion: '1 m = 100 cm', products: 11, custom: false },
  { id: 11, name: 'Roll', symbol: 'roll', type: 'Length', conversion: '1 roll = 50 m', products: 8, custom: true },
  { id: 12, name: 'Bag', symbol: 'bag', type: 'Weight', conversion: '1 bag = 25 kg', products: 4, custom: true },
]

const TYPE_COLOR: Record<string, string> = {
  Count: 'info',
  Weight: 'warn',
  Volume: 'pos',
  Length: 'purple',
  Area: 'neg',
}

export default function UnitsClient() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const filtered = UNITS.filter(r => {
    if (tab !== 'All' && r.type !== tab) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const total = UNITS.length
  const mostUsed = [...UNITS].sort((a, b) => b.products - a.products)[0]
  const productsWithoutUnit = 3
  const customUnits = UNITS.filter(r => r.custom).length

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Units of Measure</h1>
          <div className="ph-sub">Define and manage measurement units for products</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert('Create custom unit of measure')}
          >
            <i className="fa-solid fa-plus" /> New Unit
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Total Units</div>
          <div className="kpi-val">{total}</div>
          <div className="kpi-foot">defined</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Most Used</div>
          <div className="kpi-val" style={{ fontSize: 18 }}>{mostUsed.symbol}</div>
          <div className="kpi-foot">{mostUsed.products} products</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Without Unit</div>
          <div className="kpi-val" style={{ color: productsWithoutUnit > 0 ? 'var(--warn)' : undefined }}>{productsWithoutUnit}</div>
          <div className="kpi-foot">products need unit</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Custom Units</div>
          <div className="kpi-val">{customUnits}</div>
          <div className="kpi-foot">user-defined</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Count', 'Weight', 'Volume', 'Length'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by unit name, symbol…"
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
                <th>Unit Name</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Conversion</th>
                <th className="ta-right">Products Using</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="cell-with-icon">
                      <span className="thumb" style={{ background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-ruler" style={{ fontSize: 11 }} />
                      </span>
                      <div>
                        <span className="fw-6">{r.name}</span>
                        {r.custom && <span className="chip" style={{ marginLeft: 6, fontSize: 10 }}>custom</span>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ background: 'var(--border)', borderRadius: 4, padding: '2px 7px', fontSize: 13, fontWeight: 600 }}>
                      {r.symbol}
                    </code>
                  </td>
                  <td><span className={`tag ${TYPE_COLOR[r.type] || 'info'}`}>{r.type}</span></td>
                  <td className="muted" style={{ fontSize: 13 }}>{r.conversion}</td>
                  <td className="ta-right fw-6 col-num">{r.products}</td>
                  <td className="row-actions">
                    <button className="btn btn-ghost btn-sm" title="Edit unit">
                      <i className="fa-solid fa-pen" />
                    </button>
                    {r.custom && (
                      <button className="btn btn-ghost btn-sm" title="Delete" style={{ color: 'var(--neg)' }}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
          {filtered.length} unit{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
