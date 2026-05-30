/* global React */
const { RECENT_ORDERS, fmtMoney, INVOICE_LINES } = window.WMS;
const { StatusPill } = window;

// ------ Sales Orders list ------
function SalesOrders({ onPage }) {
  // Synthesize a bigger list from RECENT_ORDERS
  const base = RECENT_ORDERS;
  const more = Array.from({ length: 18 }, (_, i) => {
    const b = base[i % base.length];
    return { ...b, id: 'SO-' + (10277 - i), date: (i + 3) + ' days ago' };
  });
  const orders = [...base, ...more];

  const [tab, setTab] = React.useState('all');
  const tabs = [
    { id: 'all',      label: 'All',        count: orders.length },
    { id: 'draft',    label: 'Draft',      count: orders.filter(o => o.status === 'draft').length },
    { id: 'pending',  label: 'Pending',    count: orders.filter(o => o.status === 'pending' || o.status === 'partial').length },
    { id: 'paid',     label: 'Paid',       count: orders.filter(o => o.status === 'paid').length },
    { id: 'fulfilled',label: 'Fulfilled',  count: orders.filter(o => o.status === 'fulfilled').length },
  ];
  const filtered = tab === 'all' ? orders : tab === 'pending' ? orders.filter(o => o.status === 'pending' || o.status === 'partial') : orders.filter(o => o.status === tab);
  const totalValue = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Sales orders</h1>
          <div className="ph-sub"><span className="mono">{filtered.length}</span> orders · <span className="fw-6 muted-2">{fmtMoney(totalValue, 0)}</span> total value</div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-solid fa-filter" /> Filters</button>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn btn-primary" onClick={() => onPage('sales-form')}>
            <i className="fa-solid fa-plus" /> New sales order
          </button>
        </div>
      </div>

      {/* KPI mini-strip */}
      <div className="kpis mb-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="card card-pad">
          <div className="kpi-lbl">Open orders</div>
          <div className="kpi-val">{orders.filter(o => o.status === 'pending' || o.status === 'partial').length}</div>
          <div className="t-xs muted">{fmtMoney(orders.filter(o => o.status === 'pending' || o.status === 'partial').reduce((s,o)=>s+o.total,0), 0)} value</div>
        </div>
        <div className="card card-pad">
          <div className="kpi-lbl">Pending payment</div>
          <div className="kpi-val" style={{ color: 'var(--c-warn)' }}>{fmtMoney(8420, 0)}</div>
          <div className="t-xs muted">across 4 invoices</div>
        </div>
        <div className="card card-pad">
          <div className="kpi-lbl">Avg order value</div>
          <div className="kpi-val">{fmtMoney(orders.reduce((s,o)=>s+o.total,0) / orders.length, 0)}</div>
          <div className="t-xs"><span className="delta up"><i className="fa-solid fa-arrow-up" style={{ fontSize: 9 }}/>6.4%</span> <span className="muted">vs last week</span></div>
        </div>
        <div className="card card-pad">
          <div className="kpi-lbl">Fulfilment rate</div>
          <div className="kpi-val">94%</div>
          <div className="bar mt-2 pos"><span style={{ width: '94%' }} /></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="tabs" style={{ paddingLeft: 12 }}>
          {tabs.map(t => (
            <button key={t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
              {t.label} <span className="mono muted" style={{ marginLeft: 4, fontSize: 11 }}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="row" style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
          <div className="fb-search" style={{ flex: 1, position: 'relative', maxWidth: 320 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-3)', fontSize: 12 }} />
            <input className="input" placeholder="Search by order #, customer…" style={{ paddingLeft: 30 }} />
          </div>
          <div style={{ flex: 1 }} />
          <div className="row gap-2">
            <select className="select" style={{ width: 'auto' }}>
              <option>Last 30 days</option><option>Today</option><option>This week</option><option>Custom…</option>
            </select>
            <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-sliders" /></button>
          </div>
        </div>
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 28 }}><span className="chk" /></th>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th className="ta-right">Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Assigned</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id + i} onClick={() => onPage('sales-form')} style={{ cursor: 'pointer' }}>
                  <td onClick={e => e.stopPropagation()}><span className="chk" /></td>
                  <td className="col-id">{o.id}</td>
                  <td>
                    <div className="cell-with-icon">
                      <div className="thumb">{o.cust.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                      <div>
                        <div className="fw-6">{o.cust}</div>
                        <div className="ci-sub">PO #{(11200 + i).toString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{o.date}</td>
                  <td className="col-num">{o.items}</td>
                  <td className="ta-right col-num fw-6">{fmtMoney(o.total, 2)}</td>
                  <td><StatusPill status={o.status} /></td>
                  <td>
                    <span className="t-sm" style={{ color: o.status === 'paid' ? 'var(--c-pos)' : 'var(--text-3)' }}>
                      {o.status === 'paid' ? 'Card ending 4242' : o.status === 'pending' ? 'Net 30' : '—'}
                    </span>
                  </td>
                  <td>
                    <div className="row gap-2">
                      <div className="av" style={{ background: 'var(--c-info)' }}>{['MR','DK','PS','MR','DK'][i%5]}</div>
                      <span className="t-sm muted">{['Maria','Daniel','Priya','Maria','Daniel'][i%5]}</span>
                    </div>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="row-actions">
                      <button title="View"><i className="fa-solid fa-eye" /></button>
                      <button title="Edit"><i className="fa-solid fa-pen" /></button>
                      <button title="More"><i className="fa-solid fa-ellipsis" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ------ Invoice/SO form ------
function SalesForm({ onPage }) {
  const [lines, setLines] = React.useState(INVOICE_LINES);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const tax = lines.reduce((s, l) => s + l.qty * l.price * (l.tax || 0) / 100, 0);
  const total = subtotal + tax;

  const updateLine = (idx, key, val) => setLines(lines.map((l, i) => i === idx ? { ...l, [key]: val } : l));
  const removeLine = idx => setLines(lines.filter((_, i) => i !== idx));
  const addLine = () => setLines([...lines, { sku: '', desc: '', qty: 1, price: 0, tax: 7 }]);

  return (
    <div className="page" style={{ maxWidth: 1280 }}>
      <div className="page-head">
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => onPage('sales')} style={{ marginBottom: 4 }}>
            <i className="fa-solid fa-arrow-left" /> Back to sales orders
          </button>
          <h1>New sales order <span className="muted" style={{ fontWeight: 500 }}>· SO-10285</span></h1>
          <div className="ph-sub">Draft · created Today, 10:14 AM by Maria R.</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost"><i className="fa-solid fa-clock-rotate-left" /></button>
          <button className="btn"><i className="fa-regular fa-floppy-disk" /> Save draft</button>
          <button className="btn"><i className="fa-solid fa-paper-plane" /> Send to customer</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Confirm order</button>
        </div>
      </div>

      <div className="grid-12">
        {/* Left — main form */}
        <div className="col gap-4">
          {/* Customer block */}
          <div className="card">
            <div className="card-hd">
              <h3>Customer & shipping</h3>
              <div className="hd-actions"><button className="btn btn-ghost btn-sm"><i className="fa-solid fa-circle-plus" /> New customer</button></div>
            </div>
            <div className="card-pad">
              <div className="grid-2" style={{ gap: 14 }}>
                <div className="field">
                  <label>Customer <span className="req">*</span></label>
                  <div style={{ position: 'relative' }}>
                    <select className="select">
                      <option>Northwind Industrial</option>
                      <option>Atlas Hardware Co.</option>
                      <option>Cascade Outfitters</option>
                    </select>
                  </div>
                  <div className="t-xs muted mt-1">Balance: <span className="mono">{fmtMoney(8240, 2)}</span> · Net 30 terms</div>
                </div>
                <div className="field">
                  <label>Reference / PO #</label>
                  <input className="input" defaultValue="PO-2025-0412" />
                </div>
                <div className="field">
                  <label>Order date</label>
                  <input className="input" type="date" defaultValue="2026-05-14" />
                </div>
                <div className="field">
                  <label>Expected delivery</label>
                  <input className="input" type="date" defaultValue="2026-05-22" />
                </div>
                <div className="field" style={{ gridColumn: 'span 2' }}>
                  <label>Ship to</label>
                  <textarea className="input" rows={2} defaultValue={"4221 Industrial Pkwy, Suite 200\nReno, NV 89506"} />
                </div>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="card">
            <div className="card-hd">
              <h3>Items</h3>
              <span className="hd-sub">{lines.length} line items</span>
            </div>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 30 }}>#</th>
                    <th>SKU</th>
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
                      <td className="col-id">{l.sku}</td>
                      <td>
                        <input className="input" defaultValue={l.desc} style={{ border: 0, padding: '4px 0', background: 'transparent' }} />
                      </td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" value={l.qty} onChange={e => updateLine(i, 'qty', +e.target.value)}
                          style={{ width: 70, textAlign: 'right', padding: '4px 8px' }} />
                      </td>
                      <td className="ta-right">
                        <input className="input col-num" type="number" step="0.01" value={l.price} onChange={e => updateLine(i, 'price', +e.target.value)}
                          style={{ width: 95, textAlign: 'right', padding: '4px 8px' }} />
                      </td>
                      <td className="ta-right col-num muted">{l.tax}%</td>
                      <td className="ta-right col-num fw-6">{fmtMoney(l.qty * l.price * (1 + l.tax/100), 2)}</td>
                      <td>
                        <div className="row-actions" style={{ opacity: 1 }}>
                          <button onClick={() => removeLine(i)}><i className="fa-solid fa-xmark" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="row" style={{ padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
              <button className="btn btn-sm" onClick={addLine}><i className="fa-solid fa-plus" /> Add line</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-magnifying-glass" /> Pick from catalog</button>
              <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-barcode" /> Scan to add</button>
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <div className="card-hd">
              <h3>Notes & terms</h3>
            </div>
            <div className="card-pad">
              <div className="grid-2">
                <div className="field">
                  <label>Customer notes</label>
                  <textarea className="input" rows={3} placeholder="Visible on the printed invoice…" defaultValue="Please call dock supervisor Frank on arrival." />
                </div>
                <div className="field">
                  <label>Internal notes</label>
                  <textarea className="input" rows={3} placeholder="Only visible to your team…" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail — summary, status, audit */}
        <div className="col gap-4">
          {/* Summary */}
          <div className="card">
            <div className="card-hd"><h3>Order summary</h3></div>
            <div className="card-pad">
              <div className="col gap-2">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Subtotal</span>
                  <span className="mono">{fmtMoney(subtotal, 2)}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Tax</span>
                  <span className="mono">{fmtMoney(tax, 2)}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Shipping</span>
                  <span className="mono">$0.00</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Discount</span>
                  <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px' }}><i className="fa-solid fa-plus" style={{ fontSize: 9 }} /> Add</button>
                </div>
                <div className="divider" style={{ margin: '8px 0' }} />
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="fw-7">Total</span>
                  <span className="fw-7 mono" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{fmtMoney(total, 2)}</span>
                </div>
                <div className="t-xs muted">in USD · 7% tax inclusive</div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="card">
            <div className="card-hd"><h3>Payment</h3></div>
            <div className="card-pad col gap-3">
              <div className="field">
                <label>Payment terms</label>
                <select className="select"><option>Net 30</option><option>Net 15</option><option>Due on receipt</option><option>50% deposit</option></select>
              </div>
              <div className="field">
                <label>Payment method</label>
                <select className="select"><option>Bank transfer</option><option>Credit card</option><option>Check</option></select>
              </div>
              <div className="row gap-2" style={{ padding: '10px 12px', background: 'var(--c-pos-soft)', borderRadius: 7, color: 'var(--c-pos)' }}>
                <i className="fa-solid fa-circle-check" />
                <span className="t-sm fw-6">Credit available: $24,000</span>
              </div>
            </div>
          </div>

          {/* Audit */}
          <div className="card">
            <div className="card-hd"><h3>Audit trail</h3></div>
            <div className="card-pad col gap-3" style={{ paddingTop: 4 }}>
              {[
                { who: 'Maria R.', what: 'Created draft', when: 'Just now' },
                { who: 'Auto',     what: 'Validated stock availability', when: '1 min ago' },
                { who: 'Auto',     what: 'Applied customer tier pricing', when: '1 min ago' },
              ].map((e, i) => (
                <div key={i} className="row gap-3">
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--brand-soft)', color: 'var(--brand-soft-fg)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700 }}>{e.who[0]}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="t-sm"><span className="fw-6">{e.who}</span> {e.what}</div>
                    <div className="t-xs muted">{e.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.SalesOrders = SalesOrders;
window.SalesForm = SalesForm;
