/* global React */
const { PRODUCTS, POS_CATEGORIES, POS_CART_SEED, fmtMoney } = window.WMS;

function POS() {
  const [cart, setCart] = React.useState(POS_CART_SEED);
  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [pay, setPay] = React.useState('card');

  const products = PRODUCTS.filter(p =>
    p.status !== 'out' &&
    (cat === 'All' || p.cat === cat) &&
    (q === '' || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()))
  );

  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const addToCart = p => {
    const existing = cart.find(l => l.sku === p.sku);
    if (existing) setCart(cart.map(l => l.sku === p.sku ? { ...l, qty: l.qty + 1 } : l));
    else setCart([...cart, { sku: p.sku, name: p.name, price: p.price, qty: 1 }]);
  };
  const setQty = (sku, qty) => {
    if (qty <= 0) setCart(cart.filter(l => l.sku !== sku));
    else setCart(cart.map(l => l.sku === sku ? { ...l, qty } : l));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0, height: 'calc(100vh - var(--top-h))' }}>
      {/* Products side */}
      <div style={{ padding: '18px 22px', overflowY: 'auto', background: 'var(--bg)' }}>
        <div className="row gap-3 mb-3" style={{ alignItems: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Point of sale</h1>
          <span className="pill brand"><i className="fa-solid fa-store" style={{ fontSize: 10 }} /> Storefront — Main</span>
          <div style={{ flex: 1 }} />
          <div className="row gap-2 t-sm muted">
            <span className="row gap-2"><span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--c-pos)' }} /> Online</span>
            <span>·</span>
            <span>Maria R.</span>
          </div>
          <button className="btn btn-sm"><i className="fa-solid fa-clock-rotate-left" /> Today's sales</button>
        </div>

        {/* Search */}
        <div className="filterbar" style={{ marginBottom: 12 }}>
          <div className="fb-search">
            <i className="fa-solid fa-magnifying-glass" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search products or scan barcode…"
              autoFocus
            />
          </div>
          <button className="btn"><i className="fa-solid fa-barcode" /> Scan</button>
        </div>

        {/* Category pills */}
        <div className="row gap-2 mb-3" style={{ flexWrap: 'wrap' }}>
          {POS_CATEGORIES.map(c => (
            <button key={c} className={'chip' + (cat === c ? ' is-on' : '')} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
          {products.map(p => (
            <div
              key={p.sku}
              onClick={() => addToCart(p)}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 10,
                padding: 14,
                cursor: 'pointer',
                transition: 'all 0.12s',
                position: 'relative',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--ring)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                aspectRatio: '4/3',
                background: `linear-gradient(135deg, color-mix(in oklch, var(--brand) 20%, var(--bg-sub)), var(--bg-sub))`,
                borderRadius: 7,
                marginBottom: 10,
                display: 'grid',
                placeItems: 'center',
                fontSize: 26,
                color: 'var(--brand)',
                fontWeight: 600,
                letterSpacing: '-0.04em',
              }}>
                {p.name.slice(0,1)}
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>
                {p.name.length > 28 ? p.name.slice(0,28) + '…' : p.name}
              </div>
              <div className="row" style={{ justifyContent: 'space-between' }}>
                <span className="mono muted" style={{ fontSize: 10.5 }}>{p.sku}</span>
                <span className="fw-7 mono" style={{ fontSize: 13, color: 'var(--brand)' }}>{fmtMoney(p.price, 2)}</span>
              </div>
              <div className="t-xs muted mt-1">
                {p.qty} {p.unit} in stock {p.status === 'low' && <span style={{ color: 'var(--c-warn)' }}>· low</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart side */}
      <div style={{ background: 'var(--card)', borderLeft: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
        {/* Customer */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <div className="row gap-3" style={{ alignItems: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--bg-sub)', display: 'grid', placeItems: 'center', color: 'var(--text-3)' }}>
              <i className="fa-solid fa-user" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="t-sm fw-6">Walk-in customer</div>
              <div className="t-xs muted">No loyalty profile</div>
            </div>
            <button className="btn btn-sm btn-ghost">Change</button>
          </div>
        </div>

        {/* Cart */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px 0' }}>
          {cart.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
              <i className="fa-solid fa-basket-shopping" style={{ fontSize: 32, opacity: 0.4 }} />
              <div className="mt-3 t-sm">Cart is empty</div>
            </div>
          ) : cart.map(l => (
            <div key={l.sku} style={{ padding: '10px 12px', borderRadius: 8, marginBottom: 4, background: 'var(--bg-sub)' }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-sm fw-6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</div>
                  <div className="t-xs muted mono">{l.sku} · {fmtMoney(l.price, 2)}</div>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ padding: 4, color: 'var(--c-neg)' }} onClick={() => setQty(l.sku, 0)}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
              <div className="row mt-2" style={{ justifyContent: 'space-between' }}>
                <div className="row gap-2" style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 6 }}>
                  <button onClick={() => setQty(l.sku, l.qty - 1)} style={{ background: 'none', border: 0, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-2)' }}><i className="fa-solid fa-minus" /></button>
                  <span className="mono fw-6" style={{ minWidth: 24, textAlign: 'center' }}>{l.qty}</span>
                  <button onClick={() => setQty(l.sku, l.qty + 1)} style={{ background: 'none', border: 0, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-2)' }}><i className="fa-solid fa-plus" /></button>
                </div>
                <div className="fw-7 mono" style={{ fontSize: 13.5 }}>{fmtMoney(l.price * l.qty, 2)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ borderTop: '1px solid var(--line)', padding: '14px 18px' }}>
          <div className="col gap-2">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted t-sm">Subtotal</span>
              <span className="mono">{fmtMoney(subtotal, 2)}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted t-sm">Tax (7%)</span>
              <span className="mono">{fmtMoney(tax, 2)}</span>
            </div>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted t-sm">Discount</span>
              <button className="btn btn-ghost btn-sm" style={{ padding: '0 4px', height: 'auto', minHeight: 0 }}>
                <i className="fa-solid fa-plus" style={{ fontSize: 9 }} /> Add
              </button>
            </div>
            <div className="divider" style={{ margin: '6px 0' }} />
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="fw-7" style={{ fontSize: 14 }}>Total</span>
              <span className="fw-7 mono" style={{ fontSize: 22, letterSpacing: '-0.02em' }}>{fmtMoney(total, 2)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="row gap-2 mt-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { id: 'cash', icon: 'fa-money-bill', label: 'Cash' },
              { id: 'card', icon: 'fa-credit-card', label: 'Card' },
              { id: 'qr',   icon: 'fa-qrcode',     label: 'QR pay' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setPay(p.id)}
                className="btn"
                style={{
                  flexDirection: 'column',
                  padding: '10px 6px',
                  gap: 4,
                  borderColor: pay === p.id ? 'var(--brand)' : 'var(--line)',
                  background: pay === p.id ? 'var(--brand-soft)' : 'var(--card)',
                  color: pay === p.id ? 'var(--brand-soft-fg)' : 'var(--text-2)',
                  boxShadow: pay === p.id ? '0 0 0 3px var(--ring)' : 'none',
                }}
              >
                <i className={'fa-solid ' + p.icon} style={{ fontSize: 14 }} />
                <span className="t-xs">{p.label}</span>
              </button>
            ))}
          </div>

          <button className="btn btn-primary mt-3" style={{ width: '100%', padding: '10px', fontSize: 13.5, fontWeight: 600 }}>
            <i className="fa-solid fa-lock" /> Charge {fmtMoney(total, 2)}
          </button>
          <div className="row gap-2 mt-2">
            <button className="btn btn-sm" style={{ flex: 1 }}><i className="fa-solid fa-pause" /> Hold</button>
            <button className="btn btn-sm" style={{ flex: 1 }}><i className="fa-solid fa-percent" /> Discount</button>
            <button className="btn btn-sm" style={{ flex: 1 }}><i className="fa-solid fa-print" /> Print</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.POS = POS;
