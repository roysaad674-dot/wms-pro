/* global React */
// More forms: bank connect, add txn, add employee, export-to-payroll,
// request leave, run payroll, transfer, adjustment, stock count, location,
// bulk add, new product, new category.

const { fmtMoney } = window.WMS;
const { useState } = React;
const USERS = window.WMS_USERS;

/* Shared chrome — keep this file self-contained */
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
   1. CONNECT BANK (wizard)
   ============================================================= */
function ConnectBank({ onPage }) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState('plaid');
  const banks = [
    { name: 'Chase Business',   icon: 'fa-building-columns', c: '#117ACA' },
    { name: 'Bank of America',  icon: 'fa-building-columns', c: '#012169' },
    { name: 'Wells Fargo',      icon: 'fa-building-columns', c: '#D71E28' },
    { name: 'American Express', icon: 'fa-credit-card',      c: '#016FD0' },
    { name: 'Mercury',          icon: 'fa-piggy-bank',       c: '#0F1622' },
    { name: 'Capital One',      icon: 'fa-building-columns', c: '#D03027' },
    { name: 'Stripe',           icon: 'fa-credit-card',      c: '#635bff' },
    { name: 'First Republic',   icon: 'fa-building-columns', c: '#1c4477' },
  ];

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <FormHead
        onPage={onPage} backTo="bank-accounts" backLabel="Back to bank accounts"
        title="Connect bank"
        sub="Two-minute setup · we read transactions only, never move money without your approval"
      />

      {/* Step indicator */}
      <div className="row mb-3" style={{ background: 'var(--bg-sub)', padding: 14, borderRadius: 10, gap: 0 }}>
        {[
          { n: 1, label: 'Provider' },
          { n: 2, label: 'Choose bank' },
          { n: 3, label: 'Sign in' },
          { n: 4, label: 'Pick accounts' },
        ].map((s, i, arr) => (
          <div key={s.n} className="row" style={{ flex: 1, gap: 0 }}>
            <div className="row gap-2" style={{ flex: 1 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12,
                background: step >= s.n ? 'var(--brand)' : 'var(--bg)',
                border: step >= s.n ? 'none' : '1.5px solid var(--line-strong)',
                color: step >= s.n ? '#fff' : 'var(--text-3)',
                display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
              }}>{step > s.n ? <i className="fa-solid fa-check" style={{fontSize:9}}/> : s.n}</div>
              <div className={'t-sm ' + (step === s.n ? 'fw-7' : '')} style={{ color: step >= s.n ? 'var(--text)' : 'var(--text-3)' }}>{s.label}</div>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: step > s.n ? 'var(--brand)' : 'var(--line)', margin: '0 8px' }} />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && (
        <Card title="Connection method">
          <div className="col gap-3">
            {[
              { id: 'plaid',   name: 'Plaid',           desc: '10,000+ banks · most secure · auto-sync nightly', i: 'fa-plug', c: 'var(--brand)', rec: true },
              { id: 'mx',      name: 'MX Atrium',       desc: 'Smaller banks and credit unions',                  i: 'fa-link', c: 'var(--c-info)' },
              { id: 'csv',     name: 'CSV upload',      desc: 'Drop a statement file when needed — no auto-sync', i: 'fa-file-csv', c: 'var(--text-3)' },
              { id: 'direct',  name: 'Direct API',      desc: 'For our supported banks — fastest, real-time',      i: 'fa-bolt', c: 'var(--c-warn)' },
            ].map(p => (
              <div key={p.id} onClick={() => setProvider(p.id)} style={{
                border: '1.5px solid ' + (provider === p.id ? 'var(--brand)' : 'var(--line)'),
                background: provider === p.id ? 'var(--brand-soft)' : 'var(--card)',
                padding: 14, borderRadius: 10, cursor: 'pointer',
              }}>
                <div className="row gap-3">
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: p.c, opacity: 0.12, display: 'grid', placeItems: 'center' }}>
                    <i className={'fa-solid ' + p.i} style={{ color: p.c, opacity: 1, fontSize: 16 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="fw-6">{p.name}{p.rec && <span className="pill brand" style={{ marginLeft: 8 }}>recommended</span>}</div>
                    <div className="t-xs muted mt-1">{p.desc}</div>
                  </div>
                  <span className={'chk' + (provider === p.id ? ' is-on' : '')} style={{ borderRadius: 12 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="row mt-3"><div style={{flex:1}}/><button className="btn btn-primary" onClick={() => setStep(2)}>Continue <i className="fa-solid fa-arrow-right" /></button></div>
        </Card>
      )}

      {step === 2 && (
        <Card title="Choose your bank">
          <div className="filterbar mb-3" style={{ margin: 0 }}>
            <div className="fb-search"><i className="fa-solid fa-magnifying-glass" /><input placeholder="Search 10,000+ banks…" autoFocus /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {banks.map(b => (
              <div key={b.name} onClick={() => setStep(3)} className="card" style={{ padding: 14, cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: b.c, margin: '0 auto', display: 'grid', placeItems: 'center', color: '#fff' }}>
                  <i className={'fa-solid ' + b.icon} />
                </div>
                <div className="fw-6 t-sm mt-2">{b.name}</div>
              </div>
            ))}
          </div>
          <div className="row mt-3"><button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button></div>
        </Card>
      )}

      {step === 3 && (
        <Card title="Sign in to Chase Business" sub="Credentials are encrypted and passed to Plaid — never stored by us">
          <div className="grid-2" style={{ gap: 14 }}>
            <Field label="Username" req><input className="input" autoFocus /></Field>
            <Field label="Password" req><input className="input" type="password" /></Field>
            <Field label="Multi-factor code" span={2} hint="We'll send a one-time code to your phone if required."><input className="input mono" placeholder="•••••" /></Field>
          </div>
          <div className="banner info mt-3"><i className="fa-solid fa-shield-halved" /><div className="t-xs">Your credentials are encrypted with bank-grade TLS and used once to fetch a permanent access token. We never see your password.</div></div>
          <div className="row mt-3"><button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button><div style={{flex:1}}/><button className="btn btn-primary" onClick={() => setStep(4)}>Sign in</button></div>
        </Card>
      )}

      {step === 4 && (
        <Card title="Pick accounts to sync" sub="3 accounts found at Chase Business">
          <div className="col gap-2">
            {[
              { name: 'Business checking', last4: '4821', balance: 184_240, type: 'Checking', on: true },
              { name: 'Business savings',  last4: '4822', balance: 220_000, type: 'Savings',  on: true },
              { name: 'Ink Business card', last4: '7188', balance: -2_840,  type: 'Card',     on: false },
            ].map((a,i) => (
              <div key={i} className="row" style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 8 }}>
                <span className={'chk' + (a.on ? ' is-on' : '')} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw-6">{a.name}</div>
                  <div className="t-xs muted">{a.type} · ••{a.last4}</div>
                </div>
                <div className="mono fw-7" style={{ color: a.balance < 0 ? 'var(--c-neg)' : 'var(--text)' }}>{fmtMoney(Math.abs(a.balance), 0)}</div>
                <select className="select" style={{ width: 220, marginLeft: 12 }}><option>Map to: 1010 Cash &amp; equivalents</option><option>1020 AR</option><option>2040 Credit cards</option></select>
              </div>
            ))}
          </div>
          <Field label="Sync history" hint="How far back to pull transactions on first sync."><select className="select mt-2" style={{ maxWidth: 240 }}><option>Last 90 days</option><option>Last 6 months</option><option>Last 12 months</option><option>Last 24 months</option></select></Field>
          <div className="row mt-3"><button className="btn btn-ghost" onClick={() => setStep(3)}>Back</button><div style={{flex:1}}/><button className="btn btn-primary" onClick={() => onPage && onPage('bank-accounts')}><i className="fa-solid fa-check" /> Finish — connect 2 accounts</button></div>
        </Card>
      )}
    </div>
  );
}

/* =============================================================
   2. ADD BANK TRANSACTION (manual)
   ============================================================= */
function AddTransaction({ onPage }) {
  const [kind, setKind] = useState('expense');
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <FormHead
        onPage={onPage} backTo="banking" backLabel="Back to transactions"
        title="Add transaction"
        sub="Cash, ATM withdrawal, or anything else the bank feed missed"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Post transaction</button>
        </>}
      />
      <Card title="Type">
        <Field label="What kind?" req>
          <div className="seg" style={{ width: '100%' }}>
            {[
              { id: 'expense',  label: 'Money out',  i: 'fa-arrow-down' },
              { id: 'income',   label: 'Money in',   i: 'fa-arrow-up' },
              { id: 'transfer', label: 'Transfer',   i: 'fa-arrow-right-arrow-left' },
            ].map(k => (
              <button key={k.id} className={kind === k.id ? 'is-active' : ''} onClick={() => setKind(k.id)} style={{ flex: 1 }}>
                <i className={'fa-solid ' + k.i} /> {k.label}
              </button>
            ))}
          </div>
        </Field>
      </Card>
      <Card title="Details">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label={kind === 'transfer' ? 'From account' : 'Account'} req>
            <select className="select"><option>Operating — main ••4821</option><option>Reserve ••4822</option><option>Payroll ••0148</option><option>Amex ••3008</option></select>
          </Field>
          {kind === 'transfer' && (
            <Field label="To account" req>
              <select className="select"><option>Reserve ••4822</option><option>Payroll ••0148</option><option>Operating — main ••4821</option></select>
            </Field>
          )}
          {kind !== 'transfer' && (
            <Field label={kind === 'income' ? 'From (payer)' : 'To (payee)'} req>
              <input className="input" placeholder="e.g. Polyflo Industries, ATM, Petty cash" />
            </Field>
          )}
          <Field label="Date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
          <Field label="Amount" req>
            <div className="row gap-2"><span className="muted">$</span><input className="input mono fw-7" placeholder="0.00" style={{flex:1, fontSize: 18}}/></div>
          </Field>
          <Field label="Method"><select className="select"><option>ACH</option><option>Wire</option><option>Card</option><option>Check</option><option>Cash</option></select></Field>
          {kind !== 'transfer' && (
            <Field label="Category / GL account" req>
              <select className="select">
                {kind === 'expense' ? <>
                  <option>6010 · Rent</option><option>6020 · Utilities</option><option>6040 · Software</option><option>6060 · Travel &amp; meals</option><option>6080 · Office supplies</option>
                </> : <>
                  <option>4010 · Product sales</option><option>4020 · Services</option><option>4030 · Shipping recovered</option><option>4090 · Other income</option>
                </>}
              </select>
            </Field>
          )}
          <Field label="Reference / check #"><input className="input mono" placeholder="optional" /></Field>
          <Field label="Tax treatment"><select className="select"><option>Inherit from account</option><option>Tax exempt</option><option>Sales tax 7.25%</option></select></Field>
          <Field label="Memo" span={2}><input className="input" placeholder="Short description — used in match suggestions later." /></Field>
          <Field label="Attach receipt" span={2}>
            <button className="btn btn-sm"><i className="fa-solid fa-paperclip" /> Attach file</button>
          </Field>
        </div>
      </Card>
      <Card title="Preview">
        <div className="col gap-2 t-sm">
          <div className="row gap-2 muted"><i className="fa-solid fa-arrow-right" /> {kind === 'transfer' ? 'Operating ••4821 → Reserve ••4822' : kind === 'expense' ? 'Dr 6010 Rent · Cr 1010 Cash' : 'Dr 1010 Cash · Cr 4010 Product sales'}</div>
          <div className="t-xs muted">Posts immediately — appears in matched state in the bank inbox.</div>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   3. ADD EMPLOYEE
   ============================================================= */
function EmployeeForm({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="employees" backLabel="Back to directory"
        title="Add employee"
        sub="A new person on payroll — drives access, timesheets, payslips and the org chart"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-paper-plane" /> Save &amp; send onboarding link</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create &amp; activate</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Personal">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Legal first name" req><input className="input" placeholder="Jordan" /></Field>
              <Field label="Legal last name" req><input className="input" placeholder="Avery" /></Field>
              <Field label="Preferred name"><input className="input" placeholder="Jordy" /></Field>
              <Field label="Pronouns"><select className="select"><option>—</option><option>she/her</option><option>he/him</option><option>they/them</option><option>other</option></select></Field>
              <Field label="Date of birth"><input className="input" type="date" /></Field>
              <Field label="Personal email"><input className="input" type="email" /></Field>
              <Field label="Phone"><input className="input" placeholder="+1 …" /></Field>
              <Field label="Emergency contact"><input className="input" placeholder="Name · phone · relationship" /></Field>
              <Field label="Home address" span={2}><textarea className="input" rows={2} /></Field>
            </div>
          </Card>

          <Card title="Employment">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Employee ID" hint="Auto if blank."><input className="input mono" placeholder="EMP-011" /></Field>
              <Field label="Job title" req><input className="input" placeholder="Warehouse Associate" /></Field>
              <Field label="Team / department"><select className="select"><option>Operations</option><option>Warehouse</option><option>Finance</option><option>Sales</option><option>IT</option></select></Field>
              <Field label="Manager"><select className="select">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select></Field>
              <Field label="Work location"><select className="select"><option>Warehouse A — Oakland</option><option>Warehouse B — Hayward</option><option>HQ — Oakland</option><option>Remote</option></select></Field>
              <Field label="Employment type" req>
                <div className="seg" style={{width:'100%'}}>
                  <button className="is-active" style={{flex:1}}>Full-time</button>
                  <button style={{flex:1}}>Part-time</button>
                  <button style={{flex:1}}>Contract</button>
                  <button style={{flex:1}}>Intern</button>
                </div>
              </Field>
              <Field label="Start date" req><input className="input" type="date" defaultValue="2026-06-09" /></Field>
              <Field label="End date" hint="Leave blank for indefinite."><input className="input" type="date" /></Field>
              <Field label="Reports to (system)" span={2}>
                <select className="select"><option>Daniel Kang — Warehouse Supervisor</option><option>Maria Rodriguez — Operations Lead</option></select>
              </Field>
            </div>
          </Card>

          <Card title="Compensation">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Pay schedule"><select className="select"><option>Bi-weekly (every other Friday)</option><option>Weekly</option><option>Semi-monthly</option><option>Monthly</option></select></Field>
              <Field label="Pay basis"><div className="seg" style={{width:'100%'}}><button className="is-active" style={{flex:1}}>Hourly</button><button style={{flex:1}}>Salary</button></div></Field>
              <Field label="Hourly rate" hint="Will be used on attendance × hours."><div className="row gap-2"><span className="muted">$</span><input className="input mono" defaultValue="24.00" style={{flex:1}}/><span className="muted">/hr</span></div></Field>
              <Field label="Overtime rule"><select className="select"><option>1.5× over 40 h/wk</option><option>1.5× over 8 h/day</option><option>Salaried — no OT</option><option>None</option></select></Field>
              <Field label="Bonus eligibility"><label className="row gap-2"><input type="checkbox" /> Eligible for company bonus pool</label></Field>
              <Field label="PTO accrual"><select className="select"><option>Standard — 2 wks/yr</option><option>Senior — 3 wks/yr</option><option>Unlimited</option></select></Field>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="System access">
            <div className="col gap-3 t-sm">
              <Field label="Work email"><input className="input" placeholder="jordan@wmspro.co" /></Field>
              <Field label="Role"><select className="select"><option>Warehouse</option><option>Sales</option><option>Finance</option><option>Inventory</option><option>Admin</option></select></Field>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Require MFA at first sign-in</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Send onboarding email</label>
              <label className="row gap-2"><input type="checkbox" /> Add to "ops" Slack channel</label>
            </div>
          </Card>

          <Card title="Tax & legal">
            <div className="col gap-2 t-sm">
              <Field label="Tax ID (SSN/ITIN)"><input className="input mono" placeholder="•••-••-####" /></Field>
              <Field label="W-4 filing status"><select className="select"><option>Single</option><option>Married filing jointly</option><option>Head of household</option></select></Field>
              <Field label="State"><select className="select"><option>California</option><option>Nevada</option><option>—</option></select></Field>
              <label className="row gap-2 mt-1"><input type="checkbox" /> I-9 verified</label>
              <label className="row gap-2"><input type="checkbox" /> Direct deposit form on file</label>
              <button className="btn btn-sm btn-ghost mt-1"><i className="fa-solid fa-paperclip" /> Upload documents</button>
            </div>
          </Card>

          <Card title="Direct deposit">
            <div className="col gap-2 t-sm">
              <Field label="Bank name"><input className="input" placeholder="Chase Business" /></Field>
              <Field label="Routing"><input className="input mono" placeholder="9 digits" /></Field>
              <Field label="Account"><input className="input mono" placeholder="…" /></Field>
              <Field label="Account type"><select className="select"><option>Checking</option><option>Savings</option></select></Field>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   4. EXPORT TO PAYROLL (from attendance)
   ============================================================= */
function ExportPayroll({ onPage }) {
  const rows = [
    { name: 'Daniel Kang',  reg: 80, ot: 6,  pto: 0, sick: 0, rate: 36, pay: 3_204.00, ok: true },
    { name: 'Noah Becker',  reg: 78, ot: 8,  pto: 0, sick: 0, rate: 22, pay: 1_980.00, ok: true },
    { name: 'Owen Wallace', reg: 80, ot: 4,  pto: 0, sick: 0, rate: 24, pay: 2_064.00, ok: true },
    { name: 'Selene Park',  reg: 40, ot: 0,  pto: 0, sick: 8, rate: 28, pay: 1_344.00, ok: true },
    { name: 'Ethan Brooks', reg: 64, ot: 0,  pto: 0, sick: 0, rate: 24, pay: 1_536.00, ok: false },
    { name: 'Aria Volkov',  reg: 0,  ot: 0,  pto: 80,sick: 0, rate: 0,  pay: 0,         ok: true },
  ];
  const total = rows.reduce((s,r) => s + r.pay, 0);
  const issues = rows.filter(r => !r.ok).length;

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="attendance" backLabel="Back to attendance"
        title="Export to payroll"
        sub="Lock May 12 – May 25 attendance and push hours into the next pay run"
        actions={<>
          <button className="btn"><i className="fa-solid fa-pen" /> Edit period</button>
          <button className="btn"><i className="fa-solid fa-download" /> Download CSV</button>
          <button className="btn btn-primary" disabled={issues > 0}><i className="fa-solid fa-arrow-right" /> Push to payroll · {fmtMoney(total, 0)}</button>
        </>}
      />
      {issues > 0 && (
        <div className="banner" style={{ marginBottom: 16, background: 'var(--c-warn-soft)', color: 'var(--c-warn)', borderColor: 'color-mix(in oklch, var(--c-warn) 30%, transparent)' }}>
          <i className="fa-solid fa-triangle-exclamation" />
          <div>{issues} timesheet{issues > 1 ? 's' : ''} need correction before this period can be closed — see the rows flagged below.</div>
        </div>
      )}

      <div className="kpis mb-3">
        <div className="kpi"><div className="kpi-lbl">Pay period</div><div className="kpi-val" style={{fontSize: 18}}>May 12 – 25</div><div className="kpi-foot"><span className="muted">closes Sunday</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Hourly staff</div><div className="kpi-val">{rows.length}</div><div className="kpi-foot"><span className="muted">{rows.filter(r => r.ok).length} ready</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total hours</div><div className="kpi-val">{rows.reduce((s,r)=>s+r.reg+r.ot+r.pto+r.sick,0)} h</div><div className="kpi-foot"><span className="muted">incl. {rows.reduce((s,r)=>s+r.ot,0)} h OT</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total gross</div><div className="kpi-val">{fmtMoney(total,0)}</div><div className="kpi-foot"><span className="muted">to payroll batch</span></div></div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Timesheets being exported" pad={false}>
            <table className="tbl">
              <thead><tr><th></th><th>Employee</th><th className="ta-right">Regular</th><th className="ta-right">OT</th><th className="ta-right">PTO</th><th className="ta-right">Sick</th><th className="ta-right">Rate</th><th className="ta-right">Period pay</th></tr></thead>
              <tbody>
                {rows.map((r,i) => (
                  <tr key={i} style={{ background: r.ok ? undefined : 'var(--c-warn-soft)' }}>
                    <td>{r.ok ? <i className="fa-solid fa-circle-check" style={{color:'var(--c-pos)'}}/> : <i className="fa-solid fa-triangle-exclamation" style={{color:'var(--c-warn)'}}/>}</td>
                    <td>
                      <div className="fw-6">{r.name}</div>
                      {!r.ok && <div className="t-xs" style={{color:'var(--c-warn)'}}>Missing punch May 19 PM</div>}
                    </td>
                    <td className="ta-right col-num">{r.reg} h</td>
                    <td className="ta-right col-num" style={{color: r.ot > 0 ? 'var(--c-warn)' : 'var(--text-3)'}}>{r.ot} h</td>
                    <td className="ta-right col-num muted">{r.pto} h</td>
                    <td className="ta-right col-num muted">{r.sick} h</td>
                    <td className="ta-right col-num muted">{r.rate > 0 ? '$' + r.rate : '—'}</td>
                    <td className="ta-right col-num fw-7">{fmtMoney(r.pay, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Destination">
            <div className="col gap-3 t-sm">
              <Field label="Pay run"><select className="select"><option>May 19 – Jun 01 · pays May 31</option><option>Next available</option></select></Field>
              <Field label="Provider"><select className="select"><option>FreshPay (integrated)</option><option>Export CSV for QuickBooks</option><option>Manual upload</option></select></Field>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Auto-add reimbursable expenses</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Include approved leave</label>
              <label className="row gap-2"><input type="checkbox" /> Auto-lock period after export</label>
            </div>
          </Card>
          <Card title="Approvals">
            <div className="col gap-2 t-sm">
              <div className="row gap-2"><div className="av" style={{background:USERS[1].color}}>DK</div><div style={{flex:1}}><div className="fw-6">Daniel Kang</div><div className="t-xs muted">warehouse manager</div></div><span className="pill pos">approved</span></div>
              <div className="row gap-2"><div className="av" style={{background:USERS[2].color}}>PS</div><div style={{flex:1}}><div className="fw-6">Priya Shah</div><div className="t-xs muted">finance</div></div><span className="pill warn">pending</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   5. REQUEST LEAVE
   ============================================================= */
function RequestLeave({ onPage }) {
  const [type, setType] = useState('PTO');
  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <FormHead
        onPage={onPage} backTo="leave" backLabel="Back to leave"
        title="Request time off"
        sub="Submit for manager approval — coverage and conflicts are checked automatically"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Submit request</button>
        </>}
      />
      <Card title="Type">
        <Field label="Leave type" req>
          <div className="seg" style={{ width: '100%', flexWrap: 'wrap' }}>
            {['PTO','Sick','Parental','Bereavement','Jury duty','Unpaid'].map(t => (
              <button key={t} className={type === t ? 'is-active' : ''} onClick={() => setType(t)} style={{ flex: 1, minWidth: 100 }}>{t}</button>
            ))}
          </div>
        </Field>
      </Card>

      <Card title="Dates">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="From" req><input className="input" type="date" defaultValue="2026-06-03" /></Field>
          <Field label="To" req><input className="input" type="date" defaultValue="2026-06-07" /></Field>
          <Field label="Half-day?"><div className="seg" style={{width:'100%'}}><button className="is-active" style={{flex:1}}>Full days</button><button style={{flex:1}}>Half — AM</button><button style={{flex:1}}>Half — PM</button></div></Field>
          <Field label="Total"><div className="row gap-2"><input className="input mono fw-7" defaultValue="5 days · 40 h" readOnly style={{flex:1}}/></div></Field>
          <Field label="Reason (optional)" span={2}>
            <textarea className="input" rows={2} placeholder="Family vacation — visiting Yellowstone." />
          </Field>
        </div>
      </Card>

      <Card title="Balance & coverage">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label={type + ' balance'}>
            <div className="row gap-2">
              <input className="input mono fw-7" defaultValue="64 h available" readOnly style={{flex:1}}/>
              <span className="muted t-xs">+ 8 h accruing this period</span>
            </div>
            <div className="bar mt-2"><span style={{ width: '62%', background: 'var(--c-pos)' }} /></div>
            <div className="t-xs muted mt-1">After this request: 24 h remaining (38%)</div>
          </Field>
          <Field label="Coverage check">
            <div className="col gap-1 t-sm" style={{ padding: 10, background: 'var(--c-pos-soft)', borderRadius: 6, color: 'var(--c-pos)' }}>
              <div className="fw-6"><i className="fa-solid fa-circle-check" /> No coverage gaps</div>
              <div className="t-xs">No one else off Jun 3–7. Your shifts will be covered by Noah Becker.</div>
            </div>
          </Field>
        </div>
      </Card>

      <Card title="Routing">
        <div className="col gap-3 t-sm">
          <div className="row gap-2">
            <div className="av" style={{background:USERS[3].color}}>LC</div>
            <div style={{flex:1}}><div className="fw-6">{USERS[3].name}</div><div className="t-xs muted">requester</div></div>
          </div>
          <div className="row gap-2">
            <div className="av" style={{background:USERS[0].color}}>MR</div>
            <div style={{flex:1}}><div className="fw-6">{USERS[0].name}</div><div className="t-xs muted">your manager · will receive an email</div></div>
            <span className="pill muted">awaits</span>
          </div>
          <label className="row gap-2"><input type="checkbox" defaultChecked /> Add to team calendar</label>
          <label className="row gap-2"><input type="checkbox" /> Set out-of-office auto-reply</label>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   6. RUN PAYROLL
   ============================================================= */
function RunPayroll({ onPage }) {
  const employees = [
    { name: 'Daniel Kang',     gross: 4_320.00, tax: 1_180.00, ded: 240.00, net: 2_900.00, account: '••8821' },
    { name: 'Noah Becker',     gross: 1_980.00, tax: 540.00,   ded: 84.00,  net: 1_356.00, account: '••4218' },
    { name: 'Owen Wallace',    gross: 2_064.00, tax: 560.00,   ded: 84.00,  net: 1_420.00, account: '••6422' },
    { name: 'Maria Rodriguez', gross: 3_692.00, tax: 1_020.00, ded: 320.00, net: 2_352.00, account: '••0844' },
    { name: 'Priya Shah',      gross: 3_384.00, tax: 920.00,   ded: 280.00, net: 2_184.00, account: '••1240' },
    { name: 'Liam Chen',       gross: 2_462.00, tax: 660.00,   ded: 200.00, net: 1_602.00, account: '••3308' },
    { name: 'Selene Park',     gross: 1_344.00, tax: 360.00,   ded: 64.00,  net: 920.00,   account: '••5642' },
    { name: 'Ethan Brooks',    gross: 1_536.00, tax: 420.00,   ded: 84.00,  net: 1_032.00, account: '••8244' },
  ];
  const totalGross = employees.reduce((s,e) => s + e.gross, 0);
  const totalTax = employees.reduce((s,e) => s + e.tax, 0);
  const totalDed = employees.reduce((s,e) => s + e.ded, 0);
  const totalNet = employees.reduce((s,e) => s + e.net, 0);
  const employerTax = totalGross * 0.0765 + totalGross * 0.03;
  const totalCash = totalNet + totalTax + employerTax;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <FormHead
        onPage={onPage} backTo="payroll" backLabel="Back to payroll"
        title="Run payroll"
        idHint="PR-2026-22"
        sub="Pay period May 19 – Jun 01 · pays Friday May 31 · 8 employees"
        actions={<>
          <button className="btn"><i className="fa-solid fa-eye" /> Preview payslips</button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Approve &amp; submit · {fmtMoney(totalCash, 0)}</button>
        </>}
      />

      <div className="kpis mb-3">
        <div className="kpi"><div className="kpi-lbl">Gross pay</div><div className="kpi-val">{fmtMoney(totalGross, 0)}</div><div className="kpi-foot"><span className="muted">{employees.length} employees</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Employee tax</div><div className="kpi-val" style={{color:'var(--c-warn)'}}>−{fmtMoney(totalTax, 0)}</div><div className="kpi-foot"><span className="muted">federal + state withheld</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Net to employees</div><div className="kpi-val" style={{color:'var(--c-pos)'}}>{fmtMoney(totalNet, 0)}</div><div className="kpi-foot"><span className="muted">paid via ACH</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total cash out</div><div className="kpi-val">{fmtMoney(totalCash, 0)}</div><div className="kpi-foot"><span className="muted">net + all taxes</span></div></div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Period & schedule">
            <div className="grid-3" style={{ gap: 14 }}>
              <Field label="Pay period" req><select className="select"><option>May 19 – Jun 01</option><option>Jun 02 – Jun 15</option></select></Field>
              <Field label="Pay date" req><input className="input" type="date" defaultValue="2026-05-31" /></Field>
              <Field label="Funding account"><select className="select"><option>Payroll ••0148</option><option>Operating ••4821</option></select></Field>
            </div>
          </Card>

          <Card title="Earnings & deductions" pad={false}>
            <table className="tbl">
              <thead><tr><th>Employee</th><th>Account</th><th className="ta-right">Gross</th><th className="ta-right">Tax withheld</th><th className="ta-right">Deductions</th><th className="ta-right">Net</th></tr></thead>
              <tbody>
                {employees.map((e,i) => (
                  <tr key={i}>
                    <td className="fw-6">{e.name}</td>
                    <td><span className="mono muted t-sm">{e.account}</span></td>
                    <td className="ta-right col-num">{fmtMoney(e.gross, 2)}</td>
                    <td className="ta-right col-num" style={{color:'var(--c-warn)'}}>−{fmtMoney(e.tax, 2)}</td>
                    <td className="ta-right col-num muted">−{fmtMoney(e.ded, 2)}</td>
                    <td className="ta-right col-num fw-7">{fmtMoney(e.net, 2)}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-sub)', fontWeight: 700 }}>
                  <td colSpan="2" className="ta-right">Totals</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(totalGross, 2)}</td>
                  <td className="ta-right col-num fw-7" style={{color:'var(--c-warn)'}}>−{fmtMoney(totalTax, 2)}</td>
                  <td className="ta-right col-num fw-7">−{fmtMoney(totalDed, 2)}</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(totalNet, 2)}</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Tax filings">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Federal income tax (withheld)" value={fmtMoney(8_120, 2)} />
              <MoneyRow label="Social security + Medicare (employee)" value={fmtMoney(1_540, 2)} />
              <MoneyRow label="State income tax (withheld)" value={fmtMoney(1_120, 2)} />
              <MoneyRow label="Employer SS + Medicare" value={fmtMoney(1_540, 2)} tone="var(--c-info)" />
              <MoneyRow label="State unemployment (employer)" value={fmtMoney(600, 2)} tone="var(--c-info)" />
              <div className="divider" style={{margin:'6px 0'}}/>
              <MoneyRow label="Total tax (Form 941 next quarter)" value={fmtMoney(12_920, 2)} bold />
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Cash check">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Payroll ••0148 balance" value={fmtMoney(42_180, 2)} />
              <MoneyRow label="Run debits" value={'−' + fmtMoney(totalCash, 2)} tone="var(--c-neg)" />
              <div className="divider" style={{margin:'6px 0'}}/>
              <MoneyRow label="Projected balance" value={fmtMoney(42_180 - totalCash, 2)} bold tone={42_180 - totalCash > 0 ? 'var(--c-pos)' : 'var(--c-neg)'} />
              {(42_180 - totalCash) < 5_000 && <div className="banner" style={{padding:8, background:'var(--c-warn-soft)', color:'var(--c-warn)', borderColor:'color-mix(in oklch, var(--c-warn) 30%, transparent)'}}><i className="fa-solid fa-triangle-exclamation"/><span className="t-xs">Tight — consider transferring from Operating.</span></div>}
            </div>
          </Card>

          <Card title="Compliance checklist">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> All hours from attendance imported</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Bonus runs included</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Expense reimbursements added</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> No expired I-9 or work auth</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> All accounts active for direct deposit</label>
            </div>
          </Card>

          <Card title="Two-signer approval">
            <div className="col gap-3 t-sm">
              <div className="row gap-2"><div className="av" style={{background:USERS[2].color}}>PS</div><div style={{flex:1}}><div className="fw-6">Priya Shah</div><div className="t-xs muted">prepared</div></div><span className="pill pos">signed</span></div>
              <div className="row gap-2"><div className="av" style={{background:USERS[0].color}}>MR</div><div style={{flex:1}}><div className="fw-6">Maria Rodriguez</div><div className="t-xs muted">co-sign · CEO</div></div><span className="pill warn">awaits</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   7. NEW TRANSFER (stock)
   ============================================================= */
function TransferForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'LED-T8-18', name: 'LED T8 tube 18W',   qty: 24, fromAvail: 96,  unit: 'pcs' },
    { sku: 'SF-GLV-NIT',name: 'Nitrile glove M (100)', qty: 12, fromAvail: 1240, unit: 'box' },
  ]);
  const update = (i, key, val) => setLines(lines.map((l,j) => j === i ? { ...l, [key]: val } : l));
  const remove = i => setLines(lines.filter((_,j) => j !== i));
  const add = () => setLines([...lines, { sku: '', name: '', qty: 1, fromAvail: 0, unit: 'pcs' }]);
  const totalUnits = lines.reduce((s,l) => s + l.qty, 0);

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="transfers" backLabel="Back to transfers"
        title="Move stock"
        idHint="T-0222"
        sub="Decrement source, increment destination — with in-transit state in between"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-print" /> Print pick list</button>
          <button className="btn btn-primary"><i className="fa-solid fa-truck" /> Dispatch transfer</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Where & when">
            <div className="grid-3" style={{ gap: 14 }}>
              <Field label="From" req>
                <select className="select"><option>Warehouse A — Oakland</option><option>Warehouse B — Hayward</option><option>Outdoor yard</option><option>Store-1</option></select>
                <div className="t-xs muted mt-1">624 SKUs · 78% utilised</div>
              </Field>
              <Field label="To" req>
                <select className="select"><option>Warehouse B — Hayward</option><option>Warehouse A — Oakland</option><option>Store-1</option><option>Returns bin</option></select>
                <div className="t-xs muted mt-1">340 SKUs · 64% utilised</div>
              </Field>
              <Field label="Reason"><select className="select"><option>Rebalance stock</option><option>Supply storefront</option><option>Customer pickup at branch</option><option>Returns / repack</option><option>Other</option></select></Field>
              <Field label="Dispatch date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
              <Field label="Expected arrival" req><input className="input" type="date" defaultValue="2026-05-27" /></Field>
              <Field label="Carrier"><select className="select"><option>Internal truck (Owen Wallace)</option><option>Carrier — WestEdge</option><option>Customer pickup</option></select></Field>
              <Field label="Tracking #"><input className="input mono" placeholder="WE-…" /></Field>
              <Field label="Driver / handover"><select className="select">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select></Field>
              <Field label="Notes" hint="Appears on pick list and receipt notification."><input className="input" placeholder="Optional — e.g. 'fragile, top stack only'" /></Field>
            </div>
          </Card>

          <Card title="Items to move" sub={lines.length + ' SKUs · ' + totalUnits + ' units'} pad={false}>
            <table className="tbl">
              <thead><tr><th style={{width:30}}>#</th><th>SKU</th><th>Item</th><th className="ta-right">Available</th><th className="ta-right" style={{width:120}}>Move qty</th><th>Unit</th><th>Source bin</th><th>Dest. bin</th><th style={{width:32}}></th></tr></thead>
              <tbody>
                {lines.map((l, i) => {
                  const over = l.qty > l.fromAvail;
                  return (
                    <tr key={i}>
                      <td className="muted col-num">{i+1}</td>
                      <td><input className="input col-id" defaultValue={l.sku} style={{padding:'4px 6px', fontSize:11.5}}/></td>
                      <td className="fw-6">{l.name}</td>
                      <td className="ta-right col-num muted">{l.fromAvail}</td>
                      <td className="ta-right"><input className="input col-num" type="number" value={l.qty} onChange={e => update(i,'qty',+e.target.value)} style={{width:100, textAlign:'right', padding:'4px 8px', color: over ? 'var(--c-neg)' : undefined}}/></td>
                      <td className="muted">{l.unit}</td>
                      <td><input className="input col-id" defaultValue="A-12-3" style={{padding:'4px 6px', fontSize:11.5, width:90}}/></td>
                      <td><input className="input col-id" defaultValue="C-08-2" style={{padding:'4px 6px', fontSize:11.5, width:90}}/></td>
                      <td><div className="row-actions" style={{opacity:1}}><button onClick={() => remove(i)}><i className="fa-solid fa-xmark"/></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="row" style={{padding:'10px 14px', borderTop:'1px solid var(--line)'}}>
              <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus"/> Add line</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-barcode"/> Scan</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-clone"/> Copy from past transfer</button>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Move impact">
            <div className="col gap-3">
              <div>
                <div className="t-xs muted">From — Warehouse A</div>
                <div className="row gap-2 mt-1"><i className="fa-solid fa-warehouse"/><span className="fw-7 mono">−{totalUnits} units</span></div>
                <div className="bar mt-2"><span style={{width:'42%', background:'var(--c-info)'}}/></div>
              </div>
              <div>
                <div className="t-xs muted">In transit (1 day)</div>
                <div className="row gap-2 mt-1"><i className="fa-solid fa-truck"/><span className="fw-7 mono">{totalUnits} units</span></div>
              </div>
              <div>
                <div className="t-xs muted">To — Warehouse B</div>
                <div className="row gap-2 mt-1"><i className="fa-solid fa-warehouse"/><span className="fw-7 mono" style={{color:'var(--c-pos)'}}>+{totalUnits} units</span></div>
                <div className="bar mt-2"><span style={{width:'68%', background:'var(--c-pos)'}}/></div>
              </div>
            </div>
          </Card>
          <Card title="On dispatch">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Print pick list for the picker</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Print destination labels</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Notify destination warehouse</label>
              <label className="row gap-2"><input type="checkbox" /> Lock source bins until received</label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   8. NEW ADJUSTMENT
   ============================================================= */
function AdjustmentForm({ onPage }) {
  const [lines, setLines] = useState([
    { sku: 'CB-CAT6-30', name: 'Cat6 patch cable 30m', qty: -4, cost: 16.40, bin: 'C-09-3' },
    { sku: 'LED-T8-18',  name: 'LED T8 tube 18W',      qty: -2, cost: 8.10,  bin: 'C-08-2' },
  ]);
  const update = (i, key, val) => setLines(lines.map((l,j) => j === i ? { ...l, [key]: val } : l));
  const remove = i => setLines(lines.filter((_,j) => j !== i));
  const add = () => setLines([...lines, { sku: '', name: '', qty: 0, cost: 0, bin: '' }]);
  const totalValue = lines.reduce((s,l) => s + l.qty * l.cost, 0);

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <FormHead
        onPage={onPage} backTo="adjustments" backLabel="Back to adjustments"
        title="New stock adjustment"
        idHint="ADJ-189"
        sub="Bring system stock in line with physical reality — and post the cost variance to the right GL account"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Post adjustment</button>
        </>}
      />
      <div className="banner" style={{ marginBottom: 16, background: totalValue < -500 ? 'var(--c-warn-soft)' : 'var(--c-info-soft)', color: totalValue < -500 ? 'var(--c-warn)' : 'var(--c-info)', borderColor: 'color-mix(in oklch, ' + (totalValue < -500 ? 'var(--c-warn)' : 'var(--c-info)') + ' 30%, transparent)' }}>
        <i className={'fa-solid ' + (totalValue < -500 ? 'fa-shield-halved' : 'fa-circle-info')} />
        <div>{totalValue < -500 ? 'Adjustments over $500 require approval from Maria R.' : 'Under the $500 threshold — posts immediately on submit.'}</div>
      </div>

      <Card title="Reason & scope">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Adjustment type" req>
            <div className="seg" style={{width:'100%'}}>
              <button className="is-active" style={{flex:1}}>Write down (loss)</button>
              <button style={{flex:1}}>Write up (gain)</button>
              <button style={{flex:1}}>Reclassify</button>
            </div>
          </Field>
          <Field label="Reason" req>
            <select className="select">
              <option>Damage</option><option>Theft / loss</option><option>Expiry</option><option>Found stock</option>
              <option>Cycle count variance</option><option>Re-grade</option><option>Sample / give-away</option><option>Other</option>
            </select>
          </Field>
          <Field label="Date" req><input className="input" type="date" defaultValue="2026-05-26" /></Field>
          <Field label="Warehouse"><select className="select"><option>Warehouse A</option><option>Warehouse B</option><option>Yard</option></select></Field>
          <Field label="Initiated by"><select className="select" defaultValue="Daniel Kang">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select></Field>
          <Field label="Source document"><input className="input" placeholder="e.g. SC-0048 stock count, GRN-4426 receipt" /></Field>
          <Field label="GL — variance posts to" req>
            <select className="select">
              <option>5200 · Inventory shrinkage</option>
              <option>5210 · Inventory write-off</option>
              <option>5220 · Damaged goods</option>
              <option>6080 · Other expense</option>
            </select>
          </Field>
          <Field label="Department / cost center"><select className="select"><option>—</option><option>Receiving</option><option>Pick-pack</option><option>Returns</option></select></Field>
          <Field label="Explanation" req span={2}>
            <textarea className="input" rows={3} defaultValue="During GRN-4426 unpack we found 4 Cat6 patch cables with crushed plug housings and 2 LED tubes with broken glass — likely transit damage. Photographed, set aside, debit note draft to be issued to Lumio." />
          </Field>
        </div>
      </Card>

      <Card title="Items adjusted" sub={lines.length + ' SKUs · variance ' + fmtMoney(totalValue, 2)} pad={false}>
        <table className="tbl">
          <thead><tr><th style={{width:30}}>#</th><th>SKU</th><th>Item</th><th>Bin</th><th className="ta-right" style={{width:120}}>Change</th><th className="ta-right">Unit cost</th><th className="ta-right">Value impact</th><th style={{width:32}}></th></tr></thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td className="muted col-num">{i+1}</td>
                <td><input className="input col-id" defaultValue={l.sku} style={{padding:'4px 6px', fontSize:11.5}}/></td>
                <td className="fw-6">{l.name}</td>
                <td><input className="input col-id" defaultValue={l.bin} style={{padding:'4px 6px', fontSize:11.5, width:80}}/></td>
                <td className="ta-right"><input className="input col-num" type="number" value={l.qty} onChange={e => update(i,'qty',+e.target.value)} style={{width:100, textAlign:'right', padding:'4px 8px', color: l.qty < 0 ? 'var(--c-neg)' : 'var(--c-pos)'}}/></td>
                <td className="ta-right col-num muted">{fmtMoney(l.cost, 2)}</td>
                <td className="ta-right col-num fw-7" style={{color: l.qty * l.cost < 0 ? 'var(--c-neg)' : 'var(--c-pos)'}}>{l.qty * l.cost < 0 ? '−' : '+'}{fmtMoney(Math.abs(l.qty * l.cost), 2)}</td>
                <td><div className="row-actions" style={{opacity:1}}><button onClick={() => remove(i)}><i className="fa-solid fa-xmark"/></button></div></td>
              </tr>
            ))}
            <tr style={{ background: 'var(--bg-sub)', fontWeight: 700 }}>
              <td colSpan="6" className="ta-right">Total variance</td>
              <td className="ta-right col-num fw-7" style={{color: totalValue < 0 ? 'var(--c-neg)' : 'var(--c-pos)'}}>{totalValue < 0 ? '−' : '+'}{fmtMoney(Math.abs(totalValue), 2)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className="row" style={{padding:'10px 14px', borderTop:'1px solid var(--line)'}}>
          <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus"/> Add line</button>
          <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-paperclip"/> Attach photos</button>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   9. START STOCK COUNT
   ============================================================= */
function StartCount({ onPage }) {
  const [type, setType] = useState('cycle');
  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <FormHead
        onPage={onPage} backTo="stockcount" backLabel="Back to stock counts"
        title="Start stock count"
        sub="Generate a count sheet, hand to the warehouse team, and reconcile variances on close"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-play" /> Generate &amp; start</button>
        </>}
      />
      <Card title="Count type">
        <Field label="Scope" req>
          <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
            {[
              { id: 'cycle',  label: 'Cycle count', desc: 'A slice of SKUs — fast, recurring' },
              { id: 'spot',   label: 'Spot check',  desc: 'A single SKU or bin you suspect' },
              { id: 'full',   label: 'Full count',  desc: 'Everything. Usually year-end. Freezes the warehouse.' },
              { id: 'audit',  label: 'Auditor count', desc: 'External sample — locks SKUs once started' },
            ].map(t => (
              <div key={t.id} onClick={() => setType(t.id)} style={{
                flex: 1, minWidth: 200, padding: 14, borderRadius: 8, cursor: 'pointer',
                border: '1.5px solid ' + (type === t.id ? 'var(--brand)' : 'var(--line)'),
                background: type === t.id ? 'var(--brand-soft)' : 'var(--card)',
              }}>
                <div className="row gap-2"><span className={'chk' + (type === t.id ? ' is-on' : '')} style={{borderRadius:11}} /><span className="fw-6">{t.label}</span></div>
                <div className="t-xs muted mt-2">{t.desc}</div>
              </div>
            ))}
          </div>
        </Field>
      </Card>

      <Card title="What to count">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Warehouse" req><select className="select"><option>Warehouse A</option><option>Warehouse B</option><option>Yard</option><option>All warehouses</option></select></Field>
          <Field label={type === 'spot' ? 'SKU or bin' : 'Zone / category'}>
            <select className="select">
              {type === 'cycle' && <><option>Zone A — Fasteners (124 SKUs)</option><option>Zone B — Plumbing (96)</option><option>Zone C — Electrical (218)</option><option>Zone F — Tools (96)</option></>}
              {type === 'spot' && <><option>Single SKU…</option><option>Single bin…</option></>}
              {type === 'full' && <option>Entire warehouse (1,284 SKUs)</option>}
              {type === 'audit' && <><option>Random 10% sample</option><option>Auditor-selected sample</option></>}
            </select>
          </Field>
          <Field label="Strategy" hint="Cycle counts use ABC velocity by default.">
            <select className="select">
              <option>ABC — A items every 30d, B every 90d, C every 365d</option>
              <option>Highest-value SKUs first</option>
              <option>Random sampling</option>
              <option>Recently moved only</option>
            </select>
          </Field>
          <Field label="Counters" hint="Two-person blind count gives best accuracy.">
            <select className="select"><option>Two-person blind count</option><option>Single counter</option><option>Auto-assign from team</option></select>
          </Field>
          <Field label="Start" req><input className="input" type="datetime-local" defaultValue="2026-05-26T18:00" /></Field>
          <Field label="Target close" hint={type === 'full' ? 'Warehouse is read-only until close.' : 'Soft target — extend if needed.'}>
            <input className="input" type="datetime-local" defaultValue="2026-05-27T08:00" />
          </Field>
          <Field label="Freeze stock?" span={2}>
            <div className="seg" style={{width:'fit-content'}}>
              <button className={type !== 'full' ? 'is-active' : ''}>No — keep transacting</button>
              <button className={type === 'full' ? 'is-active' : ''}>Yes — freeze (writes only on close)</button>
            </div>
          </Field>
        </div>
      </Card>

      <Card title="Preview">
        <div className="grid-3" style={{ gap: 14 }}>
          <div className="kpi"><div className="kpi-lbl">SKUs in this count</div><div className="kpi-val">{type === 'cycle' ? 142 : type === 'spot' ? 1 : type === 'audit' ? 128 : 1284}</div><div className="kpi-foot"><span className="muted">{type === 'cycle' ? 'Zone A' : type === 'full' ? 'whole warehouse' : '—'}</span></div></div>
          <div className="kpi"><div className="kpi-lbl">Bins to visit</div><div className="kpi-val">{type === 'cycle' ? 84 : type === 'spot' ? 1 : type === 'audit' ? 78 : 624}</div><div className="kpi-foot"><span className="muted">walk-path optimised</span></div></div>
          <div className="kpi"><div className="kpi-lbl">Est. time</div><div className="kpi-val">{type === 'cycle' ? '4 h' : type === 'spot' ? '10 min' : type === 'audit' ? '6 h' : '32 h'}</div><div className="kpi-foot"><span className="muted">two counters</span></div></div>
        </div>
        <div className="banner info mt-3"><i className="fa-solid fa-mobile-screen-button"/><div className="t-sm">Counters will see this sheet on the warehouse mobile app — scan barcode, key qty, next bin. Variances surface on close for adjustment.</div></div>
      </Card>
    </div>
  );
}

/* =============================================================
   10. NEW LOCATION
   ============================================================= */
function LocationForm({ onPage }) {
  const [kind, setKind] = useState('Bin');
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <FormHead
        onPage={onPage} backTo="locations" backLabel="Back to locations"
        title="New location"
        sub="A new warehouse, zone or bin — the physical address stock lives at"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-print" /> Print sign</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create location</button>
        </>}
      />
      <Card title="Type">
        <Field label="Location type" req>
          <div className="seg" style={{width:'100%'}}>
            {['Warehouse','Zone','Aisle','Bin','Yard','Returns','Quarantine'].map(t => (
              <button key={t} className={kind === t ? 'is-active' : ''} onClick={() => setKind(t)} style={{flex:1}}>{t}</button>
            ))}
          </div>
        </Field>
      </Card>
      <Card title="Identity">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Code" req hint="Scannable identifier. Bins use parent-aisle-position.">
            <input className="input mono" placeholder={kind === 'Warehouse' ? 'WH-C' : kind === 'Zone' ? 'A-Z03' : 'A-12-3'} />
          </Field>
          <Field label="Name" req><input className="input" placeholder={kind + ' name'} /></Field>
          <Field label="Parent" hint="Bins live inside Zones, Zones inside Warehouses.">
            <select className="select">
              {kind === 'Warehouse' && <option>—</option>}
              {kind === 'Zone' && <><option>Warehouse A</option><option>Warehouse B</option><option>Yard</option></>}
              {kind === 'Bin' && <><option>Zone A — Fasteners (WH-A)</option><option>Zone B — Plumbing (WH-A)</option><option>Zone C — Electrical (WH-B)</option></>}
            </select>
          </Field>
          <Field label="Address (if warehouse)" span={2}><textarea className="input" rows={2} placeholder={'Street\nCity, State ZIP'} /></Field>
        </div>
      </Card>

      <Card title="Physical">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Capacity" req hint="In whichever unit fits.">
            <div className="row gap-2"><input className="input mono" defaultValue="4" style={{flex:1}}/><select className="select" style={{maxWidth:120}}><option>pallets</option><option>bins</option><option>m³</option><option>kg</option></select></div>
          </Field>
          <Field label="Dimensions (LxWxH)"><input className="input mono" placeholder="120 × 80 × 200 cm" /></Field>
          <Field label="Weight limit"><div className="row gap-2"><input className="input mono" placeholder="500" style={{flex:1}}/><span className="muted">kg</span></div></Field>
          <Field label="Pick face?" span={2}>
            <label className="row gap-2"><input type="checkbox" defaultChecked /> Pickers can pick directly from this bin (vs bulk-only)</label>
          </Field>
        </div>
      </Card>

      <Card title="Restrictions">
        <div className="col gap-2 t-sm">
          <label className="row gap-2"><input type="checkbox" /> Hazmat — restricted access</label>
          <label className="row gap-2"><input type="checkbox" /> Cold storage (≤ 8°C)</label>
          <label className="row gap-2"><input type="checkbox" /> Heavy items only (forklift required)</label>
          <label className="row gap-2"><input type="checkbox" /> Quarantine — no transactions until QA passes</label>
          <label className="row gap-2"><input type="checkbox" /> Damaged goods holding</label>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   11. BULK ADD PRODUCTS
   ============================================================= */
function BulkAdd({ onPage }) {
  const sample = [
    { sku: 'BLT-HX-M10', name: 'Hex bolt M10 × 30 zinc', cat: 'Fasteners', brand: 'Atlas',   unit: 'pcs', cost: 0.18, price: 0.42, status: 'ok' },
    { sku: 'BLT-HX-M14', name: 'Hex bolt M14 × 40 zinc', cat: 'Fasteners', brand: 'Atlas',   unit: 'pcs', cost: 0.42, price: 0.96, status: 'ok' },
    { sku: 'PVC-CPL-3',  name: 'PVC coupling 3"',         cat: 'Plumbing',  brand: 'Polyflo', unit: 'pcs', cost: 1.10, price: 2.40, status: 'ok' },
    { sku: 'PVC-CPL-2',  name: 'PVC coupling 2"',         cat: 'Plumbing',  brand: 'Polyflo', unit: 'pcs', cost: 0.80, price: 1.80, status: 'dup' },
    { sku: 'LED-T8-22',  name: 'LED T8 tube 22W',         cat: 'Electrical',brand: 'Lumio',   unit: 'pcs', cost: 9.80, price: 17.40,status: 'ok' },
    { sku: 'LED-T5-14',  name: 'LED T5 tube 14W',         cat: 'Electrical',brand: 'Lumio',   unit: 'pcs', cost: 6.20, price: 11.80,status: 'warn' },
    { sku: '',           name: 'Battery 12V 12Ah',        cat: 'Electrical',brand: '?',       unit: 'pcs', cost: 28.00,price: 54.00,status: 'err' },
  ];
  const ok = sample.filter(r => r.status === 'ok').length;
  const dup = sample.filter(r => r.status === 'dup').length;
  const warn = sample.filter(r => r.status === 'warn').length;
  const err = sample.filter(r => r.status === 'err').length;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <FormHead
        onPage={onPage} backTo="inventory" backLabel="Back to products"
        title="Bulk add products"
        sub="Upload or paste a spreadsheet — we validate, dedupe, then create"
        actions={<>
          <button className="btn"><i className="fa-solid fa-download" /> Template</button>
          <button className="btn btn-primary" disabled={err > 0}><i className="fa-solid fa-check" /> Create {ok + warn} products</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Source">
            <div className="seg mb-3">
              <button className="is-active"><i className="fa-solid fa-file-csv" /> CSV / XLSX</button>
              <button><i className="fa-regular fa-clipboard" /> Paste from spreadsheet</button>
              <button><i className="fa-solid fa-globe" /> From supplier catalog</button>
              <button><i className="fa-solid fa-code" /> API import</button>
            </div>
            <div style={{ border: '1.5px dashed var(--line-strong)', borderRadius: 10, padding: 24, textAlign: 'center', background: 'var(--bg-sub)' }}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 28, color: 'var(--text-3)' }} />
              <div className="fw-6 mt-2">Drop your file here or <a href="#" style={{color:'var(--brand)'}}>browse</a></div>
              <div className="t-xs muted mt-1">CSV, XLSX up to 25MB · up to 10,000 rows per import</div>
            </div>
            <div className="row mt-3 gap-2 t-sm">
              <i className="fa-solid fa-file-csv" style={{color:'var(--c-pos)'}}/>
              <span className="fw-6">products-2026-may.xlsx</span>
              <span className="muted">· 7 rows · 14 KB</span>
              <button className="btn btn-sm btn-ghost ml-auto"><i className="fa-solid fa-xmark"/></button>
            </div>
          </Card>

          <Card title="Column mapping" sub="Match your columns to our fields">
            <table className="tbl">
              <thead><tr><th>Your column</th><th>Maps to</th><th>Preview</th></tr></thead>
              <tbody>
                {[
                  ['Item code',       'SKU',           'BLT-HX-M10'],
                  ['Item name',       'Product name',  'Hex bolt M10 × 30 zinc'],
                  ['Group',           'Category',      'Fasteners'],
                  ['Brand',           'Brand',         'Atlas'],
                  ['UOM',             'Unit of measure','pcs'],
                  ['Cost USD',        'Cost',          '$0.18'],
                  ['Retail USD',      'Price',         '$0.42'],
                  ['Min',             'Reorder point', '120'],
                ].map(([col, field, prev], i) => (
                  <tr key={i}>
                    <td className="col-id">{col}</td>
                    <td>
                      <select className="select" defaultValue={field} style={{minWidth:200}}>
                        <option>{field}</option>
                        <option>(ignore)</option>
                      </select>
                    </td>
                    <td className="muted-2 t-sm">{prev}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Preview" sub={sample.length + ' rows · ' + ok + ' OK · ' + warn + ' warnings · ' + dup + ' duplicates · ' + err + ' errors'} pad={false}>
            <table className="tbl">
              <thead><tr><th></th><th>SKU</th><th>Product</th><th>Category</th><th>Brand</th><th className="ta-right">Cost</th><th className="ta-right">Price</th><th>Issue</th></tr></thead>
              <tbody>
                {sample.map((r, i) => (
                  <tr key={i} style={{ background: r.status === 'err' ? 'var(--c-neg-soft)' : r.status === 'dup' ? 'var(--c-warn-soft)' : undefined }}>
                    <td>
                      {r.status === 'ok' && <i className="fa-solid fa-circle-check" style={{color:'var(--c-pos)'}}/>}
                      {r.status === 'warn' && <i className="fa-solid fa-triangle-exclamation" style={{color:'var(--c-warn)'}}/>}
                      {r.status === 'dup' && <i className="fa-solid fa-clone" style={{color:'var(--c-warn)'}}/>}
                      {r.status === 'err' && <i className="fa-solid fa-circle-xmark" style={{color:'var(--c-neg)'}}/>}
                    </td>
                    <td className="col-id">{r.sku || <span style={{color:'var(--c-neg)'}}>missing</span>}</td>
                    <td className="fw-6">{r.name}</td>
                    <td><span className="tag">{r.cat}</span></td>
                    <td>{r.brand === '?' ? <span style={{color:'var(--c-neg)'}}>unknown</span> : r.brand}</td>
                    <td className="ta-right col-num">${r.cost.toFixed(2)}</td>
                    <td className="ta-right col-num">${r.price.toFixed(2)}</td>
                    <td className="t-xs muted">
                      {r.status === 'ok' && '—'}
                      {r.status === 'warn' && 'Margin only 47% (below 50% target)'}
                      {r.status === 'dup' && 'Already exists — will skip'}
                      {r.status === 'err' && 'Missing SKU & brand'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Summary">
            <div className="col gap-2 t-sm">
              <MoneyRow label="Rows in file" value={sample.length} />
              <MoneyRow label="Will create" value={ok + warn} tone="var(--c-pos)" />
              <MoneyRow label="Duplicates (skipped)" value={dup} tone="var(--c-warn)" />
              <MoneyRow label="Errors (must fix)" value={err} tone="var(--c-neg)" />
              <div className="divider" style={{margin:'6px 0'}}/>
              <MoneyRow label="Inventory value added" value={fmtMoney((ok + warn) * 240, 0)} bold />
            </div>
          </Card>
          <Card title="Defaults for missing fields">
            <div className="col gap-2 t-sm">
              <Field label="Default warehouse"><select className="select"><option>Warehouse A</option><option>Warehouse B</option></select></Field>
              <Field label="Default category"><select className="select"><option>(use file column)</option><option>Uncategorised</option></select></Field>
              <Field label="Default reorder rule"><select className="select"><option>Standard — 30d cover</option><option>None</option></select></Field>
            </div>
          </Card>
          <Card title="On create">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Auto-generate barcodes</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Print bin labels</label>
              <label className="row gap-2"><input type="checkbox" /> Push to Shopify storefront</label>
              <label className="row gap-2"><input type="checkbox" /> Notify buyer to source initial PO</label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   12. NEW PRODUCT
   ============================================================= */
function ProductForm({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="inventory" backLabel="Back to products"
        title="New product"
        sub="Master SKU record — drives stock, pricing, reorder rules, barcodes"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-eye" /> Preview detail page</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create product</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Identity">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Product name" req span={2}><input className="input" placeholder="e.g. Hex bolt M12 × 40 zinc-plated" /></Field>
              <Field label="SKU" req hint="Use a consistent convention — drives barcode and search."><input className="input mono" placeholder="BLT-HX-M12-40" /></Field>
              <Field label="Barcode (UPC/EAN)"><input className="input mono" placeholder="auto-generate if blank" /></Field>
              <Field label="Category" req><select className="select"><option>Fasteners → Hex bolts</option><option>Plumbing → Fittings</option><option>Electrical → Lighting</option><option>Tools → Hand tools</option></select></Field>
              <Field label="Brand"><select className="select"><option>Atlas</option><option>Polyflo</option><option>Lumio</option><option>IronGrip</option><option>+ New brand</option></select></Field>
              <Field label="Description (short)" span={2}>
                <textarea className="input" rows={2} placeholder="One line — shown on quotes, invoices and POs." />
              </Field>
              <Field label="Detailed description" span={2}>
                <textarea className="input" rows={4} placeholder="Long form — shown on storefront and spec sheets. Markdown supported." />
              </Field>
              <Field label="Tags"><input className="input" placeholder="hex, bolt, grade-8, zinc-plated" /></Field>
              <Field label="Image" hint="Drag in or pick from media library.">
                <button className="btn btn-sm" style={{width:'100%'}}><i className="fa-solid fa-image"/> Add image</button>
              </Field>
            </div>
          </Card>

          <Card title="Pricing">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Unit cost" req hint="What you pay your supplier."><div className="row gap-2"><span className="muted">$</span><input className="input mono fw-7" placeholder="0.18" style={{flex:1}}/></div></Field>
              <Field label="Retail price" req hint="Default sell price — overridable per customer."><div className="row gap-2"><span className="muted">$</span><input className="input mono fw-7" placeholder="0.42" style={{flex:1}}/></div></Field>
              <Field label="Margin"><div className="row gap-2"><input className="input mono fw-7" defaultValue="57" readOnly style={{flex:1}}/><span className="muted">%</span></div></Field>
              <Field label="MSRP / list"><div className="row gap-2"><span className="muted">$</span><input className="input mono" placeholder="0.50" style={{flex:1}}/></div></Field>
              <Field label="Wholesale tier 1"><div className="row gap-2"><span className="muted">$</span><input className="input mono" placeholder="0.38" style={{flex:1}}/></div></Field>
              <Field label="Wholesale tier 2"><div className="row gap-2"><span className="muted">$</span><input className="input mono" placeholder="0.34" style={{flex:1}}/></div></Field>
              <Field label="Tax class"><select className="select"><option>Standard taxable</option><option>Tax exempt</option><option>Reduced (food, medical)</option></select></Field>
              <Field label="Currency"><select className="select"><option>USD</option></select></Field>
            </div>
          </Card>

          <Card title="Stock & reorder">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Unit of measure" req><select className="select"><option>Piece (pcs)</option><option>Box of 100</option><option>Pallet</option><option>Set</option><option>Meter</option><option>Kilogram</option></select></Field>
              <Field label="Track inventory?">
                <div className="seg" style={{width:'100%'}}>
                  <button className="is-active" style={{flex:1}}>Yes</button>
                  <button style={{flex:1}}>No — service/non-stock</button>
                </div>
              </Field>
              <Field label="Opening qty" hint="Auto-creates an adjustment to set initial stock."><input className="input mono" placeholder="0" defaultValue="240"/></Field>
              <Field label="Default warehouse"><select className="select"><option>Warehouse A</option><option>Warehouse B</option><option>Yard</option></select></Field>
              <Field label="Default bin"><input className="input mono" placeholder="A-12-3" /></Field>
              <Field label="Preferred supplier"><select className="select"><option>Atlas Fasteners</option><option>Polyflo Industries</option><option>Lumio Electrical</option></select></Field>
              <Field label="Reorder point" hint="Trigger when on-hand drops to this."><input className="input mono" placeholder="120" /></Field>
              <Field label="Reorder qty"><input className="input mono" placeholder="240" /></Field>
              <Field label="Supplier lead time"><div className="row gap-2"><input className="input mono" defaultValue="5" style={{flex:1}}/><span className="muted">days</span></div></Field>
              <Field label="Min order qty"><input className="input mono" placeholder="24" /></Field>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Physical">
            <div className="col gap-3">
              <Field label="Weight"><div className="row gap-2"><input className="input mono" placeholder="0.024" style={{flex:1}}/><select className="select" style={{maxWidth:80}}><option>kg</option><option>g</option><option>lb</option></select></div></Field>
              <Field label="Dimensions"><div className="row gap-2"><input className="input mono" placeholder="L" style={{flex:1}}/><input className="input mono" placeholder="W" style={{flex:1}}/><input className="input mono" placeholder="H" style={{flex:1}}/><select className="select" style={{maxWidth:80}}><option>cm</option><option>mm</option><option>in</option></select></div></Field>
              <label className="row gap-2 t-sm"><input type="checkbox" /> Fragile</label>
              <label className="row gap-2 t-sm"><input type="checkbox" /> Hazmat</label>
              <label className="row gap-2 t-sm"><input type="checkbox" /> Serial-tracked</label>
              <label className="row gap-2 t-sm"><input type="checkbox" /> Batch / lot-tracked</label>
            </div>
          </Card>
          <Card title="Channels & visibility">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> POS — show in cashier search</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Sales orders — pickable</label>
              <label className="row gap-2"><input type="checkbox" /> Online storefront (Shopify)</label>
              <label className="row gap-2"><input type="checkbox" /> Amazon marketplace</label>
            </div>
          </Card>
          <Card title="Status">
            <Field label="Lifecycle"><select className="select"><option>Active</option><option>Pre-launch</option><option>Discontinued — sell-through</option><option>Archived</option></select></Field>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   13. NEW CATEGORY
   ============================================================= */
function CategoryForm({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <FormHead
        onPage={onPage} backTo="categories" backLabel="Back to categories"
        title="New product category"
        sub="A new node in the taxonomy tree — drives reporting, default GL accounts, and reorder templates"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create category</button>
        </>}
      />
      <Card title="Identity">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Category name" req span={2}>
            <input className="input" placeholder="e.g. Smart lighting" />
          </Field>
          <Field label="Code" req hint="Used as a prefix in SKUs and reports."><input className="input mono" placeholder="EL-SL" /></Field>
          <Field label="Parent category">
            <select className="select">
              <option>None (top-level)</option>
              <option>Hardware</option>
              <option>Hardware → Fasteners</option>
              <option>Building</option>
              <option>Building → Lumber</option>
              <option>Electrical</option>
              <option>Electrical → Lighting</option>
              <option>Plumbing</option>
              <option>Paint</option>
              <option>Adhesives</option>
            </select>
          </Field>
          <Field label="Description" span={2}>
            <textarea className="input" rows={2} placeholder="Optional — explain when this category fits, what's in vs out." />
          </Field>
          <Field label="Icon"><div className="row gap-2"><div style={{width:34, height:34, borderRadius:7, background:'var(--brand-soft)', color:'var(--brand-soft-fg)', display:'grid', placeItems:'center'}}><i className="fa-solid fa-bolt"/></div><button className="btn btn-sm">Change</button></div></Field>
          <Field label="Color"><div className="row gap-2">
            {['var(--brand)','var(--c-pos)','var(--c-warn)','var(--c-info)','var(--c-violet)','var(--c-neg)'].map(c => (
              <div key={c} style={{width:24, height:24, borderRadius:12, background:c, cursor:'pointer', border:'2px solid var(--card)', boxShadow:'0 0 0 1px var(--line)'}}/>
            ))}
          </div></Field>
        </div>
      </Card>

      <Card title="Accounting defaults">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Sales account" req>
            <select className="select"><option>4010 · Product sales</option><option>4011 · Sales — Electrical</option><option>4020 · Services</option></select>
            <div className="t-xs muted mt-1">Where revenue from this category posts.</div>
          </Field>
          <Field label="COGS account" req>
            <select className="select"><option>5000 · COGS Hardware</option><option>5020 · COGS Electrical</option><option>5010 · COGS Building</option></select>
          </Field>
          <Field label="Inventory account">
            <select className="select"><option>1030 · Inventory</option><option>1031 · Inventory — Electrical</option></select>
          </Field>
          <Field label="Tax class">
            <select className="select"><option>Standard taxable</option><option>Tax exempt</option><option>Reduced rate</option></select>
          </Field>
        </div>
      </Card>

      <Card title="Defaults for products">
        <div className="col gap-2 t-sm">
          <Field label="Default unit of measure"><select className="select"><option>Piece (pcs)</option><option>Box</option><option>Meter</option><option>Kilogram</option></select></Field>
          <Field label="Default reorder rule"><select className="select"><option>Standard — 30d cover</option><option>Fast-mover — 14d</option><option>Custom per SKU</option><option>None</option></select></Field>
          <Field label="Target margin"><div className="row gap-2"><input className="input mono" defaultValue="45" style={{maxWidth:80}}/><span className="muted">% — below triggers a warning</span></div></Field>
          <Field label="Default warehouse"><select className="select"><option>Warehouse A</option><option>Warehouse B</option></select></Field>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   REORDER RULES — configure per-SKU reorder points & auto-PO
   ============================================================= */
function ReorderRulesForm({ onPage }) {
  const { PRODUCTS, fmtMoney } = window.WMS;
  const { useState } = React;

  const [rows, setRows] = useState([
    { sku: 'LED-T8-18', name: 'LED T8 tube 18W 4ft',        supplier: 'Lumio',    rp: 120,  rop: 240, lead: 5,  auto: true,  min: 80,  max: 480 },
    { sku: 'WD-OAK-12', name: 'Oak plank 12mm 1.2m',        supplier: 'Cascade',  rp: 24,   rop: 60,  lead: 14, auto: false, min: 20,  max: 120 },
    { sku: 'TR-SPN-10', name: 'Spanner set 10pc chrome',    supplier: 'IronGrip', rp: 40,   rop: 20,  lead: 21, auto: false, min: 20,  max: 80  },
    { sku: 'CB-CAT6-30',name: 'Cat6 patch cable 30m',       supplier: 'Lumio',    rp: 30,   rop: 60,  lead: 5,  auto: true,  min: 20,  max: 120 },
    { sku: 'PMP-CW-1HP',name: 'Centrifugal water pump 1HP', supplier: 'Hydrox',   rp: 16,   rop: 10,  lead: 21, auto: false, min: 8,   max: 30  },
    { sku: 'BAT-12V-7A',name: 'Sealed lead-acid 12V 7Ah',   supplier: 'PowerCell',rp: 40,   rop: 60,  lead: 10, auto: true,  min: 20,  max: 120 },
    { sku: 'PT-WHT-5G', name: 'Interior paint white 5 gal', supplier: 'Beacon',   rp: 80,   rop: 40,  lead: 7,  auto: false, min: 40,  max: 200 },
  ]);
  const upd = (i, k, v) => setRows(rows.map((r,j) => j===i ? {...r,[k]:v} : r));

  return (
    <div className="page" style={{ maxWidth: 1200 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('reorder')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to reorder center
          </button>
          <h1>Reorder rules</h1>
          <div className="ph-sub">Define when and how much to reorder per SKU — drives auto-PO and the reorder center alerts</div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Save all rules</button>
        </div>
      </div>

      <div className="banner info" style={{ marginBottom: 16 }}>
        <i className="fa-solid fa-circle-info" />
        <div>
          <strong>Reorder point</strong> = quantity that triggers an alert.
          <strong style={{ marginLeft: 12 }}>Reorder qty</strong> = how much to order.
          <strong style={{ marginLeft: 12 }}>Lead time</strong> = supplier days to delivery.
          Toggle <strong style={{ marginLeft: 4 }}>Auto</strong> to create POs automatically when ROP is hit.
        </div>
      </div>

      <div className="card">
        <div className="card-hd">
          <h3>SKU rules</h3>
          <span className="hd-sub">{rows.length} SKUs configured · {rows.filter(r=>r.auto).length} auto-reorder enabled</span>
          <div className="hd-actions">
            <button className="btn btn-sm"><i className="fa-solid fa-wand-magic-sparkles" /> AI suggest rules</button>
          </div>
        </div>
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Preferred supplier</th>
                <th className="ta-right" style={{width:90}}>On hand</th>
                <th className="ta-right" style={{width:100}}>Reorder pt</th>
                <th className="ta-right" style={{width:100}}>Order qty</th>
                <th className="ta-right" style={{width:80}}>Lead (d)</th>
                <th className="ta-right" style={{width:80}}>Min stock</th>
                <th className="ta-right" style={{width:80}}>Max stock</th>
                <th style={{width:80, textAlign:'center'}}>Auto-PO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const prod = PRODUCTS.find(p => p.sku === r.sku);
                const onHand = prod?.qty ?? 0;
                const below = onHand <= r.rp;
                return (
                  <tr key={r.sku} style={below ? {background:'color-mix(in oklch, var(--c-warn-soft) 40%, transparent)'} : undefined}>
                    <td className="col-id">{r.sku}</td>
                    <td>
                      <div className="fw-6" style={{fontSize:12}}>{r.name.length>28 ? r.name.slice(0,28)+'…' : r.name}</div>
                      {below && <span className="pill warn" style={{fontSize:9}}>below ROP</span>}
                    </td>
                    <td>
                      <select className="select" value={r.supplier} onChange={e=>upd(i,'supplier',e.target.value)} style={{padding:'3px 8px',fontSize:12}}>
                        {['Lumio','Cascade','IronGrip','Hydrox','PowerCell','Beacon','Polyflo','Atlas Fasteners'].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="ta-right col-num" style={{color: below ? 'var(--c-warn)' : 'var(--text-2)', fontWeight: below ? 700 : 400}}>{onHand}</td>
                    <td className="ta-right">
                      <input className="input col-num" type="number" value={r.rp} onChange={e=>upd(i,'rp',+e.target.value)} style={{width:75,textAlign:'right',padding:'3px 6px'}}/>
                    </td>
                    <td className="ta-right">
                      <input className="input col-num" type="number" value={r.rop} onChange={e=>upd(i,'rop',+e.target.value)} style={{width:75,textAlign:'right',padding:'3px 6px'}}/>
                    </td>
                    <td className="ta-right">
                      <input className="input col-num" type="number" value={r.lead} onChange={e=>upd(i,'lead',+e.target.value)} style={{width:60,textAlign:'right',padding:'3px 6px'}}/>
                    </td>
                    <td className="ta-right">
                      <input className="input col-num" type="number" value={r.min} onChange={e=>upd(i,'min',+e.target.value)} style={{width:60,textAlign:'right',padding:'3px 6px'}}/>
                    </td>
                    <td className="ta-right">
                      <input className="input col-num" type="number" value={r.max} onChange={e=>upd(i,'max',+e.target.value)} style={{width:60,textAlign:'right',padding:'3px 6px'}}/>
                    </td>
                    <td style={{textAlign:'center'}}>
                      <button type="button" className="twk-toggle" data-on={r.auto?'1':'0'} style={{margin:'0 auto',display:'block'}} onClick={()=>upd(i,'auto',!r.auto)}><i/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="row" style={{padding:'10px 14px', borderTop:'1px solid var(--line)', gap:8}}>
          <button className="btn btn-sm" onClick={() => setRows([...rows, {sku:'',name:'New SKU',supplier:'',rp:0,rop:0,lead:7,auto:false,min:0,max:0}])}>
            <i className="fa-solid fa-plus"/> Add SKU rule
          </button>
          <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-upload"/> Import CSV</button>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   CREATE REORDER POs — bulk-create POs from reorder suggestions
   ============================================================= */
function ReorderPOForm({ onPage }) {
  const { PRODUCTS, fmtMoney } = window.WMS;
  const { useState } = React;

  const suggestions = [
    { sku: 'LED-T8-18', name: 'LED T8 tube 18W 4ft',          supplier: 'Lumio',     onHand: 96,  rp: 120, suggest: 240, price: 8.10,  lead: '5 d',  selected: true  },
    { sku: 'WD-OAK-12', name: 'Oak plank 12mm 1.2m',          supplier: 'Cascade',   onHand: 0,   rp: 24,  suggest: 60,  price: 13.50, lead: '14 d', selected: true  },
    { sku: 'TR-SPN-10', name: 'Spanner set 10pc chrome',      supplier: 'IronGrip',  onHand: 28,  rp: 40,  suggest: 20,  price: 84.00, lead: '21 d', selected: true  },
    { sku: 'CB-CAT6-30',name: 'Cat6 patch cable 30m',         supplier: 'Lumio',     onHand: 8,   rp: 30,  suggest: 60,  price: 16.40, lead: '5 d',  selected: true  },
    { sku: 'PMP-CW-1HP',name: 'Centrifugal water pump 1HP',   supplier: 'Hydrox',    onHand: 12,  rp: 16,  suggest: 10,  price: 285.00,lead: '21 d', selected: false },
    { sku: 'BAT-12V-7A',name: 'Sealed lead-acid 12V 7Ah',     supplier: 'PowerCell', onHand: 0,   rp: 40,  suggest: 60,  price: 22.00, lead: '10 d', selected: true  },
    { sku: 'PT-WHT-5G', name: 'Interior paint white 5 gal',   supplier: 'Beacon',    onHand: 64,  rp: 80,  suggest: 40,  price: 41.20, lead: '7 d',  selected: false },
  ];

  const [rows, setRows] = useState(suggestions);
  const upd = (i, k, v) => setRows(rows.map((r,j) => j===i ? {...r,[k]:v} : r));
  const sel = rows.filter(r => r.selected);

  // Group selected by supplier
  const suppliers = [...new Set(sel.map(r => r.supplier))];
  const grouped = suppliers.map(s => ({
    supplier: s,
    items: sel.filter(r => r.supplier === s),
    total: sel.filter(r => r.supplier === s).reduce((t,r) => t + r.suggest * r.price, 0),
  }));

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('reorder')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to reorder center
          </button>
          <h1>Create POs from reorder</h1>
          <div className="ph-sub">
            Select items and adjust quantities — one PO draft is created per supplier
          </div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save drafts</button>
          <button className="btn btn-primary" disabled={sel.length === 0}>
            <i className="fa-solid fa-check" /> Create {grouped.length} PO{grouped.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>

      <div className="grid-12">
        {/* Left: item selection table */}
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd">
              <h3>Items to reorder</h3>
              <span className="hd-sub">{sel.length} selected · {fmtMoney(sel.reduce((t,r)=>t+r.suggest*r.price,0), 0)} estimated spend</span>
              <div className="hd-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => setRows(rows.map(r=>({...r,selected:true})))}>Select all</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setRows(rows.map(r=>({...r,selected:false})))}>Clear</button>
              </div>
            </div>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{width:28}}></th>
                    <th>SKU</th>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th className="ta-right">On hand</th>
                    <th className="ta-right">ROP</th>
                    <th className="ta-right" style={{width:100}}>Order qty</th>
                    <th className="ta-right">Unit cost</th>
                    <th className="ta-right">Est. total</th>
                    <th>Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.sku} className={r.selected ? '' : 'muted'} style={{opacity: r.selected ? 1 : 0.5}}>
                      <td>
                        <span className={'chk' + (r.selected ? ' is-on' : '')} onClick={() => upd(i,'selected',!r.selected)} />
                      </td>
                      <td className="col-id">{r.sku}</td>
                      <td>
                        <div className="fw-6" style={{fontSize:12}}>{r.name.length>28?r.name.slice(0,28)+'…':r.name}</div>
                        {r.onHand === 0 && <span className="pill neg" style={{fontSize:9}}>out of stock</span>}
                      </td>
                      <td><span className="tag" style={{fontSize:11}}>{r.supplier}</span></td>
                      <td className="ta-right col-num" style={{color: r.onHand<=r.rp ? 'var(--c-warn)' : 'var(--text-2)', fontWeight: r.onHand<=r.rp ? 700 : 400}}>{r.onHand}</td>
                      <td className="ta-right col-num muted">{r.rp}</td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" value={r.suggest} onChange={e=>upd(i,'suggest',+e.target.value)}
                          style={{width:75,textAlign:'right',padding:'3px 6px'}} disabled={!r.selected}/>
                      </td>
                      <td className="ta-right col-num muted">{fmtMoney(r.price,2)}</td>
                      <td className="ta-right col-num fw-6">{r.selected ? fmtMoney(r.suggest*r.price,0) : '—'}</td>
                      <td className="t-sm muted">{r.lead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: PO preview grouped by supplier */}
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>POs to be created</h3><span className="hd-sub">{grouped.length} draft{grouped.length!==1?'s':''}</span></div>
            <div className="card-pad col gap-3">
              {grouped.length === 0 ? (
                <div style={{padding:24,textAlign:'center',color:'var(--text-3)'}}>
                  <i className="fa-solid fa-basket-shopping" style={{fontSize:28,opacity:.4}}/>
                  <div className="mt-2 t-sm">Select items to create POs</div>
                </div>
              ) : grouped.map((g, gi) => (
                <div key={gi} style={{border:'1px solid var(--line)',borderRadius:8,overflow:'hidden'}}>
                  <div style={{background:'var(--bg-sub)',padding:'10px 14px'}} className="row">
                    <div>
                      <div className="fw-7" style={{fontSize:13}}>{g.supplier}</div>
                      <div className="t-xs muted">{g.items.length} line{g.items.length!==1?'s':''}</div>
                    </div>
                    <div style={{marginLeft:'auto',textAlign:'right'}}>
                      <div className="fw-7 mono">{fmtMoney(g.total,0)}</div>
                      <div className="t-xs muted">estimated</div>
                    </div>
                  </div>
                  {g.items.map((item,ii) => (
                    <div key={ii} className="row" style={{padding:'8px 14px',borderTop:'1px solid var(--line)',fontSize:12}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div className="fw-6 mono" style={{fontSize:11}}>{item.sku}</div>
                        <div className="muted" style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.name}</div>
                      </div>
                      <div style={{textAlign:'right',flexShrink:0,marginLeft:8}}>
                        <div className="mono fw-6">{item.suggest} units</div>
                        <div className="muted">{fmtMoney(item.suggest*item.price,0)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {grouped.length > 0 && (
            <div className="card">
              <div className="card-hd"><h3>PO settings</h3></div>
              <div className="card-pad col gap-3 t-sm">
                <Field label="Order date"><input className="input" type="date" defaultValue="2026-05-30"/></Field>
                <Field label="Deliver to">
                  <select className="select"><option>Warehouse A — Dock 2</option><option>Warehouse A — Dock 1</option><option>Warehouse B — Dock 1</option></select>
                </Field>
                <Field label="Buyer">
                  <select className="select">{(window.WMS_USERS||[]).map(u=><option key={u.name}>{u.name}</option>)}</select>
                </Field>
                <div className="divider"/>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <span className="muted">Total POs</span><span className="mono fw-6">{grouped.length}</span>
                </div>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <span className="muted">Total lines</span><span className="mono fw-6">{sel.length}</span>
                </div>
                <div className="row" style={{justifyContent:'space-between'}}>
                  <span className="fw-7">Total spend</span>
                  <span className="fw-7 mono" style={{fontSize:16}}>{fmtMoney(sel.reduce((t,r)=>t+r.suggest*r.price,0),0)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   STOCK MOVE — bin-to-bin relocation within a warehouse
   ============================================================= */
function StockMoveForm({ onPage }) {
  const { PRODUCTS, fmtMoney } = window.WMS;
  const { useState } = React;
  const BINS = ['A-12-3','B-04-1','C-08-2','C-09-3','E-11-4','F-03-1','G-01-2','H-07-1','H-04-2','I-02-5','Y-04-B','Y-12-A'];

  const [sku, setSku] = useState('HX-12-440');
  const [fromBin, setFromBin] = useState('A-12-3');
  const [toBin, setToBin] = useState('');
  const [qty, setQty] = useState(100);
  const [reason, setReason] = useState('rebalance');

  const prod = PRODUCTS.find(p => p.sku === sku) || PRODUCTS[0];
  const qtyErr = qty > prod.qty ? `Only ${prod.qty} on hand` : qty <= 0 ? 'Must be > 0' : null;
  const binErr = toBin && toBin === fromBin ? 'Source and destination must differ' : null;
  const canSubmit = !qtyErr && !binErr && toBin && qty > 0;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('warehouse-stock')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to stock by location
          </button>
          <h1>Move stock <span className="muted" style={{ fontWeight: 500 }}>· MOV-0142</span></h1>
          <div className="ph-sub">Relocate units between bins — stock updates immediately on confirm</div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className={'btn ' + (canSubmit ? 'btn-primary' : '')} disabled={!canSubmit}>
            <i className="fa-solid fa-shuffle" /> Confirm move
          </button>
        </div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          {/* SKU */}
          <div className="card">
            <div className="card-hd"><h3>Item to move</h3></div>
            <div className="card-pad">
              <div className="grid-2" style={{ gap: 14 }}>
                <Field label="SKU / Product" req>
                  <select className="select" value={sku} onChange={e => setSku(e.target.value)}>
                    {PRODUCTS.filter(p => p.qty > 0).map(p => (
                      <option key={p.sku} value={p.sku}>{p.sku} — {p.name}</option>
                    ))}
                  </select>
                  <div className="t-xs muted mt-1">
                    <span className="mono fw-6">{prod.qty}</span> {prod.unit} on hand ·
                    Location: <span className="mono fw-6">{prod.loc}</span>
                  </div>
                </Field>
                <Field label="Quantity to move" req>
                  <input className="input mono fw-6" type="number" min={1} max={prod.qty} value={qty} onChange={e => setQty(+e.target.value)} style={{ fontSize: 18 }} />
                  {qtyErr && <div className="t-xs" style={{ color: 'var(--c-neg)', marginTop: 4 }}><i className="fa-solid fa-circle-exclamation" /> {qtyErr}</div>}
                </Field>
              </div>
            </div>
          </div>

          {/* From / To */}
          <div className="card">
            <div className="card-hd"><h3>Source → Destination</h3></div>
            <div className="card-pad">
              <div className="grid-2" style={{ gap: 14 }}>
                <Field label="From bin" req>
                  <select className="select" value={fromBin} onChange={e => setFromBin(e.target.value)}>
                    {BINS.map(b => <option key={b}>{b}</option>)}
                  </select>
                  <div className="t-xs muted mt-1">Current location of {prod.name.slice(0,24)}</div>
                </Field>
                <Field label="To bin" req>
                  <select className="select" value={toBin} onChange={e => setToBin(e.target.value)}>
                    <option value="">— select destination —</option>
                    {BINS.filter(b => b !== fromBin).map(b => <option key={b}>{b}</option>)}
                  </select>
                  {binErr && <div className="t-xs" style={{ color: 'var(--c-neg)', marginTop: 4 }}>{binErr}</div>}
                </Field>
                <Field label="Reason" req>
                  <select className="select" value={reason} onChange={e => setReason(e.target.value)}>
                    <option value="rebalance">Rebalance — even out bin utilisation</option>
                    <option value="pick-face">Replenish pick face</option>
                    <option value="consolidate">Consolidate partial pallets</option>
                    <option value="damage-quarantine">Quarantine damaged stock</option>
                    <option value="receiving">Move from receiving dock</option>
                    <option value="cycle-count">Post cycle count correction</option>
                  </select>
                </Field>
                <Field label="Reference (optional)">
                  <input className="input" placeholder="e.g. T-0219, WO-4422" />
                </Field>
                <Field label="Notes" span={2}>
                  <textarea className="input" rows={2} placeholder="Why this move — visible in the movement audit trail." />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* Right: live impact */}
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Move preview</h3></div>
            <div className="card-pad col gap-3 t-sm">
              {/* Source */}
              <div style={{ background: 'var(--bg-sub)', borderRadius: 8, padding: '10px 14px' }}>
                <div className="t-xs muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>From · {fromBin}</div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Before</span>
                  <span className="mono fw-6">{prod.qty} {prod.unit}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Moved out</span>
                  <span className="mono fw-6" style={{ color: 'var(--c-neg)' }}>−{qty}</span>
                </div>
                <div className="divider" style={{ margin: '6px 0' }} />
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="fw-7">After</span>
                  <span className={'mono fw-7' + (prod.qty - qty <= 0 ? ' c-neg' : '')} style={{ color: prod.qty - qty <= 0 ? 'var(--c-neg)' : 'var(--text)' }}>{prod.qty - qty} {prod.unit}</span>
                </div>
              </div>

              {/* Destination */}
              <div style={{ background: 'var(--c-pos-soft)', borderRadius: 8, padding: '10px 14px' }}>
                <div className="t-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--c-pos)', marginBottom: 4 }}>To · {toBin || '—'}</div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Before</span>
                  <span className="mono fw-6">0 {prod.unit}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Moved in</span>
                  <span className="mono fw-6" style={{ color: 'var(--c-pos)' }}>+{qty}</span>
                </div>
                <div className="divider" style={{ margin: '6px 0' }} />
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="fw-7">After</span>
                  <span className="mono fw-7" style={{ color: 'var(--c-pos)' }}>{qty} {prod.unit}</span>
                </div>
              </div>

              {!canSubmit && (
                <div className="banner" style={{ padding: 8 }}>
                  <i className="fa-solid fa-circle-info" />
                  <span className="t-xs">{qtyErr || binErr || 'Select a destination bin to continue.'}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>On confirm</h3></div>
            <div className="card-pad col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Generate movement record (MOV)</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Print bin labels for destination</label>
              <label className="row gap-2"><input type="checkbox" /> Notify warehouse team</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   MANUAL MOVEMENT — record an ad-hoc IN / OUT / RETURN / ADJUST
   ============================================================= */
function ManualMovementForm({ onPage }) {
  const { PRODUCTS, fmtMoney } = window.WMS;
  const USERS = window.WMS_USERS;
  const { useState } = React;

  const MOVE_TYPES = [
    { id: 'in',     label: 'IN',     icon: 'fa-arrow-down',       color: 'var(--c-pos)',  desc: 'Stock received without a PO (e.g. sample, return from service)' },
    { id: 'out',    label: 'OUT',    icon: 'fa-arrow-up',         color: 'var(--c-neg)',  desc: 'Stock removed without a sales order (e.g. internal use, sample)' },
    { id: 'adjust', label: 'ADJUST', icon: 'fa-sliders',          color: 'var(--c-warn)', desc: 'Correct on-hand count after cycle count or found discrepancy' },
    { id: 'return', label: 'RETURN', icon: 'fa-rotate-left',      color: 'var(--c-info)', desc: 'Customer return restocked to a bin' },
  ];

  const [type, setType] = useState('in');
  const [sku, setSku] = useState('LED-T8-18');
  const [qty, setQty] = useState(24);
  const [bin, setBin] = useState('C-08-2');
  const [ref, setRef] = useState('');

  const prod = PRODUCTS.find(p => p.sku === sku) || PRODUCTS[0];
  const movType = MOVE_TYPES.find(t => t.id === type);
  const isNeg = type === 'out';
  const newQty = isNeg ? prod.qty - qty : prod.qty + qty;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('transactions')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to stock movements
          </button>
          <h1>Record movement <span className="muted" style={{ fontWeight: 500 }}>· MOV-0143</span></h1>
          <div className="ph-sub">Manual stock movement — posts directly to the audit trail and updates on-hand</div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Post movement</button>
        </div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          {/* Type selector */}
          <div className="card">
            <div className="card-hd"><h3>Movement type</h3></div>
            <div className="card-pad">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {MOVE_TYPES.map(t => (
                  <button key={t.id} onClick={() => setType(t.id)} style={{
                    padding: '12px 8px', borderRadius: 10, textAlign: 'center', cursor: 'pointer',
                    border: type === t.id ? `2px solid ${t.color}` : '1px solid var(--line)',
                    background: type === t.id ? `color-mix(in oklch, ${t.color} 10%, var(--card))` : 'var(--card)',
                  }}>
                    <div style={{ fontSize: 20, color: t.color, marginBottom: 6 }}><i className={'fa-solid ' + t.icon} /></div>
                    <div className="fw-7" style={{ fontSize: 13, color: t.color }}>{t.label}</div>
                  </button>
                ))}
              </div>
              <div className="banner info mt-3" style={{ padding: 8 }}>
                <i className="fa-solid fa-circle-info" />
                <span className="t-xs">{movType.desc}</span>
              </div>
            </div>
          </div>

          {/* Item details */}
          <div className="card">
            <div className="card-hd"><h3>Item & quantity</h3></div>
            <div className="card-pad">
              <div className="grid-2" style={{ gap: 14 }}>
                <Field label="SKU / Product" req>
                  <select className="select" value={sku} onChange={e => setSku(e.target.value)}>
                    {PRODUCTS.map(p => <option key={p.sku} value={p.sku}>{p.sku} — {p.name}</option>)}
                  </select>
                  <div className="t-xs muted mt-1">On hand: <span className="mono fw-6">{prod.qty}</span> {prod.unit} · Bin: <span className="mono fw-6">{prod.loc}</span></div>
                </Field>
                <Field label="Quantity" req>
                  <div className="row gap-2">
                    <span className="muted" style={{ fontSize: 18, fontWeight: 700, color: isNeg ? 'var(--c-neg)' : 'var(--c-pos)' }}>{isNeg ? '−' : '+'}</span>
                    <input className="input mono fw-6" type="number" min={1} value={qty} onChange={e => setQty(+e.target.value)} style={{ flex: 1, fontSize: 18 }} />
                    <span className="muted">{prod.unit}</span>
                  </div>
                </Field>
                <Field label="Bin / Location" req>
                  <select className="select" value={bin} onChange={e => setBin(e.target.value)}>
                    {['A-12-3','B-04-1','C-08-2','C-09-3','E-11-4','F-03-1','G-01-2','H-07-1','Y-04-B','Y-12-A'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Reason code" req>
                  <select className="select">
                    {type === 'in'     && <><option>Sample / free stock</option><option>Vendor replacement</option><option>Production surplus</option><option>Found — unrecorded</option></>}
                    {type === 'out'    && <><option>Internal use / consumed</option><option>Sample issued</option><option>Donated / disposed</option><option>Shrinkage</option></>}
                    {type === 'adjust' && <><option>Cycle count correction</option><option>System error correction</option><option>Expired units removed</option><option>Damaged — write-down</option></>}
                    {type === 'return' && <><option>Customer return — resaleable</option><option>Customer return — damaged</option><option>Wrong item sent — restocked</option></>}
                  </select>
                </Field>
                <Field label="Reference document">
                  <input className="input" value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. SO-10284, GRN-4428, EMAIL-2026-05-26" />
                </Field>
                <Field label="Recorded by">
                  <select className="select">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select>
                </Field>
                <Field label="Date & time" req span={2}>
                  <div className="row gap-2">
                    <input className="input" type="date" defaultValue="2026-05-30" style={{ flex: 1 }} />
                    <input className="input" type="time" defaultValue="14:30" style={{ width: 120 }} />
                  </div>
                </Field>
                <Field label="Notes" span={2}>
                  <textarea className="input" rows={3} placeholder="Why this manual movement — used in audits to explain unmatched variances." />
                </Field>
              </div>
            </div>
          </div>
        </div>

        {/* Right: impact */}
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Stock impact</h3></div>
            <div className="card-pad col gap-3 t-sm">
              <div className="row gap-3" style={{ alignItems: 'center' }}>
                <div className="thumb brand" style={{ flexShrink: 0 }}>{prod.name.slice(0,1)}</div>
                <div>
                  <div className="fw-6">{prod.name}</div>
                  <div className="t-xs muted mono">{prod.sku} · {bin}</div>
                </div>
              </div>
              <div className="divider" />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted">Current stock</span>
                <span className="mono fw-6">{prod.qty} {prod.unit}</span>
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="muted">This movement</span>
                <span className="mono fw-6" style={{ color: isNeg ? 'var(--c-neg)' : 'var(--c-pos)' }}>
                  {isNeg ? '−' : '+'}{qty} {prod.unit}
                </span>
              </div>
              <div className="divider" />
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="fw-7">New on-hand</span>
                <span className="mono fw-7" style={{ fontSize: 20, color: newQty < 0 ? 'var(--c-neg)' : newQty < 10 ? 'var(--c-warn)' : 'var(--text)' }}>
                  {newQty} {prod.unit}
                </span>
              </div>
              {newQty < 0 && (
                <div className="banner" style={{ padding: 8, background: 'var(--c-neg-soft)', color: 'var(--c-neg)', borderColor: 'color-mix(in oklch, var(--c-neg) 30%, transparent)' }}>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <span className="t-xs">This will result in negative stock. Check quantity.</span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Audit trail entry</h3></div>
            <div className="card-pad col gap-2 t-sm">
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Type</span><span className="tag">{movType.label}</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">SKU</span><span className="mono">{sku}</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Bin</span><span className="mono">{bin}</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Document ref</span><span className="mono">{ref || 'MOV-0143'}</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>On post</h3></div>
            <div className="card-pad col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Update on-hand immediately</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Write to movement log</label>
              <label className="row gap-2"><input type="checkbox" /> Trigger reorder check</label>
              <label className="row gap-2"><input type="checkbox" /> Notify inventory manager</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   Register
   ============================================================= */
Object.assign(window.WMS_BESPOKE || (window.WMS_BESPOKE = {}), {
  'connect-bank':      ConnectBank,
  'new-transaction':   AddTransaction,
  'new-employee':      EmployeeForm,
  'export-payroll':    ExportPayroll,
  'request-leave':     RequestLeave,
  'run-payroll':       RunPayroll,
  'new-transfer':      TransferForm,
  'new-adjustment':    AdjustmentForm,
  'start-count':       StartCount,
  'new-location':      LocationForm,
  'bulk-add':          BulkAdd,
  'new-product':       ProductForm,
  'new-category':      CategoryForm,
  'move-stock':        StockMoveForm,
  'record-movement':   ManualMovementForm,
  'reorder-rules':     ReorderRulesForm,
  'create-reorder-pos':ReorderPOForm,
});
