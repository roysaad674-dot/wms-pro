/* global React */
// More forms: new brand, new unit, barcode print job, invite user.
const { useState } = React;
const { fmtMoney } = window.WMS;
const USERS = window.WMS_USERS;

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

/* =============================================================
   1. NEW BRAND
   ============================================================= */
function BrandForm({ onPage }) {
  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <FormHead
        onPage={onPage} backTo="brands" backLabel="Back to brands"
        title="New brand"
        sub="Manufacturer or label you stock — drives reporting and supplier links"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create brand</button>
        </>}
      />
      <Card title="Identity">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Brand name" req span={2}><input className="input" placeholder="e.g. Skylight Lighting Co." /></Field>
          <Field label="Code" req hint="Short identifier — drives SKU prefixes."><input className="input mono" placeholder="SLT" /></Field>
          <Field label="Primary category"><select className="select"><option>Electrical</option><option>Plumbing</option><option>Hardware</option><option>Tools</option><option>Paint</option><option>Safety</option><option>Building</option><option>Other</option></select></Field>
          <Field label="Logo" hint="Square — used in product detail and POS." span={2}>
            <div className="row gap-3">
              <div className="thumb brand" style={{ width: 56, height: 56, fontSize: 22 }}>SL</div>
              <button className="btn btn-sm">Upload PNG / SVG</button>
              <button className="btn btn-sm btn-ghost">Auto from website</button>
            </div>
          </Field>
          <Field label="Website"><input className="input" placeholder="https://" /></Field>
          <Field label="Country of origin"><select className="select"><option>United States</option><option>China</option><option>Germany</option><option>Mexico</option><option>Vietnam</option></select></Field>
          <Field label="Description" span={2}><textarea className="input" rows={3} placeholder="Optional — appears on storefront product pages." /></Field>
          <Field label="Tags"><input className="input" placeholder="premium, eco-cert, single-source" /></Field>
        </div>
      </Card>

      <Card title="Supplier link">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Primary supplier" hint="Most SKUs come from this vendor.">
            <select className="select"><option>+ Choose supplier…</option><option>Lumio Electrical</option><option>Polyflo Industries</option><option>Atlas Fasteners</option><option>+ New supplier</option></select>
          </Field>
          <Field label="Alternate suppliers" hint="Comma-separated codes."><input className="input mono" placeholder="SUP-003, SUP-038" /></Field>
          <Field label="Default lead time"><div className="row gap-2"><input className="input mono" defaultValue="14" style={{flex:1}}/><span className="muted">days</span></div></Field>
          <Field label="MOQ (manufacturer)"><input className="input mono" placeholder="e.g. 1 case = 100 units" /></Field>
        </div>
      </Card>

      <Card title="Defaults & targets">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Target gross margin"><div className="row gap-2"><input className="input mono" defaultValue="45" style={{flex:1}}/><span className="muted">% — below triggers a flag</span></div></Field>
          <Field label="Marketing tier"><select className="select"><option>House — promote everywhere</option><option>Standard</option><option>Sell-through only</option></select></Field>
          <Field label="Warranty default"><select className="select"><option>1 year limited</option><option>2 years</option><option>Manufacturer warranty</option><option>None</option></select></Field>
          <Field label="Status"><select className="select"><option>Active</option><option>Trial</option><option>Discontinued — sell-through</option><option>Archived</option></select></Field>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   2. NEW UNIT OF MEASURE
   ============================================================= */
