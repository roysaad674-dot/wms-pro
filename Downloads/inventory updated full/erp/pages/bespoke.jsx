/* global React */
// Bespoke layouts for pages that don't fit the generic list-page template.
const { fmtMoney } = window.WMS;
const USERS = window.WMS_USERS;
const { useState } = React;

/* =============================================================
   Common helpers
   ============================================================= */
function PageHead({ title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="ph-sub">{subtitle}</div>}
      </div>
      {actions && <div className="ph-actions">{actions}</div>}
    </div>
  );
}
function Purpose({ children, tone = 'info', icon = 'fa-lightbulb' }) {
  return (
    <div className={'banner ' + tone} style={{ marginBottom: 16 }}>
      <i className={'fa-solid ' + icon} />
      <div>{children}</div>
    </div>
  );
}
function SectionTitle({ children, sub }) {
  return (
    <div className="row" style={{ marginBottom: 10, alignItems: 'baseline' }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{children}</h3>
      {sub && <span className="muted t-xs" style={{ marginLeft: 8 }}>{sub}</span>}
    </div>
  );
}

/* =============================================================
   MAIN · Workspace — "what's on my plate today"
   ============================================================= */
function Workspace() {
  const tasks = [
    { id: 1, title: 'Approve PO-2279 — Cascade Lumber',     who: 'Maria created',   due: 'Today',   priority: 'high',   type: 'approval' },
    { id: 2, title: 'Match 4 wire deposits (>$1k each)',   who: 'Auto-flagged',    due: 'Today',   priority: 'high',   type: 'reconcile' },
    { id: 3, title: 'QC review GRN-4427 — IronGrip',       who: 'Daniel received', due: 'Today',   priority: 'med',    type: 'qc' },
    { id: 4, title: 'Sign off May 19 – Jun 01 payroll',    who: 'Priya prepared',  due: 'Friday',  priority: 'med',    type: 'approval' },
    { id: 5, title: 'Call Bluefin Marine — over credit limit', who: 'Auto-flagged',due: 'Today',   priority: 'high',   type: 'collect' },
    { id: 6, title: 'Resolve 3 missing-receipt expenses',  who: 'You owe',         due: 'Tomorrow',priority: 'med',    type: 'expense' },
    { id: 7, title: '4 SKUs out of stock — auto reorder?', who: 'Auto-flagged',    due: 'Today',   priority: 'low',    type: 'inventory' },
    { id: 8, title: 'Approve Liam\'s vacation request',    who: 'Liam requested',  due: 'Jun 02',  priority: 'low',    type: 'hr' },
  ];
  const typeMeta = {
    approval:   { i: 'fa-circle-check',           c: 'var(--c-violet)' },
    reconcile:  { i: 'fa-scale-balanced',         c: 'var(--c-info)' },
    qc:         { i: 'fa-magnifying-glass',       c: 'var(--c-warn)' },
    collect:    { i: 'fa-money-bill-trend-up',    c: 'var(--c-neg)' },
    expense:    { i: 'fa-receipt',                c: 'var(--brand)' },
    inventory:  { i: 'fa-boxes-stacked',          c: 'var(--c-info)' },
    hr:         { i: 'fa-user-clock',             c: 'var(--c-pos)' },
  };
  const team = [
    { ...USERS[1], status: 'on shift', loc: 'Warehouse A · Receiving' },
    { ...USERS[3], status: 'on shift', loc: 'Sales · phones' },
    { ...USERS[2], status: 'in meeting',loc: 'Q1 close review' },
    { ...USERS[0], status: 'on shift', loc: 'Office' },
    { ...USERS[4], status: 'on leave', loc: 'Parental — back Jul 24' },
  ];
  const events = [
    { t: '10:00', label: 'Northwind delivery — Dock 1', kind: 'inbound' },
    { t: '11:30', label: 'Q1 close — finance huddle',    kind: 'meeting' },
    { t: '13:00', label: 'Atlas Hardware pickup',        kind: 'outbound' },
    { t: '15:00', label: 'Lumio rep — pricing review',   kind: 'meeting' },
    { t: '17:00', label: 'Daily cash position emails',   kind: 'system' },
  ];

  return (
    <div className="page">
      <PageHead
        title="My Workspace"
        subtitle="Tuesday, May 26 · The things only you can do today"
        actions={<>
          <button className="btn"><i className="fa-solid fa-rotate" /> Refresh</button>
          <button className="btn btn-primary"><i className="fa-solid fa-bolt" /> Quick action</button>
        </>}
      />
      <Purpose>
        Your personal home — a feed of everything pending <strong>your</strong> approval, attention, or action, gathered from every module. Each card links straight to the source document so you can resolve without hunting.
      </Purpose>

      <div className="kpis mb-3">
        <div className="kpi">
          <div className="kpi-lbl">For your approval</div>
          <div className="kpi-val">5</div>
          <div className="kpi-foot"><span className="delta down"><i className="fa-solid fa-arrow-down" style={{fontSize:9}}/>2</span><span className="muted">vs yesterday</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Action needed today</div>
          <div className="kpi-val" style={{color:'var(--c-warn)'}}>3</div>
          <div className="kpi-foot"><span className="muted">2 high priority</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Mentions</div>
          <div className="kpi-val">4</div>
          <div className="kpi-foot"><span className="muted">unread comments</span></div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Inbox</div>
          <div className="kpi-val">12</div>
          <div className="kpi-foot"><span className="muted">documents to file</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--gap)' }}>
        {/* Task list */}
        <div className="card">
          <div className="card-hd">
            <h3>Your tasks</h3>
            <span className="hd-sub">{tasks.length} items · 3 high priority</span>
            <div className="hd-actions">
              <div className="seg">
                <button className="is-active">Mine</button>
                <button>Team</button>
              </div>
              <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-sliders" /></button>
            </div>
          </div>
          <div className="col" style={{ gap: 0 }}>
            {tasks.map(t => {
              const m = typeMeta[t.type];
              return (
                <div key={t.id} className="row" style={{ padding: '10px 16px', borderBottom: '1px solid var(--line)', gap: 12, cursor: 'pointer' }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, display: 'grid', placeItems: 'center', background: m.c, opacity: 0.12, color: m.c, position: 'relative' }}>
                    <i className={'fa-solid ' + m.i} style={{ color: m.c, opacity: 1 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fw-6">{t.title}</div>
                    <div className="t-xs muted mt-1">{t.who} · due {t.due}</div>
                  </div>
                  <span className={'pill ' + (t.priority === 'high' ? 'neg' : t.priority === 'med' ? 'warn' : 'muted')}>{t.priority}</span>
                  <button className="btn btn-sm">Open</button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: team + agenda */}
        <div className="col gap-3">
          <div className="card">
            <div className="card-hd">
              <h3>Team today</h3>
              <span className="hd-sub">{team.filter(t=>t.status==='on shift').length} on shift</span>
            </div>
            <div className="col" style={{ gap: 0 }}>
              {team.map((p, i) => (
                <div key={i} className="row" style={{ padding: '10px 14px', borderBottom: i < team.length-1 ? '1px solid var(--line)' : 'none', gap: 10 }}>
                  <div className="av" style={{ background: p.color }}>{p.initials}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fw-6 t-sm">{p.name}</div>
                    <div className="t-xs muted">{p.loc}</div>
                  </div>
                  <span className={'pill ' + (p.status === 'on shift' ? 'pos' : p.status === 'on leave' ? 'muted' : 'info')}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-hd">
              <h3>Today's agenda</h3>
              <span className="hd-sub">5 events</span>
            </div>
            <div className="col" style={{ gap: 0 }}>
              {events.map((e, i) => (
                <div key={i} className="row" style={{ padding: '10px 14px', borderBottom: i < events.length-1 ? '1px solid var(--line)' : 'none', gap: 12, alignItems: 'flex-start' }}>
                  <div className="mono fw-6 t-sm" style={{ minWidth: 44 }}>{e.t}</div>
                  <div style={{ width: 6, height: 6, borderRadius: 3, marginTop: 6, background: e.kind === 'meeting' ? 'var(--c-violet)' : e.kind === 'inbound' ? 'var(--c-pos)' : e.kind === 'outbound' ? 'var(--brand)' : 'var(--text-3)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="t-sm fw-6">{e.label}</div>
                    <div className="t-xs muted">{e.kind}</div>
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

/* =============================================================
   MAIN · Pinned reports — card grid
   ============================================================= */
function Pinned() {
  const cards = [
    { title: 'Daily cash position',    sub: 'Bank balances · pending in/out · 14-day projection', value: '$482k', delta: +12.4, type: 'cash', author: USERS[2] },
    { title: 'Sales today',            sub: 'Live POS + online + wholesale combined',             value: '$28.4k', delta: +8.2, type: 'sales', author: USERS[0] },
    { title: 'Reorder watch',          sub: 'SKUs below reorder point — by category',             value: '14 SKUs',delta: +2,   type: 'inv',  author: USERS[0] },
    { title: 'AR ageing snapshot',     sub: '60+ day overdue customers — call list',              value: '$11k',   delta: -3.2, type: 'ar',   author: USERS[2] },
    { title: 'GRN discrepancy log',    sub: 'Receipts where physical ≠ ordered',                  value: '3 open', delta: 0,    type: 'qc',   author: USERS[1] },
    { title: 'Top customers (90d)',    sub: 'By revenue · drill to their last orders',            value: 'Northwind',sub2:'$184k',type:'cust',author: USERS[0] },
    { title: 'Margin drift',           sub: 'Categories where margin moved >2pp this month',      value: '4 cats', delta: -1.2, type: 'margin', author: USERS[2] },
    { title: 'Warehouse productivity', sub: 'Picks per hour · receipts per hour by zone',         value: '38 ph', delta: +6.2, type: 'wh',   author: USERS[1] },
  ];
  const meta = {
    cash:   { i: 'fa-coins',          c: 'var(--c-pos)' },
    sales:  { i: 'fa-arrow-trend-up', c: 'var(--brand)' },
    inv:    { i: 'fa-boxes-stacked',  c: 'var(--c-warn)' },
    ar:     { i: 'fa-receipt',        c: 'var(--c-neg)' },
    qc:     { i: 'fa-magnifying-glass-chart', c: 'var(--c-info)' },
    cust:   { i: 'fa-user-friends',   c: 'var(--c-violet)' },
    margin: { i: 'fa-percent',        c: 'var(--c-info)' },
    wh:     { i: 'fa-warehouse',      c: 'var(--c-warn)' },
  };
  return (
    <div className="page">
      <PageHead
        title="Pinned reports"
        subtitle="The numbers you check most often — drill any card to its full report."
        actions={<>
          <button className="btn"><i className="fa-solid fa-grip" /> Rearrange</button>
          <button className="btn btn-primary"><i className="fa-solid fa-plus" /> Pin a report</button>
        </>}
      />
      <Purpose>
        Pinning takes any saved report or KPI and adds it to this board for everyone (or just you) to scan at a glance. Re-order by drag, drill to the source data on click, or schedule any tile to email as a daily digest.
      </Purpose>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--gap)' }}>
        {cards.map((c, i) => {
          const m = meta[c.type];
          return (
            <div key={i} className="card" style={{ padding: 16, cursor: 'pointer', minHeight: 168, display: 'flex', flexDirection: 'column' }}>
              <div className="row" style={{ marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: m.c, opacity: 0.12, display: 'grid', placeItems: 'center' }}>
                  <i className={'fa-solid ' + m.i} style={{ color: m.c, opacity: 1, fontSize: 13 }} />
                </div>
                <div style={{ flex: 1 }} />
                <div className="row-actions" style={{ opacity: 1 }}>
                  <button><i className="fa-solid fa-thumbtack" /></button>
                  <button><i className="fa-solid fa-ellipsis" /></button>
                </div>
              </div>
              <div className="fw-7" style={{ fontSize: 14 }}>{c.title}</div>
              <div className="t-xs muted mt-1" style={{ lineHeight: 1.5 }}>{c.sub}</div>
              <div style={{ flex: 1 }} />
              <div className="row" style={{ alignItems: 'baseline', marginTop: 14 }}>
                <div className="fw-7" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{c.value}</div>
                {c.delta != null && (
                  <span className={'delta ' + (c.delta >= 0 ? 'up' : 'down')} style={{ marginLeft: 8 }}>
                    <i className={'fa-solid ' + (c.delta >= 0 ? 'fa-arrow-up' : 'fa-arrow-down')} style={{ fontSize: 9 }} />
                    {Math.abs(c.delta).toFixed(1)}{typeof c.delta === 'number' && Math.abs(c.delta) < 100 ? (c.delta % 1 === 0 ? '' : '%') : '%'}
                  </span>
                )}
                {c.sub2 && <div className="ml-auto mono fw-6 t-sm muted-2">{c.sub2}</div>}
              </div>
              <div className="t-xs muted mt-2 row gap-2" style={{ alignItems: 'center' }}>
                <div className="av" style={{ background: c.author.color, width: 16, height: 16, fontSize: 8 }}>{c.author.initials}</div>
                <span>by {c.author.name.split(' ')[0]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =============================================================
   FINANCE · Chart of Accounts (tree)
   ============================================================= */
function ChartOfAccounts({ onPage }) {
  const accounts = [
    { code: '1000', name: 'Assets',                            level: 0, type: 'Header', bal: 1_240_400, dr: true },
    { code: '1010', name: 'Cash & equivalents',                level: 1, type: 'Bank',   bal: 482_140,   dr: true },
    { code: '1020', name: 'Accounts receivable',               level: 1, type: 'AR',     bal: 48_120,    dr: true },
    { code: '1030', name: 'Inventory',                         level: 1, type: 'Inventory',bal: 482_140, dr: true },
    { code: '1040', name: 'Prepaid expenses',                  level: 1, type: 'Other',  bal: 14_840,    dr: true },
    { code: '1500', name: 'Fixed assets',                      level: 1, type: 'Header', bal: 213_160,   dr: true },
    { code: '1510', name: '  Vehicles',                        level: 2, type: 'Asset',  bal: 84_200,    dr: true },
    { code: '1520', name: '  Equipment',                       level: 2, type: 'Asset',  bal: 142_400,   dr: true },
    { code: '1590', name: '  Accum. depreciation',             level: 2, type: 'Contra', bal: -13_440,   dr: false },
    { code: '2000', name: 'Liabilities',                       level: 0, type: 'Header', bal: 282_540,   dr: false },
    { code: '2010', name: 'Accounts payable',                  level: 1, type: 'AP',     bal: 142_840,   dr: false },
    { code: '2020', name: 'Sales tax payable',                 level: 1, type: 'Tax',    bal: 8_240,     dr: false },
    { code: '2030', name: 'Payroll liabilities',               level: 1, type: 'Payroll',bal: 23_400,    dr: false },
    { code: '2040', name: 'Credit cards',                      level: 1, type: 'CC',     bal: 11_260,    dr: false },
    { code: '2050', name: 'Line of credit',                    level: 1, type: 'Loan',   bal: 28_000,    dr: false },
    { code: '2500', name: 'Long-term debt',                    level: 1, type: 'Loan',   bal: 68_800,    dr: false },
    { code: '3000', name: 'Equity',                            level: 0, type: 'Header', bal: 957_860,   dr: false },
    { code: '3010', name: 'Owner\'s equity',                   level: 1, type: 'Equity', bal: 484_000,   dr: false },
    { code: '3020', name: 'Retained earnings',                 level: 1, type: 'Equity', bal: 473_860,   dr: false },
    { code: '4000', name: 'Revenue',                           level: 0, type: 'Header', bal: 1_842_400, dr: false },
    { code: '4010', name: 'Product sales',                     level: 1, type: 'Income', bal: 1_640_400, dr: false },
    { code: '4020', name: 'Services',                          level: 1, type: 'Income', bal: 142_000,   dr: false },
    { code: '4030', name: 'Shipping recovered',                level: 1, type: 'Income', bal: 60_000,    dr: false },
    { code: '5000', name: 'COGS Hardware',                     level: 0, type: 'COGS',   bal: 84_200,    dr: true },
    { code: '5010', name: 'COGS Building',                     level: 0, type: 'COGS',   bal: 124_000,   dr: true },
    { code: '5020', name: 'COGS Electrical',                   level: 0, type: 'COGS',   bal: 96_400,    dr: true },
    { code: '6000', name: 'Operating expenses',                level: 0, type: 'Header', bal: 484_240,   dr: true },
    { code: '6010', name: 'Rent',                              level: 1, type: 'Expense',bal: 100_800,   dr: true },
    { code: '6020', name: 'Utilities',                         level: 1, type: 'Expense',bal: 24_840,    dr: true },
    { code: '6030', name: 'Salaries & wages',                  level: 1, type: 'Expense',bal: 282_400,   dr: true },
    { code: '6040', name: 'Software & subscriptions',          level: 1, type: 'Expense',bal: 18_400,    dr: true },
    { code: '6050', name: 'Marketing',                         level: 1, type: 'Expense',bal: 14_840,    dr: true },
    { code: '6060', name: 'Travel & meals',                    level: 1, type: 'Expense',bal: 12_400,    dr: true },
    { code: '6070', name: 'Depreciation',                      level: 1, type: 'Expense',bal: 13_440,    dr: true },
  ];

  return (
    <div className="page">
      <PageHead
        title="Chart of Accounts"
        subtitle="The skeleton of your books — every account every transaction posts to."
        actions={<>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn btn-primary" onClick={() => onPage && onPage('new-account')}><i className="fa-solid fa-plus" /> New account</button>
        </>}
      />
      <Purpose>
        Every dollar in or out of the business lands in one of these accounts. Use the hierarchy to build your P&amp;L and balance sheet exactly the way your accountant wants to see them. Switch a code, archive an unused account, or add custom departments here.
      </Purpose>

      <div className="kpis mb-3">
        <div className="kpi"><div className="kpi-lbl">Accounts</div><div className="kpi-val">{accounts.length}</div><div className="kpi-foot"><span className="muted">across 6 sections</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total assets</div><div className="kpi-val">{fmtMoney(1_240_400,0)}</div><div className="kpi-foot"><span className="delta up"><i className="fa-solid fa-arrow-up" style={{fontSize:9}}/>4.2%</span><span className="muted">QoQ</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total liabilities</div><div className="kpi-val">{fmtMoney(282_540,0)}</div><div className="kpi-foot"><span className="muted">22.8% gearing</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Net income YTD</div><div className="kpi-val" style={{color:'var(--c-pos)'}}>{fmtMoney(1_053_560,0)}</div><div className="kpi-foot"><span className="muted">revenue − all costs</span></div></div>
      </div>

      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input placeholder="Search accounts by name or code…" />
        </div>
        <select className="select" style={{ width: 'auto' }}>
          <option>All sections</option><option>Assets</option><option>Liabilities</option><option>Equity</option><option>Revenue</option><option>COGS</option><option>Expenses</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>Active only</option><option>Include archived</option>
        </select>
        <div style={{flex:1}} />
        <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-expand" /> Expand all</button>
      </div>

      <div className="card">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Code</th>
                <th>Account name</th>
                <th>Type</th>
                <th>Normal balance</th>
                <th className="ta-right">Balance</th>
                <th>Used by</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.code} style={{ background: a.level === 0 ? 'var(--bg-sub)' : undefined }}>
                  <td className="col-id" style={{ fontWeight: a.level === 0 ? 700 : 400, color: a.level === 0 ? 'var(--text)' : 'var(--text-3)' }}>{a.code}</td>
                  <td>
                    <span style={{ paddingLeft: a.level * 16 }} className={a.level === 0 ? 'fw-7' : a.level === 1 ? 'fw-6' : ''}>
                      {a.level > 0 && <i className="fa-solid fa-angle-right" style={{ fontSize: 9, color: 'var(--text-4)', marginRight: 6 }} />}
                      {a.name.trim()}
                    </span>
                  </td>
                  <td><span className="tag">{a.type}</span></td>
                  <td><span className={'pill nodot ' + (a.dr ? 'info' : 'violet')}>{a.dr ? 'Debit' : 'Credit'}</span></td>
                  <td className="ta-right col-num fw-6" style={{ color: a.bal < 0 ? 'var(--c-neg)' : a.level === 0 ? 'var(--text)' : 'var(--text-2)' }}>
                    {fmtMoney(Math.abs(a.bal), 2)}
                  </td>
                  <td className="t-xs muted">{a.level === 2 ? '—' : (Math.round(Math.random()*40+8)) + ' txns'}</td>
                  <td>
                    <div className="row-actions">
                      <button title="Ledger"><i className="fa-solid fa-scroll" /></button>
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

/* =============================================================
   FINANCE · General Ledger
   ============================================================= */
function GeneralLedger() {
  const [account, setAccount] = useState('1010 · Cash & equivalents');
  const txns = [
    { date: 'May 26', doc: 'INV-3082', memo: 'Atlas Hardware payment',     dr: 4_812.40, cr: 0,        bal: 482_140.00 },
    { date: 'May 26', doc: 'BILL-0883',memo: 'PG&E autopay',               dr: 0,        cr: 1_840.00, bal: 477_327.60 },
    { date: 'May 26', doc: 'RCP-1239', memo: 'Greenleaf Foods card',       dr: 2_104.00, cr: 0,        bal: 479_167.60 },
    { date: 'May 25', doc: 'BILL-0879',memo: 'Lumio Electrical wire',      dr: 0,        cr: 8_120.50, bal: 477_063.60 },
    { date: 'May 25', doc: 'POS-batch',memo: 'POS daily settlement',       dr: 6_280.00, cr: 0,        bal: 485_184.10 },
    { date: 'May 24', doc: 'BILL-0876',memo: 'AWS cloud',                  dr: 0,        cr: 1_840.00, bal: 478_904.10 },
    { date: 'May 24', doc: 'JE-2284',  memo: 'Forex adj on USD AP',        dr: 320.50,   cr: 0,        bal: 480_744.10 },
    { date: 'May 23', doc: 'RCP-1235', memo: 'Unknown wire-in',            dr: 1_400.00, cr: 0,        bal: 480_423.60 },
    { date: 'May 23', doc: 'BILL-0875',memo: 'GuardPro Safety',            dr: 0,        cr: 1_104.00, bal: 479_023.60 },
    { date: 'May 22', doc: 'INV-3079', memo: 'Greenleaf invoice paid',     dr: 2_104.00, cr: 0,        bal: 480_127.60 },
    { date: 'May 22', doc: 'BILL-0873',memo: 'Sterling insurance',         dr: 0,        cr: 6_680.00, bal: 478_023.60 },
  ];
  return (
    <div className="page">
      <PageHead
        title="General Ledger"
        subtitle="Every posting to every account — drill down from a balance to the transactions behind it."
        actions={<>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn"><i className="fa-solid fa-print" /> Print</button>
        </>}
      />
      <Purpose>
        The transaction-level view that lives beneath the chart of accounts. Pick an account, a period and (optionally) a counter-party — and you see every debit and credit that moved that balance. The system of record.
      </Purpose>

      <div className="filterbar">
        <select className="select" value={account} onChange={e => setAccount(e.target.value)} style={{ flex: 1, maxWidth: 320 }}>
          <option>1010 · Cash & equivalents</option>
          <option>1020 · Accounts receivable</option>
          <option>1030 · Inventory</option>
          <option>2010 · Accounts payable</option>
          <option>4010 · Product sales</option>
          <option>5000 · COGS Hardware</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>This month</option><option>Last month</option><option>YTD</option><option>Custom range…</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>All counter-parties</option><option>Vendors</option><option>Customers</option>
        </select>
        <div style={{flex:1}} />
        <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-sliders" /> Columns</button>
      </div>

      <div className="kpis mb-3">
        <div className="kpi"><div className="kpi-lbl">Opening balance</div><div className="kpi-val">{fmtMoney(478_640,2)}</div><div className="kpi-foot"><span className="muted">May 01</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total debits</div><div className="kpi-val" style={{color:'var(--c-pos)'}}>+{fmtMoney(184_240,0)}</div><div className="kpi-foot"><span className="muted">money in · 84 txns</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Total credits</div><div className="kpi-val" style={{color:'var(--c-neg)'}}>−{fmtMoney(180_740,0)}</div><div className="kpi-foot"><span className="muted">money out · 62 txns</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Closing balance</div><div className="kpi-val">{fmtMoney(482_140,2)}</div><div className="kpi-foot"><span className="delta up"><i className="fa-solid fa-arrow-up" style={{fontSize:9}}/></span><span className="muted">May 26 (today)</span></div></div>
      </div>

      <div className="card">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th><th>Document</th><th>Memo / counter-party</th>
                <th className="ta-right">Debit</th><th className="ta-right">Credit</th><th className="ta-right">Running balance</th><th></th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={i} style={{ cursor: 'pointer' }}>
                  <td className="muted">{t.date}</td>
                  <td className="col-id" style={{ color: 'var(--brand)' }}>{t.doc}</td>
                  <td className="fw-6">{t.memo}</td>
                  <td className="ta-right col-num" style={{ color: t.dr > 0 ? 'var(--c-pos)' : 'var(--text-4)' }}>{t.dr > 0 ? fmtMoney(t.dr,2) : '—'}</td>
                  <td className="ta-right col-num" style={{ color: t.cr > 0 ? 'var(--c-neg)' : 'var(--text-4)' }}>{t.cr > 0 ? fmtMoney(t.cr,2) : '—'}</td>
                  <td className="ta-right col-num fw-6">{fmtMoney(t.bal,2)}</td>
                  <td><div className="row-actions"><button><i className="fa-solid fa-eye" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   FINANCE · Tax
   ============================================================= */
function TaxPage({ onPage }) {
  const rates = [
    { code: 'CA-STD',   name: 'California — standard sales tax', rate: 7.25, type: 'Sales',  appliedTo: 'CA shipping addresses',   accruedYTD: 84_200,  ytdFiled: 64_200 },
    { code: 'CA-RED',   name: 'California — food / grocery',     rate: 2.50, type: 'Sales',  appliedTo: 'Food category',           accruedYTD: 14_840,  ytdFiled: 12_400 },
    { code: 'NY-STD',   name: 'New York — standard sales tax',   rate: 8.875,type: 'Sales',  appliedTo: 'NY shipping addresses',   accruedYTD: 38_400,  ytdFiled: 32_800 },
    { code: 'EXEMPT',   name: 'Tax exempt (resale cert.)',       rate: 0,    type: 'Sales',  appliedTo: 'Wholesale w/ certificate',accruedYTD: 0,       ytdFiled: 0 },
    { code: 'VAT-UK',   name: 'UK VAT — standard',               rate: 20,   type: 'VAT',    appliedTo: 'UK exports',              accruedYTD: 18_400,  ytdFiled: 18_400 },
    { code: 'USE-OUT',  name: 'Use tax — out-of-state purchase', rate: 7.25, type: 'Use',    appliedTo: 'Auto-accrued',            accruedYTD: 2_840,   ytdFiled: 2_400 },
  ];
  const filings = [
    { period: 'Q1 2026 — CA Sales Tax', due: 'Apr 30', filed: 'Apr 28', amount: 14_840, status: 'filed' },
    { period: 'Q1 2026 — NY Sales Tax', due: 'Apr 30', filed: 'Apr 29', amount: 8_400,  status: 'filed' },
    { period: 'Apr 2026 — UK VAT',      due: 'May 07', filed: 'May 06', amount: 1_840,  status: 'filed' },
    { period: 'Q2 2026 — CA Sales Tax', due: 'Jul 31', filed: '—',      amount: 0,      status: 'open' },
    { period: 'Q2 2026 — NY Sales Tax', due: 'Jul 31', filed: '—',      amount: 0,      status: 'open' },
    { period: 'May 2026 — UK VAT',      due: 'Jun 07', filed: '—',      amount: 0,      status: 'open' },
  ];

  return (
    <div className="page">
      <PageHead
        title="Tax"
        subtitle="Rates that determine what tax to collect, and the filings that hand it over."
        actions={<>
          <button className="btn"><i className="fa-solid fa-download" /> Reports</button>
          <button className="btn btn-primary" onClick={() => onPage && onPage('new-tax-rate')}><i className="fa-solid fa-plus" /> Add rate</button>
        </>}
      />
      <Purpose>
        Tax rates flow into every sales transaction automatically based on shipping address, customer status, and product category. The Filings tab tracks what you’ve already filed with each authority and what’s coming due.
      </Purpose>

      <div className="kpis mb-3">
        <div className="kpi"><div className="kpi-lbl">Tax collected MTD</div><div className="kpi-val">{fmtMoney(18_240,0)}</div><div className="kpi-foot"><span className="muted">across 6 jurisdictions</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Tax owed (payable)</div><div className="kpi-val" style={{color:'var(--c-warn)'}}>{fmtMoney(8_240,0)}</div><div className="kpi-foot"><span className="muted">due to authorities</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Next filing</div><div className="kpi-val" style={{fontSize:18}}>Jun 07</div><div className="kpi-foot"><span className="muted">UK VAT · 12 days</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Late this YTD</div><div className="kpi-val" style={{color:'var(--c-pos)'}}>0</div><div className="kpi-foot"><span className="muted">all on-time</span></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--gap)' }}>
        <div className="card">
          <div className="card-hd"><h3>Tax rates</h3><span className="hd-sub">{rates.length} active</span></div>
          <div className="tbl-scroll">
            <table className="tbl">
              <thead><tr><th>Code</th><th>Name</th><th>Type</th><th className="ta-right">Rate</th><th className="ta-right">Accrued YTD</th></tr></thead>
              <tbody>
                {rates.map(r => (
                  <tr key={r.code} style={{ cursor: 'pointer' }}>
                    <td className="col-id">{r.code}</td>
                    <td>
                      <div className="fw-6">{r.name}</div>
                      <div className="t-xs muted">{r.appliedTo}</div>
                    </td>
                    <td><span className="tag">{r.type}</span></td>
                    <td className="ta-right col-num fw-7">{r.rate}%</td>
                    <td className="ta-right col-num">{fmtMoney(r.accruedYTD,0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-hd"><h3>Filings</h3><span className="hd-sub">{filings.filter(f=>f.status==='open').length} open</span></div>
          <div className="col" style={{ gap: 0 }}>
            {filings.map((f, i) => (
              <div key={i} className="row" style={{ padding: '12px 16px', borderBottom: i < filings.length-1 ? '1px solid var(--line)' : 'none', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: f.status === 'open' ? 'var(--c-warn-soft)' : 'var(--c-pos-soft)', display: 'grid', placeItems: 'center' }}>
                  <i className={'fa-solid ' + (f.status === 'open' ? 'fa-clock' : 'fa-circle-check')} style={{ color: f.status === 'open' ? 'var(--c-warn)' : 'var(--c-pos)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw-6 t-sm">{f.period}</div>
                  <div className="t-xs muted">Due {f.due}{f.status === 'filed' ? ` · filed ${f.filed}` : ''}</div>
                </div>
                {f.amount > 0 && <div className="mono fw-7 t-sm">{fmtMoney(f.amount,0)}</div>}
                {f.status === 'open' && <button className="btn btn-sm btn-primary">Prepare</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   BANKING · Reconcile (split view)
   ============================================================= */
function Reconcile() {
  const bankTxns = [
    { id: 1, date: 'May 26', desc: 'POLYFLO INDUSTRIES',   amount: -4_812.00, matched: true },
    { id: 2, date: 'May 26', desc: 'ATLAS HARDWARE CO',    amount:  4_812.40, matched: true },
    { id: 3, date: 'May 26', desc: 'STRIPE PAYOUT',        amount:  6_280.00, matched: false, suggest: 'POS-daily settlement' },
    { id: 4, date: 'May 26', desc: 'SHELL OIL #4882',      amount:  -84.20,   matched: false, suggest: 'Expense — Fuel' },
    { id: 5, date: 'May 25', desc: 'AWS *AMZN AWS',        amount: -1_840.00, matched: false, suggest: 'BILL-0876' },
    { id: 6, date: 'May 25', desc: 'PG&E AUTOPAY',         amount: -1_840.00, matched: true },
    { id: 7, date: 'May 24', desc: 'UNKNOWN WIRE-IN',      amount:  1_400.00, matched: false, suggest: null },
    { id: 8, date: 'May 24', desc: 'HOME DEPOT #1244',     amount:   -240.80, matched: false, suggest: 'EXP-1280' },
  ];
  const bookTxns = [
    { id: 'A', doc: 'BILL-0884 paid', amount: -4_812.00, matched: true },
    { id: 'B', doc: 'RCP-1240 received', amount: 4_812.40, matched: true },
    { id: 'C', doc: 'POS-daily settlement', amount: 6_280.00, matched: false },
    { id: 'D', doc: 'BILL-0876 — AWS', amount: -1_840.00, matched: false },
    { id: 'E', doc: 'BILL-0883 — PG&E', amount: -1_840.00, matched: true },
    { id: 'F', doc: 'EXP-1280 — Home Depot', amount: -240.80, matched: false },
  ];

  return (
    <div className="page">
      <PageHead
        title="Reconciliation"
        subtitle="Match the bank statement against your books — line by line, with AI suggestions."
        actions={<>
          <button className="btn"><i className="fa-solid fa-wand-magic-sparkles" /> Auto-match</button>
          <button className="btn btn-primary"><i className="fa-solid fa-check" /> Finalise</button>
        </>}
      />
      <Purpose>
        Reconciliation closes the loop between what the bank says happened and what your books say happened. Every line on the statement must tie back to a journal entry, invoice or bill. The differences are what you investigate.
      </Purpose>

      <div className="filterbar">
        <select className="select" style={{ width: 'auto' }}>
          <option>Operating — main ••4821</option><option>Payroll ••0148</option><option>Amex ••3008</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>May 2026 statement</option><option>April 2026</option><option>March 2026</option>
        </select>
        <div style={{flex:1}} />
        <div className="t-sm muted">Statement balance: <span className="mono fw-7 muted-2">{fmtMoney(482_140,2)}</span></div>
        <div className="t-sm muted">Book balance: <span className="mono fw-7 muted-2">{fmtMoney(484_580,2)}</span></div>
        <div className="t-sm" style={{ color: 'var(--c-warn)' }}>Difference: <span className="mono fw-7">{fmtMoney(2_440,2)}</span></div>
      </div>

      <div className="kpis mb-3">
        <div className="kpi"><div className="kpi-lbl">Cleared</div><div className="kpi-val" style={{color:'var(--c-pos)'}}>124</div><div className="kpi-foot"><span className="muted">{fmtMoney(184_000,0)} matched</span></div></div>
        <div className="kpi"><div className="kpi-lbl">Awaiting match</div><div className="kpi-val" style={{color:'var(--c-warn)'}}>5</div><div className="kpi-foot"><span className="muted">{fmtMoney(5_280,0)} unmatched</span></div></div>
        <div className="kpi"><div className="kpi-lbl">AI suggestions</div><div className="kpi-val">4</div><div className="kpi-foot"><span className="muted">one-click apply</span></div></div>
        <div className="kpi"><div className="kpi-lbl">In dispute</div><div className="kpi-val">1</div><div className="kpi-foot"><span className="muted">duplicate charge</span></div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <div className="card">
          <div className="card-hd">
            <i className="fa-solid fa-university" style={{ color: 'var(--c-info)' }} />
            <h3>Bank statement</h3>
            <span className="hd-sub">{bankTxns.length} lines · {bankTxns.filter(t=>!t.matched).length} unmatched</span>
          </div>
          <div className="col" style={{ gap: 0 }}>
            {bankTxns.map(t => (
              <div key={t.id} className="row" style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', gap: 10, background: t.matched ? 'var(--c-pos-soft)' : undefined, opacity: t.matched ? 0.7 : 1 }}>
                <i className={'fa-solid ' + (t.matched ? 'fa-circle-check' : 'fa-circle')} style={{ color: t.matched ? 'var(--c-pos)' : 'var(--text-4)', fontSize: 14 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw-6 t-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.desc}</div>
                  <div className="t-xs muted">{t.date}{t.suggest && <span style={{ color: 'var(--c-info)', marginLeft: 6 }}>· AI suggests "{t.suggest}"</span>}</div>
                </div>
                <div className="mono fw-7 t-sm" style={{ color: t.amount < 0 ? 'var(--c-neg)' : 'var(--c-pos)' }}>{t.amount < 0 ? '−' : '+'}{fmtMoney(Math.abs(t.amount),2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-hd">
            <i className="fa-solid fa-book" style={{ color: 'var(--brand)' }} />
            <h3>Books</h3>
            <span className="hd-sub">{bookTxns.length} entries · {bookTxns.filter(t=>!t.matched).length} unmatched</span>
          </div>
          <div className="col" style={{ gap: 0 }}>
            {bookTxns.map(t => (
              <div key={t.id} className="row" style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', gap: 10, background: t.matched ? 'var(--c-pos-soft)' : undefined, opacity: t.matched ? 0.7 : 1 }}>
                <i className={'fa-solid ' + (t.matched ? 'fa-circle-check' : 'fa-circle')} style={{ color: t.matched ? 'var(--c-pos)' : 'var(--text-4)', fontSize: 14 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw-6 t-sm">{t.doc}</div>
                  <div className="t-xs muted">Internal entry</div>
                </div>
                <div className="mono fw-7 t-sm" style={{ color: t.amount < 0 ? 'var(--c-neg)' : 'var(--c-pos)' }}>{t.amount < 0 ? '−' : '+'}{fmtMoney(Math.abs(t.amount),2)}</div>
                {!t.matched && <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-link" /></button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   SYSTEM · Calendar
   ============================================================= */
function CalendarPage() {
  const days = [];
  // Build a May 2026 month grid. May 1 is a Friday in this fictional setup.
  const startOffset = 4; // Sun=0..Fri=5; pad so 1st falls on Friday column
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= 31; d++) days.push(d);
  while (days.length % 7 !== 0) days.push(null);

  const eventMap = {
    1:  [{ kind: 'pay',  label: 'Bi-weekly payroll', color: 'var(--c-violet)' }],
    5:  [{ kind: 'tax',  label: 'CA sales tax due',  color: 'var(--c-warn)' }],
    7:  [{ kind: 'meet', label: 'Q1 close kickoff',  color: 'var(--c-info)' }],
    12: [{ kind: 'po',   label: 'PO-2278 expected',  color: 'var(--c-pos)' }],
    14: [{ kind: 'inv',  label: 'INV-3082 due',      color: 'var(--brand)' }, { kind: 'meet', label: 'Stratos rep visit', color: 'var(--c-info)' }],
    17: [{ kind: 'pay',  label: 'Payroll posted',    color: 'var(--c-violet)' }],
    19: [{ kind: 'leave',label: 'Aria — parental',   color: 'var(--text-3)' }],
    20: [{ kind: 'inv',  label: 'BILL-0873 overdue', color: 'var(--c-neg)' }],
    22: [{ kind: 'count',label: 'Cycle count Zone A',color: 'var(--c-warn)' }],
    25: [{ kind: 'po',   label: 'PO-2285 due',       color: 'var(--c-pos)' }],
    26: [{ kind: 'meet', label: '3 events today',    color: 'var(--brand)' }],
    28: [{ kind: 'inv',  label: 'BILL-0876 AWS',     color: 'var(--c-info)' }],
    31: [{ kind: 'pay',  label: 'Bi-weekly payroll', color: 'var(--c-violet)' }],
  };
  const today = 26;

  return (
    <div className="page">
      <PageHead
        title="Operations Calendar"
        subtitle="May 2026 · everything time-bound across the business in one view"
        actions={<>
          <div className="seg"><button className="is-active">Month</button><button>Week</button><button>Day</button><button>Agenda</button></div>
          <button className="btn btn-primary"><i className="fa-solid fa-plus" /> Event</button>
        </>}
      />
      <Purpose>
        A combined view of due dates pulled in from every module — invoice due dates, expected PO deliveries, payroll runs, tax filings, cycle counts, employee leave. The single place to check before promising anything.
      </Purpose>

      <div className="filterbar">
        <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-chevron-left" /></button>
        <button className="btn btn-sm">Today</button>
        <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-chevron-right" /></button>
        <div className="t-sm fw-6" style={{ marginLeft: 8 }}>May 2026</div>
        <div style={{flex:1}}/>
        <span className="row gap-1 t-xs muted"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--brand)' }} /> Invoices</span>
        <span className="row gap-1 t-xs muted"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--c-pos)' }} /> POs</span>
        <span className="row gap-1 t-xs muted"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--c-violet)' }} /> Payroll</span>
        <span className="row gap-1 t-xs muted"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--c-warn)' }} /> Tax/count</span>
        <span className="row gap-1 t-xs muted"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--c-info)' }} /> Meetings</span>
      </div>

      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--line)' }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ padding: '8px 12px', fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--line)' }}>
          {days.map((d, i) => (
            <div key={i} style={{
              background: 'var(--card)',
              minHeight: 110,
              padding: 8,
              cursor: 'pointer',
              position: 'relative',
              opacity: d ? 1 : 0.3,
            }}>
              {d && (
                <>
                  <div className="row" style={{ marginBottom: 6 }}>
                    <span style={{
                      fontSize: 12,
                      fontWeight: d === today ? 700 : 500,
                      color: d === today ? 'var(--brand-fg)' : 'var(--text-2)',
                      background: d === today ? 'var(--brand)' : 'transparent',
                      width: 22, height: 22, borderRadius: 11,
                      display: 'inline-grid', placeItems: 'center',
                    }}>{d}</span>
                  </div>
                  <div className="col" style={{ gap: 3 }}>
                    {(eventMap[d] || []).map((e, j) => (
                      <div key={j} style={{
                        fontSize: 10.5,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: e.color,
                        color: '#fff',
                        opacity: 0.92,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{e.label}</div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   SYSTEM · Settings
   ============================================================= */
function Settings() {
  const [section, setSection] = useState('company');
  const groups = [
    { id: 'company',  label: 'Company',       icon: 'fa-building' },
    { id: 'fiscal',   label: 'Fiscal & tax',  icon: 'fa-landmark' },
    { id: 'numbering',label: 'Numbering',     icon: 'fa-hashtag' },
    { id: 'docs',     label: 'Documents',     icon: 'fa-file-invoice' },
    { id: 'integ',    label: 'Integrations',  icon: 'fa-plug' },
    { id: 'notify',   label: 'Notifications', icon: 'fa-bell' },
    { id: 'security', label: 'Security',      icon: 'fa-shield-halved' },
    { id: 'billing',  label: 'Plan & billing',icon: 'fa-credit-card' },
  ];
  return (
    <div className="page">
      <PageHead
        title="Settings"
        subtitle="Configure how the whole system behaves — company-wide, not per user."
      />
      <Purpose icon="fa-gear">
        Settings here apply to the entire organisation. Per-user preferences (theme, density, keyboard) live in the user menu on the top-right. Some sections require Admin role.
      </Purpose>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--gap)' }}>
        <div className="card" style={{ padding: 8, alignSelf: 'flex-start', position: 'sticky', top: 16 }}>
          <div className="col" style={{ gap: 2 }}>
            {groups.map(g => (
              <button key={g.id} onClick={() => setSection(g.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 6,
                border: 'none', textAlign: 'left',
                background: section === g.id ? 'var(--brand-soft)' : 'transparent',
                color: section === g.id ? 'var(--brand-soft-fg)' : 'var(--text-2)',
                fontSize: 12.5, fontWeight: section === g.id ? 600 : 500,
                cursor: 'pointer',
              }}>
                <i className={'fa-solid ' + g.icon} style={{ width: 14, color: section === g.id ? 'var(--brand)' : 'var(--text-3)' }} />
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="col gap-3">
          {section === 'company' && <SettingsCompany />}
          {section === 'fiscal' && <SettingsFiscal />}
          {section === 'numbering' && <SettingsNumbering />}
          {section === 'docs' && <SettingsDocs />}
          {section === 'integ' && <SettingsIntegrations />}
          {section === 'notify' && <SettingsNotify />}
          {section === 'security' && <SettingsSecurity />}
          {section === 'billing' && <SettingsBilling />}
        </div>
      </div>
    </div>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <div className="row" style={{ padding: '14px 0', borderBottom: '1px solid var(--line)', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 240px' }}>
        <div className="fw-6 t-sm">{label}</div>
        {hint && <div className="t-xs muted mt-1" style={{ lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
function SettingsCompany() {
  return (
    <div className="card card-pad">
      <h3 style={{ margin: 0, fontSize: 15 }}>Company profile</h3>
      <div className="t-xs muted mt-1 mb-3">Used on every invoice, PO and statement you send out.</div>
      <FieldRow label="Company name" hint="Appears as the From on documents and emails.">
        <input className="input" defaultValue="WMS Pro Industrial Supply, LLC" />
      </FieldRow>
      <FieldRow label="Logo" hint="PNG or SVG, square preferred. Used on documents and the rail.">
        <div className="row gap-3">
          <div className="thumb brand" style={{ width: 56, height: 56, fontSize: 22 }}>W</div>
          <button className="btn btn-sm">Upload</button>
        </div>
      </FieldRow>
      <FieldRow label="Legal address" hint="Registered business address.">
        <textarea className="input" rows={3} defaultValue={'2840 Industrial Pkwy\nOakland, CA 94621\nUnited States'} />
      </FieldRow>
      <FieldRow label="Time zone" hint="Drives every timestamp.">
        <select className="select"><option>America/Los_Angeles (PT)</option><option>America/New_York (ET)</option><option>UTC</option></select>
      </FieldRow>
      <FieldRow label="Default currency" hint="What the books are kept in. Foreign sales convert at booking.">
        <select className="select"><option>USD — US Dollar</option><option>EUR — Euro</option><option>GBP — Pound</option></select>
      </FieldRow>
    </div>
  );
}
function SettingsFiscal() {
  return (
    <div className="card card-pad">
      <h3 style={{ margin: 0, fontSize: 15 }}>Fiscal year & tax</h3>
      <div className="t-xs muted mt-1 mb-3">When your books open and close, and what tax engine to use.</div>
      <FieldRow label="Fiscal year start"><select className="select"><option>January 1</option><option>April 1</option><option>July 1</option><option>October 1</option></select></FieldRow>
      <FieldRow label="Period length"><select className="select"><option>Monthly (12)</option><option>4-4-5</option><option>Weekly (52/53)</option></select></FieldRow>
      <FieldRow label="Tax engine" hint="Automatic engines calculate rates from shipping address."><select className="select"><option>Avalara AvaTax</option><option>TaxJar</option><option>Manual (rate table)</option></select></FieldRow>
      <FieldRow label="EIN / Tax ID"><input className="input mono" defaultValue="84-2840192" /></FieldRow>
      <FieldRow label="Lock posted entries before" hint="Prevents anyone editing closed periods."><input className="input" type="date" defaultValue="2026-04-30" /></FieldRow>
    </div>
  );
}
function SettingsNumbering() {
  const rows = [
    { doc: 'Sales orders',     prefix: 'SO-',  next: 10285, pad: 5,  reset: 'Never' },
    { doc: 'Sale invoices',    prefix: 'INV-', next: 3083,  pad: 4,  reset: 'Annually' },
    { doc: 'Purchase orders',  prefix: 'PO-',  next: 2286,  pad: 4,  reset: 'Never' },
    { doc: 'Goods receipts',   prefix: 'GRN-', next: 4429,  pad: 4,  reset: 'Never' },
    { doc: 'Purchase invoices',prefix: 'INV-S-',next: 9925, pad: 4,  reset: 'Annually' },
    { doc: 'Bills',            prefix: 'BILL-',next: 885,   pad: 4,  reset: 'Annually' },
    { doc: 'Credit notes',     prefix: 'CN-',  next: 313,   pad: 4,  reset: 'Annually' },
    { doc: 'Debit notes',      prefix: 'DN-',  next: 185,   pad: 4,  reset: 'Annually' },
    { doc: 'Journal entries',  prefix: 'JE-',  next: 2285,  pad: 4,  reset: 'Never' },
  ];
  return (
    <div className="card">
      <div className="card-hd"><h3>Document numbering</h3><span className="hd-sub">Prefix, padding and reset behaviour</span></div>
      <table className="tbl">
        <thead><tr><th>Document</th><th>Prefix</th><th className="ta-right">Next number</th><th className="ta-right">Padding</th><th>Reset</th><th></th></tr></thead>
        <tbody>
          {rows.map((r,i) => (
            <tr key={i}>
              <td className="fw-6">{r.doc}</td>
              <td className="col-id">{r.prefix}</td>
              <td className="ta-right col-num">{r.next}</td>
              <td className="ta-right col-num">{r.pad}</td>
              <td><span className="tag">{r.reset}</span></td>
              <td><div className="row-actions"><button><i className="fa-solid fa-pen" /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function SettingsDocs() {
  return (
    <div className="card card-pad">
      <h3 style={{ margin: 0, fontSize: 15 }}>Document templates</h3>
      <div className="t-xs muted mt-1 mb-3">Pick the look, default payment terms, and footer text for outgoing documents.</div>
      <FieldRow label="Invoice template"><div className="row gap-2">
        {['Classic','Modern','Minimal'].map((t,i) => (
          <button key={i} className="btn" style={{ background: i===1 ? 'var(--brand-soft)' : undefined, color: i===1 ? 'var(--brand-soft-fg)' : undefined }}>{t}</button>
        ))}
      </div></FieldRow>
      <FieldRow label="Default payment terms" hint="Applied to new customers."><select className="select"><option>Net 30</option><option>Net 15</option><option>Net 60</option><option>Due on receipt</option></select></FieldRow>
      <FieldRow label="Late payment penalty"><div className="row gap-2"><input className="input" defaultValue="1.5" style={{maxWidth:80}}/><span className="t-sm muted">% per month after due date</span></div></FieldRow>
      <FieldRow label="Invoice footer text"><textarea className="input" rows={3} defaultValue="Thank you for your business. Please remit payment to the bank details below or via the Pay Online link." /></FieldRow>
    </div>
  );
}
function SettingsIntegrations() {
  const integrations = [
    { name: 'Stripe',         desc: 'Card & ACH payment processing',     status: 'on',  i: 'fa-credit-card', c: '#635bff' },
    { name: 'Plaid',          desc: 'Bank account connectivity (6 accts)',status: 'on',  i: 'fa-university',  c: '#0a0a23' },
    { name: 'Avalara AvaTax', desc: 'Automated sales tax calc & filing', status: 'on',  i: 'fa-percent',     c: '#0078d4' },
    { name: 'Shopify',        desc: 'Sync inventory + orders to storefront', status: 'on', i: 'fa-store',  c: '#95bf47' },
    { name: 'ShipStation',    desc: 'Carrier rates and label printing',  status: 'on',  i: 'fa-truck-fast',  c: '#1c8a4d' },
    { name: 'FreshPay',       desc: 'Payroll service provider',          status: 'on',  i: 'fa-money-check',  c: '#ff6e3a' },
    { name: 'QuickBooks',     desc: 'Export to external GL',             status: 'off', i: 'fa-receipt',     c: '#2ca01c' },
    { name: 'Slack',          desc: 'Critical alerts to #ops channel',   status: 'on',  i: 'fa-message',     c: '#4a154b' },
    { name: 'Make.com',       desc: 'Custom automations',                status: 'off', i: 'fa-share-nodes', c: '#6244ff' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--gap)' }}>
      {integrations.map((g,i) => (
        <div key={i} className="card card-pad">
          <div className="row" style={{ marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: g.c, display: 'grid', placeItems: 'center', color: '#fff' }}>
              <i className={'fa-solid ' + g.i} />
            </div>
            <div style={{ flex: 1 }} />
            <span className={'pill ' + (g.status === 'on' ? 'pos' : 'muted')}>{g.status === 'on' ? 'Connected' : 'Not connected'}</span>
          </div>
          <div className="fw-7" style={{ fontSize: 14 }}>{g.name}</div>
          <div className="t-xs muted mt-1" style={{ lineHeight: 1.5 }}>{g.desc}</div>
          <div className="row gap-2 mt-3">
            <button className="btn btn-sm" style={{ flex: 1 }}>{g.status === 'on' ? 'Configure' : 'Connect'}</button>
            {g.status === 'on' && <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-pause" /></button>}
          </div>
        </div>
      ))}
    </div>
  );
}
function SettingsNotify() {
  const channels = [
    { event: 'New PO requires approval',     email: true,  slack: true,  inapp: true,  sms: false },
    { event: 'Goods receipt discrepancy',    email: true,  slack: true,  inapp: true,  sms: false },
    { event: 'Invoice paid',                 email: false, slack: false, inapp: true,  sms: false },
    { event: 'Customer over credit limit',   email: true,  slack: true,  inapp: true,  sms: true  },
    { event: 'Item out of stock',            email: false, slack: true,  inapp: true,  sms: false },
    { event: 'Bank txn unmatched 48h',       email: true,  slack: false, inapp: true,  sms: false },
    { event: 'Payroll ready for approval',   email: true,  slack: true,  inapp: true,  sms: true  },
    { event: 'Tax filing due in 7 days',     email: true,  slack: false, inapp: true,  sms: false },
  ];
  const Tick = ({ on }) => (
    <span style={{
      width: 18, height: 18, borderRadius: 4,
      background: on ? 'var(--brand)' : 'var(--bg-sub)',
      color: '#fff', display: 'inline-grid', placeItems: 'center',
      fontSize: 10, border: on ? 'none' : '1px solid var(--line)',
    }}>{on && <i className="fa-solid fa-check" />}</span>
  );
  return (
    <div className="card">
      <div className="card-hd"><h3>Notification matrix</h3><span className="hd-sub">Which events fire on which channels</span></div>
      <table className="tbl">
        <thead><tr><th>Event</th><th className="ta-center">Email</th><th className="ta-center">Slack</th><th className="ta-center">In-app</th><th className="ta-center">SMS</th></tr></thead>
        <tbody>
          {channels.map((c,i) => (
            <tr key={i}>
              <td className="fw-6">{c.event}</td>
              <td className="ta-center"><Tick on={c.email} /></td>
              <td className="ta-center"><Tick on={c.slack} /></td>
              <td className="ta-center"><Tick on={c.inapp} /></td>
              <td className="ta-center"><Tick on={c.sms} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function SettingsSecurity() {
  return (
    <div className="card card-pad">
      <h3 style={{ margin: 0, fontSize: 15 }}>Security & policy</h3>
      <div className="t-xs muted mt-1 mb-3">Org-wide rules that apply to every user.</div>
      <FieldRow label="Require MFA" hint="Block any sign-in without a second factor."><select className="select"><option>For all users</option><option>For Admins only</option><option>Optional</option></select></FieldRow>
      <FieldRow label="Session timeout"><select className="select"><option>30 minutes idle</option><option>1 hour</option><option>4 hours</option><option>Never</option></select></FieldRow>
      <FieldRow label="Password rules"><div className="col gap-1 t-sm"><label className="row gap-2"><input type="checkbox" defaultChecked />Minimum 12 characters</label><label className="row gap-2"><input type="checkbox" defaultChecked />Mixed case + numbers</label><label className="row gap-2"><input type="checkbox" />Rotate every 90 days</label></div></FieldRow>
      <FieldRow label="IP allow-list" hint="Restrict sign-in to office and VPN ranges."><textarea className="input mono" rows={2} defaultValue={'74.125.224.0/24\n203.0.113.0/24'} /></FieldRow>
      <FieldRow label="Sensitive action approval" hint="Bank txn deletion, refund > $1k, credit limit raise."><select className="select"><option>Require 2nd approver</option><option>Notify only</option><option>Off</option></select></FieldRow>
    </div>
  );
}
function SettingsBilling() {
  return (
    <div className="col gap-3">
      <div className="card card-pad">
        <div className="row">
          <div>
            <div className="t-xs muted">Current plan</div>
            <h3 style={{ margin: 0, fontSize: 22 }}>Business · annual</h3>
            <div className="t-sm muted mt-1">28 users · 3 warehouses · 5 connected banks</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div className="fw-7" style={{ fontSize: 24 }}>$684<span className="t-sm muted fw-5">/month</span></div>
            <div className="t-xs muted">billed annually · renews Feb 14, 2027</div>
          </div>
        </div>
        <div className="row gap-2 mt-3">
          <button className="btn">Compare plans</button>
          <button className="btn btn-ghost">Download invoices</button>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', color: 'var(--c-neg)' }}>Cancel</button>
        </div>
      </div>
      <div className="card card-pad">
        <h3 style={{ margin: 0, fontSize: 14 }}>Usage this period</h3>
        <div className="t-xs muted mt-1 mb-3">Resets June 14, 2026</div>
        {[
          { label: 'Active users',         used: 14,  cap: 30,  fmt: x => x },
          { label: 'Transactions / mo.',   used: 4820,cap: 50000,fmt: x => x.toLocaleString() },
          { label: 'Storage',              used: 6.2, cap: 100,  fmt: x => x.toFixed(1) + ' GB' },
          { label: 'API requests / day',   used: 18420,cap:100000,fmt: x => x.toLocaleString() },
        ].map((u,i) => {
          const pct = (u.used / u.cap) * 100;
          return (
            <div key={i} className="row" style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--line)' : 'none', gap: 16 }}>
              <div style={{ flex: '0 0 200px' }} className="fw-6 t-sm">{u.label}</div>
              <div className="bar" style={{ flex: 1, height: 6 }}><span style={{ width: pct + '%', background: pct > 80 ? 'var(--c-warn)' : 'var(--brand)' }} /></div>
              <div className="mono t-sm muted-2" style={{ minWidth: 140, textAlign: 'right' }}>{u.fmt(u.used)} <span className="muted">/ {u.fmt(u.cap)}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =============================================================
   REPORTS · AR Ageing
   ============================================================= */
function Ageing() {
  const customers = [
    { name: 'Bluefin Marine Co.',   current: 0,      d30: 11_280, d60: 0,      d90: 0,    d90p: 0,    risk: 'high' },
    { name: 'Sunridge Cafés',       current: 0,      d30: 0,     d60: 0,      d90: 0,    d90p: 1_840, risk: 'high' },
    { name: 'Riverbend Plumbing',   current: 0,      d30: 0,     d60: 3_280,  d90: 0,    d90p: 0,    risk: 'med' },
    { name: 'Halcyon Retail',       current: 0,      d30: 0,     d60: 1_240,  d90: 0,    d90p: 0,    risk: 'med' },
    { name: 'Northwind Industrial', current: 11_240, d30: 0,     d60: 0,      d90: 0,    d90p: 0,    risk: 'low' },
    { name: 'Mercer Construction',  current: 6_240,  d30: 0,     d60: 0,      d90: 0,    d90p: 0,    risk: 'low' },
    { name: 'Atlas Hardware Co.',   current: 3_280,  d30: 3_280, d60: 0,      d90: 0,    d90p: 0,    risk: 'low' },
    { name: 'Cascade Outfitters',   current: 4_220,  d30: 0,     d60: 0,      d90: 0,    d90p: 0,    risk: 'low' },
    { name: 'Beacon Hospitality',   current: 540,    d30: 0,     d60: 0,      d90: 0,    d90p: 0,    risk: 'low' },
    { name: 'Pioneer Logistics',    current: 920,    d30: 0,     d60: 0,      d90: 0,    d90p: 0,    risk: 'low' },
  ];
  const total = (c) => c.current + c.d30 + c.d60 + c.d90 + c.d90p;
  const totals = customers.reduce((acc, c) => ({
    current: acc.current + c.current, d30: acc.d30 + c.d30, d60: acc.d60 + c.d60, d90: acc.d90 + c.d90, d90p: acc.d90p + c.d90p,
  }), { current:0, d30:0, d60:0, d90:0, d90p:0 });
  const grand = totals.current + totals.d30 + totals.d60 + totals.d90 + totals.d90p;
  const buckets = [
    { k: 'current', label: 'Current',     val: totals.current, color: 'var(--c-pos)' },
    { k: 'd30',     label: '1–30 days',   val: totals.d30,     color: 'var(--c-info)' },
    { k: 'd60',     label: '31–60 days',  val: totals.d60,     color: 'var(--c-warn)' },
    { k: 'd90',     label: '61–90 days',  val: totals.d90,     color: 'oklch(0.65 0.20 50)' },
    { k: 'd90p',    label: '90+ days',    val: totals.d90p,    color: 'var(--c-neg)' },
  ];

  return (
    <div className="page">
      <PageHead
        title="AR Ageing"
        subtitle="Customer receivables bucketed by how long they’ve been outstanding — your collection priorities."
        actions={<>
          <button className="btn"><i className="fa-solid fa-envelope" /> Reminders</button>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
        </>}
      />
      <Purpose>
        The cornerstone collections report. Anything in <strong>60+ days</strong> needs a phone call today; <strong>90+</strong> may need to be written off or sent to collections. Drill any number to see the underlying invoices.
      </Purpose>

      {/* Bucket totals */}
      <div className="kpis mb-3" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {buckets.map(b => {
          const pct = (b.val / grand) * 100;
          return (
            <div key={b.k} className="kpi">
              <div className="kpi-lbl">{b.label}</div>
              <div className="kpi-val" style={{ color: b.color }}>{fmtMoney(b.val, 0)}</div>
              <div className="bar mt-1" style={{ height: 4 }}><span style={{ width: pct + '%', background: b.color }} /></div>
              <div className="kpi-foot mt-1"><span className="muted">{pct.toFixed(1)}% of AR</span></div>
            </div>
          );
        })}
      </div>

      <div className="filterbar">
        <select className="select" style={{ width: 'auto' }}>
          <option>As of today</option><option>As of month-end</option><option>Custom…</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>All segments</option><option>Wholesale</option><option>Retail</option><option>Hospitality</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>Outstanding {'>'} $0</option><option>{'>'} $1k only</option><option>{'>'} $5k only</option>
        </select>
      </div>

      <div className="card">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr><th>Customer</th><th>Risk</th><th className="ta-right">Current</th><th className="ta-right">1–30</th><th className="ta-right">31–60</th><th className="ta-right">61–90</th><th className="ta-right">90+</th><th className="ta-right">Total</th><th></th></tr>
            </thead>
            <tbody>
              {customers.map((c,i) => (
                <tr key={i}>
                  <td>
                    <div className="cell-with-icon">
                      <div className="thumb">{c.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                      <span className="fw-6">{c.name}</span>
                    </div>
                  </td>
                  <td><span className={'pill ' + (c.risk === 'high' ? 'neg' : c.risk === 'med' ? 'warn' : 'muted')}>{c.risk}</span></td>
                  <td className="ta-right col-num">{c.current ? fmtMoney(c.current,0) : <span className="muted">—</span>}</td>
                  <td className="ta-right col-num" style={{ color: c.d30 ? 'var(--c-info)' : 'var(--text-4)' }}>{c.d30 ? fmtMoney(c.d30,0) : '—'}</td>
                  <td className="ta-right col-num" style={{ color: c.d60 ? 'var(--c-warn)' : 'var(--text-4)' }}>{c.d60 ? fmtMoney(c.d60,0) : '—'}</td>
                  <td className="ta-right col-num" style={{ color: c.d90 ? 'oklch(0.65 0.20 50)' : 'var(--text-4)' }}>{c.d90 ? fmtMoney(c.d90,0) : '—'}</td>
                  <td className="ta-right col-num" style={{ color: c.d90p ? 'var(--c-neg)' : 'var(--text-4)' }}>{c.d90p ? fmtMoney(c.d90p,0) : '—'}</td>
                  <td className="ta-right col-num fw-7">{fmtMoney(total(c),0)}</td>
                  <td><div className="row-actions"><button title="Call"><i className="fa-solid fa-phone" /></button><button title="Email"><i className="fa-solid fa-envelope" /></button><button><i className="fa-solid fa-ellipsis" /></button></div></td>
                </tr>
              ))}
              <tr style={{ background: 'var(--bg-sub)', fontWeight: 700 }}>
                <td colSpan="2" className="fw-7">Total</td>
                <td className="ta-right col-num fw-7">{fmtMoney(totals.current,0)}</td>
                <td className="ta-right col-num fw-7">{fmtMoney(totals.d30,0)}</td>
                <td className="ta-right col-num fw-7">{fmtMoney(totals.d60,0)}</td>
                <td className="ta-right col-num fw-7">{fmtMoney(totals.d90,0)}</td>
                <td className="ta-right col-num fw-7">{fmtMoney(totals.d90p,0)}</td>
                <td className="ta-right col-num fw-7">{fmtMoney(grand,0)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   Export
   ============================================================= */
window.WMS_BESPOKE = {
  workspace: Workspace,
  pinned: Pinned,
  accounts: ChartOfAccounts,
  'general-ledger': GeneralLedger,
  tax: TaxPage,
  reconcile: Reconcile,
  calendar: CalendarPage,
  settings: Settings,
  ageing: Ageing,
};
