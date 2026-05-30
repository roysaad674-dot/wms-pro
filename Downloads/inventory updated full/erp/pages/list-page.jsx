/* global React */
// Generic ListPage component — reads a config and renders KPIs + filters + table.
// Used by ~25 list-style pages: POs, invoices, bills, journal entries, expenses, etc.

const { fmtMoney } = window.WMS;

function ListPage({ cfg, onPage }) {
  const [tab, setTab] = React.useState(cfg.tabs?.[0]?.id || 'all');
  const [q, setQ] = React.useState('');
  const filterRow = cfg.tabs?.find(t => t.id === tab)?.filter;
  const rows = (cfg.rows || []).filter(r => {
    if (filterRow && !filterRow(r)) return false;
    if (!q) return true;
    return Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase()));
  });

  const goto = (a) => {
    if (a.onClick) a.onClick();
    else if (a.pageId && onPage) onPage(a.pageId);
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{cfg.title}</h1>
          <div className="ph-sub">{cfg.subtitle}</div>
        </div>
        <div className="ph-actions">
          {cfg.actions?.map((a, i) => (
            <button key={i} className={'btn ' + (a.primary ? 'btn-primary' : '')} onClick={() => goto(a)}>
              {a.icon && <i className={'fa-solid ' + a.icon} />} {a.label}
            </button>
          )) || (
            <>
              <button className="btn"><i className="fa-solid fa-download" /> Export</button>
              <button className="btn btn-primary"><i className="fa-solid fa-plus" /> New</button>
            </>
          )}
        </div>
      </div>

      {/* KPI strip */}
      {cfg.kpis && (
        <div className="kpis mb-3">
          {cfg.kpis.map((k, i) => (
            <div key={i} className="kpi">
              <div className="kpi-lbl">{k.label}</div>
              <div className="kpi-val" style={{ color: k.color }}>
                {k.money ? fmtMoney(k.value, k.dp || 0) : k.value}
              </div>
              <div className="kpi-foot">
                {k.delta != null && (
                  <span className={'delta ' + (k.delta >= 0 ? 'up' : 'down')}>
                    <i className={'fa-solid ' + (k.delta >= 0 ? 'fa-arrow-up' : 'fa-arrow-down')} style={{ fontSize: 9 }} />
                    {Math.abs(k.delta).toFixed(1)}%
                  </span>
                )}
                <span className="muted">{k.sublabel}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner if config has one */}
      {cfg.banner && (
        <div className={'banner ' + (cfg.banner.tone || '')} style={{ marginBottom: 16 }}>
          <i className={'fa-solid ' + (cfg.banner.icon || 'fa-circle-info')} />
          <div>{cfg.banner.text}</div>
          {cfg.banner.action && (
            <div className="ban-actions"><button className="btn btn-sm">{cfg.banner.action}</button></div>
          )}
        </div>
      )}

      <div className="card">
        {cfg.tabs && (
          <div className="tabs" style={{ paddingLeft: 12 }}>
            {cfg.tabs.map(t => (
              <button key={t.id} className={tab === t.id ? 'is-active' : ''} onClick={() => setTab(t.id)}>
                {t.label} {t.count != null && <span className="mono muted" style={{ marginLeft: 4, fontSize: 11 }}>{t.count}</span>}
              </button>
            ))}
          </div>
        )}
        <div className="row" style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
          <div className="fb-search" style={{ flex: 1, position: 'relative', maxWidth: 320 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-3)', fontSize: 12 }} />
            <input className="input" placeholder={cfg.searchPlaceholder || 'Search…'} value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: 30 }} />
          </div>
          <div style={{ flex: 1 }} />
          {cfg.filters?.map((f, i) => (
            <select key={i} className="select" style={{ width: 'auto' }}>
              {f.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-sliders" /></button>
        </div>
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                {cfg.columns.map((c, i) => (
                  <th key={i} className={c.align === 'right' ? 'ta-right' : ''}>{c.label}</th>
                ))}
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} style={{ cursor: cfg.rowPageId ? 'pointer' : 'default' }} onClick={cfg.rowPageId && onPage ? () => onPage(cfg.rowPageId) : undefined}>
                  {cfg.columns.map((c, i) => (
                    <td key={i} className={(c.align === 'right' ? 'ta-right ' : '') + (c.cls || '')}>
                      {renderCell(c, r)}
                    </td>
                  ))}
                  <td onClick={e => e.stopPropagation()}>
                    <div className="row-actions">
                      <button title="View"><i className="fa-solid fa-eye" /></button>
                      <button title="Edit"><i className="fa-solid fa-pen" /></button>
                      <button title="More"><i className="fa-solid fa-ellipsis" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={cfg.columns.length + 1} style={{ textAlign: 'center', padding: 40, color: 'var(--text-3)' }}>No records match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="row" style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 12 }}>
          <div className="muted">Showing <span className="mono fw-6 muted-2">{rows.length}</span> of <span className="mono">{cfg.rows.length}</span></div>
          <div style={{ flex: 1 }} />
          <div className="row gap-2">
            <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-chevron-left" /></button>
            <span className="muted">Page <span className="fw-6 muted-2">1</span> of 1</span>
            <button className="btn btn-sm btn-ghost"><i className="fa-solid fa-chevron-right" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderCell(c, r) {
  const v = r[c.key];
  switch (c.type) {
    case 'id':       return <span className="col-id">{v}</span>;
    case 'money':    return <span className="col-num fw-6">{fmtMoney(v, c.dp ?? 2)}</span>;
    case 'money-signed': return <span className="col-num fw-6" style={{ color: v < 0 ? 'var(--c-neg)' : 'var(--c-pos)' }}>{(v < 0 ? '−' : '+') + fmtMoney(Math.abs(v), c.dp ?? 2)}</span>;
    case 'num':      return <span className="col-num">{v?.toLocaleString?.() ?? v}</span>;
    case 'date':     return <span className="muted">{v}</span>;
    case 'status':   return window.StatusPill ? <window.StatusPill status={v} /> : <span className="pill muted">{v}</span>;
    case 'pill':     return <span className={'pill ' + (c.tone?.(v) || 'muted')}>{v}</span>;
    case 'tag':      return <span className="tag">{v}</span>;
    case 'progress': {
      const pct = (v.done / v.total) * 100;
      return (
        <div className="row gap-2" style={{ minWidth: 130 }}>
          <span className="mono fw-6 t-sm">{v.done}/{v.total}</span>
          <div className="bar" style={{ flex: 1, height: 4 }}>
            <span style={{ width: pct + '%', background: pct === 100 ? 'var(--c-pos)' : 'var(--c-warn)' }} />
          </div>
        </div>
      );
    }
    case 'avatar':   return (
      <div className="cell-with-icon">
        <div className="thumb">{(v?.name || v).split(' ').map(w => w[0]).slice(0,2).join('')}</div>
        <div>
          <div className="fw-6">{v?.name || v}</div>
          {typeof v === 'object' && v?.sub && <div className="ci-sub">{v.sub}</div>}
        </div>
      </div>
    );
    case 'user':     return (
      <div className="row gap-2">
        <div className="av" style={{ background: v.color || 'var(--c-info)' }}>{v.initials || v.name?.split(' ').map(w=>w[0]).join('')}</div>
        <span className="t-sm muted-2">{v.name}</span>
      </div>
    );
    case 'jsx':      return c.render(r);
    default:         return v;
  }
}

window.ListPage = ListPage;
