/* global React */
// Page configs for the ~30 list-style modules. Each config is rendered by
// the shared <ListPage cfg=... /> component. The "purpose" banner is the
// "what this menu is for" line that helps users understand each module.

const { fmtMoney } = window.WMS;

/* ============================================================
   Shared entity rows (kept consistent across pages)
   ============================================================ */
const SUPPLIER_NAMES = [
  'Polyflo Industries', 'IronGrip Tools Co.', 'Lumio Electrical',
  'Atlas Fasteners', 'Cascade Lumber Supply', 'Beacon Paint Works',
  'GuardPro Safety', 'Hydrox Pumps', 'BondTek Adhesives',
  'PowerCell Energy', 'Stratos Building Materials',
];
const CUSTOMER_NAMES = [
  'Atlas Hardware Co.', 'Northwind Industrial', 'Pioneer Logistics',
  'Greenleaf Foods', 'Cascade Outfitters', 'Beacon Hospitality',
  'Mercer Construction', 'Halcyon Retail', 'Bluefin Marine Co.',
  'Riverbend Plumbing',
];
const USERS = [
  { name: 'Maria Rodriguez', initials: 'MR', color: 'oklch(0.62 0.20 30)'  },
  { name: 'Daniel Kang',     initials: 'DK', color: 'oklch(0.60 0.16 240)' },
  { name: 'Priya Shah',      initials: 'PS', color: 'oklch(0.65 0.18 320)' },
  { name: 'Liam Chen',       initials: 'LC', color: 'oklch(0.60 0.15 160)' },
  { name: 'Aria Volkov',     initials: 'AV', color: 'oklch(0.66 0.14 200)' },
];

const dayAgo = (n) => n === 0 ? 'Today' : n === 1 ? 'Yesterday' : n + ' days ago';

/* ============================================================
   VENDORS module
   ============================================================ */
const purchases = {
  title: 'Purchase Orders',
  subtitle: 'Approved buys committed to suppliers — the source of truth for what you owe before goods arrive.',
  purpose: 'A purchase order is your formal commitment to a supplier. Once approved it locks the price and quantity, and is the document that incoming goods receipts (GRNs) and supplier invoices are reconciled against — the classic three-way match.',
  actions: [
    { label: 'Export',  icon: 'fa-download' },
    { label: 'New PO',  icon: 'fa-plus', primary: true, pageId: 'new-po' },
  ],
  kpis: [
    { label: 'Open POs',         value: 28,      sublabel: 'across 11 suppliers' },
    { label: 'Awaiting receipt', value: 18,      sublabel: '4 overdue', color: 'var(--c-warn)' },
    { label: 'Spend MTD',        value: 86_420,  money: true, delta: +12.4, sublabel: 'vs last month' },
    { label: 'Avg cycle time',   value: '4.2 d', sublabel: 'PO → received' },
  ],
  tabs: [
    { id: 'all',     label: 'All',          count: 32 },
    { id: 'draft',   label: 'Drafts',       count: 3,  filter: r => r.status === 'draft' },
    { id: 'pending', label: 'Pending approval', count: 4, filter: r => r.status === 'pending' },
    { id: 'open',    label: 'Open',         count: 18, filter: r => r.status === 'sent' || r.status === 'partial' },
    { id: 'closed',  label: 'Closed',       count: 7,  filter: r => r.status === 'received' || r.status === 'cancelled' },
  ],
  filters: [['All warehouses','Warehouse A','Warehouse B','Yard'], ['All buyers','Maria R.','Daniel K.','Priya S.']],
  searchPlaceholder: 'Search PO #, supplier, SKU…',
  columns: [
    { key: 'id',       label: 'PO #',     type: 'id' },
    { key: 'date',     label: 'Issued',   type: 'date' },
    { key: 'supplier', label: 'Supplier', type: 'avatar' },
    { key: 'expected', label: 'Expected delivery', type: 'date' },
    { key: 'items',    label: 'Received', type: 'progress' },
    { key: 'value',    label: 'Total',    type: 'money', align: 'right', dp: 2 },
    { key: 'status',   label: 'Status',   type: 'pill',
      tone: v => ({draft:'muted',pending:'warn',sent:'info',partial:'warn',received:'pos',cancelled:'muted'})[v] || 'muted' },
  ],
  rows: [
    { id: 'PO-2285', date: 'Today',        supplier: 'Stratos Building Materials', expected: 'Tomorrow',   items: { done: 0,  total: 42 }, value: 18_240.00, status: 'sent' },
    { id: 'PO-2284', date: 'Today',        supplier: 'Polyflo Industries',         expected: 'Today',      items: { done: 18, total: 18 }, value: 4_812.00,  status: 'received' },
    { id: 'PO-2283', date: 'Yesterday',    supplier: 'IronGrip Tools Co.',         expected: 'Today',      items: { done: 22, total: 24 }, value: 11_240.00, status: 'partial' },
    { id: 'PO-2282', date: 'Yesterday',    supplier: 'IronGrip Tools Co.',         expected: 'May 14',     items: { done: 0,  total: 12 }, value: 5_280.00,  status: 'sent' },
    { id: 'PO-2281', date: '2 days ago',   supplier: 'Lumio Electrical',           expected: 'Yesterday',  items: { done: 36, total: 36 }, value: 8_120.50,  status: 'received' },
    { id: 'PO-2280', date: '2 days ago',   supplier: 'Atlas Fasteners',            expected: 'Yesterday',  items: { done: 12, total: 12 }, value: 2_408.40,  status: 'received' },
    { id: 'PO-2279', date: '3 days ago',   supplier: 'Cascade Lumber Supply',      expected: 'Jun 02',     items: { done: 0,  total: 28 }, value: 14_240.00, status: 'pending' },
    { id: 'PO-2278', date: '3 days ago',   supplier: 'Cascade Lumber Supply',      expected: '2 days ago', items: { done: 8,  total: 14 }, value: 6_840.00,  status: 'partial' },
    { id: 'PO-2277', date: '4 days ago',   supplier: 'Beacon Paint Works',         expected: '2 days ago', items: { done: 24, total: 24 }, value: 3_120.80,  status: 'received' },
    { id: 'PO-2276', date: '5 days ago',   supplier: 'GuardPro Safety',            expected: '3 days ago', items: { done: 60, total: 60 }, value: 1_104.00,  status: 'received' },
    { id: 'PO-2275', date: '6 days ago',   supplier: 'BondTek Adhesives',          expected: 'May 28',     items: { done: 0,  total: 18 }, value: 1_240.00,  status: 'draft' },
    { id: 'PO-2274', date: '7 days ago',   supplier: 'Hydrox Pumps',               expected: '4 days ago', items: { done: 4,  total: 4 },  value: 1_640.00,  status: 'received' },
    { id: 'PO-2273', date: '7 days ago',   supplier: 'PowerCell Energy',           expected: 'May 16',     items: { done: 0,  total: 24 }, value: 4_180.00,  status: 'pending' },
    { id: 'PO-2272', date: '8 days ago',   supplier: 'Lumio Electrical',           expected: 'Cancelled',  items: { done: 0,  total: 0 },  value: 0,         status: 'cancelled' },
  ],
};

