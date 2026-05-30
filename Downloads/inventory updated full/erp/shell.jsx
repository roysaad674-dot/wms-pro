/* global React */
// Shell: dual-rail sidebar (icon rail + contextual panel) and topbar.
// Reads window.WMS for nav config.

const { useState, useEffect, useMemo, useRef } = React;
const { MODULES, NAV, PAGE_TO_MODULE } = window.WMS;

/* -------------------------------------------------------------------------
   Icon rail — always visible. Icon + name + colored dot per module.
   ------------------------------------------------------------------------- */
function IconRail({ activeModule, onModule, sidebarStyle, onToggleSidebar }) {
  const top = MODULES;
  return (
    <nav className="rail">
      <div className="rail-logo" title="WMS Pro">
        <span className="rail-logo-mark">W</span>
        <span className="rail-logo-name">WMS Pro</span>
      </div>
      <div className="rail-stack">
        {top.map(m => {
          const active = m.id === activeModule;
          const badge = NAV[m.id].reduce((n, it) => n + (it.badge || 0), 0);
          return (
            <button
              key={m.id}
              className={'rail-btn' + (active ? ' is-active' : '')}
              style={{ '--mod': m.color }}
              onClick={() => onModule(m.id)}
            >
              <span className="rail-icn">
                <i className={'fa-solid ' + m.icon} />
                <span className="mod-dot" />
              </span>
              <span className="rail-lbl">{m.label}</span>
              {badge > 0 && <span className="rail-badge">{badge}</span>}
            </button>
          );
        })}
      </div>
      <div className="rail-spacer" />
      <div className="rail-stack">
        <button className="rail-btn rail-btn-util" onClick={onToggleSidebar}>
          <span className="rail-icn"><i className={'fa-solid ' + (sidebarStyle === 'full' ? 'fa-angles-left' : 'fa-angles-right')} /></span>
          <span className="rail-lbl">{sidebarStyle === 'full' ? 'Collapse' : 'Expand'}</span>
        </button>
        <button className="rail-btn rail-btn-util">
          <span className="rail-icn"><i className="fa-solid fa-circle-question" /></span>
          <span className="rail-lbl">Help</span>
        </button>
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------
   Side panel — shows links for the active module + user footer
   ------------------------------------------------------------------------- */
function SidePanel({ activeModule, activePage, onPage }) {
  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const items = NAV[activeModule] || [];
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => items.filter(it => !it.id || it.label.toLowerCase().includes(q.toLowerCase()) || !q),
    [items, q]
  );

  return (
    <aside className="sidepanel" style={{ '--mod': mod.color }}>
      <div className="sp-head">
        <div className="sp-icon"><i className={'fa-solid ' + mod.icon} /></div>
        <div>
          <div className="sp-title">{mod.label}</div>
          <div className="sp-sub">{items.filter(i => i.id).length} sections</div>
        </div>
      </div>
      <div className="sp-search">
        <i className="fa-solid fa-magnifying-glass" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Jump to…" />
      </div>
      <div className="sp-list">
        {filtered.map((it, i) => {
          if (it._h) return <div key={'h' + i} className="sp-section">{it._h}</div>;
          const active = it.id === activePage;
          return (
            <div
              key={it.id}
              className={'sp-item' + (active ? ' is-active' : '')}
              onClick={() => onPage(it.id)}
            >
              <i className={'fa-solid ' + it.icon} />
              <span>{it.label}</span>
              {it.badge ? <span className="sp-badge">{it.badge}</span> : it.kbd ? <span className="sp-kbd">G {it.kbd}</span> : null}
            </div>
          );
        })}
      </div>
      <div className="sp-foot">
        <div className="avatar">MR</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="uname">Maria Rodriguez</div>
          <div className="urole">Operations · Admin</div>
        </div>
        <button className="uicon-btn" title="Notifications"><i className="fa-solid fa-bell" /></button>
        <button className="uicon-btn" title="Sign out"><i className="fa-solid fa-right-from-bracket" /></button>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------
   Topbar — breadcrumbs, search, quick actions
   ------------------------------------------------------------------------- */
function Topbar({ activeModule, activePage, pageMeta }) {
  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0];
  const item = (NAV[activeModule] || []).find(it => it.id === activePage);
  const pageTitle = pageMeta?.title || item?.label || mod.label;
  return (
    <header className="topbar">
      <div className="crumbs">
        <span>{mod.label}</span>
        <span className="sep">›</span>
        <span className="curr">{pageTitle}</span>
      </div>
      <div className="topbar-spacer" />
      <div className="topbar-search">
        <i className="fa-solid fa-magnifying-glass si" />
        <input placeholder="Search products, customers, orders…" />
        <span className="kbd">⌘K</span>
      </div>
      <button className="icon-btn" title="Notifications">
        <i className="fa-solid fa-bell" />
        <span className="ib-dot" />
      </button>
      <button className="icon-btn" title="Calendar"><i className="fa-solid fa-calendar-day" /></button>
      <button className="icon-btn" title="Activity"><i className="fa-solid fa-clock-rotate-left" /></button>
      <div style={{ width: 1, height: 22, background: 'var(--line)', margin: '0 4px' }} />
      <button className="btn btn-sm"><i className="fa-solid fa-plus" /> New</button>
    </header>
  );
}

window.IconRail = IconRail;
window.SidePanel = SidePanel;
window.Topbar = Topbar;
