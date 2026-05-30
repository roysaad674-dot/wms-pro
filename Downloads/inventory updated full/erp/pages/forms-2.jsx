/* global React */
// More creation/action forms: estimate, batch statement send, payment run,
// manual AR entry, expense submission, tax rate.

const { fmtMoney } = window.WMS;
const { useState } = React;
const USERS = window.WMS_USERS;

/* Pull shared helpers from forms.jsx by recreating thin wrappers
   (each form file is babel-transpiled in isolation, so we redefine). */
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
function Card({ title, sub, actions, children, pad = true }) {
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
function MoneyRow({ label, value, bold, tone }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span className={bold ? 'fw-7' : 'muted'}>{label}</span>
      <span className={'mono ' + (bold ? 'fw-7' : '')} style={{ color: tone, fontSize: bold ? 16 : undefined }}>{value}</span>
    </div>
  );
}

/* =============================================================
   1. NEW ESTIMATE
   ============================================================= */
function EstimateForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'HX-12-440', desc: 'Heavy-duty hex bolt M12', qty: 480, price: 0.42, tax: 7.25 },
    { sku: 'PVC-2-90',  desc: 'PVC elbow 2" 90°',        qty: 60,  price: 3.20, tax: 7.25 },
    { sku: 'CEM-PT-50', desc: 'Portland cement 50kg',    qty: 24,  price: 12.80,tax: 7.25 },
  ]);
  const update = (i, key, val) => setLines(lines.map((l,j) => j === i ? { ...l, [key]: val } : l));
  const remove = i => setLines(lines.filter((_,j) => j !== i));
  const add = () => setLines([...lines, { sku: '', desc: '', qty: 1, price: 0, tax: 7.25 }]);
  const subtotal = lines.reduce((s,l) => s + l.qty * l.price, 0);
  const tax = lines.reduce((s,l) => s + l.qty * l.price * l.tax/100, 0);
  const total = subtotal + tax;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <FormHead
        onPage={onPage} backTo="estimates" backLabel="Back to estimates"
        title="New estimate" idHint="EST-0422"
        sub="Draft · created Today, 13:14 by Liam C."
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-eye" /> Preview PDF</button>
          <button className="btn"><i className="fa-solid fa-paper-plane" /> Send to customer</button>
          <button className="btn btn-primary"><i className="fa-solid fa-circle-check" /> Send &amp; mark sent</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Customer & validity" actions={<button className="btn btn-ghost btn-sm"><i className="fa-solid fa-circle-plus" /> New customer</button>}>
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Customer" req>
                <select className="select"><option>Mercer Construction</option><option>Atlas Hardware Co.</option><option>Northwind Industrial</option><option>Sunridge Cafés</option></select>
                <div className="t-xs muted mt-1">Open balance: <span className="mono">{fmtMoney(6_240, 2)}</span> · Net 60 terms</div>
              </Field>
              <Field label="Opportunity / project">
                <input className="input" placeholder="e.g. Riverbend new clinic build" defaultValue="Sunset District retrofit phase 2" />
              </Field>
              <Field label="Estimate date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Expires on" req hint="Quote is locked until this date."><input className="input" type="date" defaultValue="2026-06-09" /></Field>
              <Field label="Sales rep"><select className="select"><option>Liam Chen</option><option>Maria Rodriguez</option></select></Field>
              <Field label="Stage">
                <div className="seg" style={{width:'100%'}}>
                  <button className="is-active" style={{flex:1}}>Discovery</button>
                  <button style={{flex:1}}>Negotiation</button>
                  <button style={{flex:1}}>Verbal yes</button>
                </div>
              </Field>
              <Field label="Bill-to address" span={2}><textarea className="input" rows={2} defaultValue={'14 Mercer St\nSan Francisco, CA 94107'} /></Field>
              <Field label="Ship-to / job site" span={2}><textarea className="input" rows={2} defaultValue={'2840 Sunset Blvd, Suite 3\nSan Francisco, CA 94122 — Site contact: Frank Reyes 415-555-0188'} /></Field>
            </div>
          </Card>

          <Card title="Line items" sub={lines.length + ' lines'} pad={false}>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 30 }}>#</th>
                    <th style={{ width: 130 }}>SKU</th>
                    <th>Description</th>
                    <th className="ta-right" style={{ width: 90 }}>Qty</th>
                    <th className="ta-right" style={{ width: 110 }}>Unit price</th>
                    <th className="ta-right" style={{ width: 70 }}>Tax</th>
                    <th className="ta-right" style={{ width: 110 }}>Amount</th>
                    <th style={{ width: 32 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td className="muted col-num">{i + 1}</td>
                      <td><input className="input col-id" defaultValue={l.sku} style={{ padding: '4px 6px', fontSize: 11.5 }} /></td>
                      <td><input className="input" defaultValue={l.desc} style={{ border: 0, padding: '4px 0', background: 'transparent' }} /></td>
                      <td className="ta-right"><input className="input col-num" type="number" value={l.qty} onChange={e => update(i,'qty',+e.target.value)} style={{width:80,textAlign:'right',padding:'4px 8px'}}/></td>
                      <td className="ta-right"><input className="input col-num" type="number" step="0.01" value={l.price} onChange={e => update(i,'price',+e.target.value)} style={{width:100,textAlign:'right',padding:'4px 8px'}}/></td>
                      <td className="ta-right col-num muted">{l.tax}%</td>
                      <td className="ta-right col-num fw-6">{fmtMoney(l.qty * l.price * (1 + l.tax/100), 2)}</td>
                      <td><div className="row-actions" style={{opacity:1}}><button onClick={() => remove(i)}><i className="fa-solid fa-xmark" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row" style={{ padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
              <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus" /> Add line</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-magnifying-glass" /> Pick from catalog</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-rectangle-list" /> Insert kit</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-copy" /> Insert from past estimate</button>
            </div>
          </Card>

          <Card title="Customer-facing message">
            <Field label="Cover message">
              <textarea className="input" rows={4} defaultValue="Hi Frank — here's the materials estimate for the Sunset District retrofit phase 2 as discussed. Quote is firm for 14 days; delivery 7 working days from PO. Let me know if you want to swap to the premium spec on the cement." />
            </Field>
            <div className="row gap-2 mt-3" style={{ flexWrap: 'wrap' }}>
              <label className="row gap-2 t-sm"><input type="checkbox" defaultChecked /> Include accept / decline buttons</label>
              <label className="row gap-2 t-sm"><input type="checkbox" defaultChecked /> Auto-convert to SO on accept</label>
              <label className="row gap-2 t-sm"><input type="checkbox" /> Require 25% deposit on accept</label>
              <label className="row gap-2 t-sm"><input type="checkbox" /> Attach spec sheet PDF</label>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Quote summary">
            <div className="col gap-2">
              <MoneyRow label="Subtotal" value={fmtMoney(subtotal, 2)} />
              <MoneyRow label="Tax (7.25%)" value={fmtMoney(tax, 2)} />
              <MoneyRow label="Shipping" value={fmtMoney(0, 2)} />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted">Discount</span>
                <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px' }}><i className="fa-solid fa-plus" style={{fontSize:9}}/> Add</button>
              </div>
              <div className="divider" style={{ margin: '8px 0' }} />
              <MoneyRow label="Total" value={fmtMoney(total, 2)} bold />
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
                <span className="muted t-xs">Estimated margin</span>
                <span className="fw-7 t-sm" style={{ color: 'var(--c-pos)' }}>42% · {fmtMoney(total * 0.42, 0)}</span>
              </div>
            </div>
          </Card>

          <Card title="Win probability">
            <div className="row" style={{ alignItems: 'center', marginBottom: 12 }}>
              <div className="fw-7" style={{ fontSize: 32 }}>72<span className="muted t-sm fw-5">%</span></div>
              <div className="ml-auto t-xs muted">based on customer<br/>+ stage + value</div>
            </div>
            <div className="bar"><span style={{ width: '72%', background: 'var(--c-pos)' }} /></div>
            <div className="t-xs muted mt-2">Forecast for pipeline: <span className="mono fw-6">{fmtMoney(total * 0.72, 0)}</span></div>
          </Card>

          <Card title="Approvals & alternates">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" /> Send alternate bid (premium spec)</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Loop in Maria R. — over $10k</label>
              <label className="row gap-2"><input type="checkbox" /> Hold for material price refresh</label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   2. SEND STATEMENTS BATCH
   ============================================================= */
function SendStatements({ onPage }) {
  const customers = [
    { code: 'CUS-001', name: 'Atlas Hardware Co.',   email: 'ar@atlashw.co',      bal: 6_560.20,  inv: 4, last: 'May 01', ok: true },
    { code: 'CUS-002', name: 'Northwind Industrial', email: 'finance@northwind.com', bal: 11_240.00, inv: 1, last: 'May 01', ok: true },
    { code: 'CUS-005', name: 'Cascade Outfitters',   email: 'ap@cascadeoutfitters.com', bal: 4_220.25, inv: 2, last: 'May 01', ok: true },
    { code: 'CUS-006', name: 'Beacon Hospitality',   email: 'invoices@beaconhosp.co',   bal: 540.00,    inv: 1, last: 'May 01', ok: false },
    { code: 'CUS-007', name: 'Mercer Construction',  email: 'ar@mercercon.com',   bal: 6_240.00,  inv: 1, last: 'May 01', ok: true },
    { code: 'CUS-009', name: 'Bluefin Marine Co.',   email: 'paul@bluefinmarine.co',    bal: 11_280.00, inv: 1, last: 'May 01', ok: true },
    { code: 'CUS-010', name: 'Riverbend Plumbing',   email: 'sandra@riverbend.co',      bal: 3_280.10,  inv: 2, last: 'May 01', ok: true },
    { code: 'CUS-008', name: 'Halcyon Retail',       email: 'ar@halcyon.shop',    bal: 1_240.00,  inv: 1, last: 'May 01', ok: true },
    { code: 'CUS-024', name: 'Sunridge Cafés',       email: 'no-reply@invalid',   bal: 1_840.00,  inv: 1, last: 'May 01', ok: false },
  ];
  const [sel, setSel] = useState(() => new Set(customers.filter(c => c.bal > 0 && c.ok).map(c => c.code)));
  const toggle = (code) => {
    const next = new Set(sel);
    next.has(code) ? next.delete(code) : next.add(code);
    setSel(next);
  };
  const toggleAll = () => sel.size === customers.length ? setSel(new Set()) : setSel(new Set(customers.map(c => c.code)));
  const selectedRows = customers.filter(c => sel.has(c.code));
  const totalAmount = selectedRows.reduce((s,c) => s + c.bal, 0);

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="statements" backLabel="Back to statements"
        title="Send statements"
        sub="Batch deliver this month's statements to selected customers"
        actions={<>
          <button className="btn"><i className="fa-solid fa-clock" /> Schedule</button>
          <button className="btn"><i className="fa-solid fa-eye" /> Preview emails</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Send {sel.size} {sel.size === 1 ? 'statement' : 'statements'}</button>
        </>}
      />
      <div className="banner info" style={{ marginBottom: 16 }}>
        <i className="fa-solid fa-circle-info" />
        <div>Statements will be generated as PDFs and emailed individually. Customers without a valid email get marked as "to print" so you can mail them.</div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Period & format">
            <div className="grid-3" style={{ gap: 14 }}>
              <Field label="Period" req><select className="select"><option>May 2026</option><option>April 2026</option><option>March 2026</option><option>Custom range…</option></select></Field>
              <Field label="Statement type"><select className="select"><option>Open invoices only</option><option>Full activity (all txns)</option><option>Past-due only</option></select></Field>
              <Field label="Customers"><select className="select"><option>Only with balance</option><option>All customers</option><option>Past-due only</option><option>Custom segment…</option></select></Field>
            </div>
          </Card>

          <Card
            title="Recipients"
            sub={selectedRows.length + ' of ' + customers.length + ' selected · ' + fmtMoney(totalAmount, 0) + ' total'}
            pad={false}
          >
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 28 }}><span className={'chk' + (sel.size === customers.length ? ' is-on' : '')} onClick={toggleAll} /></th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th className="ta-right">Open invoices</th>
                  <th className="ta-right">Balance</th>
                  <th>Delivery</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.code} className={sel.has(c.code) ? 'is-selected' : ''} onClick={() => toggle(c.code)} style={{ cursor: 'pointer' }}>
                    <td><span className={'chk' + (sel.has(c.code) ? ' is-on' : '')} /></td>
                    <td>
                      <div className="cell-with-icon">
                        <div className="thumb">{c.name.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                        <span className="fw-6">{c.name}</span>
                      </div>
                    </td>
                    <td className={c.ok ? 'muted-2 t-sm' : 't-sm'} style={{ color: c.ok ? undefined : 'var(--c-warn)' }}>
                      {c.email}
                      {!c.ok && <i className="fa-solid fa-triangle-exclamation" style={{ marginLeft: 6, fontSize: 10 }} />}
                    </td>
                    <td className="ta-right col-num">{c.inv}</td>
                    <td className="ta-right col-num fw-6">{fmtMoney(c.bal, 2)}</td>
                    <td><span className={'pill ' + (c.ok ? 'pos' : 'warn')}>{c.ok ? 'Email' : 'Print & mail'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Email content">
            <Field label="Subject"><input className="input" defaultValue="Your May statement from WMS Pro Industrial Supply" /></Field>
            <Field label="Body" hint="Tokens: {{customer}}, {{balance}}, {{period}}.">
              <textarea className="input mt-2" rows={6} defaultValue={"Hi {{customer}},\n\nAttached is your statement of account for {{period}}. Your current balance is {{balance}}.\n\nPay online at wmspro.co/pay or remit ACH to the bank details on the statement. Questions? Just reply.\n\nThanks,\nThe WMS Pro AR team"} />
            </Field>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Run summary">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Recipients" value={selectedRows.length} />
              <MoneyRow label="Emailed" value={selectedRows.filter(c => c.ok).length} />
              <MoneyRow label="To print &amp; mail" value={selectedRows.filter(c => !c.ok).length} tone="var(--c-warn)" />
              <div className="divider" style={{ margin: '6px 0' }} />
              <MoneyRow label="Total receivable" value={fmtMoney(totalAmount, 2)} bold />
              <div className="t-xs muted">Past 30 days: <span className="mono">{fmtMoney(28_400, 0)}</span></div>
              <div className="t-xs muted">Past 60 days: <span className="mono" style={{color:'var(--c-warn)'}}>{fmtMoney(8_400, 0)}</span></div>
              <div className="t-xs muted">Past 90 days: <span className="mono" style={{color:'var(--c-neg)'}}>{fmtMoney(1_840, 0)}</span></div>
            </div>
          </Card>

          <Card title="Delivery options">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Attach PDF</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Include pay-online link</label>
              <label className="row gap-2"><input type="checkbox" /> CC your sales rep on each email</label>
              <label className="row gap-2"><input type="checkbox" /> BCC ar@wmspro.co for record</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Log "statement sent" on each customer</label>
            </div>
          </Card>

          <Card title="Schedule (optional)">
            <Field label="Send on">
              <select className="select"><option>Right now</option><option>Tonight at 18:00</option><option>Tomorrow 09:00</option><option>1st of next month</option></select>
            </Field>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   3. RUN PAYMENT SCHEDULE (AP batch)
   ============================================================= */
function RunPayments({ onPage }) {
  const bills = [
    { id: 'BILL-0883', payee: 'PG&E Utilities',         due: 'May 30', overdue: false, amount: 1_840.00, method: 'ACH',  acct: 'Operating ••4821' },
    { id: 'BILL-0884', payee: 'Polyflo Industries',     due: 'Jun 14', overdue: false, amount: 4_812.00, method: 'ACH',  acct: 'Operating ••4821' },
    { id: 'BILL-0881', payee: 'Cascade Property Mgmt',  due: 'Jun 01', overdue: false, amount: 8_400.00, method: 'Wire', acct: 'Operating ••4821' },
    { id: 'BILL-0882', payee: 'IronGrip Tools Co.',     due: 'Jun 13', overdue: false, amount: 11_240.00,method: 'ACH',  acct: 'Operating ••4821' },
    { id: 'BILL-0880', payee: 'AT&T Business',          due: 'May 22', overdue: true,  amount: 320.00,   method: 'ACH',  acct: 'Operating ••4821' },
    { id: 'BILL-0877', payee: 'FreshPay Payroll Svc',   due: 'May 24', overdue: true,  amount: 1_240.00, method: 'ACH',  acct: 'Payroll ••0148' },
    { id: 'BILL-0873', payee: 'Sterling Insurance',     due: 'May 20', overdue: true,  amount: 6_680.00, method: 'Check',acct: 'Operating ••4821' },
    { id: 'BILL-0876', payee: 'AWS Cloud',              due: 'Jun 04', overdue: false, amount: 1_840.00, method: 'Card', acct: 'Amex ••3008' },
  ];
  const [sel, setSel] = useState(() => new Set(bills.filter(b => b.overdue || b.due === 'May 30' || b.due === 'Jun 01').map(b => b.id)));
  const toggle = (id) => {
    const next = new Set(sel);
    next.has(id) ? next.delete(id) : next.add(id);
    setSel(next);
  };
  const toggleAll = () => sel.size === bills.length ? setSel(new Set()) : setSel(new Set(bills.map(b => b.id)));
  const selectedBills = bills.filter(b => sel.has(b.id));
  const totalAmount = selectedBills.reduce((s,b) => s + b.amount, 0);
  const byMethod = {};
  selectedBills.forEach(b => { byMethod[b.method] = (byMethod[b.method] || 0) + b.amount; });

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="bills" backLabel="Back to bills"
        title="Payment run"
        idHint="PR-2026-22"
        sub="Pay multiple bills in one batch — ACH file generated, posted to ledger, audit trail kept"
        actions={<>
          <button className="btn"><i className="fa-solid fa-clock" /> Schedule for later</button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save as draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Submit run · {fmtMoney(totalAmount, 0)}</button>
        </>}
      />
      <div className="banner" style={{ marginBottom: 16, background: 'var(--c-warn-soft)', color: 'var(--c-warn)', borderColor: 'color-mix(in oklch, var(--c-warn) 30%, transparent)' }}>
        <i className="fa-solid fa-shield-halved" />
        <div>This run requires Priya Shah's approval — pay-runs over $10,000 need two signers per policy.</div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Run settings">
            <div className="grid-3" style={{ gap: 14 }}>
              <Field label="Run name" req><input className="input" defaultValue="May 30 weekly run" /></Field>
              <Field label="Process date" req><input className="input" type="date" defaultValue="2026-05-30" /></Field>
              <Field label="Posting date"><input className="input" type="date" defaultValue="2026-05-30" /></Field>
              <Field label="Default account"><select className="select"><option>Operating — main ••4821</option><option>Payroll ••0148</option></select></Field>
              <Field label="Default method"><select className="select"><option>ACH</option><option>Wire</option><option>Check</option></select></Field>
              <Field label="Strategy" hint="Auto-pick which bills to include.">
                <select className="select"><option>Due in next 7 days + all overdue</option><option>Due in next 14 days</option><option>Manual selection only</option></select>
              </Field>
            </div>
          </Card>

          <Card
            title="Bills in this run"
            sub={selectedBills.length + ' selected of ' + bills.length}
            actions={<button className="btn btn-sm btn-ghost"><i className="fa-solid fa-filter" /> Add more</button>}
            pad={false}
          >
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{width:28}}><span className={'chk' + (sel.size === bills.length ? ' is-on' : '')} onClick={toggleAll} /></th>
                  <th>Bill</th>
                  <th>Payee</th>
                  <th>Due</th>
                  <th>Method</th>
                  <th>From account</th>
                  <th className="ta-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b.id} className={sel.has(b.id) ? 'is-selected' : ''} onClick={() => toggle(b.id)} style={{ cursor: 'pointer' }}>
                    <td><span className={'chk' + (sel.has(b.id) ? ' is-on' : '')} /></td>
                    <td className="col-id">{b.id}</td>
                    <td><div className="cell-with-icon"><div className="thumb">{b.payee.split(' ').map(w => w[0]).slice(0,2).join('')}</div><span className="fw-6">{b.payee}</span></div></td>
                    <td><span className={b.overdue ? 'fw-6' : 'muted'} style={{color: b.overdue ? 'var(--c-neg)' : undefined}}>{b.due}{b.overdue ? ' · overdue' : ''}</span></td>
                    <td><span className="tag">{b.method}</span></td>
                    <td className="t-sm muted-2">{b.acct}</td>
                    <td className="ta-right col-num fw-6">{fmtMoney(b.amount, 2)}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-sub)', fontWeight: 700 }}>
                  <td colSpan="6" className="ta-right">Total run</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(totalAmount, 2)}</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Cash check">
            <div className="col gap-2 t-sm">
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted">Operating ••4821 — current balance</span>
                <span className="mono fw-7">{fmtMoney(184_240, 2)}</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted">This run debits</span>
                <span className="mono fw-7" style={{color:'var(--c-neg)'}}>−{fmtMoney(totalAmount - 1_840, 2)}</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted">Pending cash-out (other runs)</span>
                <span className="mono">−{fmtMoney(4_280, 2)}</span>
              </div>
              <div className="divider" style={{ margin: '6px 0' }} />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="fw-7">Projected balance after run</span>
                <span className="mono fw-7" style={{ color: 'var(--c-pos)' }}>{fmtMoney(184_240 - (totalAmount - 1_840) - 4_280, 2)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Run totals">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Bills" value={selectedBills.length} />
              <MoneyRow label="Total" value={fmtMoney(totalAmount, 2)} bold />
              <div className="divider" style={{ margin: '6px 0' }} />
              {Object.entries(byMethod).map(([m, amt]) => (
                <div key={m} className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">{m}</span>
                  <span className="mono">{fmtMoney(amt, 2)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Approvals">
            <div className="col gap-3 t-sm">
              <div className="row gap-2">
                <div className="av" style={{background:'var(--c-info)'}}>MR</div>
                <div style={{flex:1}}><div className="fw-6">Maria Rodriguez</div><div className="t-xs muted">requester · today 14:02</div></div>
                <span className="pill pos">approved</span>
              </div>
              <div className="row gap-2">
                <div className="av" style={{background:'var(--c-warn)'}}>PS</div>
                <div style={{flex:1}}><div className="fw-6">Priya Shah</div><div className="t-xs muted">co-signer · &gt; $10k policy</div></div>
                <span className="pill warn">pending</span>
              </div>
              <button className="btn btn-sm"><i className="fa-solid fa-bell" /> Notify Priya now</button>
            </div>
          </Card>

          <Card title="On submit">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Generate ACH NACHA file</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Email remittance advice to each vendor</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Post journal entries to GL</label>
              <label className="row gap-2"><input type="checkbox" /> Print check stubs for Sterling Insurance</label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   4. NEW AR ENTRY (manual receivable)
   ============================================================= */
function ARManualEntry({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <FormHead
        onPage={onPage} backTo="accounts-receivable" backLabel="Back to AR"
        title="New AR entry"
        idHint="AR-MAN-118"
        sub="Manually book a charge against a customer — outside the normal sales-invoice flow"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Post entry</button>
        </>}
      />
      <div className="banner info" style={{ marginBottom: 16 }}>
        <i className="fa-solid fa-circle-info" />
        <div>Use for things like late fees, finance charges, or rebilling a chargeback. For everyday product sales create an invoice instead.</div>
      </div>
      <Card title="Charge details">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Customer" req>
            <select className="select"><option>Bluefin Marine Co.</option><option>Sunridge Cafés</option><option>Riverbend Plumbing</option></select>
            <div className="t-xs muted mt-1">Open balance: <span className="mono">{fmtMoney(11_280, 2)}</span> · Net 30</div>
          </Field>
          <Field label="Entry type" req>
            <select className="select">
              <option>Late fee (1.5%/mo)</option>
              <option>Finance charge</option>
              <option>Chargeback rebill</option>
              <option>NSF / bounced check fee</option>
              <option>Service charge</option>
              <option>Other (custom)</option>
            </select>
          </Field>
          <Field label="Source / linked invoice"><input className="input col-id" defaultValue="INV-3074" /></Field>
          <Field label="Charge date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
          <Field label="Due date"><input className="input" type="date" defaultValue="2026-06-25" /></Field>
          <Field label="Currency"><select className="select"><option>USD</option></select></Field>
          <Field label="Amount" req span={2}>
            <div className="row gap-2"><span className="muted">$</span><input className="input mono fw-7" defaultValue="142.20" style={{flex:1, fontSize: 18}}/></div>
            <div className="t-xs muted mt-1">Suggested: 1.5% × $9,480 outstanding × 1 month = $142.20</div>
          </Field>
          <Field label="GL account" req>
            <select className="select"><option>4040 · Late-fee income</option><option>4030 · Shipping recovered</option><option>4020 · Services</option></select>
          </Field>
          <Field label="Tax treatment"><select className="select"><option>Non-taxable</option><option>Standard tax</option></select></Field>
          <Field label="Description" span={2}>
            <textarea className="input" rows={3} defaultValue="Late fee on INV-3074 — invoice 12 days past due as of 2026-05-26. Per Net 30 terms and the 1.5%/mo late-fee clause." />
          </Field>
          <Field label="Visible to customer?" span={2}>
            <div className="seg" style={{width:'fit-content'}}>
              <button className="is-active">Yes — appears on next statement</button>
              <button>No — internal only</button>
            </div>
          </Field>
        </div>
      </Card>

      <Card title="Preview impact">
        <div className="col gap-2 t-sm">
          <MoneyRow label="Customer balance before" value={fmtMoney(11_280, 2)} />
          <MoneyRow label="This entry" value={'+' + fmtMoney(142.20, 2)} tone="var(--c-warn)" />
          <div className="divider" style={{ margin: '6px 0' }} />
          <MoneyRow label="Customer balance after" value={fmtMoney(11_422.20, 2)} bold />
          <div className="row gap-2 mt-2 t-xs muted">
            <i className="fa-solid fa-arrow-right" /> Dr 1020 Accounts receivable · Cr 4040 Late-fee income
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   5. SUBMIT EXPENSE
   ============================================================= */
function ExpenseForm({ onPage }) {
  const [items, setItems] = useState([
    { merchant: 'Shell — Fuel', date: '2026-05-26', cat: 'Travel — fuel', amount: 84.20, project: '—', receipt: true },
  ]);
  const total = items.reduce((s,i) => s + i.amount, 0);

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="expenses" backLabel="Back to expenses"
        title="Submit expense"
        idHint="EXP-1285"
        sub="Out-of-pocket spend for reimbursement, or a card swipe to categorise"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Submit for approval</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Receipt">
            <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
              <div style={{ width: 200, height: 260, borderRadius: 10, background: 'var(--bg-sub)', border: '1.5px dashed var(--line-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                <i className="fa-solid fa-receipt" style={{ fontSize: 32 }} />
                <div className="fw-6 mt-2 t-sm">Drop receipt here</div>
                <div className="t-xs muted mt-1">or click to browse</div>
                <div className="t-xs muted mt-2">PDF, JPG, HEIC · 10MB max</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="fw-6 t-sm">AI receipt scan</div>
                <div className="t-xs muted mt-1">Upload a photo and we'll pre-fill merchant, date, total, tax and line items automatically. Confirm before submit.</div>
                <div className="row gap-2 mt-3 t-sm">
                  <button className="btn btn-sm"><i className="fa-solid fa-camera" /> Take photo</button>
                  <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-link" /> From card swipe</button>
                </div>
                <div className="banner info mt-3" style={{ padding: 8 }}>
                  <i className="fa-solid fa-wand-magic-sparkles" />
                  <span className="t-xs">Last extract: Shell Oil #4882 · 2026-05-26 · $84.20 incl. $5.72 tax. Confidence: 96%.</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Expense details">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Merchant" req><input className="input" defaultValue="Shell Oil #4882" /></Field>
              <Field label="Date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Category" req>
                <select className="select">
                  <optgroup label="Travel">
                    <option>Travel — fuel</option>
                    <option>Travel — air</option>
                    <option>Travel — lodging</option>
                    <option>Travel — meals</option>
                    <option>Travel — ground</option>
                  </optgroup>
                  <optgroup label="Office">
                    <option>Office supplies</option>
                    <option>Software</option>
                    <option>Subscriptions</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option>Client entertainment</option>
                    <option>Conference / training</option>
                    <option>Marketing</option>
                    <option>Repairs &amp; maintenance</option>
                  </optgroup>
                </select>
              </Field>
              <Field label="Project / cost center"><select className="select"><option>— none —</option><option>WH-A Receiving</option><option>Field sales</option><option>Marketing 2026</option></select></Field>
              <Field label="Subtotal"><div className="row gap-2"><span className="muted">$</span><input className="input mono" defaultValue="78.48" style={{flex:1}}/></div></Field>
              <Field label="Tax"><div className="row gap-2"><span className="muted">$</span><input className="input mono" defaultValue="5.72" style={{flex:1}}/></div></Field>
              <Field label="Total" req><div className="row gap-2"><span className="muted">$</span><input className="input mono fw-7" defaultValue="84.20" style={{flex:1, fontSize: 18}}/></div></Field>
              <Field label="Currency"><select className="select"><option>USD</option><option>EUR</option><option>GBP</option></select></Field>
              <Field label="Payment source" req>
                <div className="seg" style={{width:'100%'}}>
                  <button className="is-active" style={{flex:1}}>Personal — reimburse</button>
                  <button style={{flex:1}}>Company card</button>
                  <button style={{flex:1}}>Petty cash</button>
                </div>
              </Field>
              <Field label="Card used" hint="Required for company card."><select className="select"><option>—</option><option>Amex Business Plat. ••3008</option><option>Visa fleet ••6421</option></select></Field>
              <Field label="Description" span={2}>
                <textarea className="input" rows={2} defaultValue="Fuel run to Warehouse B for receiving shift" />
              </Field>
              <Field label="Attendees (for meals)" span={2}>
                <input className="input" placeholder="comma-separated names, e.g. Frank Reyes (Sunridge Cafés)" />
              </Field>
            </div>
          </Card>

          <Card title="Policy check">
            <div className="col gap-2 t-sm">
              <div className="row gap-2"><i className="fa-solid fa-circle-check" style={{color:'var(--c-pos)'}}/> Within per-diem ($120 fuel/day)</div>
              <div className="row gap-2"><i className="fa-solid fa-circle-check" style={{color:'var(--c-pos)'}}/> Receipt attached</div>
              <div className="row gap-2"><i className="fa-solid fa-circle-check" style={{color:'var(--c-pos)'}}/> Under $200 — single approver</div>
              <div className="row gap-2"><i className="fa-solid fa-circle-info" style={{color:'var(--c-info)'}}/> Submitted within 30 days of purchase</div>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Summary">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Items" value={items.length} />
              <MoneyRow label="Total" value={fmtMoney(total, 2)} bold />
              <div className="t-xs muted mt-1">Will reimburse on May 31 payroll batch</div>
            </div>
          </Card>

          <Card title="Routing">
            <div className="col gap-3 t-sm">
              <div className="row gap-2">
                <div className="av" style={{background:USERS[0].color}}>MR</div>
                <div style={{flex:1}}><div className="fw-6">{USERS[0].name}</div><div className="t-xs muted">submitter</div></div>
              </div>
              <div className="row gap-2">
                <div className="av" style={{background:USERS[1].color}}>DK</div>
                <div style={{flex:1}}><div className="fw-6">{USERS[1].name}</div><div className="t-xs muted">your manager · approver</div></div>
                <span className="pill muted">awaits</span>
              </div>
              <div className="row gap-2">
                <div className="av" style={{background:USERS[2].color}}>PS</div>
                <div style={{flex:1}}><div className="fw-6">{USERS[2].name}</div><div className="t-xs muted">finance · pays out</div></div>
              </div>
            </div>
          </Card>

          <Card title="Mileage shortcut">
            <div className="t-xs muted mb-2">Not at a pump? Log the trip and we'll auto-calc at IRS rate ($0.67/mi).</div>
            <button className="btn btn-sm" style={{ width: '100%' }}><i className="fa-solid fa-route" /> Log a trip instead</button>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   6. ADD TAX RATE
   ============================================================= */
function TaxRateForm({ onPage }) {
  const [type, setType] = useState('Sales');
  return (
    <div className="page" style={{ maxWidth: 980 }}>
      <FormHead
        onPage={onPage} backTo="tax" backLabel="Back to tax"
        title="Add tax rate"
        sub="A new rate that flows into invoices and bills automatically"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Activate rate</button>
        </>}
      />

      <Card title="Type">
        <Field label="Tax type" req>
          <div className="seg" style={{width:'100%'}}>
            {['Sales','Use','VAT','GST','Excise','Withholding'].map(t => (
              <button key={t} className={type === t ? 'is-active' : ''} onClick={() => setType(t)} style={{flex:1}}>{t}</button>
            ))}
          </div>
          <div className="t-xs muted mt-1">
            {type === 'Sales' && 'Charged to customers on top of sale price. Collected then remitted to the authority.'}
            {type === 'Use' && 'Tax owed on out-of-state purchases — self-assessed.'}
            {type === 'VAT' && 'Value-added tax — input/output netted at filing.'}
            {type === 'GST' && 'Goods &amp; services tax — added at sale.'}
            {type === 'Excise' && 'Specific-product tax (e.g. fuel, alcohol).'}
            {type === 'Withholding' && 'Withheld from supplier payments and remitted on their behalf.'}
          </div>
        </Field>
      </Card>

      <Card title="Identity & rate">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Code" req hint="Short identifier — appears on every transaction."><input className="input mono" placeholder="CA-DISTRICT-SF" /></Field>
          <Field label="Display name" req><input className="input" placeholder="San Francisco district tax" /></Field>
          <Field label="Rate (%)" req>
            <div className="row gap-2"><input className="input mono fw-7" defaultValue="0.5" style={{flex:1, fontSize: 18}}/><span className="muted">%</span></div>
            <div className="t-xs muted mt-1">Combined with state rate at checkout (e.g. 7.25% state + 0.5% district = 7.75%).</div>
          </Field>
          <Field label="Effective from" req><input className="input" type="date" defaultValue="2026-06-01" /></Field>
          <Field label="Authority" req><input className="input" placeholder="California Dept. of Tax and Fee Administration" defaultValue="CDTFA" /></Field>
          <Field label="Authority account #"><input className="input mono" placeholder="e.g. SR-1234567" /></Field>
        </div>
      </Card>

      <Card title="Where it applies">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Jurisdiction" req>
            <select className="select">
              <option>Country — United States</option>
              <option>State — California</option>
              <option>County — San Francisco</option>
              <option>City — San Francisco</option>
              <option>ZIP range</option>
            </select>
          </Field>
          <Field label="Match criteria">
            <select className="select">
              <option>Ship-to address</option>
              <option>Bill-to address</option>
              <option>Origin address</option>
              <option>Customer flag</option>
            </select>
          </Field>
          <Field label="Apply to" span={2}>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              <label className="chip is-on"><input type="checkbox" defaultChecked style={{margin:0}}/> All categories</label>
              <label className="chip"><input type="checkbox" style={{margin:0}}/> Food</label>
              <label className="chip"><input type="checkbox" style={{margin:0}}/> Clothing</label>
              <label className="chip"><input type="checkbox" style={{margin:0}}/> Medicine</label>
              <label className="chip"><input type="checkbox" style={{margin:0}}/> Services</label>
            </div>
          </Field>
          <Field label="Customer exemptions" span={2} hint="Customers flagged as resale or non-profit are auto-exempt.">
            <div className="row gap-2"><label className="row gap-2 t-sm"><input type="checkbox" defaultChecked /> Honour resale certificates</label><label className="row gap-2 t-sm"><input type="checkbox" defaultChecked /> Honour non-profit cert.</label><label className="row gap-2 t-sm"><input type="checkbox" /> Honour gov't exemption</label></div>
          </Field>
        </div>
      </Card>

      <Card title="Accounting">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Collected — GL liability" req>
            <select className="select"><option>2020 · Sales tax payable</option><option>2021 · VAT payable</option><option>2022 · GST payable</option></select>
            <div className="t-xs muted mt-1">Money you owe the authority.</div>
          </Field>
          <Field label="Paid — GL asset" req>
            <select className="select"><option>1080 · Sales tax recoverable</option><option>1081 · VAT recoverable</option><option>1082 · Use tax accrual</option></select>
            <div className="t-xs muted mt-1">For supplier tax you can reclaim.</div>
          </Field>
          <Field label="Filing frequency" req><select className="select"><option>Monthly</option><option>Quarterly</option><option>Annually</option></select></Field>
          <Field label="Filing day"><select className="select"><option>Last day of period</option><option>15th of next period</option><option>30th of next period</option></select></Field>
        </div>
      </Card>

      <Card title="Behaviour">
        <div className="col gap-2 t-sm">
          <label className="row gap-2"><input type="checkbox" defaultChecked /> Show on invoice as a separate line</label>
          <label className="row gap-2"><input type="checkbox" /> Inclusive of unit price (gross pricing)</label>
          <label className="row gap-2"><input type="checkbox" defaultChecked /> Auto-file with Avalara on the due date</label>
          <label className="row gap-2"><input type="checkbox" /> Round per-line (instead of per-invoice)</label>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   Register
   ============================================================= */
Object.assign(window.WMS_BESPOKE || (window.WMS_BESPOKE = {}), {
  'new-estimate':   EstimateForm,
  'send-statements':SendStatements,
  'run-payments':   RunPayments,
  'new-ar-entry':   ARManualEntry,
  'new-expense':    ExpenseForm,
  'new-tax-rate':   TaxRateForm,
});
