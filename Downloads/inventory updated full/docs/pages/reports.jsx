/* global React */
const { fmtMoney, SP_SALES, SP_PURCHASES, SP_DAYS, CAT_BREAKDOWN, CUSTOMERS_TOP, PRODUCTS } = window.WMS;
const { AreaChart, Donut, BarChart, Sparkline } = window;

function Reports({ onPage }) {
  const [tab, setTab] = React.useState('finance');
  const [period, setPeriod] = React.useState('30');

  const tabs = [
    { id: 'finance',   label: 'Financial',    icon: 'fa-chart-line' },
    { id: 'inventory', label: 'Inventory',    icon: 'fa-boxes-stacked' },
    { id: 'sales',     label: 'Sales',        icon: 'fa-arrow-trend-up' },
    { id: 'tax',       label: 'Tax',          icon: 'fa-percent' },
    { id: 'custom',    label: 'Custom',       icon: 'fa-sliders' },
  ];

  // KPI cards (P&L style)
  const pl = [
    { label: 'Revenue',          val: 284_932, delta: +12.4, color: 'var(--c-pos)' },
    { label: 'Cost of goods',    val: 188_120, delta: +9.8,  color: 'var(--c-warn)' },
    { label: 'Gross profit',     val: 96_812,  delta: +18.2, color: 'var(--c-pos)' },
    { label: 'Operating expense',val: 42_140,  delta: +3.4,  color: 'var(--c-warn)' },
    { label: 'Net income',       val: 54_672,  delta: +24.6, color: 'var(--brand)' },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Reports</h1>
          <div className="ph-sub">Financial, inventory and sales analytics</div>
        </div>
        <div className="ph-actions">
          <div className="seg">
            {['7','30','90','365'].map(d => (
              <button key={d} className={period === d ? 'is-active' : ''} onClick={() => setPeriod(d)}>
                {d === '7' ? '7d' : d === '30' ? '30d' : d === '90' ? '3m' : '1y'}
              </button>
            ))}
          </div>
          <button className="btn"><i className="fa-solid fa-calendar-day" /> Custom range</button>
          <button className="btn"><i className="fa-solid fa-print" /> Print</button>
          <button className="btn btn-primary"><i className="fa-solid fa-file-export" /> Export PDF</button>
        </div>
      </div>

      <div className="tabs mb-3" style={{ marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
            <i className={'fa-solid ' + t.icon} style={{ marginRight: 6, fontSize: 11 }} />
            {t.label}
          </button>
        ))}
      </div>

      {/* P&L summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--gap)', marginBottom: 16 }}>
        {pl.map((p, i) => (
          <div key={i} className="card card-pad">
            <div className="kpi-lbl">{p.label}</div>
            <div className="kpi-val" style={{ color: p.color }}>{fmtMoney(p.val, 0)}</div>
            <div className="row gap-2 t-xs">
              <span className={'delta ' + (p.delta >= 0 ? 'up' : 'down')}>
                <i className={'fa-solid ' + (p.delta >= 0 ? 'fa-arrow-up' : 'fa-arrow-down')} style={{ fontSize: 9 }}/>
                {Math.abs(p.delta).toFixed(1)}%
              </span>
              <span className="muted">vs prev period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="grid-12" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-hd">
            <h3>Revenue vs cost of goods</h3>
            <span className="hd-sub">last 30 days</span>
            <div className="hd-actions">
              <div className="row gap-3 t-sm muted">
                <span className="row gap-2"><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand)' }} /> Revenue</span>
                <span className="row gap-2"><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--c-warn)' }} /> COGS</span>
              </div>
            </div>
          </div>
          <div className="card-pad" style={{ paddingTop: 8 }}>
            <AreaChart
              series={[SP_SALES.map(v => v * 1000), SP_PURCHASES.map(v => v * 800)]}
              colors={['var(--brand)', 'var(--c-warn)']}
              xLabels={SP_DAYS.map(d => `Apr ${d}`)}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-hd"><h3>Inventory value by category</h3></div>
          <div className="card-pad"><Donut data={CAT_BREAKDOWN} /></div>
        </div>
      </div>

      {/* Reports library */}
      <div className="card">
        <div className="card-hd">
          <h3>Reports library</h3>
          <span className="hd-sub">42 reports</span>
          <div className="hd-actions">
            <button className="btn btn-sm"><i className="fa-solid fa-plus" /> New custom report</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'var(--line)', padding: 1 }}>
          {[
            { name: 'Profit & loss', desc: 'Full P&L with monthly comparisons', icon: 'fa-chart-line', tag: 'Finance', favorite: true },
            { name: 'Balance sheet', desc: 'Snapshot of assets, liabilities and equity', icon: 'fa-scale-balanced', tag: 'Finance' },
            { name: 'Cash flow', desc: 'Operating, investing and financing activities', icon: 'fa-money-bill-trend-up', tag: 'Finance' },
            { name: 'AR ageing', desc: 'Outstanding receivables by bucket', icon: 'fa-coins', tag: 'AR', favorite: true },
            { name: 'AP ageing', desc: 'What you owe, by supplier', icon: 'fa-hand-holding-dollar', tag: 'AP' },
            { name: 'Inventory valuation', desc: 'Value at cost / value at retail', icon: 'fa-boxes-stacked', tag: 'Inventory' },
            { name: 'Stock movement', desc: 'IN / OUT / ADJUST per SKU', icon: 'fa-right-left', tag: 'Inventory' },
            { name: 'Slow-moving items', desc: 'SKUs without movement in 60+ days', icon: 'fa-clock', tag: 'Inventory' },
            { name: 'Sales by customer', desc: 'Top customers ranked by revenue', icon: 'fa-user-friends', tag: 'Sales', favorite: true },
            { name: 'Sales by product', desc: 'Best-sellers and margin leaders', icon: 'fa-rocket', tag: 'Sales' },
            { name: 'Sales by salesperson', desc: 'Performance ranking', icon: 'fa-award', tag: 'Sales' },
            { name: 'Tax summary', desc: 'Tax collected / payable by jurisdiction', icon: 'fa-percent', tag: 'Tax' },
          ].map((r, i) => (
            <div key={i} style={{ background: 'var(--card)', padding: 14, cursor: 'pointer', transition: 'background .12s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-sub)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--card)'}
            >
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: 'var(--brand-soft)', color: 'var(--brand-soft-fg)', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 }}>
                  <i className={'fa-solid ' + r.icon} />
                </div>
                <div style={{ flex: 1, marginLeft: 12, minWidth: 0 }}>
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="fw-6 t-md">{r.name}</div>
                    {r.favorite && <i className="fa-solid fa-star" style={{ color: 'var(--c-warn)', fontSize: 11, flexShrink: 0 }} />}
                  </div>
                  <div className="muted t-xs mt-1" style={{ lineHeight: 1.4 }}>{r.desc}</div>
                  <div className="mt-2"><span className="tag" style={{ fontSize: 10 }}>{r.tag}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Placeholder dispatcher: bespoke page > config-driven ListPage > fallback ----
function Placeholder({ pageId, title, onPage }) {
  const Bespoke = (window.WMS_BESPOKE || {})[pageId];
  if (Bespoke) return <Bespoke onPage={onPage} />;

  const cfg = (window.WMS_CONFIGS || {})[pageId];
  if (cfg && window.ListPage) {
    // Auto-prepend the "what this menu is for" purpose banner if present
    const merged = cfg.purpose && !cfg.banner ? {
      ...cfg,
      banner: { tone: 'info', icon: 'fa-lightbulb', text: cfg.purpose }
    } : cfg;
    return <window.ListPage cfg={merged} onPage={onPage} />;
  }

  // Fallback (only for truly unconfigured page ids)
  const cleanTitle = title || (pageId || '').replace(/-/g, ' ').replace(/^./, s => s.toUpperCase());
  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{cleanTitle}</h1>
          <div className="ph-sub">Module preview</div>
        </div>
      </div>
      <div className="banner info" style={{ marginBottom: 18 }}>
        <i className="fa-solid fa-circle-info" />
        <div>This module would inherit the shared shell + KPI + table patterns. Add a config entry to <code className="mono">configs.jsx</code> or a bespoke component in <code className="mono">bespoke.jsx</code>.</div>
      </div>
    </div>
  );
}

window.Reports = Reports;
window.Placeholder = Placeholder;
