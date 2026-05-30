/* global React */
const { fmtMoney, KPIS, RECENT_ORDERS, STATUS_PILL, LOW_STOCK, ACTIVITY, ACTIVITY_ICON,
        SP_DAYS, SP_SALES, SP_PURCHASES, CAT_BREAKDOWN, CUSTOMERS_TOP } = window.WMS;
const { Sparkline, AreaChart, Donut, BarChart } = window;

function StatusPill({ status }) {
  const s = STATUS_PILL[status] || { cls: 'muted', label: status };
  return <span className={'pill ' + s.cls}>{s.label}</span>;
}

function KpiTile({ k, idx }) {
  const colors = ['var(--brand)', 'var(--c-pos)', 'var(--c-info)', 'var(--c-warn)'];
  const c = colors[idx % 4];
  return (
    <div className="kpi">
      <div className="kpi-lbl">{k.label}</div>
      <div className="kpi-val">{k.money ? fmtMoney(k.value) : k.value.toLocaleString()}</div>
      <div className="kpi-foot">
        <span className={'delta ' + (k.delta >= 0 ? 'up' : 'down')}>
          <i className={'fa-solid ' + (k.delta >= 0 ? 'fa-arrow-up' : 'fa-arrow-down')} style={{ fontSize: 9 }} />
          {Math.abs(k.delta).toFixed(1)}%
        </span>
        <span>{k.period}</span>
      </div>
      <div className="spark"><Sparkline data={k.sparkSeries} width={100} height={32} color={c} /></div>
    </div>
  );
}

function Dashboard({ onPage }) {
  const [period, setPeriod] = React.useState('30');
  return (
    <div className="page">
      {/* Heading */}
      <div className="page-head">
        <div>
          <h1>Good morning, Maria</h1>
          <div className="ph-sub">Here's what's happening across your operation today, Thursday May 14.</div>
        </div>
        <div className="ph-actions">
          <div className="seg">
            {['7','30','90','365'].map(d => (
              <button key={d} className={period === d ? 'is-active' : ''} onClick={() => setPeriod(d)}>
                {d === '7' ? '7d' : d === '30' ? '30d' : d === '90' ? '3m' : '1y'}
              </button>
            ))}
          </div>
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn btn-primary"><i className="fa-solid fa-plus" /> New sale</button>
        </div>
      </div>

      {/* Banner */}
      <div className="banner" style={{ marginBottom: 16 }}>
        <i className="fa-solid fa-triangle-exclamation" />
        <div>
          <strong>4 products</strong> are below reorder threshold and <strong>3 purchase invoices</strong> need approval.
        </div>
        <div className="ban-actions">
          <button className="btn btn-sm" onClick={() => onPage('reorder')}>Review reorder</button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="kpis">
        {KPIS.map((k, i) => <KpiTile key={i} k={k} idx={i} />)}
      </div>

      {/* Main grid: revenue chart + side panels */}
      <div className="grid-12" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-hd">
            <h3>Revenue</h3>
            <span className="hd-sub">vs Purchases · last 30 days</span>
            <div className="hd-actions">
              <div className="row gap-3">
                <div className="row gap-2 t-sm muted">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--brand)' }} />
                  Sales <span className="fw-6 muted-2 mono">${SP_SALES.reduce((a,b)=>a+b,0).toFixed(1)}k</span>
                </div>
                <div className="row gap-2 t-sm muted">
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--c-info)' }} />
                  Purchases <span className="fw-6 muted-2 mono">${SP_PURCHASES.reduce((a,b)=>a+b,0).toFixed(1)}k</span>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-ellipsis" /></button>
            </div>
          </div>
          <div className="card-pad" style={{ paddingTop: 8 }}>
            <AreaChart
              series={[SP_SALES.map(v => v * 1000), SP_PURCHASES.map(v => v * 1000)]}
              colors={['var(--brand)', 'var(--c-info)']}
              xLabels={SP_DAYS.map(d => `Apr ${d}`)}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-hd">
            <h3>Stock by category</h3>
            <span className="hd-sub">14 categories</span>
          </div>
          <div className="card-pad">
            <Donut data={CAT_BREAKDOWN} />
          </div>
        </div>
      </div>

      {/* Recent activity + low stock + top customers row */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div className="card-hd">
            <h3>Low stock alerts</h3>
            <span className="hd-sub">{LOW_STOCK.length} items</span>
            <div className="hd-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => onPage('reorder')}>View all <i className="fa-solid fa-arrow-right" /></button>
            </div>
          </div>
          <div>
            {LOW_STOCK.map((p, i) => (
              <div key={p.sku} className="row gap-3" style={{ padding: '10px 16px', borderBottom: i < LOW_STOCK.length - 1 ? '1px solid var(--line)' : 'none' }}>
                <div className="thumb brand">{p.sku.slice(0,2)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fw-6 t-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div className="muted t-xs mono">{p.sku} · {p.cat}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="fw-6 mono t-sm" style={{ color: p.status === 'out' ? 'var(--c-neg)' : 'var(--c-warn)' }}>
                    {p.qty} {p.unit}
                  </div>
                  <div className="muted t-xs">reorder 120</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div className="card-hd">
            <h3>Top customers</h3>
            <span className="hd-sub">YTD revenue</span>
          </div>
          <div className="card-pad">
            <BarChart data={CUSTOMERS_TOP.map(c => ({ label: c.name, value: c.ytd }))} height={210} />
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 1' }}>
          <div className="card-hd">
            <h3>Activity</h3>
            <span className="hd-sub">last 24h</span>
            <div className="hd-actions">
              <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-arrow-right" /></button>
            </div>
          </div>
          <div className="card-pad" style={{ paddingTop: 6 }}>
            {ACTIVITY.slice(0, 6).map((a, i) => {
              const meta = ACTIVITY_ICON[a.type] || ACTIVITY_ICON.update;
              return (
                <div key={i} className="row gap-3" style={{ padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, display: 'grid', placeItems: 'center', background: meta.bg, color: meta.c, fontSize: 11, flexShrink: 0 }}>
                    <i className={'fa-solid ' + meta.i} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span className="fw-6">{a.who}</span> <span className="muted-2">{a.what}</span>
                    </div>
                    <div className="muted t-xs" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.detail}</div>
                  </div>
                  <div className="muted t-xs" style={{ flexShrink: 0 }}>{a.when}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="card-hd">
          <h3>Recent sales orders</h3>
          <span className="hd-sub">{RECENT_ORDERS.length} this week</span>
          <div className="hd-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => onPage('sales')}>Open list <i className="fa-solid fa-arrow-right" /></button>
          </div>
        </div>
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th className="ta-right">Total</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map(o => (
                <tr key={o.id} style={{ cursor: 'pointer' }}>
                  <td className="col-id">{o.id}</td>
                  <td>
                    <div className="cell-with-icon">
                      <div className="thumb">{o.cust.split(' ').map(w => w[0]).slice(0,2).join('')}</div>
                      <span className="fw-6">{o.cust}</span>
                    </div>
                  </td>
                  <td className="muted">{o.date}</td>
                  <td className="col-num">{o.items}</td>
                  <td className="ta-right col-num fw-6">{fmtMoney(o.total, 2)}</td>
                  <td><StatusPill status={o.status} /></td>
                  <td>
                    <div className="row-actions">
                      <button title="View"><i className="fa-solid fa-eye" /></button>
                      <button title="Print"><i className="fa-solid fa-print" /></button>
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

window.Dashboard = Dashboard;
window.StatusPill = StatusPill;
