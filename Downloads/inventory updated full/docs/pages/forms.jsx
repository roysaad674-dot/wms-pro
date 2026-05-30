/* global React */
// Creation / edit forms for every document and entity in the app.
// Each is exposed on window.WMS_BESPOKE and routed by pageId.

const { fmtMoney, PRODUCTS } = window.WMS;
const { useState, useMemo } = React;
const USERS = window.WMS_USERS;

/* =============================================================
   Shared form chrome
   ============================================================= */
function FormHead({ onPage, backTo, backLabel, title, idHint, sub, actions }) {
  return (
    <div className="page-head">
      <div>
        {onPage && backTo && (
          <button className="btn btn-ghost btn-sm" onClick={() => onPage(backTo)} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> {backLabel}
          </button>
        )}
        <h1>{title} {idHint && <span className="muted" style={{ fontWeight: 500 }}>· {idHint}</span>}</h1>
        {sub && <div className="ph-sub">{sub}</div>}
      </div>
      <div className="ph-actions">{actions}</div>
    </div>
  );
}

function Section({ title, sub, actions, children, pad = true }) {
  return (
    <div className="card">
      {title && (
        <div className="card-hd">
          <h3>{title}</h3>
          {sub && <span className="hd-sub">{sub}</span>}
          {actions && <div className="hd-actions">{actions}</div>}
        </div>
      )}
      {pad ? <div className="card-pad">{children}</div> : children}
    </div>
  );
}

function Field({ label, hint, req, children, span }) {
  return (
    <div className="field" style={span ? { gridColumn: 'span ' + span } : undefined}>
      <label>{label}{req && <span className="req">*</span>}</label>
      {children}
      {hint && <div className="t-xs muted">{hint}</div>}
    </div>
  );
}

function StatusChip({ label = 'Draft', tone = 'muted' }) {
  return <span className={'pill ' + tone}>{label}</span>;
}

