/* global React, ReactDOM */
const { useState, useEffect } = React;
const { IconRail, SidePanel, Topbar, Dashboard, Inventory, POS, SalesOrders, SalesForm, Reports, GoodsReceipts, Placeholder } = window;
const { PAGE_TO_MODULE, NAV, MODULES } = window.WMS;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "balanced",
  "sidebar": "full",
  "accent": "indigo",
  "radius": "rounded"
}/*EDITMODE-END*/;

const ACCENTS = {
  indigo:    { h: 268, c: 0.18, label: 'Indigo' },
  ocean:     { h: 220, c: 0.16, label: 'Ocean'  },
  forest:    { h: 155, c: 0.14, label: 'Forest' },
  amber:     { h:  60, c: 0.16, label: 'Amber'  },
  graphite:  { h: 270, c: 0.02, label: 'Mono'   },
  fuchsia:   { h: 330, c: 0.20, label: 'Fuchsia'},
};

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const [activeModule, setActiveModule] = useState('main');
  const [activePage, setActivePage] = useState('dashboard');

  // when switching pages from cards / row clicks, also jump module
  const onPage = (id) => {
    setActivePage(id);
    const mod = PAGE_TO_MODULE[id];
    if (mod) setActiveModule(mod);
  };

  // when picking a module from the rail, jump to its first valid item
  const onModule = (id) => {
    setActiveModule(id);
    const first = (NAV[id] || []).find(it => it.id);
    if (first) setActivePage(first.id);
  };

  const toggleSidebar = () => setTweak('sidebar', t.sidebar === 'full' ? 'rail' : 'full');

  // Apply tweaks to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = t.theme;
    html.dataset.density = t.density;
    const a = ACCENTS[t.accent] || ACCENTS.indigo;
    html.style.setProperty('--brand-h', a.h);
    html.style.setProperty('--brand-c', a.c);
    if (t.radius === 'sharp') {
      html.style.setProperty('--r-md', '2px');
      html.style.setProperty('--r-lg', '4px');
    } else {
      html.style.removeProperty('--r-md');
      html.style.removeProperty('--r-lg');
    }
  }, [t.theme, t.density, t.accent, t.radius]);

  // Routing
  let PageComp;
  switch (activePage) {
    case 'dashboard':   PageComp = <Dashboard onPage={onPage} />; break;
    case 'inventory':   PageComp = <Inventory onPage={onPage} />; break;
    case 'pos':         PageComp = <POS />; break;
    case 'sales':       PageComp = <SalesOrders onPage={onPage} />; break;
    case 'sales-form':  PageComp = <SalesForm onPage={onPage} />; break;
    case 'reports':     PageComp = <Reports onPage={onPage} />; break;
    case 'grn':         PageComp = <GoodsReceipts onPage={onPage} />; break;
    default:
      const itm = (NAV[activeModule] || []).find(i => i.id === activePage);
      PageComp = <Placeholder pageId={activePage} title={itm?.label} onPage={onPage} />;
  }

  return (
    <div className="app" data-sidebar={t.sidebar}>
      <IconRail
        activeModule={activeModule}
        onModule={onModule}
        sidebarStyle={t.sidebar}
        onToggleSidebar={toggleSidebar}
      />
      <SidePanel
        activeModule={activeModule}
        activePage={activePage}
        onPage={onPage}
      />
      <Topbar activeModule={activeModule} activePage={activePage} />
      <main className="main" key={activePage}>
        {PageComp}
      </main>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection label="Appearance" />
        <window.TweakToggle label="Dark mode" value={t.theme === 'dark'}
          onChange={(v) => setTweak('theme', v ? 'dark' : 'light')} />
        <window.TweakRadio label="Density" value={t.density}
          options={['compact', 'balanced', 'spacious']}
          onChange={(v) => setTweak('density', v)} />
        <window.TweakRadio label="Sidebar" value={t.sidebar}
          options={['rail', 'full']}
          onChange={(v) => setTweak('sidebar', v)} />
        <window.TweakRadio label="Corners" value={t.radius}
          options={['sharp', 'rounded']}
          onChange={(v) => setTweak('radius', v)} />

        <window.TweakSection label="Brand color" />
        <window.TweakSelect label="Accent" value={t.accent}
          options={Object.keys(ACCENTS).map(k => ({ value: k, label: ACCENTS[k].label }))}
          onChange={(v) => setTweak('accent', v)} />
      </window.TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