function UnitForm({ onPage }) {
  const [system, setSystem] = useState('Count');
  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <FormHead
        onPage={onPage} backTo="units" backLabel="Back to units"
        title="New unit of measure"
        sub="Add a way to count, weigh, measure or package something you stock"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Create unit</button>
        </>}
      />
      <Card title="Measurement system">
        <Field label="Type" req>
          <div className="seg" style={{ width: '100%', flexWrap: 'wrap' }}>
            {[
              { id: 'Count',  i: 'fa-hashtag' },
              { id: 'Length', i: 'fa-ruler-horizontal' },
              { id: 'Weight', i: 'fa-weight-hanging' },
              { id: 'Volume', i: 'fa-flask' },
              { id: 'Area',   i: 'fa-vector-square' },
              { id: 'Time',   i: 'fa-clock' },
            ].map(s => (
              <button key={s.id} className={system === s.id ? 'is-active' : ''} onClick={() => setSystem(s.id)} style={{flex:1, minWidth:96}}>
                <i className={'fa-solid ' + s.i} /> {s.id}
              </button>
            ))}
          </div>
        </Field>
      </Card>

      <Card title="Identity">
        <div className="grid-2" style={{ gap: 14 }}>
          <Field label="Code" req hint="Short identifier on documents."><input className="input mono" placeholder={system === 'Count' ? 'crate' : system === 'Length' ? 'ft' : 'pkg'} /></Field>
          <Field label="Display name" req><input className="input" placeholder={system === 'Count' ? 'Crate of 12' : 'Foot'} /></Field>
          <Field label="Plural"><input className="input" placeholder="crates" /></Field>
          <Field label="Symbol"><input className="input mono" placeholder="cr · ft · L" /></Field>
        </div>
      </Card>

      <Card title="Conversion">
        <Field label="Base unit" req hint="Smallest unit you track in this system. All conversions tie back to it.">
          <select className="select" style={{ maxWidth: 240 }}>
            {system === 'Count' && <><option>Piece (pcs)</option><option>Set</option></>}
            {system === 'Length' && <><option>Meter (m)</option><option>Inch (in)</option></>}
            {system === 'Weight' && <><option>Kilogram (kg)</option><option>Pound (lb)</option></>}
            {system === 'Volume' && <><option>Litre (L)</option><option>US Gallon</option></>}
            {system === 'Area'   && <><option>Square meter (m²)</option></>}
            {system === 'Time'   && <><option>Hour (h)</option></>}
          </select>
        </Field>
        <Field label="Factor" req hint="How many base units make 1 of this unit?">
          <div className="row gap-2 mt-1">
            <span className="t-sm">1 of this =</span>
            <input className="input mono fw-7" defaultValue={system === 'Count' ? '12' : system === 'Length' ? '0.3048' : '1'} style={{ width: 120, fontSize: 16 }}/>
            <span className="t-sm muted">base units</span>
          </div>
          <div className="banner info mt-2"><i className="fa-solid fa-lightbulb"/><span className="t-xs">Examples · 1 box = 100 pcs · 1 roll = 30 m · 1 bag = 50 kg · 1 gal = 3.785 L</span></div>
        </Field>
        <Field label="Precision" hint="Decimal places allowed on transactions.">
          <select className="select" style={{ maxWidth: 200 }}><option>0 (whole only)</option><option>1 (e.g. 1.5)</option><option>2 (e.g. 1.50)</option><option>3 (e.g. 0.125)</option><option>4</option></select>
        </Field>
      </Card>

      <Card title="Usage">
        <div className="col gap-2 t-sm">
          <label className="row gap-2"><input type="checkbox" defaultChecked /> Allow buying in this unit</label>
          <label className="row gap-2"><input type="checkbox" defaultChecked /> Allow selling in this unit</label>
          <label className="row gap-2"><input type="checkbox" /> Allow inventory tracking in this unit (instead of base)</label>
          <label className="row gap-2"><input type="checkbox" /> Show on POS cashier search</label>
        </div>
      </Card>
    </div>
  );
}

/* =============================================================
   3. BARCODE / LABEL PRINT JOB
   ============================================================= */
