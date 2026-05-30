/* global React */
const { PRODUCTS, fmtMoney, STATUS_PILL } = window.WMS;
const { StatusPill } = window;

function Inventory({ onPage }) {
  const [q, setQ] = React.useState('');
  const [cat, setCat] = React.useState('All');
  const [status, setStatus] = React.useState('All');
  const [sel, setSel] = React.useState(new Set());

  const cats = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.cat)))];
  const statuses = [
    { id: 'All',  label: 'All',         count: PRODUCTS.length },
    { id: 'in',   label: 'In stock',    count: PRODUCTS.filter(p => p.status === 'in').length },
    { id: 'low',  label: 'Low',         count: PRODUCTS.filter(p => p.status === 'low').length },
    { id: 'out',  label: 'Out',         count: PRODUCTS.filter(p => p.status === 'out').length },
  ];

  const filtered = PRODUCTS.filter(p =>
    (cat === 'All' || p.cat === cat) &&
    (status === 'All' || p.status === status) &&
    (q === '' || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
  );

  const toggle = sku => {
    const next = new Set(sel);
    next.has(sku) ? next.delete(sku) : next.add(sku);
    setSel(next);
  };
  const toggleAll = () => {
    if (sel.size === filtered.length) setSel(new Set());
    else setSel(new Set(filtered.map(p => p.sku)));
  };

  const totalValue = filtered.reduce((s, p) => s + p.qty * p.cost, 0);
  const lowCount = filtered.filter(p => p.status === 'low' || p.status === 'out').length;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Products</h1>
          <div className="ph-sub">
            <span className="mono">{filtered.length}</span> of <span className="mono">{PRODUCTS.length}</span> SKUs ·
            <span className="fw-6 muted-2" style={{ marginLeft: 6 }}>{fmtMoney(totalValue, 0)}</span> inventory value
          </div>
        </div>
        <div className="ph-actions">
          <button className="btn"><i className="fa-solid fa-download" /> Export</button>
          <button className="btn"><i className="fa-solid fa-upload" /> Import</button>
          <button className="btn" onClick={() => onPage && onPage('bulk-add')}><i className="fa-solid fa-table-cells" /> Bulk add</button>
          <button className="btn btn-primary" onClick={() => onPage && onPage('new-product')}><i className="fa-solid fa-plus" /> New product</button>
        </div>
      </div>

      {/* Status filter chips row */}
      <div className="row gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button
            key={s.id}
            className={'chip' + (status === s.id ? ' is-on' : '')}
            onClick={() => setStatus(s.id)}
          >
            {s.id !== 'All' && <span style={{
              width: 6, height: 6, borderRadius: 3,
              background: s.id === 'in' ? 'var(--c-pos)' : s.id === 'low' ? 'var(--c-warn)' : 'var(--c-neg)'
            }} />}
            {s.label}
            <span className="mono muted" style={{ fontSize: 10.5 }}>{s.count}</span>
          </button>
        ))}
        <div style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }} />
        {lowCount > 0 && (
          <div className="chip" style={{ background: 'var(--c-warn-soft)', color: 'var(--c-warn)', borderColor: 'transparent' }}>
            <i className="fa-solid fa-triangle-exclamation" />
            {lowCount} need attention
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div className="filterbar">
        <div className="fb-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, SKU, barcode…" />
        </div>
        <select className="select" value={cat} onChange={e => setCat(e.target.value)} style={{ width: 'auto' }}>
          {cats.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>All locations</option>
          <option>Warehouse A</option>
          <option>Warehouse B</option>
          <option>Storefront</option>
        </select>
        <select className="select" style={{ width: 'auto' }}>
          <option>All brands</option>
          <option>Atlas</option>
          <option>Polyflo</option>
          <option>Lumio</option>
        </select>
        <div style={{ flex: 1 }} />
        <div className="seg">
          <button className="is-active" title="Table"><i className="fa-solid fa-list" /></button>
          <button title="Grid"><i className="fa-solid fa-grip" /></button>
        </div>
        <button className="btn btn-ghost btn-sm"><i className="fa-solid fa-sliders" /> Columns</button>
      </div>

      {/* Bulk action bar */}
      {sel.size > 0 && (
        <div className="banner info" style={{ marginBottom: 12 }}>
          <i className="fa-solid fa-circle-check" />
          <span><strong>{sel.size}</strong> selected</span>
          <div className="ban-actions row gap-2">
            <button className="btn btn-sm"><i className="fa-solid fa-tag" /> Set category</button>
            <button className="btn btn-sm"><i className="fa-solid fa-truck-ramp-box" /> Transfer</button>
            <button className="btn btn-sm"><i className="fa-solid fa-print" /> Print labels</button>
            <button className="btn btn-sm btn-danger"><i className="fa-solid fa-trash" /> Delete</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="tbl-scroll">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 28, paddingRight: 0 }}>
                  <span className={'chk' + (sel.size === filtered.length && filtered.length ? ' is-on' : '')} onClick={toggleAll} />
                </th>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Location</th>
                <th className="ta-right">On hand</th>
                <th className="ta-right">Unit price</th>
                <th className="ta-right">Value</th>
                <th className="ta-right">Margin</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.sku} className={sel.has(p.sku) ? 'is-selected' : ''}>
                  <td style={{ paddingRight: 0 }}>
                    <span className={'chk' + (sel.has(p.sku) ? ' is-on' : '')} onClick={() => toggle(p.sku)} />
                  </td>
                  <td className="col-id">{p.sku}</td>
                  <td>
                    <div className="cell-with-icon">
                      <div className="thumb brand">{p.name.slice(0, 1)}</div>
                      <div style={{ minWidth: 0 }}>
                        <div className="fw-6">{p.name}</div>
                        <div className="ci-sub">{p.brand} · {p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="tag">{p.cat}</span></td>
                  <td className="muted-2">{p.brand}</td>
                  <td className="mono muted">{p.loc}</td>
                  <td className="ta-right col-num fw-6" style={{ color: p.status === 'out' ? 'var(--c-neg)' : p.status === 'low' ? 'var(--c-warn)' : undefined }}>
                    {p.qty.toLocaleString()}
                  </td>
                  <td className="ta-right col-num">{fmtMoney(p.price, 2)}</td>
                  <td className="ta-right col-num fw-6">{fmtMoney(p.qty * p.cost, 0)}</td>
                  <td className="ta-right col-num">
                    <span style={{ color: p.margin >= 50 ? 'var(--c-pos)' : p.margin >= 40 ? 'var(--text-2)' : 'var(--c-warn)' }}>
                      {p.margin}%
                    </span>
                  </td>
                  <td><StatusPill status={p.status} /></td>
                  <td>
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
        {/* Footer */}
        <div className="row" style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', fontSize: 12 }}>
          <div className="muted">Showing <span className="mono fw-6 muted-2">{filtered.length}</span> products</div>
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

window.Inventory = Inventory;
