/* global window */
// Sample data for the WMS Pro prototype.
// Exposed on window so all <script type="text/babel"> files can read it.

const MODULES = [
  { id: 'main',      label: 'Dashboard',  icon: 'fa-chart-pie',     color: 'oklch(0.62 0.18 268)' },
  { id: 'reports',   label: 'Reports',    icon: 'fa-chart-line',    color: 'oklch(0.62 0.22 310)' },
  { id: 'vendors',   label: 'Vendors',    icon: 'fa-truck',         color: 'oklch(0.70 0.16 50)'  },
  { id: 'customers', label: 'Customers',  icon: 'fa-user-friends',  color: 'oklch(0.65 0.16 240)' },
  { id: 'finance',   label: 'Finance',    icon: 'fa-landmark',      color: 'oklch(0.65 0.15 160)' },
  { id: 'banking',   label: 'Banking',    icon: 'fa-university',    color: 'oklch(0.68 0.13 200)' },
  { id: 'employees', label: 'Employees',  icon: 'fa-id-badge',      color: 'oklch(0.65 0.20 340)' },
  { id: 'warehouse', label: 'Warehouse',  icon: 'fa-warehouse',     color: 'oklch(0.72 0.15 80)'  },
  { id: 'inventory', label: 'Inventory',  icon: 'fa-boxes-stacked', color: 'oklch(0.62 0.14 200)' },
  { id: 'system',    label: 'System',     icon: 'fa-gear',          color: 'oklch(0.58 0.04 270)' },
];