function BarcodeForm({ onPage }) {
  const [tmpl, setTmpl] = useState('sku');
  const [scope, setScope] = useState('selected');
  const previewSpecs = {
    sku:      { name: 'SKU label',     w: '50 mm', h: '25 mm', use: 'On the product unit itself' },
    bin:      { name: 'Bin tag',       w: '70 mm', h: '38 mm', use: 'Stuck to the shelf below the bin' },
    pallet:   { name: 'Pallet label',  w: '105 mm',h: '148 mm',use: 'GS1-128 — full pallet trace' },
    shelf:    { name: 'Shelf talker',  w: '80 mm', h: '40 mm', use: 'Price + barcode for self-serve aisles' },
    pickface: { name: 'Pick-face',     w: '60 mm', h: '20 mm', use: 'High-volume bin reprints' },
  };
  const spec = previewSpecs[tmpl];

  return (
    <div className="page" style={{ maxWidth: 1180 }}>
      <FormHead
        onPage={onPage} backTo="barcode" backLabel="Back to barcodes"
        title="Print labels"
        sub="Generate barcodes for SKUs, bins or pallets and send them to a printer"
        actions={<>
          <button className="btn"><i className="fa-solid fa-eye" /> Preview PDF</button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save as preset</button>
          <button className="btn btn-primary"><i className="fa-solid fa-print" /> Send to printer</button>
        </>}
      />
      <div className="grid-12">
        <div className="col gap-4">
          <Card title="Template">
            <div className="grid-3" style={{ gap: 10 }}>
              {Object.entries(previewSpecs).map(([id, s]) => (
                <div key={id} onClick={() => setTmpl(id)} className="card" style={{
                  padding: 14,
                  border: '1.5px solid ' + (tmpl === id ? 'var(--brand)' : 'var(--line)'),
                  background: tmpl === id ? 'var(--brand-soft)' : 'var(--card)',
                  cursor: 'pointer',
                }}>
                  <div className="row gap-2 mb-2">
                    <span className={'chk' + (tmpl === id ? ' is-on' : '')} style={{borderRadius:11}} />
                    <span className="fw-6 t-sm">{s.name}</span>
                  </div>
                  <div className="t-xs mono muted mb-1">{s.w} × {s.h}</div>
                  <div className="t-xs muted">{s.use}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="What to print">
            <Field label="Source" req>
              <div className="seg" style={{ width: '100%' }}>
                {[
                  { id: 'selected', label: 'Selected from list' },
                  { id: 'all',      label: 'All active' },
                  { id: 'category', label: 'Category…' },
                  { id: 'paste',    label: 'Paste SKU list' },
                  { id: 'scan',     label: 'Scan to add' },
                ].map(s => (
                  <button key={s.id} className={scope === s.id ? 'is-active' : ''} onClick={() => setScope(s.id)} style={{ flex: 1 }}>{s.label}</button>
                ))}
              </div>
            </Field>
            <div className="mt-3">
              {scope === 'paste' && <textarea className="input mono" rows={4} placeholder={'HX-12-440\nPVC-2-90\nLED-T8-18'} />}
              {scope === 'category' && (
                <Field label="Category"><select className="select" style={{maxWidth:300}}><option>Fasteners (124 SKUs)</option><option>Plumbing (96)</option><option>Electrical (218)</option><option>Tools (96)</option></select></Field>
              )}
              {scope === 'selected' && (
                <Card pad={false}>
                  <table className="tbl">
                    <thead><tr><th></th><th>SKU</th><th>Product</th><th className="ta-right">Copies</th></tr></thead>
                    <tbody>
                      {[
                        { sku: 'HX-12-440', name: 'Heavy-duty hex bolt M12', copies: 240 },
                        { sku: 'PVC-2-90',  name: 'PVC elbow 2" 90°',        copies: 80  },
                        { sku: 'LED-T8-18', name: 'LED T8 tube 18W',         copies: 96  },
                        { sku: 'PT-WHT-5G', name: 'Interior paint white 5g', copies: 64  },
                      ].map((r,i) => (
                        <tr key={i}>
                          <td><span className="chk is-on" /></td>
                          <td className="col-id">{r.sku}</td>
                          <td className="fw-6">{r.name}</td>
                          <td className="ta-right"><input className="input col-num" type="number" defaultValue={r.copies} style={{width:80,textAlign:'right',padding:'4px 8px'}}/></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>
          </Card>

          <Card title="What goes on the label">
            <div className="grid-2" style={{ gap: 14 }}>
              <Field label="Barcode symbology" req>
                <select className="select"><option>Code 128 (default)</option><option>Code 39</option><option>EAN-13 (retail UPC)</option><option>QR code</option><option>GS1-128 (pallet)</option><option>Data Matrix (2D)</option></select>
              </Field>
              <Field label="Encode field"><select className="select"><option>SKU</option><option>Internal product ID</option><option>EAN/UPC if present</option><option>Custom token</option></select></Field>
              <Field label="Human-readable text"><select className="select"><option>SKU + Name (truncated)</option><option>SKU only</option><option>Name only</option><option>None</option></select></Field>
              <Field label="Price?">
                <label className="row gap-2 t-sm"><input type="checkbox" defaultChecked /> Include retail price</label>
              </Field>
              <Field label="Show brand logo?">
                <label className="row gap-2 t-sm"><input type="checkbox" /> Yes — top-left</label>
              </Field>
              <Field label="Show unit / pack size?">
                <label className="row gap-2 t-sm"><input type="checkbox" defaultChecked /> "1 box (100 pcs)"</label>
              </Field>
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Preview">
            <div style={{
              background: '#fff',
              border: '1px dashed var(--line-strong)',
              borderRadius: 8,
              padding: 20,
              textAlign: 'center',
              color: '#000',
              fontFamily: 'var(--font-mono)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4 }}>HX-12-440</div>
              <div style={{ fontSize: 9, marginBottom: 8 }}>Heavy-duty hex bolt M12</div>
              {/* fake barcode */}
              <svg width="180" height="48" viewBox="0 0 180 48" style={{ display: 'block', margin: '0 auto' }}>
                {Array.from({length: 48}).map((_,i) => {
                  const w = [1,2,3,4][i % 4];
                  return <rect key={i} x={i * 3.6} y="0" width={w * 0.8} height="40" fill="#000" />;
                })}
              </svg>
              <div style={{ fontSize: 9, fontFamily: 'monospace', letterSpacing: 2, marginTop: 4 }}>012345 678901</div>
              <div style={{ fontSize: 10, fontWeight: 600, marginTop: 6 }}>$0.42 · 1 pcs</div>
            </div>
            <div className="t-xs muted mt-2 row gap-2"><i className="fa-solid fa-print"/><span>{spec.name} · {spec.w} × {spec.h}</span></div>
          </Card>

          <Card title="Output">
            <Field label="Printer">
              <select className="select"><option>Zebra-A · Warehouse A receiving</option><option>Zebra-B · Warehouse B receiving</option><option>Desktop · LaserJet Pro</option><option>Save as PDF</option></select>
            </Field>
            <Field label="Layout"><select className="select"><option>Roll — 1 across</option><option>Sheet — Avery 5160 (3×10)</option><option>Sheet — Avery 5163 (2×5)</option></select></Field>
            <Field label="Start position" hint="Skip cells on a partially-used sheet.">
              <input className="input mono" defaultValue="1" />
            </Field>
            <Field label="Copies per label"><input className="input mono" defaultValue="1" /></Field>
          </Card>

          <Card title="Summary">
            <div className="col gap-2 t-sm">
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">SKUs</span><span className="mono fw-6">4</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Total labels</span><span className="mono fw-6">480</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Est. roll length</span><span className="mono">12.6 m</span></div>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Est. time on Zebra-A</span><span className="mono">2 min</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   4. INVITE USER
   ============================================================= */
function InviteUser({ onPage }) {
  const [bulk, setBulk] = useState(false);
  return (
    <div className="page" style={{ maxWidth: 1000 }}>
      <FormHead
        onPage={onPage} backTo="users" backLabel="Back to users"
        title="Invite user"
        sub="Send an email invite — they\u2019ll set up their own password and MFA"
        actions={<>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save as template</button>
          <button className="btn btn-primary"><i className="fa-solid fa-paper-plane" /> Send {bulk ? '4 invites' : 'invite'}</button>
        </>}
      />

      <div className="seg mb-3">
        <button className={!bulk ? 'is-active' : ''} onClick={() => setBulk(false)}>Single invite</button>
        <button className={bulk ? 'is-active' : ''} onClick={() => setBulk(true)}>Bulk invite</button>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          <Card title={bulk ? 'People to invite' : 'New user'}>
            {!bulk ? (
              <div className="grid-2" style={{ gap: 14 }}>
                <Field label="Work email" req><input className="input" type="email" placeholder="alex@wmspro.co" autoFocus /></Field>
                <Field label="Full name" req><input className="input" placeholder="Alex Tan" /></Field>
                <Field label="Job title"><input className="input" placeholder="Warehouse Associate" /></Field>
                <Field label="Team / department"><select className="select"><option>Operations</option><option>Warehouse</option><option>Finance</option><option>Sales</option><option>IT</option></select></Field>
                <Field label="Manager" hint="Routes approvals (expenses, leave)."><select className="select">{USERS.map(u => <option key={u.name}>{u.name}</option>)}</select></Field>
                <Field label="Default warehouse"><select className="select"><option>Warehouse A — Oakland</option><option>Warehouse B — Hayward</option><option>—</option></select></Field>
                <Field label="Phone (optional)" span={2}><input className="input" placeholder="+1 …" /></Field>
              </div>
            ) : (
              <>
                <Field label="Paste emails or names" hint="One per line — name and email separated by a comma. Or upload a CSV.">
                  <textarea className="input mono" rows={6} defaultValue={'Alex Tan, alex@wmspro.co\nJamie Rivers, jamie@wmspro.co\nSandeep Patel, sandeep@wmspro.co\nKira Wong, kira@wmspro.co'} />
                </Field>
                <div className="row gap-2 mt-2">
                  <button className="btn btn-sm"><i className="fa-solid fa-upload"/> Upload CSV</button>
                  <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-address-book"/> Pick from contacts</button>
                </div>
              </>
            )}
          </Card>

          <Card title="Role & permissions">
            <Field label="Role" req hint="Bundle of permissions — override individually below.">
              <div className="grid-3" style={{ gap: 10, marginTop: 6 }}>
                {[
                  { id: 'admin',    name: 'Admin',    desc: 'Full access including settings, billing, users', icon: 'fa-shield-halved', c: 'var(--c-neg)' },
                  { id: 'finance',  name: 'Finance',  desc: 'AR, AP, banking, GL, payroll, reports',          icon: 'fa-landmark',     c: 'var(--c-info)' },
                  { id: 'sales',    name: 'Sales',    desc: 'Quotes, orders, customers, POS — read inventory',icon: 'fa-cash-register',c: 'var(--brand)' },
                  { id: 'warehouse',name: 'Warehouse',desc: 'Receiving, transfers, picks — no money',         icon: 'fa-warehouse',     c: 'var(--c-warn)' },
                  { id: 'inventory',name: 'Inventory',desc: 'Products, categories, stock counts',              icon: 'fa-boxes-stacked', c: 'var(--c-violet)' },
                  { id: 'viewer',   name: 'View-only',desc: 'Read everything, edit nothing',                  icon: 'fa-eye',           c: 'var(--text-3)' },
                ].map((r,i) => (
                  <div key={r.id} className="card" style={{ padding: 14, cursor: 'pointer', border: '1.5px solid ' + (i === 3 ? 'var(--brand)' : 'var(--line)'), background: i === 3 ? 'var(--brand-soft)' : 'var(--card)' }}>
                    <div className="row gap-2 mb-1">
                      <div style={{ width: 22, height: 22, borderRadius: 5, background: r.c, opacity: 0.15, display: 'grid', placeItems: 'center' }}>
                        <i className={'fa-solid ' + r.icon} style={{ color: r.c, opacity: 1, fontSize: 10 }} />
                      </div>
                      <span className="fw-7 t-sm">{r.name}</span>
                    </div>
                    <div className="t-xs muted" style={{ lineHeight: 1.4 }}>{r.desc}</div>
                  </div>
                ))}
              </div>
            </Field>

            <div className="divider" />
            <div className="t-xs muted mb-2">Override individual capabilities:</div>
            <div className="grid-2 t-sm" style={{ gap: 8 }}>
              {[
                ['Receive goods (GRN)',           true],
                ['Create POs up to $5k',          true],
                ['Approve POs over $5k',          false],
                ['Edit product prices',           false],
                ['Run stock counts',              true],
                ['View other warehouses',         true],
                ['Issue refunds (POS)',           false],
                ['Access reports library',        false],
              ].map(([cap, on], i) => (
                <label key={i} className="row gap-2">
                  <input type="checkbox" defaultChecked={on} />
                  <span>{cap}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <div className="col gap-4">
          <Card title="Security">
            <div className="col gap-2 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Require MFA at first sign-in</label>
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Use SSO (Google Workspace)</label>
              <label className="row gap-2"><input type="checkbox" /> Restrict to office IP allow-list</label>
              <label className="row gap-2"><input type="checkbox" /> Auto-disable after 90 days inactive</label>
            </div>
          </Card>

          <Card title="Invite email">
            <Field label="Subject"><input className="input" defaultValue="You're invited to WMS Pro" /></Field>
            <Field label="Personal note" hint="Appears above the system invite copy.">
              <textarea className="input mt-2" rows={4} defaultValue={'Hi! Welcome to the team — this gets you into WMS Pro where you\u2019ll find timesheets, stock and everything else.\n\nClick the button in the email to set your password. Reach out if you get stuck.'} />
            </Field>
            <Field label="Send at"><select className="select" style={{maxWidth:200}}><option>Right now</option><option>Tomorrow 09:00</option><option>Their start date</option></select></Field>
          </Card>

          <Card title="What happens next">
            <div className="col gap-2 t-sm">
              <div className="row gap-2"><i className="fa-solid fa-envelope" style={{color:'var(--brand)'}}/><span>Email arrives within 1 minute</span></div>
              <div className="row gap-2"><i className="fa-solid fa-key" style={{color:'var(--brand)'}}/><span>They set password &amp; MFA</span></div>
              <div className="row gap-2"><i className="fa-solid fa-user-check" style={{color:'var(--brand)'}}/><span>You get notified when they sign in for the first time</span></div>
              <div className="row gap-2"><i className="fa-solid fa-clock" style={{color:'var(--brand)'}}/><span>Invite expires in 7 days · resend any time</span></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   PURCHASE INVOICE FORM
   ============================================================= */
function PurchaseInvoiceForm({ onPage }) {
  const { fmtMoney } = window.WMS;
  const USERS = window.WMS_USERS;
  const { useState } = React;
  const [lines, setLines] = useState([
    { sku: 'PVC-2-90',  desc: 'PVC elbow 2" 90°',    ord: 120, recv: 120, qty: 120, price: 1.40, tax: 0 },
    { sku: 'PVC-3-45',  desc: 'PVC elbow 3" 45°',    ord: 60,  recv: 60,  qty: 60,  price: 2.10, tax: 0 },
    { sku: 'PVC-CPL-2', desc: 'PVC coupling 2"',     ord: 200, recv: 198, qty: 198, price: 0.80, tax: 0 },
    { sku: 'PVC-VLV-2', desc: 'PVC ball valve 2"',   ord: 36,  recv: 36,  qty: 36,  price: 8.40, tax: 0 },
  ]);
  const update = (i, k, v) => setLines(lines.map((l,j) => j===i ? {...l,[k]:v} : l));
  const remove = i => setLines(lines.filter((_,j) => j!==i));
  const add = () => setLines([...lines, {sku:'',desc:'',ord:0,recv:0,qty:1,price:0,tax:0}]);
  const subtotal = lines.reduce((s,l) => s + l.qty * l.price, 0);
  const tax = 0;
  const total = subtotal + tax;
  const matchIssues = lines.filter(l => l.qty !== l.recv);

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('purchase-invoices')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to purchase invoices
          </button>
          <h1>New purchase invoice <span className="muted" style={{ fontWeight: 500 }}>· PINV-1284</span></h1>
          <div className="ph-sub">Supplier invoice awaiting three-way match</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost"><i className="fa-solid fa-clock-rotate-left" /></button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-link" /> Match to PO/GRN</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Approve &amp; bill</button>
        </div>
      </div>

      {matchIssues.length > 0 && (
        <div className="banner" style={{ marginBottom: 16, background: 'var(--c-warn-soft)', color: 'var(--c-warn)', borderColor: 'color-mix(in oklch, var(--c-warn) 30%, transparent)' }}>
          <i className="fa-solid fa-triangle-exclamation" />
          <div><strong>{matchIssues.length} line(s)</strong> have quantity mismatches vs GRN — resolve before approving.</div>
        </div>
      )}

      <div className="grid-12">
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Supplier & invoice details</h3></div>
            <div className="card-pad">
              <div className="grid-2" style={{ gap: 14 }}>
                <Field label="Supplier" req>
                  <select className="select"><option>Polyflo Industries</option><option>IronGrip Tools Co.</option><option>Lumio Electrical</option><option>Atlas Fasteners</option></select>
                </Field>
                <Field label="Supplier invoice #" req>
                  <input className="input mono" defaultValue="POLY-INV-8821" />
                </Field>
                <Field label="Invoice date" req><input className="input" type="date" defaultValue="2026-05-24" /></Field>
                <Field label="Due date" req><input className="input" type="date" defaultValue="2026-06-23" /></Field>
                <Field label="Linked PO">
                  <select className="select"><option>PO-2284 · Polyflo Industries · $648.00</option><option>PO-2283 · IronGrip</option></select>
                </Field>
                <Field label="Linked GRN">
                  <select className="select"><option>GRN-4428 · Today · complete</option><option>GRN-4421 · 3 days ago</option></select>
                </Field>
                <Field label="Currency"><select className="select"><option>USD</option><option>EUR</option></select></Field>
                <Field label="Payment terms"><select className="select"><option>Net 30</option><option>Net 15</option><option>Net 45</option><option>COD</option></select></Field>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <h3>Line items</h3>
              <span className="hd-sub">{lines.length} lines — verify against GRN quantities</span>
            </div>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr><th style={{width:30}}>#</th><th>SKU</th><th>Description</th><th className="ta-right" style={{width:80}}>PO qty</th><th className="ta-right" style={{width:80}}>Recv</th><th className="ta-right" style={{width:90}}>Invoiced</th><th className="ta-right" style={{width:110}}>Unit price</th><th className="ta-right" style={{width:80}}>Tax</th><th className="ta-right" style={{width:110}}>Amount</th><th style={{width:32}}></th></tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => {
                    const mismatch = l.qty !== l.recv;
                    return (
                      <tr key={i} style={mismatch ? { background: 'color-mix(in oklch, var(--c-warn-soft) 50%, transparent)' } : undefined}>
                        <td className="muted col-num">{i+1}</td>
                        <td className="col-id">{l.sku}</td>
                        <td className="fw-6">{l.desc}</td>
                        <td className="ta-right col-num muted">{l.ord}</td>
                        <td className="ta-right col-num muted">{l.recv}</td>
                        <td className="ta-right">
                          <input className="input col-num" type="number" value={l.qty} onChange={e => update(i,'qty',+e.target.value)} style={{width:75,textAlign:'right',padding:'4px 8px', borderColor: mismatch ? 'var(--c-warn)' : undefined}} />
                        </td>
                        <td className="ta-right">
                          <input className="input col-num" type="number" step="0.01" value={l.price} onChange={e => update(i,'price',+e.target.value)} style={{width:100,textAlign:'right',padding:'4px 8px'}} />
                        </td>
                        <td className="ta-right col-num muted">{l.tax}%</td>
                        <td className="ta-right col-num fw-6">{fmtMoney(l.qty * l.price, 2)}</td>
                        <td><div className="row-actions" style={{opacity:1}}><button onClick={() => remove(i)}><i className="fa-solid fa-xmark" /></button></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="row" style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', gap: 8 }}>
              <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus" /> Add line</button>
              <div style={{flex:1}} />
              <span className="t-xs muted">{lines.length} lines · {lines.reduce((s,l)=>s+l.qty,0)} units</span>
            </div>
          </div>
        </div>

        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Three-way match</h3></div>
            <div className="card-pad col gap-3 t-sm">
              <div className="row gap-2"><i className="fa-solid fa-file-circle-check" style={{color:'var(--c-pos)'}} /><span className="fw-6">PO-2284</span><span className="pill pos">matched</span></div>
              <div className="row gap-2"><i className="fa-solid fa-clipboard-check" style={{color:'var(--c-pos)'}} /><span className="fw-6">GRN-4428</span><span className="pill pos">matched</span></div>
              <div className="row gap-2"><i className="fa-solid fa-file-invoice" style={{color:'var(--c-warn)'}} /><span className="fw-6">PINV-1284</span><span className="pill warn">{matchIssues.length > 0 ? 'qty mismatch' : 'pending'}</span></div>
              <div className="divider" />
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">PO total</span><span className="mono fw-6">{fmtMoney(648, 2)}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">This invoice</span><span className="mono fw-6">{fmtMoney(total, 2)}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Variance</span><span className="mono fw-6" style={{color: Math.abs(total - 648) < 1 ? 'var(--c-pos)' : 'var(--c-warn)'}}>{fmtMoney(total - 648, 2)}</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Invoice total</h3></div>
            <div className="card-pad col gap-2 t-sm">
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Subtotal</span><span className="mono">{fmtMoney(subtotal, 2)}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Tax</span><span className="mono">{fmtMoney(tax, 2)}</span></div>
              <div className="divider" style={{margin:'6px 0'}} />
              <div className="row" style={{justifyContent:'space-between'}}><span className="fw-7">Total</span><span className="fw-7 mono" style={{fontSize:18}}>{fmtMoney(total, 2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   BILL FORM
   ============================================================= */
function BillForm({ onPage }) {
  const { fmtMoney } = window.WMS;
  const USERS = window.WMS_USERS;
  const { useState } = React;
  const [lines, setLines] = useState([
    { account: '5000 · COGS Hardware', desc: 'Polyflo Industries — May delivery', qty: 1, price: 648.00, tax: 0 },
  ]);
  const update = (i, k, v) => setLines(lines.map((l,j) => j===i ? {...l,[k]:v} : l));
  const remove = i => setLines(lines.filter((_,j) => j!==i));
  const add = () => setLines([...lines, {account:'', desc:'', qty:1, price:0, tax:0}]);
  const subtotal = lines.reduce((s,l) => s + l.qty * l.price, 0);
  const tax = lines.reduce((s,l) => s + l.qty * l.price * (l.tax||0)/100, 0);
  const total = subtotal + tax;

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('bills')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to bills
          </button>
          <h1>New bill <span className="muted" style={{ fontWeight: 500 }}>· BILL-0884</span></h1>
          <div className="ph-sub">Draft · created Today, 14:30 by Priya S.</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost"><i className="fa-solid fa-clock-rotate-left" /></button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-calendar-plus" /> Schedule payment</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Approve &amp; post</button>
        </div>
      </div>

      <div className="grid-12">
        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Supplier & bill details</h3></div>
            <div className="card-pad">
              <div className="grid-2" style={{ gap: 14 }}>
                <Field label="Supplier" req>
                  <select className="select"><option>Polyflo Industries</option><option>IronGrip Tools Co.</option><option>Lumio Electrical</option><option>Cascade Lumber Supply</option><option>AT&T Business</option><option>PG&E Utilities</option></select>
                </Field>
                <Field label="Bill / Ref number" req>
                  <input className="input mono" defaultValue="POLY-INV-8821" />
                </Field>
                <Field label="Bill date" req><input className="input" type="date" defaultValue="2026-05-24" /></Field>
                <Field label="Due date" req><input className="input" type="date" defaultValue="2026-06-23" /></Field>
                <Field label="Payment terms"><select className="select"><option>Net 30</option><option>Net 15</option><option>Net 45</option><option>COD</option></select></Field>
                <Field label="Pay from"><select className="select"><option>Operating — main ••4821</option><option>Reserve ••4822</option><option>Payroll ••0148</option></select></Field>
                <Field label="Source (optional)">
                  <select className="select"><option>— manual entry —</option><option>PINV-1284 · Polyflo</option><option>PO-2284 · Polyflo</option></select>
                </Field>
                <Field label="Currency"><select className="select"><option>USD</option><option>EUR</option></select></Field>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Line items / GL coding</h3><span className="hd-sub">{lines.length} lines</span></div>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr><th style={{width:30}}>#</th><th>Account</th><th>Description</th><th className="ta-right" style={{width:90}}>Qty</th><th className="ta-right" style={{width:110}}>Amount</th><th className="ta-right" style={{width:70}}>Tax %</th><th className="ta-right" style={{width:110}}>Total</th><th style={{width:32}}></th></tr>
                </thead>
                <tbody>
                  {lines.map((l, i) => (
                    <tr key={i}>
                      <td className="muted col-num">{i+1}</td>
                      <td>
                        <select className="select" value={l.account} onChange={e => update(i,'account',e.target.value)} style={{padding:'4px 8px', minWidth:220}}>
                          <option>5000 · COGS Hardware</option>
                          <option>6010 · Rent</option>
                          <option>6020 · Utilities</option>
                          <option>6030 · Salaries & wages</option>
                          <option>6070 · Depreciation</option>
                          <option>6080 · Warehouse maintenance</option>
                          <option>1030 · Inventory</option>
                        </select>
                      </td>
                      <td><input className="input" defaultValue={l.desc} style={{border:0,padding:'4px 0',background:'transparent'}} /></td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" value={l.qty} onChange={e => update(i,'qty',+e.target.value)} style={{width:75,textAlign:'right',padding:'4px 8px'}} />
                      </td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" step="0.01" value={l.price} onChange={e => update(i,'price',+e.target.value)} style={{width:100,textAlign:'right',padding:'4px 8px'}} />
                      </td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" step="0.25" value={l.tax} onChange={e => update(i,'tax',+e.target.value)} style={{width:65,textAlign:'right',padding:'4px 8px'}} />
                      </td>
                      <td className="ta-right col-num fw-6">{fmtMoney(l.qty*l.price*(1+(l.tax||0)/100), 2)}</td>
                      <td><div className="row-actions" style={{opacity:1}}><button onClick={() => remove(i)}><i className="fa-solid fa-xmark" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row" style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', gap: 8 }}>
              <button className="btn btn-sm" onClick={add}><i className="fa-solid fa-plus" /> Add line</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-wand-magic-sparkles" /> Auto-code with AI</button>
              <div style={{flex:1}} />
              <span className="t-xs muted">{lines.length} lines</span>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Notes &amp; attachments</h3></div>
            <div className="card-pad">
              <textarea className="input" rows={3} placeholder="Internal note — why this bill, what it covers, who approved it." />
              <button className="btn btn-sm btn-ghost mt-2"><i className="fa-solid fa-paperclip" /> Attach PDF invoice</button>
            </div>
          </div>
        </div>

        <div className="col gap-4">
          <div className="card">
            <div className="card-hd"><h3>Bill total</h3></div>
            <div className="card-pad col gap-2 t-sm">
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Subtotal</span><span className="mono">{fmtMoney(subtotal,2)}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Tax</span><span className="mono">{fmtMoney(tax,2)}</span></div>
              <div className="divider" style={{margin:'6px 0'}} />
              <div className="row" style={{justifyContent:'space-between'}}><span className="fw-7">Total</span><span className="fw-7 mono" style={{fontSize:18}}>{fmtMoney(total,2)}</span></div>
              <div className="t-xs muted">Due: <span className="fw-6">Jun 23, 2026</span> (30 days)</div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Supplier balance</h3></div>
            <div className="card-pad col gap-2 t-sm">
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">Open AP today</span><span className="mono fw-6">{fmtMoney(29_622, 2)}</span></div>
              <div className="row" style={{justifyContent:'space-between'}}><span className="muted">This bill</span><span className="mono" style={{color:'var(--c-warn)'}}>+{fmtMoney(total,2)}</span></div>
              <div className="divider" style={{margin:'6px 0'}} />
              <div className="row" style={{justifyContent:'space-between'}}><span className="fw-7">After posting</span><span className="fw-7 mono">{fmtMoney(29_622+total,2)}</span></div>
            </div>
          </div>

          <div className="card">
            <div className="card-hd"><h3>Payment schedule</h3></div>
            <div className="card-pad col gap-3 t-sm">
              <label className="row gap-2"><input type="checkbox" defaultChecked /> Include in next payment run (Jun 1)</label>
              <label className="row gap-2"><input type="checkbox" /> Hold — do not pay automatically</label>
              <label className="row gap-2"><input type="checkbox" /> Apply early-pay discount if available</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Register */
Object.assign(window.WMS_BESPOKE || (window.WMS_BESPOKE = {}), {
  'new-brand':              BrandForm,
  'new-unit':               UnitForm,
  'new-barcode':            BarcodeForm,
  'invite-user':            InviteUser,
  'new-purchase-invoice':   PurchaseInvoiceForm,
  'new-bill':               BillForm,
});
