'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RequestLeavePage() {
  const router = useRouter()
  const [type,   setType]   = useState('PTO')
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  function handleSubmit() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => router.push('/employees'), 1200) }, 700)
  }

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/employees')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to employees
          </button>
          <h1>Request time off</h1>
          <div className="ph-sub">Submit for manager approval — coverage and conflicts are checked automatically</div>
        </div>
        <div className="ph-actions">
          <button className="btn" disabled={saving}><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Submitting…</> : <><i className="fa-solid fa-paper-plane" /> Submit request</>}
          </button>
        </div>
      </div>

      {saved && (
        <div className="banner" style={{ marginBottom: 16, background: 'var(--c-pos-soft)', color: 'var(--c-pos)', borderColor: 'color-mix(in oklch, var(--c-pos) 30%, transparent)' }}>
          <i className="fa-solid fa-circle-check" /> Leave request submitted — manager notified — redirecting…
        </div>
      )}

      <div className="col gap-4">
        {/* Type */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Type</div>
          <div className="field">
            <label>Leave type <span style={{ color: 'var(--c-neg)' }}>*</span></label>
            <div className="seg" style={{ width: '100%', flexWrap: 'wrap' }}>
              {['PTO','Sick','Parental','Bereavement','Jury duty','Unpaid'].map(t => (
                <button key={t} className={type === t ? 'is-active' : ''} onClick={() => setType(t)} style={{ flex: 1, minWidth: 100 }}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>Dates</div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>From <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <input className="input" type="date" defaultValue="2026-06-03" />
            </div>
            <div className="field">
              <label>To <span style={{ color: 'var(--c-neg)' }}>*</span></label>
              <input className="input" type="date" defaultValue="2026-06-07" />
            </div>
            <div className="field">
              <label>Half-day?</label>
              <div className="seg" style={{ width: '100%' }}>
                <button className="is-active" style={{ flex: 1 }}>Full days</button>
                <button style={{ flex: 1 }}>Half — AM</button>
                <button style={{ flex: 1 }}>Half — PM</button>
              </div>
            </div>
            <div className="field">
              <label>Total</label>
              <input className="input mono fw-7" defaultValue="5 days · 40 h" readOnly style={{ flex: 1 }} />
            </div>
            <div className="field" style={{ gridColumn: 'span 2' }}>
              <label>Reason (optional)</label>
              <textarea className="input" rows={2} placeholder="Family vacation — visiting Yellowstone." />
            </div>
          </div>
        </div>

        {/* Balance & coverage */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>Balance &amp; coverage</div>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="field">
              <label>{type} balance</label>
              <input className="input mono fw-7" defaultValue="64 h available" readOnly />
              <div className="bar mt-2"><span style={{ width: '62%', background: 'var(--c-pos)' }} /></div>
              <div className="t-xs muted mt-1">After this request: 24 h remaining (38%)</div>
            </div>
            <div className="field">
              <label>Coverage check</label>
              <div className="col gap-1 t-sm" style={{ padding: 10, background: 'var(--c-pos-soft)', borderRadius: 6, color: 'var(--c-pos)' }}>
                <div className="fw-6"><i className="fa-solid fa-circle-check" /> No coverage gaps</div>
                <div className="t-xs">No one else off Jun 3–7. Your shifts will be covered by Noah Becker.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Routing */}
        <div className="card card-pad">
          <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Routing</div>
          <div className="col gap-3 t-sm">
            <div className="row gap-2">
              <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--c-info)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>LC</div>
              <div style={{ flex: 1 }}><div className="fw-6">Liam Chen</div><div className="t-xs muted">requester</div></div>
            </div>
            <div className="row gap-2">
              <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--c-warn)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>MR</div>
              <div style={{ flex: 1 }}><div className="fw-6">Maria Rodriguez</div><div className="t-xs muted">your manager · will receive an email</div></div>
              <span className="pill muted">awaits</span>
            </div>
            <label className="row gap-2"><input type="checkbox" defaultChecked /> Add to team calendar</label>
            <label className="row gap-2"><input type="checkbox" /> Set out-of-office auto-reply</label>
          </div>
        </div>

        <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn" onClick={() => router.push('/employees')}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      </div>
    </div>
  )
}