// Items shown inside each module's side-panel. Optional: section header, badge, kbd.
const NAV = {
  main: [
    { id: 'dashboard',   label: 'Overview',         icon: 'fa-chart-pie', kbd: 'D' },
    { id: 'workspace',   label: 'My Workspace',     icon: 'fa-th-large' },
    { id: 'pinned',      label: 'Pinned Reports',   icon: 'fa-thumbtack' },
  ],
  reports: [
    { id: 'reports',         label: 'Reports Library', icon: 'fa-chart-bar', kbd: 'R' },
    { id: 'custom-report',   label: 'Custom Report',   icon: 'fa-sliders' },
    { id: 'scheduled',       label: 'Scheduled',       icon: 'fa-clock' },
    { _h: 'Favorites' },
    { id: 'sales-summary',   label: 'Sales summary',   icon: 'fa-bookmark' },
    { id: 'ageing',          label: 'AR ageing',       icon: 'fa-bookmark' },
  ],
  vendors: [
    { id: 'purchases',         label: 'Purchase Orders',     icon: 'fa-shopping-cart', kbd: 'O' },
    { id: 'grn',               label: 'Goods Receipts',      icon: 'fa-clipboard-check' },
    { id: 'purchase-invoices', label: 'Purchase Invoices',   icon: 'fa-file-invoice', badge: 3 },
    { id: 'debit-notes',       label: 'Debit Notes',         icon: 'fa-arrow-left-long' },
    { id: 'bills',             label: 'Bills',               icon: 'fa-file-lines' },
    { id: 'suppliers',         label: 'Suppliers',           icon: 'fa-truck', kbd: 'V' },
  ],
  customers: [
    { id: 'estimates',     label: 'Estimates',      icon: 'fa-calculator' },
    { id: 'sales',         label: 'Sales Orders',   icon: 'fa-file-invoice-dollar', kbd: 'S' },
    { id: 'sale-invoices', label: 'Sale Invoices',  icon: 'fa-receipt' },
    { id: 'sales-receipts',label: 'Payments',       icon: 'fa-money-bill' },
    { id: 'credit-notes',  label: 'Credit Notes',   icon: 'fa-rotate-left' },
    { id: 'statements',    label: 'Statements',     icon: 'fa-file-lines' },
    { id: 'customers',     label: 'Customers',      icon: 'fa-user-friends', kbd: 'C' },
    { id: 'pos',           label: 'Point of Sale',  icon: 'fa-cash-register' },
  ],
  finance: [
    { id: 'accounts',           label: 'Chart of Accounts', icon: 'fa-landmark' },
    { id: 'journal-entries',    label: 'Journal Entries',   icon: 'fa-book' },
    { id: 'general-ledger',     label: 'General Ledger',    icon: 'fa-scroll' },
    { id: 'accounts-payable',   label: 'Accounts Payable',  icon: 'fa-hand-holding-dollar' },
    { id: 'accounts-receivable',label: 'Accounts Receivable', icon: 'fa-coins' },
    { id: 'expenses',           label: 'Expenses',          icon: 'fa-wallet' },
    { id: 'tax',                label: 'Tax',               icon: 'fa-percent' },
  ],
  banking: [
    { id: 'bank-accounts', label: 'Bank Accounts',   icon: 'fa-university' },
    { id: 'banking',       label: 'Transactions',    icon: 'fa-right-left' },
    { id: 'reconcile',     label: 'Reconciliation',  icon: 'fa-scale-balanced' },
  ],
  employees: [
    { id: 'employees',  label: 'Directory',     icon: 'fa-id-badge', kbd: 'E' },
    { id: 'attendance', label: 'Attendance',    icon: 'fa-user-check' },
    { id: 'leave',      label: 'Leave Tracker', icon: 'fa-calendar-minus' },
    { id: 'payroll',    label: 'Payroll',       icon: 'fa-money-check-dollar' },
  ],
  warehouse: [
    { id: 'warehouse-stock', label: 'Stock by Location', icon: 'fa-layer-group' },
    { id: 'transactions',    label: 'Stock Movements',   icon: 'fa-right-left' },
    { id: 'transfers',       label: 'Transfers',         icon: 'fa-shuffle' },
    { id: 'adjustments',     label: 'Adjustments',       icon: 'fa-sliders' },
    { id: 'stockcount',      label: 'Stock Count',       icon: 'fa-clipboard-check' },
    { id: 'locations',       label: 'Locations',         icon: 'fa-location-dot' },
  ],
  inventory: [
    { id: 'inventory',  label: 'Products',       icon: 'fa-boxes-stacked', badge: 4, kbd: 'P' },
    { id: 'reorder',    label: 'Reorder Center', icon: 'fa-cart-plus', badge: 4 },
    { id: 'categories', label: 'Categories',     icon: 'fa-tags' },
    { id: 'brands',     label: 'Brands',         icon: 'fa-certificate' },
    { id: 'units',      label: 'Units',          icon: 'fa-ruler' },
    { id: 'barcode',    label: 'Barcodes',       icon: 'fa-barcode' },
  ],
  system: [
    { id: 'calendar', label: 'Calendar',     icon: 'fa-calendar-days' },
    { id: 'activity', label: 'Activity Log', icon: 'fa-clock-rotate-left' },
    { id: 'users',    label: 'Users & Roles',icon: 'fa-users-gear' },
    { id: 'settings', label: 'Settings',     icon: 'fa-gear' },
  ],
};

// Which module owns a given page id — used to switch the rail when navigating.
const PAGE_TO_MODULE = (() => {
  const m = {};
  for (const [mod, items] of Object.entries(NAV)) {
    for (const it of items) if (it.id) m[it.id] = mod;
  }
  return m;
})();

// ---------- sample business data ----------
const fmtMoney = (n, dp = 0) =>
  '$' + (n || 0).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });

const KPIS = [
  { label: 'Net revenue',     value: 284_932, money: true, delta: +12.4, period: 'vs last month',
    sparkSeries: [42, 46, 44, 50, 53, 58, 62, 60, 66, 72, 70, 78] },
  { label: 'Gross profit',    value: 96_812, money: true, delta: +8.1,  period: 'margin 34.0%',
    sparkSeries: [22, 24, 23, 26, 28, 30, 31, 33, 35, 36, 35, 38] },
  { label: 'Orders',          value: 1_284,             delta: +4.2,  period: 'avg ' + fmtMoney(222),
    sparkSeries: [110, 105, 115, 120, 118, 122, 130, 128, 132, 135, 138, 142] },
  { label: 'AR outstanding',  value: 48_120, money: true, delta: -3.2,  period: '12 invoices overdue',
    sparkSeries: [56, 58, 55, 53, 52, 50, 49, 48, 50, 47, 46, 48] },
];

