/* global React */
const { fmtMoney } = window.WMS;

// --- Sample GRN data ---
const GRNS = [
  { id: 'GRN-4428', date: 'Today, 11:24', supplier: 'Polyflo Industries',     po: 'PO-2284', items: { rec: 18, ord: 18 }, wh: 'Warehouse A · Dock 2', by: 'Daniel K.',  status: 'complete',     value: 4_812.00, qc: 'passed'  },
  { id: 'GRN-4427', date: 'Today, 09:08', supplier: 'IronGrip Tools Co.',     po: 'PO-2283', items: { rec: 22, ord: 24 }, wh: 'Warehouse A · Dock 1', by: 'Maria R.',   status: 'partial',      value: 11_240.00,qc: 'pending' },
  { id: 'GRN-4426', date: 'Yesterday',    supplier: 'Lumio Electrical',       po: 'PO-2281', items: { rec: 36, ord: 36 }, wh: 'Warehouse B · Dock 1', by: 'Priya S.',   status: 'discrepancy',  value: 8_120.50, qc: 'failed'  },
  { id: 'GRN-4425', date: 'Yesterday',    supplier: 'Atlas Fasteners',        po: 'PO-2280', items: { rec: 12, ord: 12 }, wh: 'Warehouse A · Dock 3', by: 'Daniel K.',  status: 'complete',     value: 2_408.40, qc: 'passed'  },
  { id: 'GRN-4424', date: '2 days ago',   supplier: 'Cascade Lumber Supply',  po: 'PO-2278', items: { rec: 8,  ord: 14 }, wh: 'Yard · Bay 4',         by: 'Maria R.',   status: 'partial',      value: 6_840.00, qc: 'pending' },
  { id: 'GRN-4423', date: '2 days ago',   supplier: 'Beacon Paint Works',     po: 'PO-2277', items: { rec: 24, ord: 24 }, wh: 'Warehouse A · Dock 2', by: 'Priya S.',   status: 'complete',     value: 3_120.80, qc: 'passed'  },
  { id: 'GRN-4422', date: '3 days ago',   supplier: 'GuardPro Safety',        po: 'PO-2276', items: { rec: 60, ord: 60 }, wh: 'Warehouse B · Dock 2', by: 'Daniel K.',  status: 'complete',     value: 1_104.00, qc: 'passed'  },
  { id: 'GRN-4421', date: '3 days ago',   supplier: 'Polyflo Industries',     po: 'PO-2275', items: { rec: 18, ord: 18 }, wh: 'Warehouse A · Dock 1', by: 'Maria R.',   status: 'complete',     value: 5_240.00, qc: 'passed'  },
  { id: 'GRN-4420', date: '4 days ago',   supplier: 'Hydrox Pumps',           po: 'PO-2274', items: { rec: 4,  ord: 4  }, wh: 'Warehouse A · Dock 3', by: 'Daniel K.',  status: 'complete',     value: 1_640.00, qc: 'passed'  },
];

// Open POs awaiting receipt
const OPEN_POS = [
  { po: 'PO-2285', supplier: 'Stratos Building Materials', expected: 'Today',     items: 42, value: 18_240, eta: 'on-time' },
  { po: 'PO-2286', supplier: 'BondTek Adhesives',          expected: 'Today',     items: 8,  value: 1_240,  eta: 'on-time' },
  { po: 'PO-2287', supplier: 'PowerCell Energy',           expected: 'Tomorrow',  items: 24, value: 4_180,  eta: 'on-time' },
  { po: 'PO-2288', supplier: 'Lumio Electrical',           expected: 'May 16',    items: 60, value: 9_640,  eta: 'late'    },
  { po: 'PO-2282', supplier: 'IronGrip Tools Co.',         expected: 'Overdue',   items: 12, value: 5_280,  eta: 'overdue' },
];

// Detail line items for the selected GRN
const GRN_LINES = [
  { sku: 'PVC-2-90',  desc: 'PVC elbow 2" 90°',         ord: 80, rec: 80, dmg: 0, unit: 'pcs', loc: 'B-04-1' },
  { sku: 'PVC-3-45',  desc: 'PVC elbow 3" 45°',         ord: 40, rec: 40, dmg: 0, unit: 'pcs', loc: 'B-04-2' },
  { sku: 'PVC-CPL-2', desc: 'PVC coupling 2"',          ord: 120,rec: 118,dmg: 2, unit: 'pcs', loc: 'B-04-3' },
  { sku: 'PVC-VLV-2', desc: 'PVC ball valve 2"',        ord: 24, rec: 24, dmg: 0, unit: 'pcs', loc: 'B-05-1' },
  { sku: 'PVC-PIPE2', desc: 'PVC pipe 2" x 3m',         ord: 60, rec: 60, dmg: 0, unit: 'pcs', loc: 'B-06-1' },
];

