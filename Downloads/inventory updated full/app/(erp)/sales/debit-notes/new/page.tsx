'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { fmtMoney } from '@/lib/utils'

type Line = { sku: string; desc: string; qty: number; price: number; tax: number }

export default function NewDebitNotePage() {
  const router = useRouter()
  const [lines,  setLines]  = useState<Line[]>([{ sku: 'PVC-CPL-2', desc: 'PVC coupling 2" — damaged seals', qty: 2, price: 0.80, tax: 0 }])
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const total    = subtotal

  function addLine() { setLines([...lines, { sku: '', desc: '', qty: 1, price: 0, tax: 0 }]) }
  function removeLine(i: number) { setLines(lines.filter((_, j) => j !== i)) }
  function updateLine(i: number, key: keyof Line, val: string | number) {
    setLines(lines.map((l, j) => j === i ? { ...l, [key]: val } : l))
  }

  function handleSubmit() {
    setSaving(true)
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => router.push('/purchases'), 1200) }, 700)
  }

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => router.push('/purchases')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to purchases
          </button>
          <h1>New debit note <span className="muted" style={{ fontWeight: 500 }}>· DN-0185</span></h1>
          <div className="ph-sub">Money to recover from supplier</div>
        </div>
        <div className="ph-actions">
          <button className="btn" disabled={saving}><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? <><i className="fa-solid fa-spinner fa-spin" /> Sending…</> : <><i className="fa-solid fa-paper-plane" /> Send to supplier</>}
          </button>
        </div>
      </div>

      {saved && (
        <div className="banner" style={{ marginBottom: 16, background: 'var(--c-pos-soft)', color: 'var(--c-pos)', borderColor: 'color-mix(in oklch, var(--c-pos) 30%, transparent)' }}>
          <i className="fa-solid fa-circle-check" /> Debit note DN-0185 sent — redirecting…
        </div>
      )}

      <div className="grid-12" style={{ alignItems: 'flex-start' }}>
        <div className="col gap-4">

          {/* Supplier & source */}
          <div className="card card-pad">
            <div className="fw-6 t-sm" style={{ marginBottom: 14 }}>Supplier &amp; source</div>
            <div className="grid-2" style={{ gap: 14 }}>
              <div className="field">
                <label>Supplier <span style={{ color: 'var(--c-neg)' }}>*</span></label>
                <select className="select">
                  <option>Lumio Electrical</option><option>Polyflo Industries</option><option>IronGrip Tools Co.</option>
                </select>
              </div>
              <div className="field">
                <label>Source receipt (GRN)</label>
                <select className="select">
                  <option>GRN-4426 · 2 days ago</option><option>GRN-4428 · today</option><option>—</option>
                </select>
              </div>
              <div className="field">
                <label>Issue date <span style={{ color: 'var(--c-neg)' }}>*</span></label>
                <input className="input" type="date" defaultValue="2026-05-26" />
              </div>
              <div className="field">
                <label>Reason <span style={{ color: 'var(--c-neg)' }}>*</span></label>
                <select className="select">
                  <option>Damaged on receipt</option><option>Short shipment</option><option>Wrong item shipped</option><option>Quality below spec</option><option>Late delivery</option>
                </select>
              </div>
              <div className="field">
                <label>Recovery method</label>
                <div className="seg" style={{ width: '100%' }}>
                  <button className="is-active" style={{ flex: 1 }}>Offset next bill</button>
                  <button style={{ flex: 1 }}>Refund to bank</button>
                  <button style={{ flex: 1 }}>Replacement</button>
                </div>
              </div>
              <div className="field">
                <label>Currency</label>
                <select className="select"><option>USD</option></select>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="card">
            <div className="card-pad" style={{ paddingBottom: 0 }}>
              <div className="fw-6 t-sm">Items to debit</div>
            </div>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>SKU</th><th>Description</th>
                    <th className="ta-right">Qty</th>
                    <th className="ta-right">Unit price</th>
                    <th className="ta-right">Total</th>
                    <th style={{ width: 32 }} />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td><input className="input mono" value={l.sku} onChange={e => updateLine(i,'sku',e.target.value)} style={{ width: 120, padding: '4px 8px' }} /></td>
                      <td><input className="input" value={l.desc} onChange={e => updateLine(i,'desc',e.target.value)} style={{ width: '100%', padding: '4px 8px' }} /></td>
                      <td className="ta-right"><input className="input col-num" type="number" value={l.qty} onChange={e => updateLine(i,'qty',+e.target.value)} style={{ width: 80, textAlign: 'right', padding: '4px 8px' }} /></td>
                      <td className="ta-right"><input className="input col-num" type="number" step="0.01" value={l.price} onChange={e => updateLine(i,'price',+e.target.value)} style={{ width: 100, textAlign: 'right', padding: '4px 8px' }} /></td>
                      <td className="ta-right col-num fw-6">{fmtMoney(l.qty * l.price, 2)}</td>
                      <td><div className="row-actions"><button onClick={() => removeLine(i)}><i className="fa-solid fa-xmark" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
              <button className="btn btn-sm" onClick={addLine}><i className="fa-solid fa-plus" /> Add line</button>
            </div>
          </div>

          {/* Explanation */}
          <div className="card card-pad">
            <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Explanation to supplier</div>
            <div className="field">
              <label>Detailed description</label>
              <textarea className="input" rows={4} defaultValue={`2 units of PVC coupling 2" (SKU PVC-CPL-2) arrived with cracked sealing rings on GRN-4426 dated 2026-05-24. Photos attached. Please credit the value to our next bill or refund as ACH.`} />
            </div>
            <div className="row gap-2" style={{ marginTop: 8 }}>
              <button className="btn btn-sm"><i className="fa-solid fa-paperclip" /> Attach evidence (3 photos)</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-link" /> Link to QC report</button>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col gap-4">
          <div className="card card-pad">
            <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Debit total</div>
            <div className="col gap-2 t-sm">
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Subtotal</span><span className="mono">{fmtMoney(subtotal, 2)}</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Tax</span><span className="mono">$0.00</span></div>
              <div className="divider" />
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="fw-7">Debit total</span><span className="mono fw-7" style={{ fontSize: 16 }}>{fmtMoney(total, 2)}</span></div>
              <div className="t-xs muted">Status: Draft · Terms: Offset next bill</div>
            </div>
          </div>

          <div className="card card-pad">
            <div className="fw-6 t-sm" style={{ marginBottom: 12 }}>Supplier balance impact</div>
            <div className="col gap-2 t-sm">
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Open AP today</span><span className="mono">{fmtMoney(24810, 2)}</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">This debit</span><span className="mono" style={{ color: 'var(--c-pos)' }}>−{fmtMoney(total, 2)}</span></div>
              <div className="divider" />
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="fw-7">After applying</span><span className="mono fw-7">{fmtMoney(24810 - total, 2)}</span></div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSubmit} disabled={saving}>
            {saving ? 'Sending…' : 'Send to supplier'}
          </button>
        </div>
      </div>
    </div>
  )
}