const RECENT_ORDERS = [
  { id: 'SO-10284', cust: 'Atlas Hardware Co.',    date: 'Today, 09:42',  total: 4_812.40, status: 'paid',     items: 12 },
  { id: 'SO-10283', cust: 'Northwind Industrial',  date: 'Today, 08:11',  total: 11_240.00,status: 'fulfilled',items: 28 },
  { id: 'SO-10282', cust: 'Pioneer Logistics',     date: 'Yesterday',     total: 920.50,   status: 'pending',  items: 4 },
  { id: 'SO-10281', cust: 'Greenleaf Foods',       date: 'Yesterday',     total: 2_104.00, status: 'paid',     items: 9 },
  { id: 'SO-10280', cust: 'Cascade Outfitters',    date: '2 days ago',    total: 7_680.25, status: 'partial',  items: 17 },
  { id: 'SO-10279', cust: 'Beacon Hospitality',    date: '2 days ago',    total: 540.00,   status: 'draft',    items: 3 },
  { id: 'SO-10278', cust: 'Atlas Hardware Co.',    date: '3 days ago',    total: 3_280.10, status: 'fulfilled',items: 8 },
];

const STATUS_PILL = {
  paid:      { cls: 'pos',    label: 'Paid' },
  fulfilled: { cls: 'info',   label: 'Fulfilled' },
  pending:   { cls: 'warn',   label: 'Pending' },
  partial:   { cls: 'warn',   label: 'Partial' },
  draft:     { cls: 'muted',  label: 'Draft' },
  overdue:   { cls: 'neg',    label: 'Overdue' },
  cancelled: { cls: 'muted',  label: 'Cancelled' },
  in:        { cls: 'pos',    label: 'In stock' },
  low:       { cls: 'warn',   label: 'Low' },
  out:       { cls: 'neg',    label: 'Out' },
  active:    { cls: 'pos',    label: 'Active' },
};