function AuditTimeline({ items }) {
  return (
    <div className="col gap-3">
      {items.map((e, i) => (
        <div key={i} className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: i === 0 ? 'var(--brand)' : 'var(--text-4)', marginTop: 7, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="t-sm"><span className="fw-6">{e.who}</span> <span className="muted-2">{e.what}</span></div>
            <div className="t-xs muted">{e.when}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MoneyRow({ label, value, mono = true, bold, tone }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span className={bold ? 'fw-7' : 'muted'}>{label}</span>
      <span className={(mono ? 'mono ' : '') + (bold ? 'fw-7' : '')} style={{ color: tone, fontSize: bold ? 16 : undefined }}>{value}</span>
    </div>
  );
}

/* =============================================================
   Reusable: customer / supplier picker block
   ============================================================= */
function PartyBlock({ kind, options, defaultName, address, balance, terms, contact, onNew }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <Field label={kind} req>
        <select className="select" defaultValue={defaultName}>{options.map(o => <option key={o}>{o}</option>)}</select>
        <div className="t-xs muted mt-1">
          {balance != null && <>Balance: <span className="mono">{fmtMoney(balance, 2)}</span> · </>}
          {terms} · {contact}
        </div>
      </Field>
      <Field label="Reference #">
        <input className="input" defaultValue={'REF-' + Math.floor(Math.random() * 9000 + 1000)} />
      </Field>
      <Field label={kind + ' address'} span={2}>
        <textarea className="input" rows={2} defaultValue={address} />
      </Field>
    </div>
  );
}

/* =============================================================
   Reusable line-items table (PO / GRN / Invoice / CN / DN)
   ============================================================= */
function LineItems({ lines, setLines, columns = 'po' }) {
  const update = (i, key, val) => setLines(lines.map((l, j) => j === i ? { ...l, [key]: val } : l));
  const remove = i => setLines(lines.filter((_, j) => j !== i));
  const add = () => setLines([...lines, { sku: '', desc: '', qty: 1, price: 0, tax: 7, recv: 0 }]);

  const totalCell = (l) => l.qty * (l.price || 0) * (1 + (l.tax || 0) / 100);

  return (
    <div>
      <div className="tbl-scroll">
        <table className="tbl">
          <thead>
            <tr>
              <th style={{ width: 30 }}>#</th>
              <th style={{ width: 130 }}>SKU</th>
              <th>Description</th>
              {columns === 'grn' && <th className="ta-right" style={{ width: 80 }}>Ordered</th>}
              <th className="ta-right" style={{ width: 90 }}>{columns === 'grn' ? 'Received' : 'Qty'}</th>
              {columns !== 'grn' && <th className="ta-right" style={{ width: 110 }}>Unit price</th>}
              {columns === 'grn' && <th className="ta-right" style={{ width: 80 }}>Damaged</th>}
              {columns !== 'grn' && <th className="ta-right" style={{ width: 70 }}>Tax</th>}
              {columns === 'grn' && <th style={{ width: 90 }}>Bin</th>}
              {columns !== 'grn' && <th className="ta-right" style={{ width: 110 }}>Amount</th>}
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td className="muted col-num">{i + 1}</td>
                <td>
                  <input className="input col-id" defaultValue={l.sku} style={{ padding: '4px 6px', fontSize: 11.5 }} />
                </td>
                <td>
                  <input className="input" defaultValue={l.desc} style={{ border: 0, padding: '4px 0', background: 'transparent' }} />
                </td>
                {columns === 'grn' && <td className="ta-right col-num muted">{l.ord}</td>}
                <td className="ta-right">
                  <input className="input col-num" type="number" value={columns === 'grn' ? (l.recv ?? l.qty) : l.qty} onChange={e => update(i, columns === 'grn' ? 'recv' : 'qty', +e.target.value)} style={{ width: 80, textAlign: 'right', padding: '4px 8px' }} />
                </td>
                {columns !== 'grn' && (
                  <td className="ta-right">
                    <input className="input col-num" type="number" step="0.01" value={l.price} onChange={e => update(i, 'price', +e.target.value)} style={{ width: 100, textAlign: 'right', padding: '4px 8px' }} />
                  </td>
                )}
                {columns === 'grn' && (
                  <td className="ta-right">
                    <input className="input col-num" type="number" value={l.dmg || 0} onChange={e => update(i, 'dmg', +e.target.value)} style={{ width: 70, textAlign: 'right', padding: '4px 8px' }} />
                  </td>
                )}
                {columns !== 'grn' && <td className="ta-right col-num muted">{l.tax}%</td>}
                {columns === 'grn' && (
                  <td>
                    <input className="input col-id" defaultValue={l.bin || 'A-12-3'} style={{ padding: '4px 6px', fontSize: 11.5 }} />
                  </td>
                )}
                {columns !== 'grn' && <td className="ta-right col-num fw-6">{fmtMoney(totalCell(l), 2)}</td>}
                <td>
                  <div className="row-actions" style={{ opacity: 1 }}>
                    <button onClick={() => remove(i)}><i className="fa-solid fa-xmark" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="row" style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', gap: 8 }}>
        <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus" /> Add line</button>
        <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-magnifying-glass" /> Pick from catalog</button>
        <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-barcode" /> Scan to add</button>
        <div style={{ flex: 1 }} />
        <span className="t-xs muted">{lines.length} lines · {lines.reduce((s,l) => s + (columns === 'grn' ? (l.recv ?? l.qty) : l.qty), 0)} units</span>
      </div>
    </div>
  );
}

/* =============================================================
   Right-rail summary common to document forms
   ============================================================= */
function DocSummary({ subtotal, tax, shipping = 0, discount = 0, total, label = 'Order total', status = 'Draft', terms = 'Net 30', currency = 'USD' }) {
  return (
    <Section title={label}>
      <div className="col gap-2">
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Status</span><StatusChip label={status} /></div>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Currency</span><span className="mono">{currency}</span></div>
        <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Terms</span><span className="t-sm fw-6">{terms}</span></div>
        <div className="divider" style={{ margin: '6px 0' }} />
        <MoneyRow label="Subtotal" value={fmtMoney(subtotal, 2)} />
        <MoneyRow label="Tax" value={fmtMoney(tax, 2)} />
        <MoneyRow label="Shipping" value={fmtMoney(shipping, 2)} />
        {discount !== 0 && <MoneyRow label="Discount" value={'−' + fmtMoney(discount, 2)} tone="var(--c-pos)" />}
        <div className="divider" style={{ margin: '6px 0' }} />
        <MoneyRow label="Total" value={fmtMoney(total, 2)} bold />
      </div>
    </Section>
  );
}

/* =============================================================
   1. NEW PURCHASE ORDER
   ============================================================= */
function PurchaseOrderForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'PVC-2-90',   desc: 'PVC elbow 2" 90°',          qty: 120, price: 1.40, tax: 0 },
    { sku: 'PVC-3-45',   desc: 'PVC elbow 3" 45°',          qty: 60,  price: 2.10, tax: 0 },
    { sku: 'PVC-CPL-2',  desc: 'PVC coupling 2"',           qty: 200, price: 0.80, tax: 0 },
    { sku: 'PVC-VLV-2',  desc: 'PVC ball valve 2"',         qty: 36,  price: 8.40, tax: 0 },
  ]);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = 0;
  const total = subtotal + tax;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <FormHead
        onPage={onPage} backTo="purchases" backLabel="Back to purchase orders"
        title="New purchase order"
        idHint="PO-2286"
        sub="Draft · created Today, 11:42 by Daniel K."
        actions={<>
          <button className="btn btn-ghost"><i className="fa-solid fa-clock-rotate-left" /></button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-paper-plane" /> Send to supplier</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Approve & send</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Supplier & delivery" actions={<button className="btn btn-ghost btn-sm"><i className="fa-solid fa-circle-plus" /> New supplier</button>}>
            <PartyBlock kind="Supplier"
              options={['Polyflo Industries','IronGrip Tools Co.','Lumio Electrical','Atlas Fasteners','Cascade Lumber Supply','Beacon Paint Works']}
              defaultName="Polyflo Industries"
              address={'820 W Industrial Blvd\nHayward, CA 94544\nUnited States'}
              balance={24_810} terms="Net 30" contact="Sarah Wells · sarah@polyflo.com" />
            <div className="grid-2 mt-3" style={{ gap: 14 }}>
              <Field label="Order date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Expected delivery" req><input className="input" type="date" defaultValue="2026-06-04" /></Field>
              <Field label="Deliver to"><select className="select"><option>Warehouse A — Dock 2</option><option>Warehouse B — Dock 1</option><option>Outdoor yard</option></select></Field>
              <Field label="Buyer"><select className="select" defaultValue="Daniel Kang">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select></Field>
              <Field label="Currency"><select className="select"><option>USD — US Dollar</option><option>EUR — Euro</option></select></Field>
              <Field label="Payment terms"><select className="select"><option>Net 30</option><option>Net 15</option><option>Net 45</option><option>COD</option></select></Field>
            </div>
          </Section>

          <Section title="Line items" sub={lines.length + ' items'} pad={false}>
            <LineItems lines={lines} setLines={setLines} columns="po" />
          </Section>

          <Section title="Notes">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Supplier note" hint="Printed on the PO sent to the supplier.">
                <textarea className="input" rows={3} placeholder="Special instructions…" defaultValue="Pre-call Dock 2 supervisor; gate opens 06:00–17:00 M–F." />
              </Field>
              <Field label="Internal note" hint="Only visible to your team.">
                <textarea className="input" rows={3} placeholder="Why this PO, alternate suppliers tried…" />
              </Field>
            </div>
          </Section>
        </div>

        <div className="col gap-4">
          <DocSummary subtotal={subtotal} tax={tax} total={total} label="Order total" status="Draft" terms="Net 30" />

          <Section title="Three-way match preview">
            <div className="col gap-3 t-sm">
              <div className="row gap-2"><i className="fa-solid fa-file-circle-plus" style={{color:'var(--brand)'}} /><span className="fw-6">PO-2286</span><span className="muted">— this draft</span></div>
              <div className="row gap-2"><i className="fa-regular fa-clipboard" style={{color:'var(--text-4)'}} /><span className="muted">GRN pending</span><span className="t-xs muted">— created on receipt</span></div>
              <div className="row gap-2"><i className="fa-regular fa-file-lines" style={{color:'var(--text-4)'}} /><span className="muted">Supplier invoice pending</span></div>
              <div className="banner info" style={{ padding: 8 }}><i className="fa-solid fa-circle-info" /><span className="t-xs">Bill will only post after both GRN and supplier invoice match this PO within tolerance.</span></div>
            </div>
          </Section>

          <Section title="Approval">
            <div className="col gap-3 t-sm">
              <div className="row gap-2"><div className="av" style={{background:'var(--c-info)'}}>DK</div><div><div className="fw-6">Daniel Kang</div><div className="t-xs muted">requester</div></div></div>
              <div className="row gap-2"><div className="av" style={{background:'var(--c-warn)'}}>MR</div><div><div className="fw-6">Maria Rodriguez</div><div className="t-xs muted">approver · &gt;$5k</div></div><span className="pill warn ml-auto">pending</span></div>
              <div className="banner" style={{ padding: 8 }}><i className="fa-solid fa-triangle-exclamation" /><span className="t-xs">{fmtMoney(total,0)} exceeds your $5k auto-approve limit.</span></div>
            </div>
          </Section>

          <Section title="History">
            <AuditTimeline items={[
              { who: 'Daniel K.', what: 'created draft', when: 'Today, 11:42' },
              { who: 'Auto', what: 'pre-filled from reorder suggestion (4 SKUs)', when: 'Today, 11:42' },
            ]} />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   2. NEW GOODS RECEIPT (GRN)
   ============================================================= */
function GRNForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'PVC-2-90',  desc: 'PVC elbow 2" 90°',   ord: 120, recv: 120, dmg: 0, bin: 'B-04-1' },
    { sku: 'PVC-3-45',  desc: 'PVC elbow 3" 45°',   ord: 60,  recv: 60,  dmg: 0, bin: 'B-04-2' },
    { sku: 'PVC-CPL-2', desc: 'PVC coupling 2"',    ord: 200, recv: 198, dmg: 2, bin: 'B-04-3' },
    { sku: 'PVC-VLV-2', desc: 'PVC ball valve 2"',  ord: 36,  recv: 36,  dmg: 0, bin: 'B-05-1' },
  ]);
  const totalOrd = lines.reduce((s,l) => s + l.ord, 0);
  const totalRecv = lines.reduce((s,l) => s + l.recv, 0);
  const dmgCount = lines.reduce((s,l) => s + l.dmg, 0);
  const hasDiscrepancy = totalRecv !== totalOrd || dmgCount > 0;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <FormHead
        onPage={onPage} backTo="grn" backLabel="Back to goods receipts"
        title="New goods receipt"
        idHint="GRN-4429"
        sub="In progress · started Today, 11:24"
        actions={<>
          <button className="btn"><i className="fa-solid fa-print" /> Print labels</button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save partial</button>
          <button className={'btn ' + (hasDiscrepancy ? '' : 'btn-primary')}><i className="fa-solid fa-check" /> {hasDiscrepancy ? 'Submit with discrepancy' : 'Complete receipt'}</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Receipt details">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Purchase order" req>
                <select className="select"><option>PO-2284 · Polyflo Industries</option><option>PO-2283 · IronGrip Tools Co.</option><option>PO-2281 · Lumio Electrical</option></select>
                <div className="t-xs muted mt-1">Open POs: <span className="mono">18</span> · expected today: <span className="mono">2</span></div>
              </Field>
              <Field label="Supplier reference / packing slip">
                <input className="input" placeholder="e.g. PSL-2025-04412" defaultValue="POLY-PSL-8821" />
              </Field>
              <Field label="Receipt date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Received at" req><select className="select"><option>Warehouse A — Dock 2</option><option>Warehouse A — Dock 1</option><option>Warehouse B — Dock 1</option><option>Outdoor yard — Bay 4</option></select></Field>
              <Field label="Received by"><select className="select" defaultValue="Daniel Kang">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select></Field>
              <Field label="Carrier / truck">
                <div className="row gap-2"><select className="select" style={{flex:1}}><option>WestEdge Logistics</option><option>Direct supplier truck</option><option>UPS</option><option>FedEx</option></select><input className="input mono" placeholder="Truck #" defaultValue="WE-4218" style={{width:110}}/></div>
              </Field>
            </div>
          </Section>

          <Section
            title="Lines received"
            sub={totalRecv + ' / ' + totalOrd + ' units · ' + dmgCount + ' damaged'}
            actions={
              <div className="row gap-2">
                <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-barcode" /> Scan</button>
                <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-check-double" /> Mark all complete</button>
              </div>
            }
            pad={false}
          >
            <LineItems lines={lines} setLines={setLines} columns="grn" />
          </Section>

          <Section title="Quality check">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="QC outcome" req>
                <div className="seg" style={{ width: '100%' }}>
                  <button className="is-active" style={{flex:1}}><i className="fa-solid fa-circle-check" style={{color:'var(--c-pos)'}}/> Pass</button>
                  <button style={{flex:1}}><i className="fa-solid fa-clock" style={{color:'var(--c-warn)'}}/> Hold</button>
                  <button style={{flex:1}}><i className="fa-solid fa-circle-xmark" style={{color:'var(--c-neg)'}}/> Fail</button>
                </div>
              </Field>
              <Field label="Inspector"><select className="select"><option>Priya Shah</option><option>Maria Rodriguez</option></select></Field>
              <Field label="Notes" span={2}>
                <textarea className="input" rows={2} defaultValue={dmgCount > 0 ? '2 units of PVC-CPL-2 arrived with cracked seals. Photographed and set aside.' : ''} />
              </Field>
              <Field label="Photo attachments" span={2}>
                <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                  {[1,2].map(i => <div key={i} style={{ width: 72, height: 72, borderRadius: 8, background: 'var(--bg-sub)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', color: 'var(--text-4)' }}><i className="fa-solid fa-image" /></div>)}
                  <button style={{ width: 72, height: 72, borderRadius: 8, background: 'transparent', border: '1.5px dashed var(--line-strong)', color: 'var(--text-3)', cursor: 'pointer' }}><i className="fa-solid fa-plus" /></button>
                </div>
              </Field>
            </div>
          </Section>
        </div>

        <div className="col gap-4">
          <Section title="Reconciliation against PO">
            <div className="col gap-3 t-sm">
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Ordered</span><span className="mono fw-6">{totalOrd} units</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Received now</span><span className="mono fw-6">{totalRecv} units</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Damaged</span><span className="mono fw-6" style={{color: dmgCount > 0 ? 'var(--c-neg)' : 'var(--text-2)'}}>{dmgCount} units</span></div>
              <div className="bar"><span style={{ width: ((totalRecv-dmgCount) / totalOrd * 100) + '%', background: totalRecv === totalOrd && dmgCount === 0 ? 'var(--c-pos)' : 'var(--c-warn)' }} /></div>
              {hasDiscrepancy && (
                <div className="banner" style={{ padding: 8, background: 'var(--c-warn-soft)', color: 'var(--c-warn)', borderColor: 'color-mix(in oklch, var(--c-warn) 30%, transparent)' }}>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span className="t-xs">{dmgCount} damaged · debit note will be drafted automatically.</span>
                </div>
              )}
            </div>
          </Section>

          <Section title="Next steps">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Update stock immediately on submit</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Print bin tags for received SKUs</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked={dmgCount > 0} /> Draft debit note for damaged units</label>
              <label className="row gap-2"><input type="checkbox" /> Notify buyer (Daniel K.) on submit</label>
            </div>
          </Section>

          <Section title="History">
            <AuditTimeline items={[
              { who: 'Daniel K.', what: 'started receipt', when: 'Today, 11:24' },
              { who: 'Auto', what: 'pre-filled lines from PO-2284', when: 'Today, 11:24' },
            ]} />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   3. NEW SALE INVOICE
   ============================================================= */
function SaleInvoiceForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'HX-12-440', desc: 'Heavy-duty hex bolt M12', qty: 240, price: 0.42, tax: 7.25 },
    { sku: 'TR-SPN-10', desc: 'Spanner set 10pc chrome', qty: 12,  price: 142.00,tax: 7.25 },
    { sku: 'SF-GLV-NIT',desc: 'Nitrile glove M (100/box)',qty: 6,  price: 18.40, tax: 0 },
  ]);
  const subtotal = lines.reduce((s,l) => s + l.qty * l.price, 0);
  const tax = lines.reduce((s,l) => s + l.qty * l.price * (l.tax || 0) / 100, 0);
  const discount = 50;
  const total = subtotal + tax - discount;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <FormHead
        onPage={onPage} backTo="sale-invoices" backLabel="Back to sale invoices"
        title="New sale invoice"
        idHint="INV-3083"
        sub="Draft · created Today, 12:08 by Liam C."
        actions={<>
          <button className="btn btn-ghost"><i className="fa-solid fa-clock-rotate-left" /></button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-eye" /> Preview PDF</button>
          <button className="btn"><i className="fa-solid fa-paper-plane" /> Send</button>
          <button className="btn btn-primary"><i className="fa-solid fa-circle-check" /> Finalise &amp; send</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Customer & dates" actions={<button className="btn btn-ghost btn-sm"><i className="fa-solid fa-circle-plus" /> New customer</button>}>
            <PartyBlock kind="Customer"
              options={['Atlas Hardware Co.','Northwind Industrial','Pioneer Logistics','Greenleaf Foods','Cascade Outfitters']}
              defaultName="Atlas Hardware Co."
              address={'2104 Foothill Blvd\nOakland, CA 94601\nUnited States'}
              balance={6_560} terms="Net 30" contact="Frank Donovan · ar@atlashw.co" />
            <div className="grid-2 mt-3" style={{ gap: 14 }}>
              <Field label="Invoice date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Due date" req><input className="input" type="date" defaultValue="2026-06-25" /></Field>
              <Field label="Sales rep"><select className="select"><option>Liam Chen</option><option>Maria Rodriguez</option></select></Field>
              <Field label="Linked SO"><input className="input col-id" defaultValue="SO-10284" /></Field>
              <Field label="Currency"><select className="select"><option>USD</option><option>EUR</option></select></Field>
              <Field label="Payment terms"><select className="select"><option>Net 30</option><option>Due on receipt</option><option>Net 15</option><option>Net 60</option></select></Field>
            </div>
          </Section>

          <Section title="Line items" sub={lines.length + ' lines'} pad={false}>
            <LineItems lines={lines} setLines={setLines} columns="invoice" />
          </Section>

          <Section title="Notes & footer">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Message to customer">
                <textarea className="input" rows={3} defaultValue="Thank you for your continued business — payment via ACH preferred, details below." />
              </Field>
              <Field label="Internal note">
                <textarea className="input" rows={3} placeholder="Only your team sees this." />
              </Field>
              <Field label="Footer text" span={2}>
                <input className="input" defaultValue="Bank: Chase Business · Routing 021000021 · Account 000482140" />
              </Field>
            </div>
          </Section>
        </div>

        <div className="col gap-4">
          <DocSummary subtotal={subtotal} tax={tax} discount={discount} total={total} label="Invoice total" status="Draft" terms="Net 30" />
          <Section title="Customer snapshot">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Open balance" value={fmtMoney(6_560, 2)} />
              <MoneyRow label="Credit limit" value={fmtMoney(50_000, 2)} />
              <MoneyRow label="LTV (rolling 12m)" value={fmtMoney(142_180, 0)} />
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Last order</span><span className="t-sm">Today, 09:42</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">DSO</span><span className="t-sm fw-6">22 days</span></div>
              <div className="bar mt-1"><span style={{ width: '13%', background: 'var(--c-pos)' }} /></div>
              <div className="t-xs muted">13% of credit limit used</div>
            </div>
          </Section>
          <Section title="Payment link">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Include Stripe "Pay online" button</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Auto-email reminder at day 7, 14, 21</label>
              <label className="row gap-2"><input type="checkbox" /> Apply 1.5%/mo late fee after due</label>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   4. NEW DEBIT NOTE (supplier debit)
   ============================================================= */
function DebitNoteForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'PVC-CPL-2', desc: 'PVC coupling 2" — damaged seals', qty: 2, price: 0.80, tax: 0 },
  ]);
  const subtotal = lines.reduce((s,l) => s + l.qty * l.price, 0);
  const tax = 0;
  const total = subtotal + tax;
  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <FormHead
        onPage={onPage} backTo="debit-notes" backLabel="Back to debit notes"
        title="New debit note"
        idHint="DN-0185"
        sub="Money to recover from supplier"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Send to supplier</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Supplier & source">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Supplier" req>
                <select className="select"><option>Lumio Electrical</option><option>Polyflo Industries</option><option>IronGrip Tools Co.</option></select>
              </Field>
              <Field label="Source receipt (GRN)">
                <select className="select"><option>GRN-4426 · 2 days ago</option><option>GRN-4428 · today</option><option>—</option></select>
              </Field>
              <Field label="Issue date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Reason" req>
                <select className="select"><option>Damaged on receipt</option><option>Short shipment</option><option>Wrong item shipped</option><option>Quality below spec</option><option>Late delivery</option></select>
              </Field>
              <Field label="Recovery method"><div className="seg" style={{width:'100%'}}><button className="is-active" style={{flex:1}}>Offset next bill</button><button style={{flex:1}}>Refund to bank</button><button style={{flex:1}}>Replacement</button></div></Field>
              <Field label="Currency"><select className="select"><option>USD</option></select></Field>
            </div>
          </Section>

          <Section title="Items to debit" pad={false}>
            <LineItems lines={lines} setLines={setLines} columns="invoice" />
          </Section>

          <Section title="Explanation to supplier">
            <Field label="Detailed description">
              <textarea className="input" rows={4} defaultValue={'2 units of PVC coupling 2" (SKU PVC-CPL-2) arrived with cracked sealing rings on GRN-4426 dated 2026-05-24. Photos attached. Please credit the value to our next bill or refund as ACH.'} />
            </Field>
            <div className="row gap-2 mt-2">
              <button className="btn btn-sm"><i className="fa-solid fa-paperclip" /> Attach evidence (3 photos)</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-link" /> Link to QC report</button>
            </div>
          </Section>
        </div>

        <div className="col gap-4">
          <DocSummary subtotal={subtotal} tax={tax} total={total} label="Debit total" status="Draft" terms="Offset next bill" />
          <Section title="Supplier balance impact">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Open AP today" value={fmtMoney(24_810, 2)} />
              <MoneyRow label="This debit" value={'−' + fmtMoney(total, 2)} tone="var(--c-pos)" />
              <div className="divider" style={{margin:'6px 0'}} />
              <MoneyRow label="After applying" value={fmtMoney(24_810 - total, 2)} bold />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   5. NEW SUPPLIER
   ============================================================= */