const ST = {
  complete:    { cls: 'pos',   label: 'Complete'    },
  partial:     { cls: 'warn',  label: 'Partial'     },
  discrepancy: { cls: 'neg',   label: 'Discrepancy' },
  pending:     { cls: 'muted', label: 'Pending'     },
};
const QC = {
  passed:  { cls: 'pos',  label: 'QC passed', i: 'fa-circle-check' },
  pending: { cls: 'warn', label: 'QC pending',i: 'fa-clock' },
  failed:  { cls: 'neg',  label: 'QC failed', i: 'fa-circle-xmark' },
};
const ETA = {
  'on-time': { cls: 'pos',  label: 'On time' },
  'late':    { cls: 'warn', label: 'Late'    },
  'overdue': { cls: 'neg',  label: 'Overdue' },
};

function GoodsReceipts({ onPage }) {
  const [tab, setTab] = React.useState('all');
  const [sel, setSel] = React.useState(GRNS[0].id);
  const [showDetail, setShowDetail] = React.useState(true);

  const tabs = [
    { id: 'all',     label: 'All',         count: GRNS.length },
    { id: 'pending', label: 'Awaiting QC', count: GRNS.filter(g => g.qc === 'pending').length },
    { id: 'partial', label: 'Partial',     count: GRNS.filter(g => g.status === 'partial').length },
    { id: 'discrep', label: 'Discrepancy', count: GRNS.filter(g => g.status === 'discrepancy').length },
  ];
  const map = { all: () => true, pending: g => g.qc === 'pending', partial: g => g.status === 'partial', discrep: g => g.status === 'discrepancy' };
  const filtered = GRNS.filter(map[tab]);

  const selected = GRNS.find(g => g.id === sel) || GRNS[0];
  const totalReceivedToday = GRNS.filter(g => g.date.startsWith('Today')).reduce((s, g) => s + g.value, 0);

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Goods receipts</h1>
          <div className="ph-sub">
            Record what physically arrived from suppliers — automatically updates stock and matches against open POs.
          </div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-solid fa-filter" /> Filters</button>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn"><i className="fa-solid fa-barcode" /> Scan to receive</button>
          <button className="btn btn-primary" onClick={() => onPage && onPage('new-grn')}><i className="fa-solid fa-plus" /> New GRN</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="kpis mb-3">
        <div className="kpi">
          <div className="kpi-lbl">Awaiting receipt</div>
          <div className="kpi-val">{OPEN_POS.length}</div>
          <div className="kpi-foot"><span className="muted">{fmtMoney(OPEN_POS.reduce((s,p)=>s+p.value,0),0)} value</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Received today</div>
          <div className="kpi-val">{fmtMoney(totalReceivedToday, 0)}</div>
          <div className="kpi-foot">
            <span className="delta up"><i className="fa-solid fa-arrow-up" style={{fontSize:9}}/>12%</span>
            <span className="muted">vs yesterday</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Awaiting QC</div>
          <div className="kpi-val" style={{ color: 'var(--c-warn)' }}>{GRNS.filter(g => g.qc === 'pending').length}</div>
          <div className="kpi-foot"><span className="muted">across {new Set(GRNS.filter(g=>g.qc==='pending').map(g=>g.supplier)).size} suppliers</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Discrepancies</div>
          <div className="kpi-val" style={{ color: 'var(--c-neg)' }}>{GRNS.filter(g => g.status === 'discrepancy').length}</div>
          <div className="kpi-foot"><span className="muted">needs supplier follow-up</span></div>
        </div>
      </div>

      {/* Awaiting receipt strip */}
      <div className="card mb-3">
        <div className="card-hd">
          <h3>Awaiting receipt</h3>
          <span className="hd-sub">{OPEN_POS.length} purchase orders inbound</span>
          <div className="hd-actions">
            <button className="btn btn-ghost btn-sm">View all POs <i className="fa-solid fa-arrow-right" /></button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 1, background: 'var(--line)', overflowX: 'auto' }}>
          {OPEN_POS.map(p => {
            const eta = ETA[p.eta];
            return (
              <div key={p.po} style={{ background: 'var(--card)', padding: '12px 16px', minWidth: 220, flex: 1, cursor: 'pointer' }}>
                <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="t-xs muted mono">{p.po}</div>
                    <div className="fw-6 t-sm mt-1" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{p.supplier}</div>
                  </div>
                  <span className={'pill ' + eta.cls}>{eta.label}</span>
                </div>
                <div className="row gap-3 mt-2">
                  <div>
                    <div className="t-xs muted">Expected</div>
                    <div className="t-sm fw-6">{p.expected}</div>
                  </div>
                  <div>
                    <div className="t-xs muted">Items</div>
                    <div className="t-sm fw-6 mono">{p.items}</div>
                  </div>
                  <div>
                    <div className="t-xs muted">Value</div>
                    <div className="t-sm fw-6 mono">{fmtMoney(p.value, 0)}</div>
                  </div>
                </div>
                <button className="btn btn-sm mt-2" style={{ width: '100%' }}>
                  <i className="fa-solid fa-clipboard-check" /> Receive
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main: list + detail rail */}
      <div style={{ display: 'grid', gridTemplateColumns: showDetail ? '1fr 420px' : '1fr', gap: 'var(--gap)' }}>
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
              <input className="input" placeholder="Search GRN, PO, supplier…" style={{ paddingLeft: 30 }} />
            </div>
            <div style={{ flex: 1 }} />
            <select className="select" style={{ width: 'auto' }}>
              <option>All warehouses</option>
              <option>Warehouse A</option>
              <option>Warehouse B</option>
              <option>Yard</option>
            </select>
            <button className="btn btn-sm btn-ghost" onClick={() => setShowDetail(d => !d)} title="Toggle detail panel">
              <i className={'fa-solid ' + (showDetail ? 'fa-angles-right' : 'fa-angles-left')} />
            </button>
          </div>
          <div className="tbl-scroll">
            <table className="tbl">
              <thead>
                <tr>
                  <th>GRN #</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>PO ref</th>
                  <th>Received</th>
                  <th>Warehouse</th>
                  <th>QC</th>
                  <th>Status</th>
                  <th className="ta-right">Value</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => {
                  const st = ST[g.status], qc = QC[g.qc];
                  const pct = (g.items.rec / g.items.ord) * 100;
                  return (
                    <tr key={g.id} className={g.id === sel ? 'is-selected' : ''} onClick={() => setSel(g.id)} style={{ cursor: 'pointer' }}>
                      <td className="col-id">{g.id}</td>
                      <td className="muted">{g.date}</td>
                      <td>
                        <div className="cell-with-icon">
                          <div className="thumb">{g.supplier.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                          <span className="fw-6">{g.supplier}</span>
                        </div>
                      </td>
                      <td className="col-id">{g.po}</td>
                      <td>
                        <div className="row gap-2" style={{ minWidth: 140 }}>
                          <span className="mono fw-6 t-sm">{g.items.rec}/{g.items.ord}</span>
                          <div className="bar" style={{ flex: 1, height: 4 }}>
                            <span style={{
                              width: pct + '%',
                              background: pct === 100 ? 'var(--c-pos)' : pct >= 80 ? 'var(--c-warn)' : 'var(--c-neg)'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td className="t-sm muted-2">{g.wh}</td>
                      <td><span className={'pill ' + qc.cls + ' nodot'} title={qc.label}><i className={'fa-solid ' + qc.i} style={{ fontSize: 9 }} />{qc.label.split(' ')[1]}</span></td>
                      <td><span className={'pill ' + st.cls}>{st.label}</span></td>
                      <td className="ta-right col-num fw-6">{fmtMoney(g.value, 2)}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="row-actions">
                          <button title="Print"><i className="fa-solid fa-print" /></button>
                          <button title="More"><i className="fa-solid fa-ellipsis" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail rail */}
        {showDetail && (
          <div className="card" style={{ alignSelf: 'flex-start', position: 'sticky', top: 16 }}>
            <div className="card-hd">
              <div style={{ flex: 1 }}>
                <h3>{selected.id}</h3>
                <div className="t-xs muted mt-1">{selected.date} · received by {selected.by}</div>
              </div>
              <div className="hd-actions">
                <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-up-right-from-square" /></button>
              </div>
            </div>

            <div className="card-pad">
              {/* Status row */}
              <div className="row gap-2 mb-3">
                <span className={'pill ' + ST[selected.status].cls}>{ST[selected.status].label}</span>
                <span className={'pill ' + QC[selected.qc].cls + ' nodot'}>
                  <i className={'fa-solid ' + QC[selected.qc].i} style={{ fontSize: 9 }} />
                  {QC[selected.qc].label}
                </span>
              </div>

              {/* Metadata */}
              <div className="col gap-2 t-sm">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Supplier</span>
                  <span className="fw-6">{selected.supplier}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Purchase order</span>
                  <span className="mono fw-6" style={{ color: 'var(--brand)' }}>{selected.po}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Warehouse</span>
                  <span>{selected.wh}</span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Received by</span>
                  <span className="row gap-2">
                    <span className="av" style={{ width: 18, height: 18, fontSize: 9, background: 'var(--c-info)' }}>{selected.by.split(' ').map(w => w[0]).join('')}</span>
                    <span>{selected.by}</span>
                  </span>
                </div>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <span className="muted">Total value</span>
                  <span className="mono fw-7">{fmtMoney(selected.value, 2)}</span>
                </div>
              </div>

              <div className="divider" />

              {/* Lines */}
              <div className="mb-2 row" style={{ justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Line items</h3>
                <span className="t-xs muted mono">{selected.items.rec}/{selected.items.ord} units</span>
              </div>
              <div className="col" style={{ gap: 1, background: 'var(--line)', borderRadius: 7, overflow: 'hidden', border: '1px solid var(--line)' }}>
                <div className="row t-xs muted" style={{ padding: '6px 10px', background: 'var(--bg-sub)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 10 }}>
                  <div style={{ flex: 2 }}>Item</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>Ord</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>Rec</div>
                  <div style={{ flex: 1, textAlign: 'right' }}>Dmg</div>
                </div>
                {GRN_LINES.map(l => (
                  <div key={l.sku} className="row" style={{ padding: '8px 10px', background: 'var(--card)', fontSize: 12 }}>
                    <div style={{ flex: 2, minWidth: 0 }}>
                      <div className="fw-6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.desc}</div>
                      <div className="t-xs muted mono">{l.sku} · {l.loc}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }} className="mono muted">{l.ord}</div>
                    <div style={{ flex: 1, textAlign: 'right' }} className="mono fw-6" style={{ color: l.rec === l.ord ? 'var(--c-pos)' : 'var(--c-warn)' }}>{l.rec}</div>
                    <div style={{ flex: 1, textAlign: 'right' }} className="mono" style={{ color: l.dmg > 0 ? 'var(--c-neg)' : 'var(--text-3)' }}>{l.dmg}</div>
                  </div>
                ))}
              </div>

              {selected.qc === 'pending' && (
                <div className="banner" style={{ marginTop: 14 }}>
                  <i className="fa-solid fa-clock" />
                  <div>Awaiting quality check from <strong>Priya S.</strong></div>
                </div>
              )}
              {selected.status === 'discrepancy' && (
                <div className="banner" style={{ marginTop: 14, background: 'var(--c-neg-soft)', color: 'var(--c-neg)', borderColor: 'color-mix(in oklch, var(--c-neg) 30%, transparent)' }}>
                  <i className="fa-solid fa-triangle-exclamation" />
                  <div>2 units damaged on PVC-CPL-2 — debit note suggested</div>
                </div>
              )}

              <div className="row gap-2 mt-3">
                <button className="btn btn-sm" style={{ flex: 1 }}><i className="fa-solid fa-print" /> Print</button>
                <button className="btn btn-sm" style={{ flex: 1 }}><i className="fa-solid fa-rotate-left" /> Debit note</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}><i className="fa-solid fa-check" /> Approve</button>
              </div>

              {/* Timeline */}
              <div className="divider" />
              <h3 style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Activity</h3>
              <div className="col gap-3">
                {[
                  { who: selected.by, what: 'received and unloaded', when: selected.date },
                  { who: 'Auto',      what: 'matched to ' + selected.po, when: selected.date },
                  { who: 'Daniel K.', what: 'created GRN draft', when: selected.date },
                ].map((e, i) => (
                  <div key={i} className="row gap-3">
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: i === 0 ? 'var(--c-pos)' : 'var(--text-4)', marginTop: 7, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="t-sm"><span className="fw-6">{e.who}</span> <span className="muted-2">{e.what}</span></div>
                      <div className="t-xs muted">{e.when}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.GoodsReceipts = GoodsReceipts;