const PRODUCTS = [
  { sku: 'HX-12-440',  name: 'Heavy-duty hex bolt M12',      cat: 'Fasteners',     brand: 'Atlas',   loc: 'A-12-3', qty: 1842, unit: 'pcs', price: 0.42, cost: 0.18, status: 'in',   margin: 57 },
  { sku: 'PVC-2-90',   name: 'PVC elbow 2" 90°',             cat: 'Plumbing',      brand: 'Polyflo', loc: 'B-04-1', qty: 412,  unit: 'pcs', price: 3.20, cost: 1.40, status: 'in',   margin: 56 },
  { sku: 'LED-T8-18',  name: 'LED T8 tube 18W 4ft',          cat: 'Electrical',    brand: 'Lumio',   loc: 'C-08-2', qty: 96,   unit: 'pcs', price: 14.50,cost: 8.10, status: 'low',  margin: 44 },
  { sku: 'WD-OAK-12',  name: 'Oak plank 12mm 1.2m',          cat: 'Lumber',        brand: 'Cascade', loc: 'D-02-7', qty: 0,    unit: 'pcs', price: 22.00,cost: 13.50,status: 'out',  margin: 39 },
  { sku: 'PT-WHT-5G',  name: 'Interior paint white 5 gal',   cat: 'Paint',         brand: 'Beacon',  loc: 'E-11-4', qty: 64,   unit: 'pcs', price: 78.00,cost: 41.20,status: 'in',   margin: 47 },
  { sku: 'TR-SPN-10',  name: 'Spanner set 10pc chrome',      cat: 'Tools',         brand: 'IronGrip',loc: 'F-03-1', qty: 28,   unit: 'set', price: 142.00,cost: 84.00,status: 'low', margin: 41 },
  { sku: 'SF-GLV-NIT', name: 'Nitrile glove M (100)',        cat: 'Safety',        brand: 'GuardPro',loc: 'G-01-2', qty: 1240, unit: 'box', price: 18.40,cost: 10.50,status: 'in',   margin: 43 },
  { sku: 'CEM-PT-50',  name: 'Portland cement 50kg',         cat: 'Building',      brand: 'Stratos', loc: 'H-07-1', qty: 182,  unit: 'bag', price: 12.80,cost: 8.20, status: 'in',   margin: 36 },
  { sku: 'CB-CAT6-30', name: 'Cat6 patch cable 30m',         cat: 'Electrical',    brand: 'Lumio',   loc: 'C-09-3', qty: 8,    unit: 'pcs', price: 28.00,cost: 16.40,status: 'low',  margin: 41 },
  { sku: 'ADH-EPX-2',  name: 'Epoxy adhesive 2-part 250ml',  cat: 'Adhesives',     brand: 'BondTek', loc: 'I-02-5', qty: 312,  unit: 'pcs', price: 8.40, cost: 4.10, status: 'in',   margin: 51 },
  { sku: 'PMP-CW-1HP', name: 'Centrifugal water pump 1HP',   cat: 'Machinery',     brand: 'Hydrox',  loc: 'J-01-1', qty: 12,   unit: 'pcs', price: 410.00,cost: 285.00,status: 'low',margin: 30 },
  { sku: 'BAT-12V-7A', name: 'Sealed lead-acid 12V 7Ah',     cat: 'Electrical',    brand: 'PowerCell',loc:'C-12-1', qty: 0,    unit: 'pcs', price: 36.00,cost: 22.00,status: 'out',  margin: 39 },
  { sku: 'TLE-CER-30', name: 'Ceramic tile 30x30 cream',     cat: 'Building',      brand: 'Stratos', loc: 'H-04-2', qty: 4_280,unit: 'pcs', price: 1.20, cost: 0.55, status: 'in',   margin: 54 },
  { sku: 'INS-RW-12',  name: 'Rockwool insulation 1.2m roll',cat: 'Insulation',    brand: 'Stratos', loc: 'H-11-3', qty: 44,   unit: 'roll',price: 64.00,cost: 38.00,status: 'in',   margin: 41 },
];

const LOW_STOCK = PRODUCTS.filter(p => p.status === 'low' || p.status === 'out').slice(0, 6);

const ACTIVITY = [
  { who: 'Maria L.',  what: 'fulfilled SO-10283', detail: 'Northwind Industrial · $11,240.00', when: '12m ago', type: 'sale' },
  { who: 'Auto',      what: 'low stock alert',     detail: 'LED T8 tube — 96 below threshold 120', when: '38m ago', type: 'adjust' },
  { who: 'Daniel K.', what: 'received GRN-4421',   detail: 'Polyflo · 18 line items',         when: '1h ago', type: 'purchase' },
  { who: 'Maria L.',  what: 'created SO-10284',    detail: 'Atlas Hardware Co. · $4,812.40',  when: '1h ago', type: 'create' },
  { who: 'System',    what: 'reorder suggested',   detail: '4 SKUs below reorder point',      when: '2h ago', type: 'update' },
  { who: 'Priya S.',  what: 'paid bill BILL-882',  detail: 'IronGrip · $4,200.00',            when: '3h ago', type: 'sale' },
  { who: 'Daniel K.', what: 'stock transfer T-219',detail: 'Warehouse A → B · 64 items',      when: '4h ago', type: 'transfer' },
];

const ACTIVITY_ICON = {
  sale:     { i: 'fa-arrow-trend-up',  c: 'var(--c-pos)',    bg: 'var(--c-pos-soft)' },
  purchase: { i: 'fa-truck',           c: 'var(--c-info)',   bg: 'var(--c-info-soft)' },
  create:   { i: 'fa-circle-plus',     c: 'var(--c-violet)', bg: 'var(--c-violet-soft)' },
  update:   { i: 'fa-pen',             c: 'var(--c-info)',   bg: 'var(--c-info-soft)' },
  adjust:   { i: 'fa-triangle-exclamation', c: 'var(--c-warn)', bg: 'var(--c-warn-soft)' },
  transfer: { i: 'fa-shuffle',         c: 'var(--c-violet)', bg: 'var(--c-violet-soft)' },
};