function SupplierForm({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <FormHead
        onPage={onPage} backTo="suppliers" backLabel="Back to suppliers"
        title="New supplier"
        sub="Master record — used on every PO, GRN and bill"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create supplier</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Identity">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Legal name" req span={2}><input className="input" placeholder="ABC Supply Co., LLC" /></Field>
              <Field label="Display name" hint="Shown on documents. Defaults to legal."><input className="input" placeholder="ABC Supply" /></Field>
              <Field label="Supplier code" hint="Auto-generated unless overridden."><input className="input mono" defaultValue="SUP-039" /></Field>
              <Field label="Category"><select className="select"><option>Hardware</option><option>Electrical</option><option>Plumbing</option><option>Tools</option><option>Services</option><option>Other</option></select></Field>
              <Field label="Tax ID / EIN"><input className="input mono" placeholder="84-2840192" /></Field>
              <Field label="Website"><input className="input" placeholder="https://" /></Field>
              <Field label="Tags"><input className="input" placeholder="vetted, woman-owned, local" /></Field>
            </div>
          </Section>

          <Section title="Primary contact">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Name"><input className="input" placeholder="Sarah Wells" /></Field>
              <Field label="Role"><input className="input" placeholder="Account Manager" /></Field>
              <Field label="Email"><input className="input" type="email" placeholder="sarah@…" /></Field>
              <Field label="Phone"><input className="input" placeholder="+1 510 555 0188" /></Field>
            </div>
            <button className="btn btn-sm btn-ghost mt-2"><i className="fa-solid fa-plus" /> Add another contact</button>
          </Section>

          <Section title="Addresses">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Billing address" span={2}><textarea className="input" rows={3} placeholder={'Street\nCity, State ZIP\nCountry'} /></Field>
              <Field label="Shipping origin (default)" span={2}><textarea className="input" rows={3} placeholder="Same as billing — uncheck to enter separately" /></Field>
            </div>
            <label className="row gap-2 mt-2 t-sm"><input type="checkbox" defaultChecked /> Same as billing address</label>
          </Section>

          <Section title="Banking & payment">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Default payment method"><select className="select"><option>ACH</option><option>Wire</option><option>Check</option><option>Card</option></select></Field>
              <Field label="Default payment terms"><select className="select"><option>Net 30</option><option>Net 15</option><option>Net 45</option><option>Net 60</option><option>COD</option></select></Field>
              <Field label="Bank — name"><input className="input" placeholder="Chase Business" /></Field>
              <Field label="Bank — account"><input className="input mono" placeholder="•••• 4821" /></Field>
              <Field label="Routing / sort code"><input className="input mono" placeholder="021000021" /></Field>
              <Field label="Discount terms" hint="e.g. 2/10 net 30"><input className="input" placeholder="—" /></Field>
            </div>
          </Section>
        </div>

        <div className="col gap-4">
          <Section title="Performance targets">
            <div className="col gap-3 t-sm">
              <Field label="On-time delivery target"><div className="row gap-2"><input className="input" type="number" defaultValue={95} style={{maxWidth:80}}/><span className="muted">%</span></div></Field>
              <Field label="Defect rate threshold"><div className="row gap-2"><input className="input" type="number" defaultValue={2} step="0.1" style={{maxWidth:80}}/><span className="muted">% before review</span></div></Field>
              <Field label="Approval limit (this supplier)"><div className="row gap-2"><span className="muted">$</span><input className="input mono" defaultValue="20,000" style={{flex:1}}/></div></Field>
            </div>
          </Section>

          <Section title="Compliance">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> W-9 / W-8 on file</label>
              <label className="row gap-2"><input type="checkbox" /> Certificate of insurance</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Master purchase agreement</label>
              <label className="row gap-2"><input type="checkbox" /> COI expires within 90 days</label>
              <button className="btn btn-sm btn-ghost mt-1"><i className="fa-solid fa-paperclip" /> Upload documents</button>
            </div>
          </Section>

          <Section title="Status">
            <div className="col gap-2 t-sm">
              <Field label="Status"><select className="select"><option>Active</option><option>On hold</option><option>Inactive</option><option>Lead</option></select></Field>
              <Field label="Currency"><select className="select"><option>USD</option><option>EUR</option><option>GBP</option></select></Field>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   6. NEW CUSTOMER
   ============================================================= */
function CustomerForm({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <FormHead
        onPage={onPage} backTo="customers" backLabel="Back to customers"
        title="New customer"
        sub="Master record — used on every estimate, sale and invoice"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create customer</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Identity">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Customer type" req>
                <div className="seg" style={{width:'100%'}}>
                  <button className="is-active" style={{flex:1}}><i className="fa-solid fa-building" /> Business</button>
                  <button style={{flex:1}}><i className="fa-solid fa-user" /> Individual</button>
                </div>
              </Field>
              <Field label="Display name" req><input className="input" placeholder="e.g. Sunridge Cafés" /></Field>
              <Field label="Legal name"><input className="input" placeholder="Sunridge Cafés, Inc." /></Field>
              <Field label="Customer code" hint="Auto-generated."><input className="input mono" defaultValue="CUS-185" /></Field>
              <Field label="Segment"><select className="select"><option>Wholesale</option><option>Retail</option><option>Contractor</option><option>Hospitality</option><option>Government</option></select></Field>
              <Field label="Sales rep"><select className="select"><option>Liam Chen</option><option>Maria Rodriguez</option></select></Field>
              <Field label="Tax ID / Resale cert."><input className="input mono" placeholder="EIN or resale #" /></Field>
              <Field label="Tax status"><select className="select"><option>Standard taxable</option><option>Tax exempt (resale)</option><option>Tax exempt (non-profit)</option><option>Out-of-state</option></select></Field>
            </div>
          </Section>

          <Section title="Primary contact">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Name"><input className="input" /></Field>
              <Field label="Role"><input className="input" placeholder="AP clerk" /></Field>
              <Field label="Email"><input className="input" type="email" /></Field>
              <Field label="Phone"><input className="input" placeholder="+1 ..." /></Field>
            </div>
            <button className="btn btn-sm btn-ghost mt-2"><i className="fa-solid fa-plus" /> Add another contact</button>
          </Section>

          <Section title="Addresses">
            <Field label="Billing address" span={2}><textarea className="input" rows={3} placeholder="…" /></Field>
            <Field label="Default ship-to" span={2}><textarea className="input mt-2" rows={3} placeholder="Same as billing" /></Field>
            <label className="row gap-2 mt-2 t-sm"><input type="checkbox" defaultChecked /> Ship-to matches billing</label>
            <label className="row gap-2 mt-1 t-sm"><input type="checkbox" /> Multiple ship-to locations (warehouses, stores…)</label>
          </Section>
        </div>

        <div className="col gap-4">
          <Section title="Credit & terms">
            <div className="col gap-3 t-sm">
              <Field label="Credit limit"><div className="row gap-2"><span className="muted">$</span><input className="input mono" defaultValue="10,000" style={{flex:1}}/></div></Field>
              <Field label="Payment terms"><select className="select"><option>Net 30</option><option>Net 15</option><option>Net 60</option><option>COD</option><option>Prepaid</option></select></Field>
              <Field label="Discount tier"><select className="select"><option>None</option><option>Tier 1 — 2%</option><option>Tier 2 — 5%</option><option>Tier 3 — 10%</option></select></Field>
              <Field label="Currency"><select className="select"><option>USD</option><option>EUR</option><option>GBP</option></select></Field>
              <Field label="Price list"><select className="select"><option>Wholesale standard</option><option>Wholesale premium</option><option>Retail MSRP</option></select></Field>
            </div>
          </Section>

          <Section title="Communications">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Send invoices by email</label>
              <label className="row gap-2"><input type="checkbox" /> Mail paper invoice</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Monthly statement</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Marketing newsletter</label>
            </div>
          </Section>

          <Section title="Status">
            <div className="col gap-2 t-sm">
              <Field label="Status"><select className="select"><option>Active</option><option>Lead</option><option>Dormant</option><option>Do not sell</option></select></Field>
              <Field label="Tags"><input className="input" placeholder="VIP, contractor, recurring" /></Field>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   7. RECORD PAYMENT
   ============================================================= */
function PaymentForm({ onPage }) {
  const openInvoices = [
    { id: 'INV-3081', cust: 'Northwind Industrial', due: 'Jun 14', total: 11_240.00, applied: 0 },
    { id: 'INV-3080', cust: 'Northwind Industrial', due: 'May 14', total: 4_840.00,  applied: 0 },
    { id: 'INV-3078', cust: 'Northwind Industrial', due: 'May 02', total: 2_840.00,  applied: 0 },
  ];
  const [applied, setApplied] = useState({ 'INV-3081': 11_240, 'INV-3080': 4_840, 'INV-3078': 0 });
  const received = 16_080;
  const sumApplied = Object.values(applied).reduce((a,b) => a+b, 0);
  const unapplied = Math.max(0, received - sumApplied);

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <FormHead
        onPage={onPage} backTo="sales-receipts" backLabel="Back to payments"
        title="Record payment"
        idHint="RCP-1241"
        sub="Apply customer money received against open invoices"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Record &amp; apply</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Payment received">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="From customer" req>
                <select className="select"><option>Northwind Industrial</option><option>Atlas Hardware Co.</option><option>Mercer Construction</option></select>
                <div className="t-xs muted mt-1">Open balance: <span className="mono fw-6">{fmtMoney(18_920, 2)}</span> across 3 invoices</div>
              </Field>
              <Field label="Amount received" req>
                <div className="row gap-2"><span className="muted">$</span><input className="input mono fw-7" defaultValue="16,080.00" style={{flex:1, fontSize: 18}}/></div>
              </Field>
              <Field label="Method"><div className="seg" style={{width:'100%'}}>
                <button className="is-active" style={{flex:1}}>ACH</button>
                <button style={{flex:1}}>Card</button>
                <button style={{flex:1}}>Check</button>
                <button style={{flex:1}}>Wire</button>
                <button style={{flex:1}}>Cash</button>
              </div></Field>
              <Field label="Deposit to"><select className="select"><option>Operating — main ••4821</option><option>Reserve ••4822</option><option>Payroll ••0148</option></select></Field>
              <Field label="Payment date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Reference / check #"><input className="input mono" defaultValue="ACH-848211" /></Field>
              <Field label="Note" span={2}><input className="input" placeholder="Optional — appears on the deposit slip" /></Field>
            </div>
          </Section>

          <Section title="Apply to open invoices" sub="Auto-applied to oldest first — adjust below" pad={false}>
            <table className="tbl">
              <thead><tr><th></th><th>Invoice</th><th>Due</th><th className="ta-right">Outstanding</th><th className="ta-right" style={{width: 160}}>Applied</th><th className="ta-right">Remaining</th></tr></thead>
              <tbody>
                {openInvoices.map(inv => {
                  const app = applied[inv.id] || 0;
                  return (
                    <tr key={inv.id}>
                      <td><span className={'chk' + (app > 0 ? ' is-on' : '')} onClick={() => setApplied({...applied, [inv.id]: app > 0 ? 0 : inv.total})} /></td>
                      <td className="col-id" style={{color:'var(--brand)'}}>{inv.id}</td>
                      <td className="muted">{inv.due}</td>
                      <td className="ta-right col-num">{fmtMoney(inv.total, 2)}</td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" step="0.01" value={app} onChange={e => setApplied({...applied, [inv.id]: +e.target.value})} style={{ width: 130, textAlign: 'right', padding: '4px 8px' }} />
                      </td>
                      <td className="ta-right col-num" style={{color: inv.total - app === 0 ? 'var(--c-pos)' : 'var(--text-3)'}}>{fmtMoney(inv.total - app, 2)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: 'var(--bg-sub)', fontWeight: 600 }}>
                  <td colSpan="4" className="ta-right muted">Total applied</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(sumApplied, 2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </Section>
        </div>

        <div className="col gap-4">
          <Section title="Reconcile">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Received" value={fmtMoney(received, 2)} bold />
              <MoneyRow label="Applied" value={fmtMoney(sumApplied, 2)} />
              <div className="divider" style={{margin:'6px 0'}} />
              <MoneyRow label="Unapplied" value={fmtMoney(unapplied, 2)} tone={unapplied > 0 ? 'var(--c-warn)' : 'var(--c-pos)'} />
              {unapplied > 0 && (
                <div className="banner" style={{ padding: 8, background: 'var(--c-warn-soft)', color: 'var(--c-warn)', borderColor: 'color-mix(in oklch, var(--c-warn) 30%, transparent)' }}>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span className="t-xs">{fmtMoney(unapplied, 2)} unapplied — will sit as customer credit.</span>
                </div>
              )}
            </div>
          </Section>

          <Section title="On submit">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Email receipt to customer</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Mark invoices as paid</label>
              <label className="row gap-2"><input type="checkbox" /> Generate refund (if overpayment)</label>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   8. NEW CREDIT NOTE
   ============================================================= */
function CreditNoteForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'PT-WHT-5G', desc: 'Interior paint white 5g — returned', qty: 1, price: 78.00, tax: 7.25 },
  ]);
  const subtotal = lines.reduce((s,l) => s + l.qty * l.price, 0);
  const tax = lines.reduce((s,l) => s + l.qty * l.price * (l.tax || 0) / 100, 0);
  const total = subtotal + tax;
  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <FormHead
        onPage={onPage} backTo="credit-notes" backLabel="Back to credit notes"
        title="New credit note"
        idHint="CN-0313"
        sub="Money you give back to a customer"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Issue credit</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Customer & source">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Customer" req><select className="select"><option>Atlas Hardware Co.</option><option>Northwind Industrial</option></select></Field>
              <Field label="Source invoice"><select className="select"><option>INV-3082 · Today</option><option>INV-3079 · Yesterday</option></select></Field>
              <Field label="Issue date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Reason" req><select className="select"><option>Customer return</option><option>Defective goods</option><option>Price adjustment</option><option>Goodwill</option><option>Order error</option></select></Field>
              <Field label="Restock?" req><div className="seg" style={{width:'100%'}}><button className="is-active" style={{flex:1}}>Yes — back to A-12-3</button><button style={{flex:1}}>No — scrap</button></div></Field>
              <Field label="Currency"><select className="select"><option>USD</option></select></Field>
            </div>
          </Section>

          <Section title="Items credited" pad={false}>
            <LineItems lines={lines} setLines={setLines} columns="invoice" />
          </Section>

          <Section title="Apply credit">
            <div className="seg" style={{ marginBottom: 12 }}>
              <button className="is-active">Apply to invoice…</button>
              <button>Refund to original payment</button>
              <button>Hold as customer credit</button>
            </div>
            <Field label="Apply to invoice"><select className="select"><option>INV-3081 · Northwind · $11,240 open</option><option>INV-3082 · Atlas · $4,812 open</option></select></Field>
          </Section>

          <Section title="Internal notes">
            <textarea className="input" rows={3} placeholder="Why this credit — useful for analytics on returns reasons." />
          </Section>
        </div>

        <div className="col gap-4">
          <DocSummary subtotal={subtotal} tax={tax} total={total} label="Credit total" status="Draft" terms="—" />
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   9. NEW JOURNAL ENTRY
   ============================================================= */
function JournalEntryForm({ onPage }) {
  const [rows, setRows] = useState([
    { account: '6010 · Rent',           memo: 'May rent accrual',     debit: 8_400, credit: 0 },
    { account: '2100 · Accrued rent',   memo: 'May rent accrual',     debit: 0,    credit: 8_400 },
    { account: '',                      memo: '',                      debit: 0,    credit: 0 },
  ]);
  const totalDr = rows.reduce((s,r) => s + (r.debit || 0), 0);
  const totalCr = rows.reduce((s,r) => s + (r.credit || 0), 0);
  const isBalanced = totalDr === totalCr && totalDr > 0;
  const update = (i, key, val) => setRows(rows.map((r,j) => j === i ? { ...r, [key]: val } : r));
  const remove = i => setRows(rows.filter((_,j) => j !== i));
  const add = () => setRows([...rows, { account: '', memo: '', debit: 0, credit: 0 }]);

  return (
    <div className="page" style={{ maxWidth: 1080 }}>
      <FormHead
        onPage={onPage} backTo="journal-entries" backLabel="Back to journal entries"
        title="New journal entry"
        idHint="JE-2285"
        sub="Manual posting to the general ledger — debits and credits must balance"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn" disabled={!isBalanced}><i className="fa-solid fa-paper-plane" /> Submit for review</button>
          <button className={'btn ' + (isBalanced ? 'btn-primary' : '')} disabled={!isBalanced}><i className="fa-solid fa-check" /> Post</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Section title="Entry header">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Period"><select className="select"><option>May 2026</option><option>Jun 2026</option></select></Field>
              <Field label="Type"><select className="select"><option>Standard</option><option>Adjusting</option><option>Reversing</option><option>Closing</option></select></Field>
              <Field label="Recurring?"><div className="seg" style={{width:'100%'}}><button className="is-active" style={{flex:1}}>One-off</button><button style={{flex:1}}>Monthly</button><button style={{flex:1}}>Quarterly</button></div></Field>
              <Field label="Memo" req span={2}><input className="input" defaultValue="May rent accrual — Cascade Property Mgmt" /></Field>
            </div>
          </Section>

          <Section title="Lines" sub="At least 2 lines — debits = credits" pad={false}>
            <table className="tbl">
              <thead><tr><th style={{width:30}}>#</th><th>Account</th><th>Memo</th><th className="ta-right" style={{width:130}}>Debit</th><th className="ta-right" style={{width:130}}>Credit</th><th style={{width:32}}></th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td className="muted col-num">{i+1}</td>
                    <td>
                      <select className="select" value={r.account} onChange={e => update(i,'account',e.target.value)} style={{ padding: '4px 8px', minWidth: 240 }}>
                        <option value="">— select account —</option>
                        <option>1010 · Cash & equivalents</option>
                        <option>1020 · Accounts receivable</option>
                        <option>1030 · Inventory</option>
                        <option>2010 · Accounts payable</option>
                        <option>2100 · Accrued rent</option>
                        <option>4010 · Product sales</option>
                        <option>5000 · COGS Hardware</option>
                        <option>6010 · Rent</option>
                        <option>6020 · Utilities</option>
                        <option>6030 · Salaries & wages</option>
                        <option>6070 · Depreciation</option>
                      </select>
                    </td>
                    <td><input className="input" value={r.memo} onChange={e => update(i,'memo',e.target.value)} style={{ border: 0, padding: '4px 0', background: 'transparent' }} /></td>
                    <td className="ta-right"><input className="input col-num" type="number" step="0.01" value={r.debit || ''} onChange={e => update(i,'debit',+e.target.value || 0)} style={{width:120,textAlign:'right',padding:'4px 8px'}} /></td>
                    <td className="ta-right"><input className="input col-num" type="number" step="0.01" value={r.credit || ''} onChange={e => update(i,'credit',+e.target.value || 0)} style={{width:120,textAlign:'right',padding:'4px 8px'}} /></td>
                    <td><div className="row-actions" style={{opacity:1}}><button onClick={() => remove(i)}><i className="fa-solid fa-xmark" /></button></div></td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-sub)', fontWeight: 700 }}>
                  <td colSpan="3" className="ta-right">Totals</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(totalDr, 2)}</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(totalCr, 2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <div className="row" style={{ padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
              <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus" /> Add line</button>
              <div style={{flex:1}} />
              <span className="t-sm" style={{ color: isBalanced ? 'var(--c-pos)' : 'var(--c-warn)', fontWeight: 600 }}>
                <i className={'fa-solid ' + (isBalanced ? 'fa-circle-check' : 'fa-circle-exclamation')} style={{ marginRight: 4 }} />
                {isBalanced ? 'Balanced' : 'Out of balance by ' + fmtMoney(Math.abs(totalDr - totalCr), 2)}
              </span>
            </div>
          </Section>

          <Section title="Attachments & memo">
            <textarea className="input" rows={3} placeholder="Long-form explanation — used by your auditor 12 months from now." />
            <button className="btn btn-sm btn-ghost mt-2"><i className="fa-solid fa-paperclip" /> Attach supporting documents</button>
          </Section>
        </div>

        <div className="col gap-4">
          <Section title="Validation">
            <div className="col gap-2 t-sm">
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Lines</span><span className="mono">{rows.filter(r => r.account).length}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Total debits</span><span className="mono fw-7">{fmtMoney(totalDr,2)}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Total credits</span><span className="mono fw-7">{fmtMoney(totalCr,2)}</span></div>
              <div className="divider" style={{margin:'6px 0'}} />
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Difference</span><span className="mono fw-7" style={{color: isBalanced ? 'var(--c-pos)' : 'var(--c-neg)'}}>{fmtMoney(Math.abs(totalDr-totalCr),2)}</span></div>
            </div>
          </Section>
          <Section title="Approval">
            <div className="col gap-2 t-sm">
              <Field label="Reviewer"><select className="select"><option>Priya Shah — Senior Accountant</option><option>Maria Rodriguez — Admin</option></select></Field>
              <label className="row gap-2 mt-1"><input type="checkbox" /> Notify reviewer on save</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Lock entry once posted</label>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   10. NEW ACCOUNT (chart of accounts)
   ============================================================= */
function AccountForm({ onPage }) {
  const [type, setType] = useState('Expense');
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <FormHead
        onPage={onPage} backTo="accounts" backLabel="Back to chart of accounts"
        title="New account"
        sub="A new line in the chart — transactions can post to it once created"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create account</button>
        </>}
      />
      <Section title="Classification">
        <Field label="Account section" req>
          <div className="seg" style={{width:'100%', flexWrap: 'wrap'}}>
            {['Asset','Liability','Equity','Revenue','COGS','Expense'].map(t => (
              <button key={t} className={type === t ? 'is-active' : ''} onClick={() => setType(t)} style={{flex:1, minWidth: 88}}>{t}</button>
            ))}
          </div>
          <div className="t-xs muted mt-1">
            {type === 'Asset' && 'Things you own — cash, AR, inventory, equipment.'}
            {type === 'Liability' && 'Things you owe — AP, loans, tax payable.'}
            {type === 'Equity' && 'Owner\'s stake — capital, retained earnings.'}
            {type === 'Revenue' && 'Income earned from selling things.'}
            {type === 'COGS' && 'Direct cost of the things you sold.'}
            {type === 'Expense' && 'Operating costs — rent, salaries, utilities.'}
          </div>
        </Field>
      </Section>

      <Section title="Details">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Account name" req span={2}><input className="input" placeholder={type === 'Expense' ? 'e.g. Warehouse maintenance' : ''} /></Field>
          <Field label="Account code" req hint="Suggested based on section."><input className="input mono" defaultValue={type === 'Expense' ? '6080' : type === 'Asset' ? '1080' : '2080'} /></Field>
          <Field label="Sub-type"><select className="select">
            {type === 'Asset' && <><option>Bank</option><option>Accounts receivable</option><option>Inventory</option><option>Fixed asset</option><option>Other current</option></>}
            {type === 'Liability' && <><option>Accounts payable</option><option>Credit card</option><option>Loan</option><option>Tax</option><option>Other current</option></>}
            {type === 'Equity' && <><option>Owner equity</option><option>Retained earnings</option></>}
            {type === 'Revenue' && <><option>Income</option><option>Other income</option></>}
            {type === 'COGS' && <><option>Cost of goods</option><option>Direct labour</option></>}
            {type === 'Expense' && <><option>Operating</option><option>Payroll</option><option>Travel</option><option>Software</option><option>Other expense</option></>}
          </select></Field>
          <Field label="Parent account" hint="For roll-ups on the P&L."><select className="select"><option>None (top-level)</option><option>6000 · Operating expenses</option><option>6030 · Salaries & wages</option></select></Field>
          <Field label="Normal balance"><div className="seg" style={{width:'100%'}}><button className={['Asset','COGS','Expense'].includes(type) ? 'is-active' : ''} style={{flex:1}}>Debit</button><button className={['Liability','Equity','Revenue'].includes(type) ? 'is-active' : ''} style={{flex:1}}>Credit</button></div></Field>
          <Field label="Description" span={2}><textarea className="input" rows={2} placeholder="When to use this account — visible in the picker tooltip." /></Field>
          <Field label="Tax code"><select className="select"><option>Inherit from transaction</option><option>Tax exempt</option><option>Standard 7.25%</option></select></Field>
          <Field label="Reporting tag"><input className="input" placeholder="e.g. department, project" /></Field>
        </div>
      </Section>

      <Section title="Behaviour">
        <div className="col gap-2 t-sm">
          <label className="row gap-2"><input type="checkbox" defaultChecked /> Allow transactions to post directly</label>
          <label className="row gap-2"><input type="checkbox" /> Require department on every posting</label>
          <label className="row gap-2"><input type="checkbox" /> Auto-reconcile from bank feed</label>
          <label className="row gap-2"><input type="checkbox" /> Hide from non-finance users</label>
        </div>
      </Section>
    </div>
  );
}

/* =============================================================
   11. STATEMENT DETAIL / PREVIEW
   ============================================================= */
function StatementDetail({ onPage }) {
  const lines = [
    { date: 'May 03', doc: 'INV-3068', memo: 'Sales invoice',   debit: 3_280.10, credit: 0 },
    { date: 'May 06', doc: 'RCP-1218', memo: 'Payment — ACH',   debit: 0,       credit: 2_104.00 },
    { date: 'May 10', doc: 'INV-3071', memo: 'Sales invoice',   debit: 4_812.40, credit: 0 },
    { date: 'May 14', doc: 'INV-3074', memo: 'Sales invoice',   debit: 1_240.00, credit: 0 },
    { date: 'May 18', doc: 'CN-0309',  memo: 'Credit note — price adj.', debit: 0, credit: 140.00 },
    { date: 'May 22', doc: 'RCP-1233', memo: 'Payment — Cash',  debit: 0,       credit: 320.00 },
    { date: 'May 26', doc: 'INV-3082', memo: 'Sales invoice',   debit: 4_812.40, credit: 0 },
  ];
  const opening = 3_280.10;
  const charges = lines.reduce((s,l) => s + l.debit, 0);
  const credits = lines.reduce((s,l) => s + l.credit, 0);
  const closing = opening + charges - credits;

  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <FormHead
        onPage={onPage} backTo="statements" backLabel="Back to statements"
        title="Statement preview"
        idHint="Atlas Hardware Co."
        sub="May 1 – May 31, 2026 · ready to email or print"
        actions={<>
          <button className="btn"><i className="fa-solid fa-print" /> Print</button>
          <button className="btn"><i className="fa-solid fa-file-pdf" /> Download PDF</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Send to customer</button>
        </>}
      />
      {/* Statement paper preview */}
      <div className="card" style={{ padding: 40, maxWidth: 820, margin: '0 auto' }}>
        <div className="row" style={{ alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div className="thumb brand" style={{ width: 48, height: 48, fontSize: 20, marginRight: 0, marginBottom: 10 }}>W</div>
            <div className="fw-7" style={{ fontSize: 16 }}>WMS Pro Industrial Supply</div>
            <div className="t-xs muted" style={{ lineHeight: 1.5 }}>2840 Industrial Pkwy<br/>Oakland, CA 94621<br/>+1 510 555 0188 · ar@wmspro.co</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="t-xs muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account statement</div>
            <div className="fw-7" style={{ fontSize: 22, letterSpacing: '-0.02em', marginTop: 4 }}>Atlas Hardware Co.</div>
            <div className="t-xs muted">May 1 – May 31, 2026</div>
            <div className="t-xs mono mt-1">Account: <span className="fw-6">CUS-001</span></div>
          </div>
        </div>

        <div className="row" style={{ background: 'var(--bg-sub)', padding: 14, borderRadius: 8, marginBottom: 24, gap: 24 }}>
          <div><div className="t-xs muted">Opening balance</div><div className="fw-7 mono" style={{ fontSize: 16, marginTop: 2 }}>{fmtMoney(opening, 2)}</div></div>
          <div><div className="t-xs muted">New charges</div><div className="fw-7 mono" style={{ fontSize: 16, marginTop: 2 }}>{fmtMoney(charges, 2)}</div></div>
          <div><div className="t-xs muted">Payments &amp; credits</div><div className="fw-7 mono" style={{ fontSize: 16, marginTop: 2 }}>{fmtMoney(credits, 2)}</div></div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="t-xs muted">Closing balance due</div>
            <div className="fw-7 mono" style={{ fontSize: 22, marginTop: 2, color: closing > 0 ? 'var(--c-neg)' : 'var(--c-pos)' }}>{fmtMoney(closing, 2)}</div>
          </div>
        </div>

        <table className="tbl" style={{ marginBottom: 24 }}>
          <thead><tr><th>Date</th><th>Document</th><th>Memo</th><th className="ta-right">Charges</th><th className="ta-right">Payments</th><th className="ta-right">Balance</th></tr></thead>
          <tbody>
            <tr><td className="muted">May 01</td><td className="muted">—</td><td className="fw-6">Opening balance</td><td></td><td></td><td className="ta-right col-num fw-6">{fmtMoney(opening, 2)}</td></tr>
            {lines.map((l, i) => {
              const runningBal = opening + lines.slice(0, i+1).reduce((s,ll) => s + ll.debit - ll.credit, 0);
              return (
                <tr key={i}>
                  <td className="muted">{l.date}</td>
                  <td className="col-id">{l.doc}</td>
                  <td>{l.memo}</td>
                  <td className="ta-right col-num">{l.debit > 0 ? fmtMoney(l.debit, 2) : '—'}</td>
                  <td className="ta-right col-num" style={{color: l.credit > 0 ? 'var(--c-pos)' : 'var(--text-4)'}}>{l.credit > 0 ? fmtMoney(l.credit, 2) : '—'}</td>
                  <td className="ta-right col-num fw-6">{fmtMoney(runningBal, 2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="row" style={{ background: 'var(--c-warn-soft)', padding: 14, borderRadius: 8, marginBottom: 24, color: 'var(--c-warn)' }}>
          <i className="fa-solid fa-circle-info" />
          <span className="t-sm">Pay online at <strong>wmspro.co/pay/CUS-001</strong> or remit ACH to routing 021000021, account 000482140. Questions? Reply to this email.</span>
        </div>

        <div className="t-xs muted" style={{ textAlign: 'center', lineHeight: 1.6 }}>
          A 1.5% per month late fee applies to balances over 30 days past due.<br/>WMS Pro Industrial Supply, LLC · EIN 84-2840192 · wmspro.co
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   Register
   ============================================================= */
Object.assign(window.WMS_BESPOKE || (window.WMS_BESPOKE = {}), {
  'new-po':           PurchaseOrderForm,
  'new-grn':          GRNForm,
  'new-invoice':      SaleInvoiceForm,
  'new-debit-note':   DebitNoteForm,
  'new-credit-note':  CreditNoteForm,
  'new-supplier':     SupplierForm,
  'new-customer':     CustomerForm,
  'new-payment':      PaymentForm,
  'new-entry':        JournalEntryForm,
  'new-account':      AccountForm,
  'statement-detail': StatementDetail,
});
