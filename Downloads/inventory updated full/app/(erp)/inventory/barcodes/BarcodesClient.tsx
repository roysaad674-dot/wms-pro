'use client'
import { useState } from 'react'

const BARCODES = [
  { id: 1, sku: 'EL-0047', product: 'USB-C Power Adapter 65W', barcode: '5901234123457', format: 'EAN-13', location: 'Zone A / Bin 04', inQueue: false },
  { id: 2, sku: 'EL-0048', product: 'HDMI Cable 2m', barcode: '4006381333931', format: 'EAN-13', location: 'Zone A / Bin 05', inQueue: true },
  { id: 3, sku: 'CL-0012', product: 'Safety Gloves L', barcode: 'SG-CL0012-L', format: 'CODE-128', location: 'Zone B / Shelf 2', inQueue: false },
  { id: 4, sku: 'ST-0091', product: 'Steel Bracket 50mm', barcode: 'STL-0091-50MM', format: 'CODE-128', location: 'Zone C / Rack 3', inQueue: true },
  { id: 5, sku: 'ST-0092', product: 'Steel Bracket 75mm', barcode: 'STL-0092-75MM', format: 'CODE-128', location: 'Zone C / Rack 3', inQueue: true },
  { id: 6, sku: 'PK-0033', product: 'Bubble Wrap Roll 50m', barcode: null, format: null, location: 'Receiving Bay', inQueue: false },
  { id: 7, sku: 'FD-0019', product: 'Cardboard Box A3', barcode: null, format: null, location: 'Packing Area', inQueue: false },
  { id: 8, sku: 'EL-0051', product: 'Wireless Mouse', barcode: '4894862050102', format: 'EAN-13', location: 'Zone A / Bin 08', inQueue: false },
  { id: 9, sku: 'EL-0052', product: 'Mechanical Keyboard TKL', barcode: '195553193474', format: 'EAN-13', location: 'Zone A / Bin 09', inQueue: true },
  { id: 10, sku: 'LG-0007', product: 'Industrial Label Tape 24mm', barcode: 'LBL-LG007-24', format: 'QR', location: 'Stationery Store', inQueue: false },
]

const FORMAT_COLOR: Record<string, string> = {
  'EAN-13': 'info',
  'CODE-128': 'pos',
  'QR': 'warn',
}

export default function BarcodesClient() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')

  const filtered = BARCODES.filter(r => {
    if (tab === 'Missing barcode' && r.barcode !== null) return false
    if (tab === 'Print queue' && !r.inQueue) return false
    if (!q) return true
    return JSON.stringify(r).toLowerCase().includes(q.toLowerCase())
  })

  const withBarcode = BARCODES.filter(r => r.barcode).length
  const withoutBarcode = BARCODES.filter(r => !r.barcode).length
  const printQueue = BARCODES.filter(r => r.inQueue).length
  const printedToday = 6

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Barcodes</h1>
          <div className="ph-sub">Product barcode registry and label printing</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-download" /> Export
          </button>
          <button
            className="btn btn-primary"
            onClick={() => alert('Select items and click Print')}
          >
            <i className="fa-solid fa-print" /> Print Labels
          </button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-lbl">Products with Barcode</div>
          <div className="kpi-val" style={{ color: 'var(--pos)' }}>{withBarcode}</div>
          <div className="kpi-foot">have codes assigned</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Without Barcode</div>
          <div className="kpi-val" style={{ color: withoutBarcode > 0 ? 'var(--warn)' : undefined }}>{withoutBarcode}</div>
          <div className="kpi-foot">need assignment</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Print Queue</div>
          <div className="kpi-val" style={{ color: printQueue > 0 ? 'var(--accent)' : undefined }}>{printQueue}</div>
          <div className="kpi-foot">labels queued</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Printed Today</div>
          <div className="kpi-val">{printedToday}</div>
          <div className="kpi-foot">labels printed</div>
        </div>
      </div>

      <div className="tabs">
        {['All', 'Missing barcode', 'Print queue'].map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            placeholder="Search by SKU, product, barcode…"
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
                <th>SKU</th>
                <th>Product</th>
                <th>Barcode Value</th>
                <th>Format</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td className="col-id">{r.sku}</td>
                  <td>
                    <div className="cell-with-icon">
                      <span className="thumb" style={{ background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-box" style={{ fontSize: 11 }} />
                      </span>
                      <div>
                        <div className="fw-6">{r.product}</div>
                        {r.inQueue && (
                          <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 1 }}>
                            <i className="fa-solid fa-print" style={{ marginRight: 3 }} />in print queue
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {r.barcode
                      ? <code style={{ background: 'var(--border)', borderRadius: 4, padding: '2px 7px', fontSize: 12 }}>{r.barcode}</code>
                      : <span className="pill warn">No barcode</span>
                    }
                  </td>
                  <td>
                    {r.format
                      ? <span className={`tag ${FORMAT_COLOR[r.format] || 'info'}`}>{r.format}</span>
                      : <span className="muted">—</span>
                    }
                  </td>
                  <td className="muted">{r.location}</td>
                  <td className="row-actions">
                    {r.barcode ? (
                      <>
                        <button
                          className="btn btn-ghost btn-sm"
                          title="Print label"
                          onClick={() => alert(`Print label for ${r.sku}`)}
                        >
                          <i className="fa-solid fa-print" />
                        </button>
                        <button className="btn btn-ghost btn-sm" title="Edit barcode">
                          <i className="fa-solid fa-pen" />
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-sm btn-primary" title="Assign barcode">
                        <i className="fa-solid fa-barcode" /> Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
