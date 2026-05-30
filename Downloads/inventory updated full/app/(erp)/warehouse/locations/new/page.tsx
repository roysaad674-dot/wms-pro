'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLocationPage() {
  const router = useRouter()
  const [kind, setKind] = useState('Bin')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSubmit() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => router.push('/warehouse/locations'), 1200) }, 700)
  }

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/warehouse/locations')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to locations
          </button>
          <h1>New location</h1>
          <div className="ph-sub">A new warehouse, zone or bin — the physical address stock lives at</div>
        </div>
        <div className="ph-actions">
          <button className="btn" disabled={saving}><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn" disabled={saving}><i className="fa-solid fa-print" /> Print sign</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Creating…</> : <><i className="fa-solid fa-check" /> Create location</>}
          </button>
        </div>
      </div>

      {saved && (
        <div className="banner" style={{ marginBottom: 16, background: 'var(--c-pos-soft)', color: 'var(--c-pos)', borderColor: 'color-mix(in oklch, var(--c-pos) 30%, transparent)' }}>
          <i className="fa-solid fa-circle-check" /> Location created — redirecting…
        </div>
      )}

      <div className="col gap-4">
        {/* Type */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Type</div>
          <div className="field">
            <label>Location type <span style={{ color: 'var(--c-neg)' }}>*</span></label>
            <div className="seg" style={{ width: '100%' }}>
              {['Warehouse', 'Zone', 'Aisle', 'Bin', 'Yard', 'Returns', 'Quarantine'].map(t => (
                <button key={t} className={kind === t ? 'is-active' : ''} onClick={() => setKind(t)} style={{ flex: 1 }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>Identity</div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>Code <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <input className="input mono" placeholder={kind === 'Warehouse' ? 'WH-C' : kind === 'Zone' ? 'A-Z03' : 'A-12-3'} />
              <div className="t-xs muted mt-1">Scannable identifier. Bins use parent-aisle-position.</div>
            </div>
            <div className="field">
              <label>Name <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <input className="input" placeholder={kind + ' name'} />
            </div>
            <div className="field">
              <label>Parent</label>
              <select className="select">
                {kind === 'Warehouse' && <option>—</option>}
                {kind === 'Zone' && (<><option>Warehouse A</option><option>Warehouse B</option><option>Yard</option></>)}
                {(kind === 'Bin' || kind === 'Aisle') && (<><option>Zone A — Fasteners (WH-A)</option><option>Zone B — Plumbing (WH-A)</option><option>Zone C — Electrical (WH-B)</option></>)}
                {(kind === 'Returns' || kind === 'Quarantine') && (<><option>Warehouse A</option><option>Warehouse B</option></>)}
                {kind === 'Yard' && <option>—</option>}
              </select>
              <div className="t-xs muted mt-1">Bins live inside Zones, Zones inside Warehouses.</div>
            </div>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label>Address {kind === 'Warehouse' ? <span style={{ color: 'var(--c-neg)' }}>*</span> : <span className="muted">(if warehouse)</span>}</label>
              <textarea className="input" rows={2} placeholder={'Street\nCity, State ZIP'} />
            </div>
          </div>
        </div>

        {/* Physical */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>Physical</div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>Capacity <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <div className="row gap-2">
                <input className="input mono" defaultValue="4" style={{ flex: 1 }} />
                <select className="select" style={{ maxWidth: 120 }}>
                  <option>pallets</option><option>bins</option><option>m³</option><option>kg</option>
                </select>
              </div>
              <div className="t-xs muted mt-1">In whichever unit fits.</div>
            </div>
            <div className="field">
              <label>Dimensions (L×W×H)</label>
              <input className="input mono" placeholder="120 × 80 × 200 cm" />
            </div>
            <div className="field">
              <label>Weight limit</label>
              <div className="row gap-2">
                <input className="input mono" placeholder="500" style={{ flex: 1 }} />
                <span className="muted">kg</span>
              </div>
            </div>
            <div className="field">
              <label>Pick face?</label>
              <label className="row gap-2 t-sm">
                <input type="checkbox" defaultChecked /> Pickers can pick directly from this bin (vs bulk-only)
              </label>
            </div>
          </div>
        </div>

        {/* Restrictions */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Restrictions</div>
          <div className="col gap-2 t-sm">
            <label className="row gap-2"><input type="checkbox" /> Hazmat — restricted access</label>
            <label className="row gap-2"><input type="checkbox" /> Cold storage (≤ 8°C)</label>
            <label className="row gap-2"><input type="checkbox" /> Heavy items only (forklift required)</label>
            <label className="row gap-2"><input type="checkbox" /> Quarantine — no transactions until QA passes</label>
            <label className="row gap-2"><input type="checkbox" /> Damaged goods holding</label>
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={() => router.push('/warehouse/locations')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Creating…' : 'Create location'}
          </button>
        </div>
      </div>
    </div>
  )
}