const purchaseInvoices = {
  title: 'Purchase Invoices',
  subtitle: 'Supplier-issued invoices waiting to become bills after three-way match.',
  purpose: 'Purchase invoices are the documents your suppliers send you. Before they become payable bills they must match the related purchase order and goods receipt. Discrepancies (price, quantity, tax) live here until resolved.',
  actions: [
    { label: 'OCR upload', icon: 'fa-cloud-arrow-up' },
    { label: 'Export', icon: 'fa-download' },
    { label: 'New invoice', icon: 'fa-plus', primary: true, pageId: 'new-purchase-invoice' },
  ],
  kpis: [
    { label: 'Awaiting match',    value: 12,     sublabel: '3 with price discrepancy', color: 'var(--c-warn)' },
    { label: 'Ready to bill',     value: 7,      sublabel: 'matched & approved' },
    { label: 'Total this month',  value: 124_840, money: true, delta: +8.2, sublabel: 'vs last month' },
    { label: 'OCR queue',         value: 4,      sublabel: 'parsing in progress' },
  ],
  tabs: [
    { id: 'all',       label: 'All',          count: 23 },
    { id: 'unmatched', label: 'Awaiting match', count: 12, filter: r => r.match === 'pending' || r.match === 'mismatch' },
    { id: 'matched',   label: 'Matched',      count: 7,  filter: r => r.match === 'matched' },
    { id: 'billed',    label: 'Billed',       count: 4,  filter: r => r.match === 'billed' },
  ],
  filters: [['All suppliers', ...SUPPLIER_NAMES.slice(0,5)]],
  columns: [
    { key: 'id',      label: 'Invoice #', type: 'id' },
    { key: 'date',    label: 'Date',      type: 'date' },
    { key: 'supplier',label: 'Supplier',  type: 'avatar' },
    { key: 'po',      label: 'PO ref',    type: 'id' },
    { key: 'match',   label: 'Match',     type: 'pill',
      tone: v => ({matched:'pos', pending:'warn', mismatch:'neg', billed:'info'})[v] },
    { key: 'due',     label: 'Due',       type: 'date' },
    { key: 'value',   label: 'Amount',    type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { id: 'INV-S-9924', date: 'Today',     supplier: 'Polyflo Industries', po: 'PO-2284', match: 'matched',  due: 'Jun 14', value: 4_812.00 },
    { id: 'INV-S-9923', date: 'Today',     supplier: 'IronGrip Tools Co.', po: 'PO-2283', match: 'mismatch', due: 'Jun 14', value: 11_240.00 },
    { id: 'INV-S-9922', date: 'Yesterday', supplier: 'Lumio Electrical',   po: 'PO-2281', match: 'matched',  due: 'Jun 13', value: 8_120.50 },
    { id: 'INV-S-9921', date: 'Yesterday', supplier: 'Atlas Fasteners',    po: 'PO-2280', match: 'billed',   due: 'Jun 13', value: 2_408.40 },
    { id: 'INV-S-9920', date: '2 days ago',supplier: 'Cascade Lumber Supply',po: 'PO-2278',match: 'pending', due: 'Jun 12', value: 6_840.00 },
    { id: 'INV-S-9919', date: '2 days ago',supplier: 'Beacon Paint Works', po: 'PO-2277', match: 'billed',   due: 'Jun 12', value: 3_120.80 },
    { id: 'INV-S-9918', date: '3 days ago',supplier: 'GuardPro Safety',    po: 'PO-2276', match: 'matched',  due: 'Jun 11', value: 1_104.00 },
    { id: 'INV-S-9917', date: '4 days ago',supplier: 'Hydrox Pumps',       po: 'PO-2274', match: 'pending',  due: 'Jun 10', value: 1_640.00 },
    { id: 'INV-S-9916', date: '5 days ago',supplier: 'Polyflo Industries', po: 'PO-2275', match: 'billed',   due: 'Jun 09', value: 5_240.00 },
  ],
};

const debitNotes = {
  title: 'Debit Notes',
  subtitle: 'Money you claim back from a supplier — damaged stock, short shipments, returns.',
  purpose: 'When a supplier under-delivers or sends damaged goods, a debit note formally reduces what you owe them. Each note links to the originating GRN and is offset against future bills or refunded.',
  actions: [
    { label: 'Export', icon: 'fa-download' },
    { label: 'New debit note', icon: 'fa-plus', primary: true, pageId: 'new-debit-note' },
  ],
  kpis: [
    { label: 'Open notes',     value: 4,      sublabel: 'awaiting credit' },
    { label: 'Open value',     value: 1_840,  money: true, sublabel: 'to recover' },
    { label: 'Recovered YTD',  value: 14_280, money: true, delta: -2.1, sublabel: 'vs last year' },
    { label: 'Top reason',     value: 'Damaged', sublabel: '42% of cases' },
  ],
  tabs: [
    { id: 'all',    label: 'All',      count: 12 },
    { id: 'open',   label: 'Open',     count: 4, filter: r => r.status === 'open' },
    { id: 'applied',label: 'Applied',  count: 6, filter: r => r.status === 'applied' },
    { id: 'closed', label: 'Closed',   count: 2, filter: r => r.status === 'closed' },
  ],
  columns: [
    { key: 'id',      label: 'Note #',   type: 'id' },
    { key: 'date',    label: 'Issued',   type: 'date' },
    { key: 'supplier',label: 'Supplier', type: 'avatar' },
    { key: 'grn',     label: 'Source GRN', type: 'id' },
    { key: 'reason',  label: 'Reason',   type: 'tag' },
    { key: 'status',  label: 'Status',   type: 'pill',
      tone: v => ({open:'warn',applied:'info',closed:'pos'})[v] },
    { key: 'value',   label: 'Amount',   type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { id: 'DN-0184', date: 'Today',     supplier: 'Lumio Electrical',     grn: 'GRN-4426', reason: 'Damaged',     status: 'open',    value: 320.00 },
    { id: 'DN-0183', date: 'Yesterday', supplier: 'IronGrip Tools Co.',   grn: 'GRN-4427', reason: 'Short ship',  status: 'open',    value: 480.00 },
    { id: 'DN-0182', date: '2 days ago',supplier: 'Cascade Lumber Supply',grn: 'GRN-4424', reason: 'Quality',     status: 'open',    value: 640.00 },
    { id: 'DN-0181', date: '3 days ago',supplier: 'Polyflo Industries',   grn: 'GRN-4423', reason: 'Damaged',     status: 'open',    value: 400.00 },
    { id: 'DN-0180', date: '5 days ago',supplier: 'Beacon Paint Works',   grn: 'GRN-4422', reason: 'Wrong item',  status: 'applied', value: 280.00 },
    { id: 'DN-0179', date: '6 days ago',supplier: 'Hydrox Pumps',         grn: 'GRN-4420', reason: 'Damaged',     status: 'applied', value: 820.00 },
    { id: 'DN-0178', date: '1 wk ago',  supplier: 'Atlas Fasteners',      grn: 'GRN-4419', reason: 'Short ship',  status: 'applied', value: 140.00 },
    { id: 'DN-0177', date: '2 wks ago', supplier: 'GuardPro Safety',      grn: 'GRN-4415', reason: 'Quality',     status: 'closed',  value: 90.00 },
  ],
};

const bills = {
  title: 'Bills',
  subtitle: 'Everything you owe — paid, due, overdue. Drives next week\'s payment run.',
  purpose: 'Bills are payable obligations to anyone — suppliers, utilities, landlords, contractors. They drive cash-out forecasting and the weekly payment run. Pay singly, batch by due date, or schedule recurring runs.',
  actions: [
    { label: 'Schedule run', icon: 'fa-calendar-plus', pageId: 'run-payments' },
    { label: 'New bill', icon: 'fa-plus', primary: true, pageId: 'new-bill' },
  ],
  kpis: [
    { label: 'Due this week', value: 42_180, money: true, sublabel: '11 bills', color: 'var(--c-warn)' },
    { label: 'Overdue',       value: 8_240,  money: true, sublabel: '3 bills', color: 'var(--c-neg)' },
    { label: 'Scheduled',     value: 28_400, money: true, sublabel: 'next Mon batch' },
    { label: 'Avg DPO',       value: '32 d', sublabel: 'days payable outstanding' },
  ],
  tabs: [
    { id: 'all',     label: 'All',       count: 38 },
    { id: 'due',     label: 'Due soon',  count: 11, filter: r => r.status === 'due' },
    { id: 'overdue', label: 'Overdue',   count: 3,  filter: r => r.status === 'overdue' },
    { id: 'paid',    label: 'Paid',      count: 24, filter: r => r.status === 'paid' },
  ],
  columns: [
    { key: 'id',      label: 'Bill #',   type: 'id' },
    { key: 'payee',   label: 'Payee',    type: 'avatar' },
    { key: 'cat',     label: 'Category', type: 'tag' },
    { key: 'date',    label: 'Date',     type: 'date' },
    { key: 'due',     label: 'Due',      type: 'date' },
    { key: 'status',  label: 'Status',   type: 'pill',
      tone: v => ({paid:'pos',due:'warn',overdue:'neg',scheduled:'info'})[v] },
    { key: 'value',   label: 'Amount',   type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { id: 'BILL-0884', payee: 'Polyflo Industries',      cat: 'Goods',       date: 'Today',     due: 'Jun 14',   status: 'due',       value: 4_812.00 },
    { id: 'BILL-0883', payee: 'PG&E Utilities',          cat: 'Utilities',   date: 'Today',     due: 'May 30',   status: 'due',       value: 1_840.00 },
    { id: 'BILL-0882', payee: 'IronGrip Tools Co.',      cat: 'Goods',       date: 'Yesterday', due: 'Jun 13',   status: 'scheduled', value: 11_240.00 },
    { id: 'BILL-0881', payee: 'Cascade Property Mgmt',   cat: 'Rent',        date: 'Yesterday', due: 'Jun 01',   status: 'due',       value: 8_400.00 },
    { id: 'BILL-0880', payee: 'AT&T Business',           cat: 'Utilities',   date: '2 days ago',due: 'May 22',   status: 'overdue',   value: 320.00 },
    { id: 'BILL-0879', payee: 'Lumio Electrical',        cat: 'Goods',       date: '3 days ago',due: 'Jun 12',   status: 'paid',      value: 8_120.50 },
    { id: 'BILL-0878', payee: 'Atlas Fasteners',         cat: 'Goods',       date: '3 days ago',due: 'Jun 12',   status: 'paid',      value: 2_408.40 },
    { id: 'BILL-0877', payee: 'FreshPay Payroll Svc',    cat: 'Services',    date: '4 days ago',due: 'May 24',   status: 'overdue',   value: 1_240.00 },
    { id: 'BILL-0876', payee: 'AWS Cloud',               cat: 'Subscription',date: '5 days ago',due: 'Jun 04',   status: 'scheduled', value: 1_840.00 },
    { id: 'BILL-0875', payee: 'GuardPro Safety',         cat: 'Goods',       date: '6 days ago',due: 'Jun 09',   status: 'paid',      value: 1_104.00 },
    { id: 'BILL-0874', payee: 'Beacon Paint Works',      cat: 'Goods',       date: '6 days ago',due: 'Jun 09',   status: 'paid',      value: 3_120.80 },
    { id: 'BILL-0873', payee: 'Sterling Insurance',      cat: 'Insurance',   date: '1 wk ago',  due: 'May 20',   status: 'overdue',   value: 6_680.00 },
  ],
};

const suppliers = {
  title: 'Suppliers',
  subtitle: 'Vendor master list — terms, performance, balance owed, contact people.',
  purpose: 'The supplier master is the source of truth for everyone you buy from. Each row links to their orders, bills, performance metrics (on-time %, defect rate), and credit terms. Open a supplier to see their full ledger.',
  actions: [
    { label: 'Import',  icon: 'fa-upload' },
    { label: 'Export',  icon: 'fa-download' },
    { label: 'New supplier', icon: 'fa-plus', primary: true, pageId: 'new-supplier' },
  ],
  kpis: [
    { label: 'Active suppliers', value: 84,        sublabel: '6 added this quarter' },
    { label: 'AP owed',          value: 142_840,  money: true, sublabel: 'across 38 bills' },
    { label: 'On-time delivery', value: '94.2%',   delta: +1.8, sublabel: 'last 90 days' },
    { label: 'Top vendor',       value: 'Polyflo', sublabel: '$184k YTD spend' },
  ],
  tabs: [
    { id: 'all',    label: 'All',          count: 84 },
    { id: 'active', label: 'Active',       count: 78, filter: r => r.status === 'active' },
    { id: 'hold',   label: 'On hold',      count: 4,  filter: r => r.status === 'hold' },
    { id: 'inactive',label:'Inactive',     count: 2,  filter: r => r.status === 'inactive' },
  ],
  filters: [['All categories','Hardware','Electrical','Plumbing','Tools','Services']],
  columns: [
    { key: 'code',    label: 'Code',     type: 'id' },
    { key: 'name',    label: 'Supplier', type: 'avatar' },
    { key: 'contact', label: 'Primary contact', type: 'user' },
    { key: 'terms',   label: 'Terms',    type: 'tag' },
    { key: 'orders',  label: 'Open POs', type: 'num', align: 'right' },
    { key: 'owed',    label: 'AP owed',  type: 'money', align: 'right', dp: 0 },
    { key: 'ontime',  label: 'On-time',  type: 'jsx', render: r => (
      <span className="row gap-2" style={{ justifyContent: 'flex-end', minWidth: 90 }}>
        <span className="mono fw-6" style={{ color: r.ontime >= 95 ? 'var(--c-pos)' : r.ontime >= 85 ? 'var(--c-warn)' : 'var(--c-neg)' }}>{r.ontime}%</span>
      </span>
    ), align: 'right' },
    { key: 'status',  label: 'Status',   type: 'pill',
      tone: v => ({active:'pos',hold:'warn',inactive:'muted'})[v] },
  ],
  rows: [
    { code: 'SUP-001', name: 'Polyflo Industries',         contact: { name: 'Sarah Wells',  initials: 'SW', color: 'oklch(0.62 0.16 240)' }, terms: 'Net 30', orders: 4, owed: 24_810, ontime: 97, status: 'active' },
    { code: 'SUP-002', name: 'IronGrip Tools Co.',         contact: { name: 'Tom Becker',   initials: 'TB', color: 'oklch(0.65 0.18 60)' },  terms: 'Net 45', orders: 2, owed: 16_540, ontime: 92, status: 'active' },
    { code: 'SUP-003', name: 'Lumio Electrical',           contact: { name: 'Inez Park',    initials: 'IP', color: 'oklch(0.60 0.17 320)' }, terms: 'Net 30', orders: 3, owed: 8_120,  ontime: 88, status: 'active' },
    { code: 'SUP-004', name: 'Atlas Fasteners',            contact: { name: 'Joe Martinez', initials: 'JM', color: 'oklch(0.65 0.15 180)' }, terms: 'Net 15', orders: 1, owed: 2_408,  ontime: 98, status: 'active' },
    { code: 'SUP-005', name: 'Cascade Lumber Supply',      contact: { name: 'Ana Whitmore', initials: 'AW', color: 'oklch(0.60 0.15 140)' }, terms: 'COD',    orders: 2, owed: 14_240, ontime: 81, status: 'hold' },
    { code: 'SUP-006', name: 'Beacon Paint Works',         contact: { name: 'Rick Owens',   initials: 'RO', color: 'oklch(0.60 0.18 30)' },  terms: 'Net 30', orders: 0, owed: 0,      ontime: 96, status: 'active' },
    { code: 'SUP-007', name: 'GuardPro Safety',            contact: { name: 'Mei Lin',      initials: 'ML', color: 'oklch(0.66 0.14 260)' }, terms: 'Net 60', orders: 0, owed: 0,      ontime: 99, status: 'active' },
    { code: 'SUP-008', name: 'Hydrox Pumps',               contact: { name: 'Carl Vogel',   initials: 'CV', color: 'oklch(0.60 0.16 220)' }, terms: 'Net 30', orders: 1, owed: 1_640,  ontime: 93, status: 'active' },
    { code: 'SUP-009', name: 'BondTek Adhesives',          contact: { name: 'Yael Stein',   initials: 'YS', color: 'oklch(0.62 0.18 340)' }, terms: 'Net 30', orders: 1, owed: 1_240,  ontime: 90, status: 'active' },
    { code: 'SUP-010', name: 'PowerCell Energy',           contact: { name: 'Mark Tao',     initials: 'MT', color: 'oklch(0.62 0.14 200)' }, terms: 'Net 45', orders: 1, owed: 4_180,  ontime: 86, status: 'active' },
    { code: 'SUP-011', name: 'Stratos Building Materials', contact: { name: 'Iris Nakata',  initials: 'IN', color: 'oklch(0.60 0.18 280)' }, terms: 'Net 30', orders: 1, owed: 18_240, ontime: 94, status: 'active' },
    { code: 'SUP-038', name: 'WestEdge Logistics',         contact: { name: 'Dan Pruitt',   initials: 'DP', color: 'oklch(0.55 0.04 270)' }, terms: 'Net 30', orders: 0, owed: 0,      ontime: 72, status: 'hold' },
  ],
};

/* ============================================================
   CUSTOMERS module
   ============================================================ */
const estimates = {
  title: 'Estimates',
  subtitle: 'Price quotes sent to customers — convert accepted ones into sales orders in one click.',
  purpose: 'An estimate is a non-binding price quote. The customer accepts, declines, or asks for revisions; on acceptance it becomes a sales order with no re-entry. Win rate and time-to-decision are tracked here.',
  actions: [
    { label: 'Export', icon: 'fa-download' },
    { label: 'New estimate', icon: 'fa-plus', primary: true, pageId: 'new-estimate' },
  ],
  kpis: [
    { label: 'Open estimates', value: 18,     sublabel: '$84k in pipeline' },
    { label: 'Win rate',       value: '62%',  delta: +4.2, sublabel: 'last 30 days' },
    { label: 'Avg cycle',      value: '3.4 d',sublabel: 'send → accept' },
    { label: 'Expiring',       value: 4,      sublabel: 'in next 7 days',  color: 'var(--c-warn)' },
  ],
  tabs: [
    { id: 'all',      label: 'All',         count: 32 },
    { id: 'draft',    label: 'Drafts',      count: 3, filter: r => r.status === 'draft' },
    { id: 'sent',     label: 'Sent',        count: 14, filter: r => r.status === 'sent' },
    { id: 'accepted', label: 'Accepted',    count: 11, filter: r => r.status === 'accepted' },
    { id: 'declined', label: 'Declined',    count: 4, filter: r => r.status === 'declined' },
  ],
  columns: [
    { key: 'id',     label: 'Estimate #', type: 'id' },
    { key: 'date',   label: 'Sent',       type: 'date' },
    { key: 'cust',   label: 'Customer',   type: 'avatar' },
    { key: 'expires',label: 'Expires',    type: 'date' },
    { key: 'rep',    label: 'Sales rep',  type: 'user' },
    { key: 'value',  label: 'Total',      type: 'money', align: 'right', dp: 2 },
    { key: 'status', label: 'Status',     type: 'pill',
      tone: v => ({draft:'muted',sent:'info',accepted:'pos',declined:'neg'})[v] },
  ],
  rows: [
    { id: 'EST-0421', date: 'Today',     cust: 'Mercer Construction', expires: 'Jun 05',   rep: USERS[0], value: 14_240.00, status: 'sent' },
    { id: 'EST-0420', date: 'Today',     cust: 'Northwind Industrial',expires: 'Jun 05',   rep: USERS[2], value: 28_400.00, status: 'sent' },
    { id: 'EST-0419', date: 'Yesterday', cust: 'Atlas Hardware Co.',  expires: 'Jun 04',   rep: USERS[0], value: 4_812.40,  status: 'accepted' },
    { id: 'EST-0418', date: 'Yesterday', cust: 'Pioneer Logistics',   expires: 'Jun 04',   rep: USERS[3], value: 920.50,    status: 'draft' },
    { id: 'EST-0417', date: '2 days ago',cust: 'Greenleaf Foods',     expires: 'Jun 02',   rep: USERS[2], value: 2_104.00,  status: 'accepted' },
    { id: 'EST-0416', date: '3 days ago',cust: 'Halcyon Retail',      expires: 'May 28',   rep: USERS[0], value: 1_640.00,  status: 'declined' },
    { id: 'EST-0415', date: '4 days ago',cust: 'Cascade Outfitters',  expires: 'May 30',   rep: USERS[3], value: 7_680.25,  status: 'sent' },
    { id: 'EST-0414', date: '5 days ago',cust: 'Beacon Hospitality',  expires: 'May 28',   rep: USERS[0], value: 540.00,    status: 'sent' },
    { id: 'EST-0413', date: '6 days ago',cust: 'Bluefin Marine Co.',  expires: 'May 26',   rep: USERS[2], value: 11_280.00, status: 'accepted' },
    { id: 'EST-0412', date: '1 wk ago',  cust: 'Riverbend Plumbing',  expires: 'May 24',   rep: USERS[3], value: 3_280.10,  status: 'declined' },
  ],
};

const saleInvoices = {
  title: 'Sale Invoices',
  subtitle: 'Invoices you have issued to customers — paid, due, overdue, partial.',
  purpose: 'Sale invoices are the customer-facing demands for payment generated from sales orders. The status flows draft → sent → paid; partial payments and overdue collection live here too.',
  actions: [
    { label: 'Send reminders', icon: 'fa-envelope' },
    { label: 'New invoice', icon: 'fa-plus', primary: true, pageId: 'new-invoice' },
  ],
  kpis: [
    { label: 'Outstanding',   value: 48_120, money: true, sublabel: '24 invoices' },
    { label: 'Overdue',       value: 12_840, money: true, sublabel: '8 invoices', color: 'var(--c-neg)' },
    { label: 'Avg DSO',       value: '28 d', delta: -2.4, sublabel: 'days sales outstanding' },
    { label: 'Collected MTD', value: 184_240,money: true, delta: +6.8, sublabel: 'vs last month' },
  ],
  tabs: [
    { id: 'all',     label: 'All',     count: 76 },
    { id: 'draft',   label: 'Drafts',  count: 4,  filter: r => r.status === 'draft' },
    { id: 'open',    label: 'Open',    count: 24, filter: r => r.status === 'pending' || r.status === 'partial' },
    { id: 'overdue', label: 'Overdue', count: 8,  filter: r => r.status === 'overdue' },
    { id: 'paid',    label: 'Paid',    count: 40, filter: r => r.status === 'paid' },
  ],
  columns: [
    { key: 'id',     label: 'Invoice #', type: 'id' },
    { key: 'date',   label: 'Issued',    type: 'date' },
    { key: 'cust',   label: 'Customer',  type: 'avatar' },
    { key: 'due',    label: 'Due',       type: 'date' },
    { key: 'pay',    label: 'Paid',      type: 'progress' },
    { key: 'value',  label: 'Amount',    type: 'money', align: 'right', dp: 2 },
    { key: 'status', label: 'Status',    type: 'pill',
      tone: v => ({draft:'muted',pending:'info',partial:'warn',paid:'pos',overdue:'neg'})[v] },
  ],
  rows: [
    { id: 'INV-3082', date: 'Today',     cust: 'Atlas Hardware Co.',   due: 'Jun 14', pay: { done: 4_812.40, total: 4_812.40 }, value: 4_812.40,  status: 'paid' },
    { id: 'INV-3081', date: 'Today',     cust: 'Northwind Industrial', due: 'Jun 14', pay: { done: 0,        total: 11_240 },    value: 11_240.00, status: 'pending' },
    { id: 'INV-3080', date: 'Yesterday', cust: 'Pioneer Logistics',    due: 'Jun 13', pay: { done: 0,        total: 920.50 },    value: 920.50,    status: 'pending' },
    { id: 'INV-3079', date: 'Yesterday', cust: 'Greenleaf Foods',      due: 'Jun 13', pay: { done: 2_104,    total: 2_104 },     value: 2_104.00,  status: 'paid' },
    { id: 'INV-3078', date: '2 days ago',cust: 'Cascade Outfitters',   due: 'Jun 12', pay: { done: 4_000,    total: 7_680.25 },  value: 7_680.25,  status: 'partial' },
    { id: 'INV-3077', date: '4 days ago',cust: 'Beacon Hospitality',   due: 'May 25', pay: { done: 0,        total: 540 },       value: 540.00,    status: 'overdue' },
    { id: 'INV-3076', date: '5 days ago',cust: 'Atlas Hardware Co.',   due: 'May 24', pay: { done: 0,        total: 3_280 },     value: 3_280.10,  status: 'overdue' },
    { id: 'INV-3075', date: '6 days ago',cust: 'Halcyon Retail',       due: 'Jun 09', pay: { done: 1_240,    total: 1_240 },     value: 1_240.00,  status: 'paid' },
    { id: 'INV-3074', date: '1 wk ago',  cust: 'Bluefin Marine Co.',   due: 'May 20', pay: { done: 0,        total: 11_280 },    value: 11_280.00, status: 'overdue' },
    { id: 'INV-3073', date: '1 wk ago',  cust: 'Mercer Construction',  due: 'May 22', pay: { done: 8_000,    total: 14_240 },    value: 14_240.00, status: 'partial' },
    { id: 'INV-3072', date: '2 wks ago', cust: 'Riverbend Plumbing',   due: 'May 12', pay: { done: 0,        total: 3_280 },     value: 3_280.10,  status: 'overdue' },
    { id: 'INV-3071', date: '2 wks ago', cust: 'Greenleaf Foods',      due: 'May 28', pay: { done: 0,        total: 0 },         value: 0,         status: 'draft' },
  ],
};

const salesReceipts = {
  title: 'Payments received',
  subtitle: 'Money in — cash, check, card, wire and ACH receipts applied to invoices.',
  purpose: 'Every customer payment lands here, whether direct (cash/card) or matched from a bank deposit. Each receipt applies against one or more invoices and feeds the cash position on your dashboard.',
  actions: [
    { label: 'Record payment', icon: 'fa-plus', primary: true, pageId: 'new-payment' },
  ],
  kpis: [
    { label: 'Received today', value: 8_240,  money: true, sublabel: '6 receipts' },
    { label: 'This month',     value: 184_240,money: true, delta: +6.8, sublabel: 'vs last month' },
    { label: 'Unapplied',      value: 2_100,  money: true, sublabel: '2 receipts', color: 'var(--c-warn)' },
    { label: 'Top method',     value: 'ACH',  sublabel: '64% of volume' },
  ],
  tabs: [
    { id: 'all',       label: 'All',       count: 48 },
    { id: 'unapplied', label: 'Unapplied', count: 2,  filter: r => r.applied === 'no' },
    { id: 'applied',   label: 'Applied',   count: 46, filter: r => r.applied === 'yes' },
  ],
  columns: [
    { key: 'id',     label: 'Receipt #', type: 'id' },
    { key: 'date',   label: 'Date',      type: 'date' },
    { key: 'cust',   label: 'From',      type: 'avatar' },
    { key: 'method', label: 'Method',    type: 'tag' },
    { key: 'inv',    label: 'Applies to',type: 'id' },
    { key: 'applied',label: 'Applied',   type: 'pill',
      tone: v => ({yes:'pos',no:'warn'})[v] },
    { key: 'value',  label: 'Amount',    type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { id: 'RCP-1240', date: 'Today',     cust: 'Atlas Hardware Co.',   method: 'ACH',   inv: 'INV-3082', applied: 'yes', value: 4_812.40 },
    { id: 'RCP-1239', date: 'Today',     cust: 'Greenleaf Foods',      method: 'Card',  inv: 'INV-3079', applied: 'yes', value: 2_104.00 },
    { id: 'RCP-1238', date: 'Today',     cust: 'Halcyon Retail',       method: 'ACH',   inv: 'INV-3075', applied: 'yes', value: 1_240.00 },
    { id: 'RCP-1237', date: 'Today',     cust: 'Cascade Outfitters',   method: 'Wire',  inv: 'INV-3078', applied: 'yes', value: 4_000.00 },
    { id: 'RCP-1236', date: 'Yesterday', cust: 'Mercer Construction',  method: 'Check', inv: 'INV-3073', applied: 'yes', value: 8_000.00 },
    { id: 'RCP-1235', date: 'Yesterday', cust: 'Unknown deposit',      method: 'ACH',   inv: '—',         applied: 'no',  value: 1_400.00 },
    { id: 'RCP-1234', date: '2 days ago',cust: 'Pioneer Logistics',    method: 'Card',  inv: 'INV-3070', applied: 'yes', value: 920.50 },
    { id: 'RCP-1233', date: '3 days ago',cust: 'Beacon Hospitality',   method: 'Cash',  inv: 'INV-3069', applied: 'yes', value: 320.00 },
    { id: 'RCP-1232', date: '3 days ago',cust: 'Unmatched wire',       method: 'Wire',  inv: '—',         applied: 'no',  value: 700.00 },
  ],
};

const creditNotes = {
  title: 'Credit Notes',
  subtitle: 'Refunds and post-sale adjustments issued to customers.',
  purpose: 'A credit note reverses or reduces a previously issued invoice — returns, price adjustments, goodwill credits. Apply against a future invoice or refund directly to the original payment method.',
  actions: [
    { label: 'Export', icon: 'fa-download' },
    { label: 'New credit note', icon: 'fa-plus', primary: true, pageId: 'new-credit-note' },
  ],
  kpis: [
    { label: 'Open credits',     value: 6,      sublabel: 'unapplied' },
    { label: 'Open value',       value: 4_280,  money: true, sublabel: 'to refund or apply' },
    { label: 'Issued this month',value: 18_840, money: true, sublabel: '12 notes' },
    { label: 'Refund rate',      value: '2.1%', delta: -0.4, sublabel: 'of net revenue' },
  ],
  tabs: [
    { id: 'all',     label: 'All',     count: 18 },
    { id: 'open',    label: 'Open',    count: 6,  filter: r => r.status === 'open' },
    { id: 'applied', label: 'Applied', count: 10, filter: r => r.status === 'applied' },
    { id: 'refunded',label: 'Refunded',count: 2,  filter: r => r.status === 'refunded' },
  ],
  columns: [
    { key: 'id',     label: 'Note #',   type: 'id' },
    { key: 'date',   label: 'Issued',   type: 'date' },
    { key: 'cust',   label: 'Customer', type: 'avatar' },
    { key: 'inv',    label: 'Source invoice', type: 'id' },
    { key: 'reason', label: 'Reason',   type: 'tag' },
    { key: 'status', label: 'Status',   type: 'pill',
      tone: v => ({open:'warn',applied:'info',refunded:'pos'})[v] },
    { key: 'value',  label: 'Amount',   type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { id: 'CN-0312', date: 'Today',     cust: 'Northwind Industrial', inv: 'INV-3081', reason: 'Return',     status: 'open',     value: 1_240.00 },
    { id: 'CN-0311', date: 'Yesterday', cust: 'Cascade Outfitters',   inv: 'INV-3078', reason: 'Goodwill',   status: 'open',     value: 320.00 },
    { id: 'CN-0310', date: '2 days ago',cust: 'Pioneer Logistics',    inv: 'INV-3070', reason: 'Defective',  status: 'open',     value: 480.00 },
    { id: 'CN-0309', date: '3 days ago',cust: 'Greenleaf Foods',      inv: 'INV-3060', reason: 'Price adj.', status: 'applied',  value: 140.00 },
    { id: 'CN-0308', date: '4 days ago',cust: 'Atlas Hardware Co.',   inv: 'INV-3058', reason: 'Return',     status: 'refunded', value: 820.00 },
    { id: 'CN-0307', date: '5 days ago',cust: 'Halcyon Retail',       inv: 'INV-3054', reason: 'Goodwill',   status: 'applied',  value: 200.00 },
  ],
};

const statements = {
  title: 'Statements',
  subtitle: 'Monthly customer statements — open invoices, payments applied, balance owed.',
  purpose: 'A statement summarises every transaction with a customer over a period (typically a month). Send them on the 1st to prompt payment of open invoices and surface any disputes early.',
  rowPageId: 'statement-detail',
  actions: [
    { label: 'Generate batch', icon: 'fa-bolt' },
    { label: 'Send all', icon: 'fa-envelope', primary: true, pageId: 'send-statements' },
  ],
  kpis: [
    { label: 'Customers with balance', value: 24,      sublabel: 'to send this cycle' },
    { label: 'Total outstanding',      value: 48_120,  money: true, sublabel: 'across all customers' },
    { label: 'Last sent',              value: 'May 01',sublabel: '124 statements emailed' },
    { label: 'Bounced',                value: 2,       sublabel: 'invalid email',  color: 'var(--c-warn)' },
  ],
  filters: [['This period','Last period','This year'], ['All customers','With balance only','New this month']],
  columns: [
    { key: 'cust',     label: 'Customer',    type: 'avatar' },
    { key: 'opening',  label: 'Opening',     type: 'money', align: 'right', dp: 2 },
    { key: 'invoiced', label: 'Invoiced',    type: 'money', align: 'right', dp: 2 },
    { key: 'paid',     label: 'Paid',        type: 'money', align: 'right', dp: 2 },
    { key: 'closing',  label: 'Closing',     type: 'money', align: 'right', dp: 2 },
    { key: 'lastSent', label: 'Last sent',   type: 'date' },
    { key: 'status',   label: 'Status',      type: 'pill',
      tone: v => ({sent:'pos',pending:'warn',bounced:'neg'})[v] },
  ],
  rows: [
    { cust: 'Atlas Hardware Co.',   opening: 3_280.10, invoiced: 8_092.50, paid: 4_812.40,  closing: 6_560.20, lastSent: 'May 01', status: 'sent' },
    { cust: 'Northwind Industrial', opening: 0,         invoiced: 11_240,   paid: 0,         closing: 11_240,   lastSent: 'May 01', status: 'sent' },
    { cust: 'Cascade Outfitters',   opening: 540,       invoiced: 7_680.25, paid: 4_000,     closing: 4_220.25, lastSent: 'May 01', status: 'sent' },
    { cust: 'Beacon Hospitality',   opening: 0,         invoiced: 540,      paid: 0,         closing: 540,      lastSent: 'May 01', status: 'bounced' },
    { cust: 'Mercer Construction',  opening: 0,         invoiced: 14_240,   paid: 8_000,     closing: 6_240,    lastSent: 'May 01', status: 'sent' },
    { cust: 'Bluefin Marine Co.',   opening: 0,         invoiced: 11_280,   paid: 0,         closing: 11_280,   lastSent: 'May 01', status: 'sent' },
    { cust: 'Riverbend Plumbing',   opening: 1_240,     invoiced: 3_280.10, paid: 1_240,     closing: 3_280.10, lastSent: 'May 01', status: 'sent' },
    { cust: 'Halcyon Retail',       opening: 0,         invoiced: 1_240,    paid: 1_240,     closing: 0,        lastSent: 'May 01', status: 'sent' },
    { cust: 'Greenleaf Foods',      opening: 0,         invoiced: 2_104,    paid: 2_104,     closing: 0,        lastSent: 'May 01', status: 'sent' },
    { cust: 'Pioneer Logistics',    opening: 0,         invoiced: 920.50,   paid: 0,         closing: 920.50,   lastSent: 'May 01', status: 'pending' },
  ],
};

const customers = {
  title: 'Customers',
  subtitle: 'Customer master — contact, credit terms, balance, lifetime value.',
  purpose: 'The customer master is the source of truth for everyone you sell to. Each row links to their orders, invoices, payment history and statements. Credit limits and terms set here flow into every new sale.',
  actions: [
    { label: 'Import',  icon: 'fa-upload' },
    { label: 'Export',  icon: 'fa-download' },
    { label: 'New customer', icon: 'fa-plus', primary: true, pageId: 'new-customer' },
  ],
  kpis: [
    { label: 'Active customers', value: 184,       sublabel: '12 added this quarter' },
    { label: 'AR outstanding',   value: 48_120,    money: true, sublabel: 'across 24 invoices' },
    { label: 'Avg LTV',          value: 12_840,    money: true, delta: +4.2, sublabel: 'last 12 months' },
    { label: 'Over credit limit',value: 3,         sublabel: 'manual approval needed', color: 'var(--c-warn)' },
  ],
  tabs: [
    { id: 'all',    label: 'All',         count: 184 },
    { id: 'active', label: 'Active',      count: 172, filter: r => r.status === 'active' },
    { id: 'over',   label: 'Over limit',  count: 3,   filter: r => r.over === true },
    { id: 'leads',  label: 'Leads',       count: 9,   filter: r => r.status === 'lead' },
  ],
  filters: [['All segments','Wholesale','Retail','Contractor','Hospitality']],
  columns: [
    { key: 'code',   label: 'Code',     type: 'id' },
    { key: 'name',   label: 'Customer', type: 'avatar' },
    { key: 'segment',label: 'Segment',  type: 'tag' },
    { key: 'terms',  label: 'Terms',    type: 'tag' },
    { key: 'limit',  label: 'Credit limit', type: 'money', align: 'right', dp: 0 },
    { key: 'balance',label: 'Balance',  type: 'jsx', render: r => (
      <span className="mono fw-6" style={{ color: r.over ? 'var(--c-neg)' : 'var(--text)' }}>{fmtMoney(r.balance, 0)}</span>
    ), align: 'right' },
    { key: 'ltv',    label: 'LTV',      type: 'money', align: 'right', dp: 0 },
    { key: 'status', label: 'Status',   type: 'pill',
      tone: v => ({active:'pos',lead:'info',dormant:'muted'})[v] },
  ],
  rows: [
    { code: 'CUS-001', name: 'Atlas Hardware Co.',    segment: 'Wholesale',  terms: 'Net 30', limit: 50_000, balance: 6_560,  ltv: 142_180, status: 'active' },
    { code: 'CUS-002', name: 'Northwind Industrial',  segment: 'Wholesale',  terms: 'Net 45', limit: 100_000,balance: 11_240, ltv: 184_240, status: 'active' },
    { code: 'CUS-003', name: 'Pioneer Logistics',     segment: 'Contractor', terms: 'Net 30', limit: 20_000, balance: 920,    ltv: 62_400,  status: 'active' },
    { code: 'CUS-004', name: 'Greenleaf Foods',       segment: 'Wholesale',  terms: 'Net 30', limit: 30_000, balance: 0,      ltv: 78_310,  status: 'active' },
    { code: 'CUS-005', name: 'Cascade Outfitters',    segment: 'Retail',     terms: 'Net 15', limit: 15_000, balance: 4_220,  ltv: 96_540,  status: 'active' },
    { code: 'CUS-006', name: 'Beacon Hospitality',    segment: 'Hospitality',terms: 'COD',    limit: 5_000,  balance: 540,    ltv: 18_240,  status: 'active' },
    { code: 'CUS-007', name: 'Mercer Construction',   segment: 'Contractor', terms: 'Net 60', limit: 75_000, balance: 6_240,  ltv: 124_200, status: 'active', over: false },
    { code: 'CUS-008', name: 'Halcyon Retail',        segment: 'Retail',     terms: 'Net 30', limit: 10_000, balance: 0,      ltv: 32_140,  status: 'active' },
    { code: 'CUS-009', name: 'Bluefin Marine Co.',    segment: 'Wholesale',  terms: 'Net 30', limit: 10_000, balance: 11_280, ltv: 28_400,  status: 'active', over: true },
    { code: 'CUS-010', name: 'Riverbend Plumbing',    segment: 'Contractor', terms: 'Net 30', limit: 3_000,  balance: 3_280,  ltv: 14_280,  status: 'active', over: true },
    { code: 'CUS-024', name: 'Sunridge Cafés',        segment: 'Hospitality',terms: 'COD',    limit: 2_000,  balance: 0,      ltv: 0,       status: 'lead' },
  ],
};

window.WMS_CONFIGS = {
  // vendors
  purchases, 'purchase-invoices': purchaseInvoices, 'debit-notes': debitNotes, bills, suppliers,
  // customers
  estimates, 'sale-invoices': saleInvoices, 'sales-receipts': salesReceipts, 'credit-notes': creditNotes,
  statements, customers,
};
window.WMS_USERS = USERS;