// POS sample
const POS_CATEGORIES = ['All', 'Fasteners', 'Plumbing', 'Electrical', 'Paint', 'Tools', 'Safety', 'Building'];
const POS_CART_SEED = [
  { sku: 'PT-WHT-5G',  name: 'Interior paint white 5 gal', price: 78.00, qty: 2 },
  { sku: 'TR-SPN-10',  name: 'Spanner set 10pc',           price: 142.00,qty: 1 },
  { sku: 'SF-GLV-NIT', name: 'Nitrile glove M (100)',      price: 18.40, qty: 6 },
];

// Invoice form sample
const INVOICE_LINES = [
  { sku: 'PVC-2-90',  desc: 'PVC elbow 2" 90°',         qty: 80, price: 3.20, tax: 7 },
  { sku: 'CB-CAT6-30',desc: 'Cat6 patch cable 30m',     qty: 12, price: 28.00,tax: 7 },
  { sku: 'LED-T8-18', desc: 'LED T8 tube 18W 4ft',      qty: 24, price: 14.50,tax: 7 },
  { sku: 'SF-GLV-NIT',desc: 'Nitrile glove M (100/box)', qty: 6, price: 18.40,tax: 7 },
];

const CUSTOMERS_TOP = [
  { name: 'Northwind Industrial',  ytd: 184_240, orders: 38, last: '2 days ago' },
  { name: 'Atlas Hardware Co.',    ytd: 142_180, orders: 52, last: 'Today' },
  { name: 'Cascade Outfitters',    ytd: 96_540,  orders: 24, last: '2 days ago' },
  { name: 'Greenleaf Foods',       ytd: 78_310,  orders: 41, last: 'Yesterday' },
  { name: 'Pioneer Logistics',     ytd: 62_400,  orders: 19, last: 'Yesterday' },
];

// Sales-vs-purchases chart series
const SP_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const SP_SALES     = [4.2,4.8,5.1,4.4,3.9,5.3,5.8,6.2,5.5,5.7,6.4,7.1,6.6,6.9,7.4,8.1,7.6,7.2,8.0,8.4,7.9,8.8,9.2,8.5,9.0,9.6,10.1,9.4,9.8,10.4];
const SP_PURCHASES = [3.4,3.6,3.8,3.5,3.1,4.0,4.3,4.6,4.1,4.2,4.7,5.2,4.8,5.0,5.3,5.7,5.4,5.1,5.6,5.9,5.5,6.1,6.4,5.9,6.2,6.6,6.9,6.5,6.7,7.0];

// Stock-by-category donut
const CAT_BREAKDOWN = [
  { cat: 'Electrical', value: 28, color: 'var(--c-info)' },
  { cat: 'Fasteners',  value: 18, color: 'var(--brand)' },
  { cat: 'Tools',      value: 16, color: 'var(--c-violet)' },
  { cat: 'Building',   value: 14, color: 'var(--c-warn)' },
  { cat: 'Plumbing',   value: 10, color: 'var(--c-pos)' },
  { cat: 'Other',      value: 14, color: 'oklch(0.7 0.02 270)' },
];

window.WMS = {
  MODULES, NAV, PAGE_TO_MODULE, fmtMoney,
  KPIS, RECENT_ORDERS, STATUS_PILL, PRODUCTS, LOW_STOCK,
  ACTIVITY, ACTIVITY_ICON,
  POS_CATEGORIES, POS_CART_SEED, INVOICE_LINES, CUSTOMERS_TOP,
  SP_DAYS, SP_SALES, SP_PURCHASES, CAT_BREAKDOWN,
};
