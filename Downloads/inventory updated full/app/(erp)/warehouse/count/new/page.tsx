'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StartCountPage() {
  const router = useRouter()
  const [type, setType] = useState('cycle')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const skuCount = type === 'cycle' ? 142 : type === 'spot' ? 1 : type === 'audit' ? 128 : 1284
  const binCount = type === 'cycle' ? 84 : type === 'spot' ? 1 : type === 'audit' ? 78 : 624
  const estTime  = type === 'cycle' ? '4 h' : type === 'spot' ? '10 min' : type === 'audit' ? '6 h' : '32 h'

  function handleSubmit() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => router.push('/warehouse/count'), 1200) }, 700)
  }

  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/warehouse/count')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to stock counts
          </button>
          <h1>Start stock count</h1>
          <div className="ph-sub">Generate a count sheet, hand to the warehouse team, and reconcile variances on close</div>
        </div>
        <div className="ph-actions">
          <button className="btn" disabled={saving}><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Starting…</> : <><i className="fa-solid fa-play" /> Generate &amp; start</>}
          </button>
        </div>
      </div>

      {saved && (
        <div className="banner" style={{ marginBottom: 16, background: 'var(--c-pos-soft)', color: 'var(--c-pos)', borderColor: 'color-mix(in oklch, var(--c-pos) 30%, transparent)' }}>
          <i className="fa-solid fa-circle-check" /> Stock count started — count sheet sent to mobile app — redirecting…
        </div>
      )}

      <div className="col gap-4">
        {/* Count type */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Count type</div>
          <div className="field">
            <label>Scope <span style={{ color: 'var(--c-neg)' }}>*</span></label>
            <div className="row gap-3" style={{ flexWrap: 'wrap', marginTop: 6 }}>
              {[
                { id: 'cycle',  label: 'Cycle count',    desc: 'A slice of SKUs — fast, recurring' },
                { id: 'spot',   label: 'Spot check',     desc: 'A single SKU or bin you suspect' },
                { id: 'full',   label: 'Full count',     desc: 'Everything. Usually year-end. Freezes the warehouse.' },
                { id: 'audit',  label: 'Auditor count',  desc: 'External sample — locks SKUs once started' },
              ].map(t => (
                <div key={t.id} onClick={() => setType(t.id)} style={{
                  flex: 1, minWidth: 200, padding: 14, borderRadius: 8, cursor: 'pointer',
                  border: '1.5px solid ' + (type === t.id ? 'var(--brand)' : 'var(--line)'),
                  background: type === t.id ? 'var(--brand-soft)' : 'var(--card)',
                }}>
                  <div className="row gap-2">
                    <i className={`fa-solid ${type === t.id ? 'fa-circle-dot' : 'fa-circle'}`} style={{ color: type === t.id ? 'var(--brand)' : 'var(--text-3)' }} />
                    <span className="fw-6">{t.label}</span>
                  </div>
                  <div className="t-xs muted mt-2">{t.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What to count */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>What to count</div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>Warehouse <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <select className="select">
                <option>Warehouse A</option><option>Warehouse B</option><option>Yard</option><option>All warehouses</option>
              </select>
            </div>
            <div className="field">
              <label>{type === 'spot' ? 'SKU or bin' : 'Zone / category'}</label>
              <select className="select">
                {type === 'cycle' && (<><option>Zone A — Fasteners (124 SKUs)</option><option>Zone B — Plumbing (96)</option><option>Zone C — Electrical (218)</option><option>Zone F — Tools (96)</option></>)}
                {type === 'spot'  && (<><option>Single SKU…</option><option>Single bin…</option></>)}
                {type === 'full'  && (<option>Entire warehouse (1,284 SKUs)</option>)}
                {type === 'audit' && (<><option>Random 10% sample</option><option>Auditor-selected sample</option></>)}
              </select>
            </div>
            <div className="field">
              <label>Strategy</label>
              <select className="select">
                <option>ABC — A items every 30d, B every 90d, C every 365d</option>
                <option>Highest-value SKUs first</option>
                <option>Random sampling</option>
                <option>Recently moved only</option>
              </select>
              <div className="t-xs muted mt-1">Cycle counts use ABC velocity by default.</div>
            </div>
            <div className="field">
              <label>Counters</label>
              <select className="select">
                <option>Two-person blind count</option><option>Single counter</option><option>Auto-assign from team</option>
              </select>
              <div className="t-xs muted mt-1">Two-person blind count gives best accuracy.</div>
            </div>
            <div className="field">
              <label>Start <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <input className="input" type="datetime-local" defaultValue="2026-05-26T18:00" />
            </div>
            <div className="field">
              <label>Target close</label>
              <input className="input" type="datetime-local" defaultValue="2026-05-27T08:00" />
              <div className="t-xs muted mt-1">{type === 'full' ? 'Warehouse is read-only until close.' : 'Soft target — extend if needed.'}</div>
            </div>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label>Freeze stock?</label>
              <div className="seg" style={{ width: 'fit-content' }}>
                <button className={type !== 'full' ? 'is-active' : ''}>No — keep transacting</button>
                <button className={type === 'full' ? 'is-active' : ''}>Yes — freeze (writes only on close)</button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>Preview</div>
          <div className="grid-3" style={{ gap: 14, marginBottom: 16 }}>
            <div className="kpi">
              <div className="kpi-lbl">SKUs in this count</div>
              <div className="kpi-val">{skuCount}</div>
              <div className="kpi-foot"><span className="muted">{type === 'cycle' ? 'Zone A' : type === 'full' ? 'whole warehouse' : '—'}</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-lbl">Bins to visit</div>
              <div className="kpi-val">{binCount}</div>
              <div className="kpi-foot"><span className="muted">walk-path optimised</span></div>
            </div>
            <div className="kpi">
              <div className="kpi-lbl">Est. time</div>
              <div className="kpi-val">{estTime}</div>
              <div className="kpi-foot"><span className="muted">two counters</span></div>
            </div>
          </div>
          <div className="banner" style={{ background: 'color-mix(in oklch, var(--c-info) 10%, transparent)', color: 'var(--c-info)', borderColor: 'color-mix(in oklch, var(--c-info) 30%, transparent)' }}>
            <i className="fa-solid fa-mobile-screen-button" />
            <div className="t-sm">Counters will see this sheet on the warehouse mobile app — scan barcode, key qty, next bin. Variances surface on close for adjustment.</div>
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={() => router.push('/warehouse/count')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Starting…' : 'Generate & start'}
          </button>
        </div>
      </div>
    </div>
  )
}
