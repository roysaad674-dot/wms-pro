/* global React */
// Page configs part 2: finance, banking, employees, warehouse, inventory, reports, system.
const { fmtMoney } = window.WMS;
const USERS = window.WMS_USERS;

/* ============================================================
   FINANCE
   ============================================================ */
const journalEntries = {
  title: 'Journal Entries',
  subtitle: 'Manual postings to the general ledger — accruals, depreciation, adjustments.',
  purpose: 'Most ledger activity happens automatically from invoices, bills and bank feeds. Journal entries are where the accountant posts things the system can\'t infer: month-end accruals, depreciation, intercompany transfers, and corrections.',
  actions: [
    { label: 'Recurring', icon: 'fa-repeat' },
    { label: 'New entry', icon: 'fa-plus', primary: true, pageId: 'new-entry' },
  ],
  kpis: [
    { label: 'Posted this period', value: 28,     sublabel: '$184k debit / credit volume' },
    { label: 'Drafts',             value: 4,      sublabel: 'awaiting review' },
    { label: 'Unbalanced',         value: 0,      sublabel: 'all entries reconcile', color: 'var(--c-pos)' },
    { label: 'Recurring',          value: 6,      sublabel: 'auto-post monthly' },
  ],
  tabs: [
    { id: 'all',    label: 'All',         count: 32 },
    { id: 'posted', label: 'Posted',      count: 28, filter: r => r.status === 'posted' },
    { id: 'draft',  label: 'Drafts',      count: 4,  filter: r => r.status === 'draft' },
  ],
  columns: [
    { key: 'id',     label: 'Entry #',    type: 'id' },
    { key: 'date',   label: 'Date',       type: 'date' },
    { key: 'memo',   label: 'Memo',       type: 'jsx', render: r => <span className="fw-6">{r.memo}</span> },
    { key: 'lines',  label: 'Lines',      type: 'num', align: 'right' },
    { key: 'debit',  label: 'Debit',      type: 'money', align: 'right', dp: 2 },
    { key: 'credit', label: 'Credit',     type: 'money', align: 'right', dp: 2 },
    { key: 'by',     label: 'Posted by',  type: 'user' },
    { key: 'status', label: 'Status',     type: 'pill',
      tone: v => ({posted:'pos',draft:'muted',recurring:'info'})[v] },
  ],
  rows: [
    { id: 'JE-2284', date: 'Today',     memo: 'May rent accrual',           lines: 2, debit: 8_400.00, credit: 8_400.00, by: USERS[2], status: 'posted' },
    { id: 'JE-2283', date: 'Today',     memo: 'Depreciation — vehicles',    lines: 4, debit: 1_240.00, credit: 1_240.00, by: USERS[2], status: 'recurring' },
    { id: 'JE-2282', date: 'Yesterday', memo: 'Forex adjust on USD AP',     lines: 3, debit: 320.50,   credit: 320.50,   by: USERS[2], status: 'posted' },
    { id: 'JE-2281', date: 'Yesterday', memo: 'Reclass employee advance',   lines: 2, debit: 600.00,   credit: 600.00,   by: USERS[2], status: 'posted' },
    { id: 'JE-2280', date: '2 days ago',memo: 'Inventory write-off (LED)',  lines: 2, debit: 480.00,   credit: 480.00,   by: USERS[0], status: 'draft' },
    { id: 'JE-2279', date: '3 days ago',memo: 'Prepaid insurance amortize', lines: 2, debit: 556.67,   credit: 556.67,   by: USERS[2], status: 'recurring' },
    { id: 'JE-2278', date: '4 days ago',memo: 'Loan interest accrual',      lines: 2, debit: 1_840.00, credit: 1_840.00, by: USERS[2], status: 'posted' },
    { id: 'JE-2277', date: '5 days ago',memo: 'Correct Q1 misclassification',lines:4, debit: 240.00,   credit: 240.00,   by: USERS[2], status: 'draft' },
  ],
};

const accountsPayable = {
  title: 'Accounts Payable',
  subtitle: 'What you owe suppliers — bucketed by ageing, ready for the payment run.',
  purpose: 'AP is the sub-ledger view of every open supplier bill aged by how long it has been outstanding. Use it to plan cash, prioritise critical vendors, and identify early-payment discount opportunities.',
  actions: [
    { label: 'Export', icon: 'fa-download' },
    { label: 'Schedule run', icon: 'fa-calendar-plus', primary: true, pageId: 'run-payments' },
  ],
  kpis: [
    { label: 'Total AP',     value: 142_840, money: true, sublabel: 'across 38 bills' },
    { label: 'Current',      value: 84_240,  money: true, sublabel: 'not yet due',  color: 'var(--c-pos)' },
    { label: '31–60 days',   value: 42_180,  money: true, sublabel: '12 bills',     color: 'var(--c-warn)' },
    { label: '60+ days',     value: 16_420,  money: true, sublabel: '5 bills past due', color: 'var(--c-neg)' },
  ],
  filters: [['All suppliers','Polyflo','IronGrip','Lumio','Cascade'], ['All categories','Goods','Utilities','Services']],
  columns: [
    { key: 'supplier', label: 'Supplier', type: 'avatar' },
    { key: 'current',  label: 'Current',  type: 'money', align: 'right', dp: 0 },
    { key: 'd30',      label: '1–30 d',   type: 'money', align: 'right', dp: 0 },
    { key: 'd60',      label: '31–60 d',  type: 'money', align: 'right', dp: 0 },
    { key: 'd90',      label: '61–90 d',  type: 'money', align: 'right', dp: 0 },
    { key: 'd90p',     label: '90+ d',    type: 'money', align: 'right', dp: 0 },
    { key: 'total',    label: 'Total',    type: 'jsx', render: r => <span className="mono fw-7">{fmtMoney(r.total,0)}</span>, align: 'right' },
  ],
  rows: [
    { supplier: 'Polyflo Industries',         current: 24_810, d30: 4_812, d60: 0,      d90: 0,    d90p: 0,    total: 29_622 },
    { supplier: 'IronGrip Tools Co.',         current: 16_540, d30: 0,     d60: 11_240, d90: 0,    d90p: 0,    total: 27_780 },
    { supplier: 'Lumio Electrical',           current: 8_120,  d30: 0,     d60: 0,      d90: 0,    d90p: 0,    total: 8_120 },
    { supplier: 'Atlas Fasteners',            current: 2_408,  d30: 0,     d60: 0,      d90: 0,    d90p: 0,    total: 2_408 },
    { supplier: 'Cascade Lumber Supply',      current: 14_240, d30: 6_840, d60: 0,      d90: 0,    d90p: 0,    total: 21_080 },
    { supplier: 'AT&T Business',              current: 0,      d30: 0,     d60: 320,    d90: 0,    d90p: 0,    total: 320 },
    { supplier: 'FreshPay Payroll Svc',       current: 0,      d30: 0,     d60: 1_240,  d90: 0,    d90p: 0,    total: 1_240 },
    { supplier: 'Sterling Insurance',         current: 0,      d30: 0,     d60: 6_680,  d90: 0,    d90p: 0,    total: 6_680 },
    { supplier: 'Cascade Property Mgmt',      current: 0,      d30: 0,     d60: 0,      d90: 8_400,d90p: 0,    total: 8_400 },
    { supplier: 'PG&E Utilities',             current: 1_840,  d30: 0,     d60: 0,      d90: 0,    d90p: 0,    total: 1_840 },
    { supplier: 'WestEdge Logistics',         current: 0,      d30: 0,     d60: 0,      d90: 0,    d90p: 8_020, total: 8_020 },
    { supplier: 'Hydrox Pumps',               current: 1_640,  d30: 0,     d60: 0,      d90: 0,    d90p: 0,    total: 1_640 },
  ],
};

const accountsReceivable = {
  title: 'Accounts Receivable',
  subtitle: 'What customers owe you — bucketed by ageing, sorted by collection priority.',
  purpose: 'AR is the mirror of AP — every open customer invoice aged by days outstanding. Use it to drive collections calls, send reminders, and forecast cash-in.',
  actions: [
    { label: 'Send reminders', icon: 'fa-envelope' },
    { label: 'Export', icon: 'fa-download' },
    { label: 'New AR entry', icon: 'fa-plus', primary: true, pageId: 'new-ar-entry' },
  ],
  kpis: [
    { label: 'Total AR',   value: 48_120,  money: true, sublabel: 'across 24 invoices' },
    { label: 'Current',    value: 24_240,  money: true, sublabel: 'not yet due', color: 'var(--c-pos)' },
    { label: '31–60 days', value: 12_840,  money: true, sublabel: '8 invoices',   color: 'var(--c-warn)' },
    { label: '60+ days',   value: 11_040,  money: true, sublabel: '4 invoices',   color: 'var(--c-neg)' },
  ],
  columns: [
    { key: 'cust',    label: 'Customer', type: 'avatar' },
    { key: 'current', label: 'Current',  type: 'money', align: 'right', dp: 0 },
    { key: 'd30',     label: '1–30 d',   type: 'money', align: 'right', dp: 0 },
    { key: 'd60',     label: '31–60 d',  type: 'money', align: 'right', dp: 0 },
    { key: 'd90',     label: '61–90 d',  type: 'money', align: 'right', dp: 0 },
    { key: 'd90p',    label: '90+ d',    type: 'money', align: 'right', dp: 0 },
    { key: 'total',   label: 'Total',    type: 'jsx', render: r => <span className="mono fw-7">{fmtMoney(r.total,0)}</span>, align: 'right' },
  ],
  rows: [
    { cust: 'Northwind Industrial', current: 11_240, d30: 0,     d60: 0,      d90: 0,     d90p: 0,    total: 11_240 },
    { cust: 'Mercer Construction',  current: 6_240,  d30: 0,     d60: 0,      d90: 0,     d90p: 0,    total: 6_240  },
    { cust: 'Atlas Hardware Co.',   current: 3_280,  d30: 3_280, d60: 0,      d90: 0,     d90p: 0,    total: 6_560  },
    { cust: 'Cascade Outfitters',   current: 4_220,  d30: 0,     d60: 0,      d90: 0,     d90p: 0,    total: 4_220  },
    { cust: 'Bluefin Marine Co.',   current: 0,      d30: 11_280,d60: 0,      d90: 0,     d90p: 0,    total: 11_280 },
    { cust: 'Riverbend Plumbing',   current: 0,      d30: 0,     d60: 3_280,  d90: 0,     d90p: 0,    total: 3_280  },
    { cust: 'Beacon Hospitality',   current: 540,    d30: 0,     d60: 0,      d90: 0,     d90p: 0,    total: 540    },
    { cust: 'Pioneer Logistics',    current: 920,    d30: 0,     d60: 0,      d90: 0,     d90p: 0,    total: 920    },
    { cust: 'Halcyon Retail',       current: 0,      d30: 0,     d60: 1_240,  d90: 0,     d90p: 0,    total: 1_240  },
    { cust: 'Sunridge Cafés',       current: 0,      d30: 0,     d60: 0,      d90: 0,     d90p: 1_840, total: 1_840  },
  ],
};

const expenses = {
  title: 'Expenses',
  subtitle: 'Out-of-pocket and card expenses — categorised, taxed, ready for reimbursement.',
  purpose: 'Expenses are the small purchases that don\'t come through formal POs — fuel, lunches, postage, software subscriptions. Submit with receipts, get coded to the right account, approved, and reimbursed in payroll.',
  actions: [
    { label: 'Import card feed', icon: 'fa-credit-card' },
    { label: 'Submit expense', icon: 'fa-plus', primary: true, pageId: 'new-expense' },
  ],
  kpis: [
    { label: 'Pending approval', value: 14,     sublabel: '$2,840 total' },
    { label: 'Approved this mo', value: 18_240, money: true, delta: +6.4, sublabel: 'vs last month' },
    { label: 'Top category',     value: 'Travel', sublabel: '38% of spend' },
    { label: 'Missing receipts', value: 3,      sublabel: 'older than 7 days', color: 'var(--c-warn)' },
  ],
  tabs: [
    { id: 'all',      label: 'All',     count: 84 },
    { id: 'pending',  label: 'Pending', count: 14, filter: r => r.status === 'pending' },
    { id: 'approved', label: 'Approved',count: 62, filter: r => r.status === 'approved' },
    { id: 'rejected', label: 'Rejected',count: 8,  filter: r => r.status === 'rejected' },
  ],
  columns: [
    { key: 'id',     label: 'Exp #',     type: 'id' },
    { key: 'date',   label: 'Date',      type: 'date' },
    { key: 'who',    label: 'Submitted by', type: 'user' },
    { key: 'merchant',label: 'Merchant', type: 'jsx', render: r => <span className="fw-6">{r.merchant}</span> },
    { key: 'cat',    label: 'Category',  type: 'tag' },
    { key: 'receipt',label: 'Receipt',   type: 'pill',
      tone: v => ({attached:'pos',missing:'warn'})[v] },
    { key: 'status', label: 'Status',    type: 'pill',
      tone: v => ({approved:'pos',pending:'warn',rejected:'neg'})[v] },
    { key: 'value',  label: 'Amount',    type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { id: 'EXP-1284', date: 'Today',     who: USERS[0], merchant: 'Shell — fuel',          cat: 'Travel',     receipt: 'attached', status: 'pending',  value: 84.20 },
    { id: 'EXP-1283', date: 'Today',     who: USERS[1], merchant: 'Olive & Vine',          cat: 'Meals',      receipt: 'attached', status: 'pending',  value: 142.00 },
    { id: 'EXP-1282', date: 'Yesterday', who: USERS[2], merchant: 'Notion',                cat: 'Software',   receipt: 'attached', status: 'approved', value: 96.00 },
    { id: 'EXP-1281', date: 'Yesterday', who: USERS[0], merchant: 'USPS — postage',        cat: 'Office',     receipt: 'missing',  status: 'pending',  value: 38.40 },
    { id: 'EXP-1280', date: '2 days ago',who: USERS[3], merchant: 'Home Depot',            cat: 'Supplies',   receipt: 'attached', status: 'approved', value: 240.80 },
    { id: 'EXP-1279', date: '3 days ago',who: USERS[2], merchant: 'Adobe Creative Cloud',  cat: 'Software',   receipt: 'attached', status: 'approved', value: 56.00 },
    { id: 'EXP-1278', date: '4 days ago',who: USERS[1], merchant: 'Hertz car rental',      cat: 'Travel',     receipt: 'attached', status: 'rejected', value: 320.00 },
    { id: 'EXP-1277', date: '5 days ago',who: USERS[0], merchant: 'Starbucks',             cat: 'Meals',      receipt: 'missing',  status: 'pending',  value: 24.80 },
  ],
};

/* ============================================================
   BANKING
   ============================================================ */
const bankAccounts = {
  title: 'Bank Accounts',
  subtitle: 'Every account, card and credit line you own — live balances pulled nightly.',
  purpose: 'This is your cash position at a glance. Each account syncs via Plaid or your bank\'s direct feed and posts transactions into the bank-transactions queue for matching. Add a wallet, switch the default, or pause a feed here.',
  actions: [
    { label: 'Connect bank', icon: 'fa-plug', primary: true, pageId: 'connect-bank' },
  ],
  kpis: [
    { label: 'Total cash',     value: 482_140, money: true, sublabel: 'across 6 accounts' },
    { label: 'Available',      value: 412_840, money: true, sublabel: 'after pending/holds' },
    { label: 'Credit utilised',value: '38%',   sublabel: '$38k of $100k limit' },
    { label: 'Last sync',      value: '12m ago',sublabel: 'all feeds healthy', color: 'var(--c-pos)' },
  ],
  columns: [
    { key: 'name',    label: 'Account',     type: 'avatar' },
    { key: 'inst',    label: 'Institution', type: 'tag' },
    { key: 'type',    label: 'Type',        type: 'pill',
      tone: v => ({checking:'info',savings:'pos',card:'violet',line:'warn'})[v] },
    { key: 'last4',   label: 'Number',      type: 'id' },
    { key: 'balance', label: 'Current',     type: 'money-signed', align: 'right', dp: 2 },
    { key: 'avail',   label: 'Available',   type: 'money', align: 'right', dp: 2 },
    { key: 'sync',    label: 'Last sync',   type: 'date' },
    { key: 'feed',    label: 'Feed',        type: 'pill',
      tone: v => ({live:'pos',paused:'warn',error:'neg'})[v] },
  ],
  rows: [
    { name: 'Operating — main',     inst: 'Chase Business',     type: 'checking', last4: '••4821', balance: 184_240,  avail: 178_400, sync: '8m ago',  feed: 'live' },
    { name: 'Reserve',              inst: 'Chase Business',     type: 'savings',  last4: '••4822', balance: 220_000,  avail: 220_000, sync: '8m ago',  feed: 'live' },
    { name: 'Payroll',              inst: 'Mercury',            type: 'checking', last4: '••0148', balance: 42_180,   avail: 42_180,  sync: '12m ago', feed: 'live' },
    { name: 'Amex Business Plat.',  inst: 'American Express',   type: 'card',     last4: '••3008', balance: -8_420,   avail: 91_580,  sync: '14m ago', feed: 'live' },
    { name: 'Visa fleet',           inst: 'Capital One',        type: 'card',     last4: '••6421', balance: -2_840,   avail: 17_160,  sync: '14m ago', feed: 'live' },
    { name: 'Line of credit',       inst: 'First Republic',     type: 'line',     last4: '••0001', balance: -28_000,  avail: 72_000,  sync: '2 days ago', feed: 'paused' },
  ],
};

const banking = {
  title: 'Bank Transactions',
  subtitle: 'Every line on every bank feed — match, categorise, or split.',
  purpose: 'The bank inbox. Imported transactions wait here until you match them to an invoice/bill or assign them an expense category. Once cleared they post to the general ledger and stop bugging you.',
  actions: [
    { label: 'Bulk match', icon: 'fa-wand-magic-sparkles' },
    { label: 'Add transaction', icon: 'fa-plus', primary: true, pageId: 'new-transaction' },
  ],
  kpis: [
    { label: 'To review',        value: 28,      sublabel: '$18,240 unmatched', color: 'var(--c-warn)' },
    { label: 'Matched this wk',  value: 124,     sublabel: '$84,120 cleared' },
    { label: 'AI suggestions',   value: 18,      sublabel: 'one-click apply' },
    { label: 'In dispute',       value: 1,       sublabel: 'duplicate charge', color: 'var(--c-neg)' },
  ],
  tabs: [
    { id: 'review',  label: 'To review',  count: 28, filter: r => r.status === 'review' },
    { id: 'matched', label: 'Matched',    count: 124, filter: r => r.status === 'matched' },
    { id: 'all',     label: 'All',        count: 152 },
  ],
  filters: [['All accounts','Operating','Payroll','Amex','Visa']],
  columns: [
    { key: 'date',   label: 'Date',     type: 'date' },
    { key: 'desc',   label: 'Description', type: 'jsx', render: r => (
      <div>
        <div className="fw-6">{r.desc}</div>
        <div className="t-xs muted">{r.account}</div>
      </div>
    ) },
    { key: 'cat',    label: 'Category', type: 'tag' },
    { key: 'match',  label: 'Match',    type: 'pill',
      tone: v => ({suggested:'info',manual:'muted',exact:'pos'})[v] },
    { key: 'status', label: 'Status',   type: 'pill',
      tone: v => ({review:'warn',matched:'pos'})[v] },
    { key: 'amount', label: 'Amount',   type: 'money-signed', align: 'right', dp: 2 },
  ],
  rows: [
    { date: 'Today',     desc: 'POLYFLO INDUSTRIES',   account: 'Operating ••4821', cat: 'Goods',     match: 'exact',     status: 'matched', amount: -4_812.00 },
    { date: 'Today',     desc: 'ATLAS HARDWARE CO',    account: 'Operating ••4821', cat: 'Sales',     match: 'exact',     status: 'matched', amount:  4_812.40 },
    { date: 'Today',     desc: 'SHELL OIL #4882',      account: 'Visa ••6421',      cat: 'Travel',    match: 'suggested', status: 'review',  amount: -84.20 },
    { date: 'Today',     desc: 'STRIPE PAYOUT',        account: 'Operating ••4821', cat: 'Sales',     match: 'suggested', status: 'review',  amount:  6_280.00 },
    { date: 'Yesterday', desc: 'AWS *AMZN AWS',        account: 'Amex ••3008',      cat: 'Software',  match: 'suggested', status: 'review',  amount: -1_840.00 },
    { date: 'Yesterday', desc: 'PG&E AUTOPAY',         account: 'Operating ••4821', cat: 'Utilities', match: 'exact',     status: 'matched', amount: -1_840.00 },
    { date: '2 days ago',desc: 'UNKNOWN WIRE-IN',      account: 'Operating ••4821', cat: '—',         match: 'manual',    status: 'review',  amount:  1_400.00 },
    { date: '2 days ago',desc: 'HOME DEPOT #1244',     account: 'Visa ••6421',      cat: 'Supplies',  match: 'suggested', status: 'review',  amount: -240.80 },
    { date: '3 days ago',desc: 'BANK FEE',             account: 'Operating ••4821', cat: 'Bank fees', match: 'manual',    status: 'matched', amount: -25.00 },
    { date: '3 days ago',desc: 'STARBUCKS #4421',      account: 'Visa ••6421',      cat: 'Meals',     match: 'suggested', status: 'review',  amount: -24.80 },
  ],
};

/* ============================================================
   EMPLOYEES
   ============================================================ */
const employees = {
  title: 'Employee Directory',
  subtitle: 'Everyone on payroll — contact, role, manager, employment dates.',
  purpose: 'The people master. Each row links to the employee\'s timesheets, payslips, leave balance, and documents. Drives access permissions, payroll runs, and the org chart.',
  actions: [
    { label: 'Org chart', icon: 'fa-sitemap' },
    { label: 'Export', icon: 'fa-download' },
    { label: 'Add employee', icon: 'fa-plus', primary: true, pageId: 'new-employee' },
  ],
  kpis: [
    { label: 'Active employees', value: 28,       sublabel: '4 contractors' },
    { label: 'New this quarter', value: 3,        sublabel: '1 in onboarding' },
    { label: 'Avg tenure',       value: '3.2 yr', sublabel: 'organisation-wide' },
    { label: 'Open roles',       value: 2,        sublabel: 'Sales Rep, Warehouse Lead' },
  ],
  tabs: [
    { id: 'all',     label: 'All',           count: 32 },
    { id: 'fte',     label: 'Full-time',     count: 24, filter: r => r.type === 'FTE' },
    { id: 'pt',      label: 'Part-time',     count: 4,  filter: r => r.type === 'PT' },
    { id: 'contractor', label: 'Contractor', count: 4,  filter: r => r.type === 'Contract' },
  ],
  filters: [['All teams','Operations','Finance','Sales','Warehouse','IT']],
  columns: [
    { key: 'id',      label: 'ID',       type: 'id' },
    { key: 'name',    label: 'Employee', type: 'avatar' },
    { key: 'role',    label: 'Role',     type: 'jsx', render: r => (
      <div>
        <div className="fw-6">{r.role}</div>
        <div className="t-xs muted">{r.team}</div>
      </div>
    ) },
    { key: 'manager', label: 'Manager',  type: 'user' },
    { key: 'type',    label: 'Type',     type: 'tag' },
    { key: 'started', label: 'Started',  type: 'date' },
    { key: 'salary',  label: 'Salary',   type: 'money', align: 'right', dp: 0 },
    { key: 'status',  label: 'Status',   type: 'pill',
      tone: v => ({active:'pos',onboarding:'info',leave:'warn'})[v] },
  ],
  rows: [
    { id: 'EMP-001', name: 'Maria Rodriguez', role: 'Operations Lead',        team: 'Operations', manager: USERS[2], type: 'FTE',      started: '2019-04-12', salary: 96_000, status: 'active' },
    { id: 'EMP-002', name: 'Daniel Kang',     role: 'Warehouse Supervisor',   team: 'Warehouse',  manager: USERS[0], type: 'FTE',      started: '2020-08-03', salary: 72_000, status: 'active' },
    { id: 'EMP-003', name: 'Priya Shah',      role: 'Senior Accountant',      team: 'Finance',    manager: USERS[2], type: 'FTE',      started: '2018-02-19', salary: 88_000, status: 'active' },
    { id: 'EMP-004', name: 'Liam Chen',       role: 'Sales Representative',   team: 'Sales',      manager: USERS[0], type: 'FTE',      started: '2022-06-14', salary: 64_000, status: 'active' },
    { id: 'EMP-005', name: 'Aria Volkov',     role: 'Inventory Analyst',      team: 'Operations', manager: USERS[0], type: 'FTE',      started: '2021-11-08', salary: 68_000, status: 'leave' },
    { id: 'EMP-006', name: 'Noah Becker',     role: 'Warehouse Associate',    team: 'Warehouse',  manager: USERS[1], type: 'FTE',      started: '2023-03-22', salary: 48_000, status: 'active' },
    { id: 'EMP-007', name: 'Selene Park',     role: 'AP Clerk',               team: 'Finance',    manager: USERS[2], type: 'PT',       started: '2024-01-09', salary: 32_000, status: 'active' },
    { id: 'EMP-008', name: 'Owen Wallace',    role: 'Driver',                 team: 'Warehouse',  manager: USERS[1], type: 'FTE',      started: '2022-08-17', salary: 52_000, status: 'active' },
    { id: 'EMP-009', name: 'Iris Nakamura',   role: 'IT Contractor',          team: 'IT',         manager: USERS[2], type: 'Contract', started: '2025-02-04', salary: 0,      status: 'active' },
    { id: 'EMP-010', name: 'Ethan Brooks',    role: 'Sales Representative',   team: 'Sales',      manager: USERS[0], type: 'FTE',      started: '2026-05-12', salary: 60_000, status: 'onboarding' },
  ],
};

const attendance = {
  title: 'Attendance',
  subtitle: 'Clock-ins and total hours by employee and pay period.',
  purpose: 'Hourly time-tracking for warehouse, driver and PT staff. Pulled into payroll. Use the per-day grid to spot missing punches or unusual patterns and edit before the period closes.',
  actions: [
    { label: 'Period', icon: 'fa-calendar' },
    { label: 'Export to payroll', icon: 'fa-arrow-right', primary: true, pageId: 'export-payroll' },
  ],
  kpis: [
    { label: 'Period',          value: 'May 12–25', sublabel: 'closes Sunday' },
    { label: 'Total hours',     value: '1,284 h',   sublabel: 'across 18 hourly staff' },
    { label: 'Overtime hours',  value: '42 h',      sublabel: '6 employees', color: 'var(--c-warn)' },
    { label: 'Missing punches', value: 3,           sublabel: 'needs correction' },
  ],
  columns: [
    { key: 'name',     label: 'Employee', type: 'avatar' },
    { key: 'regular',  label: 'Regular',  type: 'jsx', render: r => <span className="mono fw-6">{r.regular} h</span>, align: 'right' },
    { key: 'ot',       label: 'Overtime', type: 'jsx', render: r => <span className="mono fw-6" style={{ color: r.ot > 0 ? 'var(--c-warn)' : 'var(--text-3)' }}>{r.ot} h</span>, align: 'right' },
    { key: 'pto',      label: 'PTO',      type: 'jsx', render: r => <span className="mono">{r.pto} h</span>, align: 'right' },
    { key: 'sick',     label: 'Sick',     type: 'jsx', render: r => <span className="mono">{r.sick} h</span>, align: 'right' },
    { key: 'total',    label: 'Total',    type: 'jsx', render: r => <span className="mono fw-7">{r.total} h</span>, align: 'right' },
    { key: 'rate',     label: 'Rate',     type: 'jsx', render: r => <span className="mono muted">{'$' + r.rate}/h</span>, align: 'right' },
    { key: 'pay',      label: 'Period pay', type: 'money', align: 'right', dp: 2 },
  ],
  rows: [
    { name: 'Daniel Kang',     regular: 80, ot: 6,  pto: 0, sick: 0, total: 86, rate: 36, pay: 3_204.00 },
    { name: 'Noah Becker',     regular: 78, ot: 8,  pto: 0, sick: 0, total: 86, rate: 22, pay: 1_980.00 },
    { name: 'Owen Wallace',    regular: 80, ot: 4,  pto: 0, sick: 0, total: 84, rate: 24, pay: 2_064.00 },
    { name: 'Maria Rodriguez', regular: 80, ot: 0,  pto: 0, sick: 0, total: 80, rate: 0,  pay: 0 },
    { name: 'Priya Shah',      regular: 80, ot: 0,  pto: 0, sick: 0, total: 80, rate: 0,  pay: 0 },
    { name: 'Liam Chen',       regular: 80, ot: 0,  pto: 0, sick: 0, total: 80, rate: 0,  pay: 0 },
    { name: 'Aria Volkov',     regular: 0,  ot: 0,  pto: 80,sick: 0, total: 80, rate: 0,  pay: 0 },
    { name: 'Selene Park',     regular: 40, ot: 0,  pto: 0, sick: 8, total: 48, rate: 28, pay: 1_344.00 },
    { name: 'Ethan Brooks',    regular: 64, ot: 0,  pto: 0, sick: 0, total: 64, rate: 24, pay: 1_536.00 },
  ],
};

const leave = {
  title: 'Leave Tracker',
  subtitle: 'Time-off requests — pending approval, upcoming, used vs accrued.',
  purpose: 'Where managers approve PTO, sick days, and unpaid leave. The calendar guarantees you never accidentally short-staff a shift; balances accrue per company policy and visible to each employee in self-service.',
  actions: [
    { label: 'Calendar view', icon: 'fa-calendar' },
    { label: 'Approve all', icon: 'fa-check-double' },
    { label: 'Request leave', icon: 'fa-plus', primary: true, pageId: 'request-leave' },
  ],
  kpis: [
    { label: 'Pending requests', value: 5,    sublabel: '2 awaiting your approval', color: 'var(--c-warn)' },
    { label: 'On leave today',   value: 1,    sublabel: 'Aria V. — parental' },
    { label: 'Avg balance',      value: '64 h',sublabel: 'PTO available org-wide' },
    { label: 'Coverage gaps',    value: 0,    sublabel: 'next 14 days', color: 'var(--c-pos)' },
  ],
  tabs: [
    { id: 'pending',  label: 'Pending',  count: 5,  filter: r => r.status === 'pending' },
    { id: 'upcoming', label: 'Upcoming', count: 8,  filter: r => r.status === 'approved' },
    { id: 'history',  label: 'History',  count: 42 },
  ],
  columns: [
    { key: 'name',  label: 'Employee', type: 'avatar' },
    { key: 'type',  label: 'Type',     type: 'tag' },
    { key: 'from',  label: 'From',     type: 'date' },
    { key: 'to',    label: 'To',       type: 'date' },
    { key: 'days',  label: 'Days',     type: 'jsx', render: r => <span className="mono fw-6">{r.days}</span>, align: 'right' },
    { key: 'reason',label: 'Reason',   type: 'jsx', render: r => <span className="muted-2 t-sm">{r.reason}</span> },
    { key: 'status',label: 'Status',   type: 'pill',
      tone: v => ({pending:'warn',approved:'pos',rejected:'neg'})[v] },
  ],
  rows: [
    { name: 'Aria Volkov',   type: 'Parental', from: 'May 01', to: 'Jul 24',  days: 60, reason: 'Parental leave',    status: 'approved' },
    { name: 'Liam Chen',     type: 'PTO',      from: 'Jun 03', to: 'Jun 07',  days: 5,  reason: 'Family vacation',   status: 'pending' },
    { name: 'Noah Becker',   type: 'Sick',     from: 'Today',  to: 'Today',   days: 1,  reason: 'Migraine',          status: 'pending' },
    { name: 'Daniel Kang',   type: 'PTO',      from: 'Jun 17', to: 'Jun 21',  days: 5,  reason: 'Hiking trip',       status: 'pending' },
    { name: 'Owen Wallace',  type: 'PTO',      from: 'Jul 04', to: 'Jul 04',  days: 1,  reason: 'July 4th',          status: 'approved' },
    { name: 'Selene Park',   type: 'Unpaid',   from: 'Jun 24', to: 'Jun 28',  days: 5,  reason: 'School recess',     status: 'pending' },
    { name: 'Priya Shah',    type: 'PTO',      from: 'Aug 12', to: 'Aug 23',  days: 10, reason: 'Annual leave',      status: 'approved' },
    { name: 'Ethan Brooks',  type: 'PTO',      from: 'Jun 14', to: 'Jun 14',  days: 1,  reason: 'Medical appointment',status: 'pending' },
  ],
};

const payroll = {
  title: 'Payroll',
  subtitle: 'Pay runs — schedule, run, post to GL, file taxes, hand off to bank.',
  purpose: 'Each pay-run rolls up timesheets + salaried staff + bonuses + reimbursed expenses into gross, then nets it down through tax, benefits and garnishments. Approve, then ACH posts as a batch.',
  actions: [
    { label: 'Tax filings', icon: 'fa-file-invoice' },
    { label: 'Run payroll', icon: 'fa-play', primary: true, pageId: 'run-payroll' },
  ],
  kpis: [
    { label: 'Next run',          value: 'May 31',sublabel: 'Friday — bi-weekly' },
    { label: 'Estimated gross',   value: 86_240,  money: true, sublabel: '28 employees' },
    { label: 'Estimated net',     value: 62_840,  money: true, sublabel: '27% withholding' },
    { label: 'YTD payroll',       value: 1_842_400, money: true, sublabel: 'org-wide' },
  ],
  tabs: [
    { id: 'upcoming', label: 'Upcoming', count: 1, filter: r => r.status === 'upcoming' },
    { id: 'paid',     label: 'Paid',     count: 9, filter: r => r.status === 'paid' },
    { id: 'all',      label: 'All',      count: 10 },
  ],
  columns: [
    { key: 'period', label: 'Period',     type: 'jsx', render: r => <span className="fw-6">{r.period}</span> },
    { key: 'paydate',label: 'Pay date',   type: 'date' },
    { key: 'people', label: 'Employees',  type: 'num', align: 'right' },
    { key: 'gross',  label: 'Gross',      type: 'money', align: 'right', dp: 2 },
    { key: 'tax',    label: 'Tax & ben.', type: 'money', align: 'right', dp: 2 },
    { key: 'net',    label: 'Net pay',    type: 'money', align: 'right', dp: 2 },
    { key: 'status', label: 'Status',     type: 'pill',
      tone: v => ({upcoming:'info',paid:'pos',draft:'muted'})[v] },
  ],
  rows: [
    { period: 'May 19 – Jun 01', paydate: 'May 31',  people: 28, gross: 86_240.00, tax: 23_400.00, net: 62_840.00, status: 'upcoming' },
    { period: 'May 05 – May 18', paydate: 'May 17',  people: 28, gross: 84_180.00, tax: 22_840.00, net: 61_340.00, status: 'paid' },
    { period: 'Apr 21 – May 04', paydate: 'May 03',  people: 27, gross: 80_840.00, tax: 21_920.00, net: 58_920.00, status: 'paid' },
    { period: 'Apr 07 – Apr 20', paydate: 'Apr 19',  people: 27, gross: 78_420.00, tax: 21_300.00, net: 57_120.00, status: 'paid' },
    { period: 'Mar 24 – Apr 06', paydate: 'Apr 05',  people: 26, gross: 75_240.00, tax: 20_400.00, net: 54_840.00, status: 'paid' },
    { period: 'Mar 10 – Mar 23', paydate: 'Mar 22',  people: 26, gross: 74_840.00, tax: 20_280.00, net: 54_560.00, status: 'paid' },
  ],
};

/* ============================================================
   WAREHOUSE
   ============================================================ */
const warehouseStock = {
  title: 'Stock by Location',
  subtitle: 'On-hand quantities — by SKU, by bin, across every warehouse.',
  purpose: 'Where exactly is each unit of stock? This is the bin-level view: an SKU may exist at multiple bins across multiple warehouses, plus reserved-for-orders and in-transit. Bedrock for picking and cycle counts.',
  actions: [
    { label: 'Print labels', icon: 'fa-print' },
    { label: 'Move stock', icon: 'fa-shuffle', primary: true, pageId: 'move-stock' },
  ],
  kpis: [
    { label: 'Total SKUs',       value: 1_284,    sublabel: 'across 3 warehouses' },
    { label: 'Inventory value',  value: 482_140,  money: true, sublabel: 'at cost' },
    { label: 'Bins occupied',    value: '78%',    sublabel: '624 of 800 bins' },
    { label: 'Negative stock',   value: 2,        sublabel: 'data entry error', color: 'var(--c-neg)' },
  ],
  filters: [['All warehouses','Warehouse A','Warehouse B','Yard'], ['All zones','Receiving','Bulk','Pick face','Returns']],
  columns: [
    { key: 'sku',     label: 'SKU',      type: 'id' },
    { key: 'name',    label: 'Product',  type: 'avatar' },
    { key: 'wh',      label: 'Warehouse',type: 'tag' },
    { key: 'bin',     label: 'Bin',      type: 'id' },
    { key: 'onHand',  label: 'On hand',  type: 'num', align: 'right' },
    { key: 'reserved',label: 'Reserved', type: 'num', align: 'right' },
    { key: 'avail',   label: 'Available',type: 'jsx', render: r => <span className="mono fw-6" style={{ color: r.avail <= 0 ? 'var(--c-neg)' : r.avail <= 10 ? 'var(--c-warn)' : 'var(--text)' }}>{r.avail}</span>, align: 'right' },
    { key: 'transit', label: 'In transit', type: 'num', align: 'right' },
    { key: 'updated', label: 'Last move', type: 'date' },
  ],
  rows: [
    { sku: 'HX-12-440', name: 'Heavy-duty hex bolt M12',     wh: 'WH-A', bin: 'A-12-3', onHand: 1842, reserved: 240, avail: 1602, transit: 0,  updated: '2h ago' },
    { sku: 'PVC-2-90',  name: 'PVC elbow 2" 90°',            wh: 'WH-A', bin: 'B-04-1', onHand: 412,  reserved: 80,  avail: 332,  transit: 80, updated: 'Today' },
    { sku: 'LED-T8-18', name: 'LED T8 tube 18W',             wh: 'WH-B', bin: 'C-08-2', onHand: 96,   reserved: 24,  avail: 72,   transit: 0,  updated: 'Yesterday' },
    { sku: 'WD-OAK-12', name: 'Oak plank 12mm 1.2m',         wh: 'Yard', bin: 'Y-12-A', onHand: 0,    reserved: 0,   avail: 0,    transit: 240,updated: '3 days ago' },
    { sku: 'PT-WHT-5G', name: 'Interior paint white 5 gal',  wh: 'WH-A', bin: 'E-11-4', onHand: 64,   reserved: 12,  avail: 52,   transit: 0,  updated: 'Yesterday' },
    { sku: 'TR-SPN-10', name: 'Spanner set 10pc chrome',     wh: 'WH-A', bin: 'F-03-1', onHand: 28,   reserved: 4,   avail: 24,   transit: 0,  updated: 'Yesterday' },
    { sku: 'SF-GLV-NIT',name: 'Nitrile glove M (100)',       wh: 'WH-B', bin: 'G-01-2', onHand: 1240, reserved: 60,  avail: 1180, transit: 0,  updated: '2 days ago' },
    { sku: 'CEM-PT-50', name: 'Portland cement 50kg',        wh: 'Yard', bin: 'Y-04-B', onHand: 182,  reserved: 80,  avail: 102,  transit: 0,  updated: 'Today' },
    { sku: 'CB-CAT6-30',name: 'Cat6 patch cable 30m',        wh: 'WH-B', bin: 'C-09-3', onHand: 8,    reserved: 12,  avail: -4,   transit: 60, updated: 'Yesterday' },
    { sku: 'BAT-12V-7A',name: 'Sealed lead-acid 12V 7Ah',    wh: 'WH-B', bin: 'C-12-1', onHand: 0,    reserved: 0,   avail: 0,    transit: 24, updated: '4 days ago' },
  ],
};

const transactions = {
  title: 'Stock Movements',
  subtitle: 'Audit trail — every increase and decrease of quantity, with source document.',
  purpose: 'Total transparency over inventory: every quantity change records who, when, why, and which document caused it. Use to debug stock discrepancies and meet audit requirements.',
  actions: [
    { label: 'Export', icon: 'fa-download' },
    { label: 'Record movement', icon: 'fa-plus', primary: true, pageId: 'record-movement' },
  ],
  kpis: [
    { label: 'Movements today', value: 142,    sublabel: '8 different SKUs' },
    { label: 'In',              value: '+482', sublabel: 'units received', color: 'var(--c-pos)' },
    { label: 'Out',             value: '-624', sublabel: 'units shipped',  color: 'var(--c-neg)' },
    { label: 'Adjustments',     value: 4,      sublabel: 'manual today' },
  ],
  filters: [['All types','Receipt','Sale','Transfer','Adjust','Return'], ['All warehouses','WH-A','WH-B','Yard']],
  columns: [
    { key: 'date', label: 'Time',     type: 'date' },
    { key: 'sku',  label: 'SKU',      type: 'id' },
    { key: 'name', label: 'Product',  type: 'jsx', render: r => <span className="fw-6">{r.name}</span> },
    { key: 'type', label: 'Type',     type: 'tag' },
    { key: 'qty',  label: 'Qty',      type: 'jsx', render: r => <span className="mono fw-6" style={{ color: r.qty > 0 ? 'var(--c-pos)' : 'var(--c-neg)' }}>{r.qty > 0 ? '+' : ''}{r.qty}</span>, align: 'right' },
    { key: 'from', label: 'From',     type: 'id' },
    { key: 'to',   label: 'To',       type: 'id' },
    { key: 'doc',  label: 'Document', type: 'id' },
    { key: 'by',   label: 'By',       type: 'user' },
  ],
  rows: [
    { date: '09:42', sku: 'HX-12-440', name: 'Heavy-duty hex bolt M12',  type: 'Sale',     qty: -240,  from: 'A-12-3', to: 'Shipped',  doc: 'SO-10284', by: USERS[0] },
    { date: '09:28', sku: 'PVC-2-90',  name: 'PVC elbow 2" 90°',         type: 'Receipt',  qty: +80,   from: 'GRN',    to: 'B-04-1',   doc: 'GRN-4428', by: USERS[1] },
    { date: '09:14', sku: 'PT-WHT-5G', name: 'Interior paint white 5g',  type: 'Sale',     qty: -2,    from: 'E-11-4', to: 'Shipped',  doc: 'POS-8821', by: USERS[3] },
    { date: '08:56', sku: 'LED-T8-18', name: 'LED T8 tube 18W',          type: 'Transfer', qty: +24,   from: 'WH-A',   to: 'WH-B',     doc: 'T-0219',   by: USERS[1] },
    { date: '08:48', sku: 'LED-T8-18', name: 'LED T8 tube 18W',          type: 'Transfer', qty: -24,   from: 'A-08-1', to: 'C-08-2',   doc: 'T-0219',   by: USERS[1] },
    { date: '08:32', sku: 'CB-CAT6-30',name: 'Cat6 patch cable 30m',     type: 'Adjust',   qty: -4,    from: 'C-09-3', to: 'Damaged',  doc: 'ADJ-184',  by: USERS[1] },
    { date: '08:18', sku: 'SF-GLV-NIT',name: 'Nitrile glove M (100)',    type: 'Sale',     qty: -60,   from: 'G-01-2', to: 'Shipped',  doc: 'SO-10283', by: USERS[0] },
    { date: '08:02', sku: 'CEM-PT-50', name: 'Portland cement 50kg',     type: 'Receipt',  qty: +120,  from: 'Yard',   to: 'Y-04-B',   doc: 'GRN-4427', by: USERS[1] },
    { date: '07:46', sku: 'WD-OAK-12', name: 'Oak plank 12mm 1.2m',      type: 'Return',   qty: +6,    from: 'Customer',to:'Y-12-A',   doc: 'CN-0312',  by: USERS[3] },
  ],
};

const transfers = {
  title: 'Transfers',
  subtitle: 'Move stock between warehouses or bins — in transit until received.',
  purpose: 'A transfer is a multi-step move: a source location decrements, in-transit increments, and finally the destination increments on receipt. Use to rebalance, supply storefronts from a hub, or repack damaged stock.',
  actions: [{ label: 'New transfer', icon: 'fa-plus', primary: true, pageId: 'new-transfer' }],
  kpis: [
    { label: 'Open transfers', value: 4,    sublabel: '128 units in transit' },
    { label: 'Avg transit time', value: '14 h', sublabel: 'last 30 days' },
    { label: 'Discrepancies',  value: 1,    sublabel: 'on receipt this week', color: 'var(--c-warn)' },
    { label: 'Completed MTD',  value: 18,   sublabel: '1,840 units moved' },
  ],
  tabs: [
    { id: 'open', label: 'Open',      count: 4, filter: r => r.status !== 'received' },
    { id: 'done', label: 'Completed', count: 14, filter: r => r.status === 'received' },
  ],
  columns: [
    { key: 'id',     label: 'Transfer #', type: 'id' },
    { key: 'date',   label: 'Initiated',  type: 'date' },
    { key: 'from',   label: 'From',       type: 'tag' },
    { key: 'to',     label: 'To',         type: 'tag' },
    { key: 'items',  label: 'Items',      type: 'progress' },
    { key: 'by',     label: 'Initiated by', type: 'user' },
    { key: 'eta',    label: 'ETA',        type: 'date' },
    { key: 'status', label: 'Status',     type: 'pill',
      tone: v => ({draft:'muted',transit:'info',received:'pos',discrep:'warn'})[v] },
  ],
  rows: [
    { id: 'T-0221', date: 'Today',     from: 'WH-A', to: 'WH-B',   items: { done: 0,  total: 60 }, by: USERS[1], eta: 'Tomorrow', status: 'transit' },
    { id: 'T-0220', date: 'Today',     from: 'Yard', to: 'WH-A',   items: { done: 0,  total: 28 }, by: USERS[1], eta: 'Today',    status: 'transit' },
    { id: 'T-0219', date: 'Yesterday', from: 'WH-A', to: 'WH-B',   items: { done: 24, total: 24 }, by: USERS[1], eta: 'Yesterday',status: 'received' },
    { id: 'T-0218', date: 'Yesterday', from: 'WH-B', to: 'WH-A',   items: { done: 38, total: 40 }, by: USERS[0], eta: 'Yesterday',status: 'discrep' },
    { id: 'T-0217', date: '2 days ago',from: 'WH-A', to: 'Store-1',items: { done: 14, total: 14 }, by: USERS[0], eta: '2 days ago',status: 'received' },
    { id: 'T-0216', date: '3 days ago',from: 'Yard', to: 'WH-B',   items: { done: 60, total: 60 }, by: USERS[1], eta: '3 days ago',status: 'received' },
    { id: 'T-0215', date: '4 days ago',from: 'WH-A', to: 'Yard',   items: { done: 0,  total: 40 }, by: USERS[1], eta: '4 days ago',status: 'draft' },
  ],
};

const adjustments = {
  title: 'Stock Adjustments',
  subtitle: 'Manually correct on-hand quantities — write up, write down, scrap, reclass.',
  purpose: 'Sometimes physical stock disagrees with the system: damage, theft, found-stock, expiry. Adjustments record the reason, post the cost variance to the right GL account, and keep the audit trail clean.',
  actions: [{ label: 'New adjustment', icon: 'fa-plus', primary: true, pageId: 'new-adjustment' }],
  kpis: [
    { label: 'Adjustments MTD',  value: 28,     sublabel: 'across 18 SKUs' },
    { label: 'Net value impact', value: -1_240, money: true, sublabel: 'this month', color: 'var(--c-neg)' },
    { label: 'Top reason',       value: 'Damage', sublabel: '38% of cases' },
    { label: 'Awaiting approval',value: 2,      sublabel: '> $500 threshold', color: 'var(--c-warn)' },
  ],
  columns: [
    { key: 'id',     label: 'Adj #',    type: 'id' },
    { key: 'date',   label: 'Date',     type: 'date' },
    { key: 'sku',    label: 'SKU',      type: 'id' },
    { key: 'name',   label: 'Product',  type: 'jsx', render: r => <span className="fw-6">{r.name}</span> },
    { key: 'reason', label: 'Reason',   type: 'tag' },
    { key: 'qty',    label: 'Qty',      type: 'jsx', render: r => <span className="mono fw-6" style={{ color: r.qty > 0 ? 'var(--c-pos)' : 'var(--c-neg)' }}>{r.qty > 0 ? '+' : ''}{r.qty}</span>, align: 'right' },
    { key: 'value',  label: 'Value',    type: 'money-signed', align: 'right', dp: 2 },
    { key: 'by',     label: 'By',       type: 'user' },
    { key: 'status', label: 'Status',   type: 'pill',
      tone: v => ({posted:'pos',pending:'warn'})[v] },
  ],
  rows: [
    { id: 'ADJ-188', date: 'Today',     sku: 'CB-CAT6-30',name: 'Cat6 patch cable 30m', reason: 'Damage',     qty: -4,  value: -65.60,  by: USERS[1], status: 'posted' },
    { id: 'ADJ-187', date: 'Today',     sku: 'LED-T8-18', name: 'LED T8 tube 18W',      reason: 'Damage',     qty: -2,  value: -16.20,  by: USERS[1], status: 'pending' },
    { id: 'ADJ-186', date: 'Yesterday', sku: 'PT-WHT-5G', name: 'Interior paint white', reason: 'Expiry',     qty: -1,  value: -41.20,  by: USERS[1], status: 'posted' },
    { id: 'ADJ-185', date: '2 days ago',sku: 'HX-12-440', name: 'Heavy-duty hex bolt',  reason: 'Cycle count',qty: +12, value: +2.16,   by: USERS[0], status: 'posted' },
    { id: 'ADJ-184', date: '3 days ago',sku: 'TR-SPN-10', name: 'Spanner set 10pc',     reason: 'Theft',      qty: -1,  value: -84.00,  by: USERS[1], status: 'pending' },
    { id: 'ADJ-183', date: '4 days ago',sku: 'SF-GLV-NIT',name: 'Nitrile glove M',      reason: 'Found',      qty: +24, value: +252.00, by: USERS[1], status: 'posted' },
    { id: 'ADJ-182', date: '5 days ago',sku: 'CEM-PT-50', name: 'Portland cement 50kg', reason: 'Damage',     qty: -3,  value: -24.60,  by: USERS[1], status: 'posted' },
  ],
};

const stockcount = {
  title: 'Stock Counts',
  subtitle: 'Cycle counts and full inventory counts — find discrepancies before they surprise you.',
  purpose: 'A stock count is a physical recount of all (or a slice of) stock to confirm what the system says. Cycle counts run weekly on high-velocity items; full counts run at year-end. Variances post as adjustments automatically.',
  actions: [
    { label: 'Generate cycle plan', icon: 'fa-shuffle' },
    { label: 'Start count', icon: 'fa-plus', primary: true, pageId: 'start-count' },
  ],
  kpis: [
    { label: 'Active counts',     value: 1,    sublabel: 'Zone A — in progress' },
    { label: 'Accuracy YTD',      value: '98.4%', delta: +0.6, sublabel: 'system vs physical' },
    { label: 'Last full count',   value: 'Dec 31', sublabel: '142 days ago' },
    { label: 'Variance value YTD',value: -842, money: true, sublabel: 'net shrinkage', color: 'var(--c-warn)' },
  ],
  columns: [
    { key: 'id',       label: 'Count #', type: 'id' },
    { key: 'type',     label: 'Type',    type: 'tag' },
    { key: 'scope',    label: 'Scope',   type: 'jsx', render: r => <span className="fw-6">{r.scope}</span> },
    { key: 'started',  label: 'Started', type: 'date' },
    { key: 'closed',   label: 'Closed',  type: 'date' },
    { key: 'progress', label: 'Progress',type: 'progress' },
    { key: 'variance', label: 'Variance',type: 'money-signed', align: 'right', dp: 2 },
    { key: 'status',   label: 'Status',  type: 'pill',
      tone: v => ({progress:'info',done:'pos',planned:'muted'})[v] },
  ],
  rows: [
    { id: 'SC-0048', type: 'Cycle',    scope: 'Zone A — fasteners',     started: 'Today',     closed: '—',     progress: { done: 84, total: 142 }, variance: 0,       status: 'progress' },
    { id: 'SC-0047', type: 'Cycle',    scope: 'Zone C — electrical',    started: 'Yesterday', closed: 'Today', progress: { done: 96, total: 96  }, variance: -82.40,  status: 'done' },
    { id: 'SC-0046', type: 'Cycle',    scope: 'Zone E — paint',         started: '3 days ago',closed: '2 days ago', progress: { done: 64, total: 64  }, variance: -41.20, status: 'done' },
    { id: 'SC-0045', type: 'Cycle',    scope: 'Zone F — tools',         started: '1 wk ago',  closed: '6 days ago', progress: { done: 28, total: 28  }, variance: -84.00, status: 'done' },
    { id: 'SC-0044', type: 'Spot',     scope: 'SKU HX-12-440',          started: '1 wk ago',  closed: '1 wk ago',   progress: { done: 1,  total: 1   }, variance: +2.16,  status: 'done' },
    { id: 'SC-0049', type: 'Full',     scope: 'Year-end full count',    started: '—',         closed: '—',     progress: { done: 0,  total: 1284}, variance: 0,       status: 'planned' },
  ],
};

const locations = {
  title: 'Locations',
  subtitle: 'Warehouses, zones, aisles, bins — the physical map of your stock.',
  purpose: 'The hierarchy that tells the system where things live. Each bin has a unique address, a capacity, restrictions (heavy, hazmat, refrigerated). The pick path is generated from this map.',
  actions: [{ label: 'Print map', icon: 'fa-map' }, { label: 'New location', icon: 'fa-plus', primary: true, pageId: 'new-location' }],
  kpis: [
    { label: 'Warehouses', value: 3,   sublabel: '2 buildings + outdoor yard' },
    { label: 'Bins total', value: 800, sublabel: 'across all warehouses' },
    { label: 'Bins occupied', value: 624, sublabel: '78% utilisation' },
    { label: 'Bins reserved', value: 12, sublabel: 'hold for receipt', color: 'var(--c-info)' },
  ],
  columns: [
    { key: 'code',     label: 'Code',    type: 'id' },
    { key: 'name',     label: 'Name',    type: 'jsx', render: r => <span className="fw-6">{r.name}</span> },
    { key: 'type',     label: 'Type',    type: 'tag' },
    { key: 'parent',   label: 'Parent',  type: 'tag' },
    { key: 'cap',      label: 'Capacity',type: 'jsx', render: r => <span className="mono">{r.cap}</span>, align: 'right' },
    { key: 'occ',      label: 'Occupied',type: 'jsx', render: r => (
      <div className="row gap-2" style={{ minWidth: 120, justifyContent: 'flex-end' }}>
        <span className="mono fw-6">{r.occPct}%</span>
        <div className="bar" style={{ width: 60, height: 4 }}>
          <span style={{ width: r.occPct + '%', background: r.occPct > 90 ? 'var(--c-warn)' : 'var(--c-pos)' }} />
        </div>
      </div>
    ), align: 'right' },
    { key: 'restrict', label: 'Restrictions', type: 'tag' },
  ],
  rows: [
    { code: 'WH-A',   name: 'Warehouse A — main',     type: 'Warehouse',  parent: '—',     cap: '480 bins', occPct: 82, restrict: '—' },
    { code: 'WH-B',   name: 'Warehouse B — overflow', type: 'Warehouse',  parent: '—',     cap: '240 bins', occPct: 64, restrict: '—' },
    { code: 'YARD',   name: 'Outdoor yard',           type: 'Yard',       parent: '—',     cap: '80 bays',  occPct: 92, restrict: 'Bulky' },
    { code: 'A-Z01',  name: 'Zone A — Fasteners',     type: 'Zone',      parent: 'WH-A',  cap: '120 bins', occPct: 78, restrict: '—' },
    { code: 'A-Z02',  name: 'Zone B — Plumbing',      type: 'Zone',      parent: 'WH-A',  cap: '80 bins',  occPct: 84, restrict: '—' },
    { code: 'A-12-3', name: 'Bin A-12-3',             type: 'Bin',       parent: 'A-Z01', cap: '4 pallets',occPct: 100,restrict: '—' },
    { code: 'B-04-1', name: 'Bin B-04-1',             type: 'Bin',       parent: 'A-Z02', cap: '2 pallets',occPct: 50, restrict: '—' },
    { code: 'COLD-1', name: 'Refrigerated bay',       type: 'Zone',      parent: 'WH-B',  cap: '12 bins',  occPct: 42, restrict: 'Cold ≤ 8°C' },
    { code: 'HAZ-1',  name: 'Hazmat cage',            type: 'Zone',      parent: 'WH-B',  cap: '8 bins',   occPct: 38, restrict: 'Hazmat' },
  ],
};

/* ============================================================
   INVENTORY (the products list lives elsewhere as bespoke)
   ============================================================ */
const reorder = {
  title: 'Reorder Center',
  subtitle: 'Items below reorder point — suggested quantities ready to convert to POs.',
  purpose: 'The system watches every SKU\'s on-hand quantity against its reorder point and supplier lead time. Anything that needs to be re-ordered surfaces here with a suggested quantity based on usage velocity. Approve to create POs in one batch.',
  actions: [
    { label: 'Reorder rules', icon: 'fa-sliders', pageId: 'reorder-rules' },
    { label: 'Create POs from selected', icon: 'fa-shopping-cart', primary: true, pageId: 'create-reorder-pos' },
  ],
  kpis: [
    { label: 'Items below reorder', value: 14,    sublabel: '4 already out of stock', color: 'var(--c-warn)' },
    { label: 'Suggested spend',     value: 42_180,money: true, sublabel: '6 POs proposed' },
    { label: 'Stock-out days saved',value: '8.2 d',sublabel: 'avg lead time' },
    { label: 'Auto-reordered MTD',  value: 18,    sublabel: '$84k spend' },
  ],
  filters: [['All suppliers','Polyflo','Lumio','IronGrip','Cascade']],
  columns: [
    { key: 'sku',      label: 'SKU',      type: 'id' },
    { key: 'name',     label: 'Product',  type: 'avatar' },
    { key: 'supplier', label: 'Preferred supplier', type: 'tag' },
    { key: 'onHand',   label: 'On hand',  type: 'jsx', render: r => <span className="mono fw-6" style={{ color: r.onHand === 0 ? 'var(--c-neg)' : 'var(--c-warn)' }}>{r.onHand}</span>, align: 'right' },
    { key: 'rp',       label: 'Reorder point', type: 'num', align: 'right' },
    { key: 'velocity', label: 'Velocity/day', type: 'jsx', render: r => <span className="mono">{r.velocity}</span>, align: 'right' },
    { key: 'lead',     label: 'Lead time',type: 'jsx', render: r => <span className="muted">{r.lead}</span>, align: 'right' },
    { key: 'suggest',  label: 'Suggest',  type: 'jsx', render: r => <span className="mono fw-7" style={{ color: 'var(--brand)' }}>+{r.suggest}</span>, align: 'right' },
    { key: 'cost',     label: 'Est. cost',type: 'money', align: 'right', dp: 0 },
  ],
  rows: [
    { sku: 'LED-T8-18', name: 'LED T8 tube 18W',          supplier: 'Lumio',    onHand: 96,  rp: 120, velocity: 4.2,  lead: '5 d',  suggest: 240, cost: 1944 },
    { sku: 'WD-OAK-12', name: 'Oak plank 12mm 1.2m',      supplier: 'Cascade',  onHand: 0,   rp: 24,  velocity: 1.8,  lead: '14 d', suggest: 60,  cost: 810 },
    { sku: 'TR-SPN-10', name: 'Spanner set 10pc chrome',  supplier: 'IronGrip', onHand: 28,  rp: 40,  velocity: 0.8,  lead: '21 d', suggest: 20,  cost: 1680 },
    { sku: 'CB-CAT6-30',name: 'Cat6 patch cable 30m',     supplier: 'Lumio',    onHand: 8,   rp: 30,  velocity: 1.2,  lead: '5 d',  suggest: 60,  cost: 984 },
    { sku: 'PMP-CW-1HP',name: 'Centrifugal water pump 1HP',supplier:'Hydrox',   onHand: 12,  rp: 16,  velocity: 0.4,  lead: '21 d', suggest: 10,  cost: 2850 },
    { sku: 'BAT-12V-7A',name: 'Sealed lead-acid 12V 7Ah', supplier: 'PowerCell',onHand: 0,   rp: 40,  velocity: 1.4,  lead: '10 d', suggest: 60,  cost: 1320 },
    { sku: 'PT-WHT-5G', name: 'Interior paint white 5 gal',supplier:'Beacon',   onHand: 64,  rp: 80,  velocity: 1.2,  lead: '7 d',  suggest: 40,  cost: 1648 },
  ],
};

const categories = {
  title: 'Product Categories',
  subtitle: 'The taxonomy tree that organises every product — drives reports, margins, and reorder rules.',
  purpose: 'Categories are the hierarchical labels that turn 1,200 SKUs into something analysable. They drive margin reports by department, set default GL accounts, and determine which reorder rule template applies.',
  actions: [{ label: 'Reorganise tree', icon: 'fa-sitemap' }, { label: 'New category', icon: 'fa-plus', primary: true, pageId: 'new-category' }],
  kpis: [
    { label: 'Total categories', value: 28,     sublabel: 'across 4 levels' },
    { label: 'Largest',          value: 'Electrical', sublabel: '218 SKUs' },
    { label: 'Top margin',       value: 'Adhesives',  sublabel: '51% avg' },
    { label: 'Untagged SKUs',    value: 4,      sublabel: 'awaiting categorisation', color: 'var(--c-warn)' },
  ],
  columns: [
    { key: 'name',    label: 'Category', type: 'jsx', render: r => (
      <div className="row gap-2">
        {r.level > 0 && <span style={{ width: r.level * 16 }} />}
        <i className={'fa-solid ' + (r.level === 0 ? 'fa-folder-open' : 'fa-tag')} style={{ color: r.level === 0 ? 'var(--brand)' : 'var(--text-3)', fontSize: 11 }} />
        <span className="fw-6">{r.name}</span>
      </div>
    ) },
    { key: 'code',    label: 'Code',     type: 'id' },
    { key: 'skus',    label: 'SKUs',     type: 'num', align: 'right' },
    { key: 'value',   label: 'Inventory value', type: 'money', align: 'right', dp: 0 },
    { key: 'margin',  label: 'Avg margin', type: 'jsx', render: r => <span className="mono fw-6" style={{ color: r.margin >= 50 ? 'var(--c-pos)' : 'var(--text)' }}>{r.margin}%</span>, align: 'right' },
    { key: 'gl',      label: 'Default GL', type: 'tag' },
  ],
  rows: [
    { name: 'Hardware',      level: 0, code: 'HW',    skus: 280, value: 84_200,  margin: 48, gl: '5000 — COGS Hardware' },
    { name: 'Fasteners',     level: 1, code: 'HW-FS', skus: 124, value: 18_240,  margin: 57, gl: '5000' },
    { name: 'Tools',         level: 1, code: 'HW-TL', skus: 96,  value: 38_400,  margin: 41, gl: '5000' },
    { name: 'Building',      level: 0, code: 'BL',    skus: 184, value: 124_000, margin: 42, gl: '5010 — COGS Building' },
    { name: 'Cement',        level: 1, code: 'BL-CM', skus: 24,  value: 14_840,  margin: 36, gl: '5010' },
    { name: 'Lumber',        level: 1, code: 'BL-LU', skus: 80,  value: 64_200,  margin: 39, gl: '5010' },
    { name: 'Tile',          level: 1, code: 'BL-TL', skus: 40,  value: 28_400,  margin: 54, gl: '5010' },
    { name: 'Electrical',    level: 0, code: 'EL',    skus: 218, value: 96_400,  margin: 44, gl: '5020 — COGS Electrical' },
    { name: 'Lighting',      level: 1, code: 'EL-LT', skus: 84,  value: 32_400,  margin: 44, gl: '5020' },
    { name: 'Cables',        level: 1, code: 'EL-CB', skus: 64,  value: 18_240,  margin: 41, gl: '5020' },
    { name: 'Batteries',     level: 1, code: 'EL-BT', skus: 32,  value: 8_400,   margin: 39, gl: '5020' },
    { name: 'Plumbing',      level: 0, code: 'PL',    skus: 96,  value: 42_180,  margin: 56, gl: '5030 — COGS Plumbing' },
    { name: 'Paint',         level: 0, code: 'PT',    skus: 64,  value: 18_240,  margin: 47, gl: '5040' },
    { name: 'Adhesives',     level: 0, code: 'AD',    skus: 38,  value: 4_280,   margin: 51, gl: '5050' },
    { name: 'Safety',        level: 0, code: 'SF',    skus: 48,  value: 14_840,  margin: 43, gl: '5060' },
    { name: 'Insulation',    level: 0, code: 'IN',    skus: 18,  value: 12_400,  margin: 41, gl: '5070' },
  ],
};

const brands = {
  title: 'Brands',
  subtitle: 'Brands you carry — track performance, margins, and stock concentration.',
  purpose: 'Each product is associated with a manufacturer brand. Use this view to spot brands you over-rely on, brands with poor sell-through, and brands with the best margins for promotion.',
  actions: [{ label: 'New brand', icon: 'fa-plus', primary: true, pageId: 'new-brand' }],
  kpis: [
    { label: 'Active brands', value: 24,  sublabel: '2 added this quarter' },
    { label: 'Top by revenue', value: 'Polyflo', sublabel: '$84k YTD' },
    { label: 'Top by margin', value: 'BondTek',  sublabel: '52% avg' },
    { label: 'Single-source SKUs', value: 184, sublabel: 'no alternate brand', color: 'var(--c-warn)' },
  ],
  columns: [
    { key: 'logo',    label: '', type: 'jsx', render: r => <div className="thumb brand" style={{ width: 30, height: 30, marginRight: 0 }}>{r.name.slice(0,2)}</div> },
    { key: 'name',    label: 'Brand',  type: 'jsx', render: r => <span className="fw-6">{r.name}</span> },
    { key: 'cat',     label: 'Primary category', type: 'tag' },
    { key: 'skus',    label: 'SKUs',   type: 'num', align: 'right' },
    { key: 'stock',   label: 'Stock value', type: 'money', align: 'right', dp: 0 },
    { key: 'ytd',     label: 'YTD revenue', type: 'money', align: 'right', dp: 0 },
    { key: 'margin',  label: 'Avg margin',  type: 'jsx', render: r => <span className="mono fw-6">{r.margin}%</span>, align: 'right' },
    { key: 'supplier',label: 'Supplier',type: 'tag' },
  ],
  rows: [
    { name: 'Polyflo',  cat: 'Plumbing',    skus: 84,  stock: 24_840,  ytd: 184_240, margin: 56, supplier: 'Polyflo Industries' },
    { name: 'Lumio',    cat: 'Electrical',  skus: 124, stock: 42_180,  ytd: 142_400, margin: 44, supplier: 'Lumio Electrical' },
    { name: 'Atlas',    cat: 'Fasteners',   skus: 96,  stock: 14_840,  ytd: 96_400,  margin: 57, supplier: 'Atlas Fasteners' },
    { name: 'IronGrip', cat: 'Tools',       skus: 64,  stock: 38_400,  ytd: 78_400,  margin: 41, supplier: 'IronGrip Tools Co.' },
    { name: 'Beacon',   cat: 'Paint',       skus: 48,  stock: 18_240,  ytd: 56_400,  margin: 47, supplier: 'Beacon Paint Works' },
    { name: 'GuardPro', cat: 'Safety',      skus: 28,  stock: 14_840,  ytd: 38_400,  margin: 43, supplier: 'GuardPro Safety' },
    { name: 'Cascade',  cat: 'Lumber',      skus: 60,  stock: 48_400,  ytd: 84_200,  margin: 39, supplier: 'Cascade Lumber Supply' },
    { name: 'BondTek',  cat: 'Adhesives',   skus: 24,  stock: 4_180,   ytd: 18_400,  margin: 52, supplier: 'BondTek Adhesives' },
    { name: 'Hydrox',   cat: 'Machinery',   skus: 12,  stock: 14_400,  ytd: 24_800,  margin: 30, supplier: 'Hydrox Pumps' },
    { name: 'Stratos',  cat: 'Building',    skus: 84,  stock: 64_200,  ytd: 96_400,  margin: 42, supplier: 'Stratos Building Materials' },
  ],
};

const units = {
  title: 'Units of Measure',
  subtitle: 'How you count things — pieces, boxes, pallets, meters, kilograms. Plus conversions.',
  purpose: 'Most SKUs are bought one way (pallet) but sold another (piece). Define the base unit, the alternate units, and the conversion factors here. The system then handles "how many pieces in the pallet just received" automatically.',
  actions: [{ label: 'New unit', icon: 'fa-plus', primary: true, pageId: 'new-unit' }],
  kpis: [
    { label: 'Base units',    value: 12,  sublabel: 'across all SKUs' },
    { label: 'With conversions', value: 28, sublabel: 'multi-unit SKUs' },
    { label: 'Custom units',  value: 4,   sublabel: 'business-specific' },
    { label: 'Unused',        value: 2,   sublabel: 'no SKU references', color: 'var(--c-warn)' },
  ],
  columns: [
    { key: 'code',     label: 'Code',  type: 'id' },
    { key: 'name',     label: 'Name',  type: 'jsx', render: r => <span className="fw-6">{r.name}</span> },
    { key: 'system',   label: 'System',type: 'tag' },
    { key: 'base',     label: 'Base',  type: 'tag' },
    { key: 'factor',   label: 'Factor to base', type: 'jsx', render: r => <span className="mono">{r.factor}</span>, align: 'right' },
    { key: 'usedBy',   label: 'Used by', type: 'num', align: 'right' },
    { key: 'desc',     label: 'Note',  type: 'jsx', render: r => <span className="muted-2 t-sm">{r.desc}</span> },
  ],
  rows: [
    { code: 'pcs',  name: 'Piece',          system: 'Count',   base: 'pcs', factor: 1,    usedBy: 824, desc: 'Default count unit' },
    { code: 'box',  name: 'Box of 100',     system: 'Count',   base: 'pcs', factor: 100,  usedBy: 42,  desc: 'Bulk consumables' },
    { code: 'pal',  name: 'Pallet',         system: 'Count',   base: 'pcs', factor: 240,  usedBy: 18,  desc: 'Std EUR pallet' },
    { code: 'set',  name: 'Set',            system: 'Count',   base: 'set', factor: 1,    usedBy: 38,  desc: 'Tool sets, fastener kits' },
    { code: 'm',    name: 'Meter',          system: 'Length',  base: 'm',   factor: 1,    usedBy: 64,  desc: 'Cable & rope' },
    { code: 'roll', name: 'Roll',           system: 'Length',  base: 'm',   factor: 30,   usedBy: 24,  desc: 'Cable roll = 30 m' },
    { code: 'kg',   name: 'Kilogram',       system: 'Weight',  base: 'kg',  factor: 1,    usedBy: 28,  desc: 'Loose goods' },
    { code: 'bag',  name: 'Bag 50kg',       system: 'Weight',  base: 'kg',  factor: 50,   usedBy: 12,  desc: 'Cement & aggregate' },
    { code: 'gal',  name: 'Gallon (US)',    system: 'Volume',  base: 'L',   factor: 3.785,usedBy: 18,  desc: 'Paint & solvent' },
    { code: 'L',    name: 'Litre',          system: 'Volume',  base: 'L',   factor: 1,    usedBy: 14,  desc: '—' },
  ],
};

const barcode = {
  title: 'Barcodes & Labels',
  subtitle: 'Generate, print, and reprint bin tags, SKU labels, and shelf talkers.',
  purpose: 'Every receipt, sale and movement reads a barcode. Generate code128, EAN-13, QR or 2D variants; print individual labels on the desktop or send batches to the warehouse Zebra. Templates control layout per use.',
  actions: [
    { label: 'Label templates', icon: 'fa-sliders' },
    { label: 'Print queue', icon: 'fa-print', primary: true, pageId: 'new-barcode' },
  ],
  kpis: [
    { label: 'Labels printed today', value: 1_284,sublabel: 'across 3 Zebras' },
    { label: 'In queue',             value: 18,   sublabel: 'awaiting Zebra-A' },
    { label: 'Unscannable SKUs',     value: 2,    sublabel: 'damaged barcode', color: 'var(--c-warn)' },
    { label: 'Active templates',     value: 8,    sublabel: 'shelf, bin, pallet…' },
  ],
  tabs: [
    { id: 'queue', label: 'Print queue', count: 18, filter: r => r.status === 'queued' },
    { id: 'done',  label: 'Printed today', count: 84, filter: r => r.status === 'printed' },
  ],
  columns: [
    { key: 'job',    label: 'Job #',   type: 'id' },
    { key: 'time',   label: 'Time',    type: 'date' },
    { key: 'type',   label: 'Label',   type: 'tag' },
    { key: 'desc',   label: 'Content', type: 'jsx', render: r => <span className="fw-6">{r.desc}</span> },
    { key: 'qty',    label: 'Qty',     type: 'jsx', render: r => <span className="mono fw-6">×{r.qty}</span>, align: 'right' },
    { key: 'printer',label: 'Printer', type: 'tag' },
    { key: 'by',     label: 'By',      type: 'user' },
    { key: 'status', label: 'Status',  type: 'pill',
      tone: v => ({printed:'pos',queued:'warn',failed:'neg'})[v] },
  ],
  rows: [
    { job: 'LBL-3284', time: 'Today 09:42', type: 'Bin tag',    desc: 'B-04-1 → B-04-9 (9 bins)',    qty: 9,   printer: 'Zebra-A', by: USERS[1], status: 'queued' },
    { job: 'LBL-3283', time: 'Today 09:28', type: 'SKU label',  desc: 'PVC-2-90 — PVC elbow 2" 90°', qty: 80,  printer: 'Zebra-A', by: USERS[1], status: 'printed' },
    { job: 'LBL-3282', time: 'Today 09:18', type: 'Shelf talker',desc:'PT-WHT-5G — Sale tag',         qty: 4,   printer: 'Desktop', by: USERS[0], status: 'printed' },
    { job: 'LBL-3281', time: 'Today 08:56', type: 'Pallet',     desc: 'GRN-4428 — Polyflo intake',   qty: 4,   printer: 'Zebra-B', by: USERS[1], status: 'printed' },
    { job: 'LBL-3280', time: 'Today 08:44', type: 'SKU label',  desc: 'LED-T8-18 — LED T8 tube',     qty: 24,  printer: 'Zebra-A', by: USERS[1], status: 'queued' },
    { job: 'LBL-3279', time: 'Today 08:30', type: 'Pickface',   desc: 'Zone A cleanup batch',        qty: 142, printer: 'Zebra-A', by: USERS[1], status: 'queued' },
    { job: 'LBL-3278', time: 'Yesterday',   type: 'Bin tag',    desc: 'C-09-3 reprint',              qty: 1,   printer: 'Desktop', by: USERS[1], status: 'failed' },
  ],
};

/* ============================================================
   SYSTEM
   ============================================================ */
const activity = {
  title: 'Activity Log',
  subtitle: 'Every action by every user — searchable, exportable, audit-ready.',
  purpose: 'The audit trail. Every create, edit, delete, login, and approval is recorded with user, IP, timestamp and before/after values. Use it to investigate incidents and prove compliance.',
  actions: [{ label: 'Export CSV', icon: 'fa-download' }],
  kpis: [
    { label: 'Events today',    value: 482,   sublabel: 'across 14 users' },
    { label: 'Sign-ins today',  value: 28,    sublabel: '0 failed', color: 'var(--c-pos)' },
    { label: 'Sensitive actions', value: 12,  sublabel: 'price changes, refunds', color: 'var(--c-warn)' },
    { label: 'Retention',       value: '2 yr',sublabel: 'log kept' },
  ],
  filters: [['All users','Maria R.','Daniel K.','Priya S.'], ['All actions','create','update','delete','sign-in']],
  columns: [
    { key: 'time',   label: 'Time',     type: 'date' },
    { key: 'who',    label: 'User',     type: 'user' },
    { key: 'action', label: 'Action',   type: 'tag' },
    { key: 'target', label: 'Target',   type: 'id' },
    { key: 'detail', label: 'Detail',   type: 'jsx', render: r => <span className="muted-2 t-sm">{r.detail}</span> },
    { key: 'ip',     label: 'IP',       type: 'jsx', render: r => <span className="mono muted t-xs">{r.ip}</span> },
  ],
  rows: [
    { time: '09:42', who: USERS[0], action: 'fulfilled',  target: 'SO-10283',  detail: 'Northwind Industrial · $11,240',           ip: '10.0.4.21' },
    { time: '09:38', who: USERS[1], action: 'received',   target: 'GRN-4428',  detail: 'Polyflo · 18 line items',                  ip: '10.0.4.42' },
    { time: '09:14', who: USERS[3], action: 'sold',       target: 'POS-8821',  detail: 'Walk-in customer · $156.80',               ip: '10.0.4.18' },
    { time: '09:08', who: USERS[2], action: 'created',    target: 'JE-2284',   detail: 'May rent accrual · $8,400',                ip: '10.0.4.62' },
    { time: '08:56', who: USERS[1], action: 'transferred',target: 'T-0219',    detail: 'WH-A → WH-B · 24 units LED-T8-18',         ip: '10.0.4.42' },
    { time: '08:42', who: USERS[2], action: 'approved',   target: 'EXP-1282',  detail: 'Notion subscription · $96',                ip: '10.0.4.62' },
    { time: '08:32', who: USERS[1], action: 'adjusted',   target: 'ADJ-188',   detail: 'CB-CAT6-30 −4 units (damage)',             ip: '10.0.4.42' },
    { time: '08:18', who: USERS[0], action: 'signed-in',  target: '—',         detail: 'Web · Chrome on macOS',                    ip: '10.0.4.21' },
    { time: '08:14', who: USERS[2], action: 'updated',    target: 'CUS-009',   detail: 'Bluefin Marine — credit limit $10k → $5k', ip: '10.0.4.62' },
    { time: '08:02', who: USERS[1], action: 'signed-in',  target: '—',         detail: 'Mobile · iOS Safari',                      ip: '10.0.4.42' },
  ],
};

const users = {
  title: 'Users & Roles',
  subtitle: 'Who can access what — users, roles, permissions, sessions.',
  purpose: 'Roles bundle permissions (e.g. "Warehouse can receive but not invoice"). Users inherit one role plus optional overrides. Active sessions show who\'s logged in and where, and let you force sign-out.',
  actions: [
    { label: 'Roles', icon: 'fa-shield-halved' },
    { label: 'Invite user', icon: 'fa-user-plus', primary: true, pageId: 'invite-user' },
  ],
  kpis: [
    { label: 'Total users',       value: 14, sublabel: '11 staff + 3 contractors' },
    { label: 'Active now',        value: 6,  sublabel: 'across 4 devices' },
    { label: 'MFA enabled',       value: '93%',delta: +14, sublabel: '13 of 14' },
    { label: 'Pending invites',   value: 1,  sublabel: 'sent 2 days ago' },
  ],
  columns: [
    { key: 'name',   label: 'User',     type: 'avatar' },
    { key: 'email',  label: 'Email',    type: 'jsx', render: r => <span className="muted-2 t-sm">{r.email}</span> },
    { key: 'role',   label: 'Role',     type: 'tag' },
    { key: 'mfa',    label: 'MFA',      type: 'pill',
      tone: v => ({on:'pos',off:'warn'})[v] },
    { key: 'last',   label: 'Last seen',type: 'date' },
    { key: 'sessions',label:'Sessions', type: 'num', align: 'right' },
    { key: 'status', label: 'Status',   type: 'pill',
      tone: v => ({active:'pos',invited:'info',disabled:'muted'})[v] },
  ],
  rows: [
    { name: 'Maria Rodriguez', email: 'maria@wmspro.co',   role: 'Admin',     mfa: 'on',  last: 'now',         sessions: 2, status: 'active' },
    { name: 'Daniel Kang',     email: 'daniel@wmspro.co',  role: 'Warehouse', mfa: 'on',  last: '8m ago',      sessions: 1, status: 'active' },
    { name: 'Priya Shah',      email: 'priya@wmspro.co',   role: 'Finance',   mfa: 'on',  last: '12m ago',     sessions: 1, status: 'active' },
    { name: 'Liam Chen',       email: 'liam@wmspro.co',    role: 'Sales',     mfa: 'on',  last: '34m ago',     sessions: 1, status: 'active' },
    { name: 'Aria Volkov',     email: 'aria@wmspro.co',    role: 'Inventory', mfa: 'on',  last: 'on leave',    sessions: 0, status: 'disabled' },
    { name: 'Noah Becker',     email: 'noah@wmspro.co',    role: 'Warehouse', mfa: 'off', last: 'Today',       sessions: 1, status: 'active' },
    { name: 'Selene Park',     email: 'selene@wmspro.co',  role: 'Finance',   mfa: 'on',  last: 'Yesterday',   sessions: 0, status: 'active' },
    { name: 'Owen Wallace',    email: 'owen@wmspro.co',    role: 'Warehouse', mfa: 'on',  last: 'Today',       sessions: 1, status: 'active' },
    { name: 'Iris Nakamura',   email: 'iris@ext.contract', role: 'IT',        mfa: 'on',  last: 'Yesterday',   sessions: 1, status: 'active' },
    { name: 'Ethan Brooks',    email: 'ethan@wmspro.co',   role: 'Sales',     mfa: 'on',  last: '2 days ago',  sessions: 0, status: 'invited' },
  ],
};

/* ============================================================
   REPORTS
   ============================================================ */
const scheduled = {
  title: 'Scheduled Reports',
  subtitle: 'Reports that run on their own and email out — weekly close, monthly KPIs.',
  purpose: 'Schedule any saved report to run daily/weekly/monthly and email its PDF or CSV to a list of recipients. Perfect for the Monday-morning sales pack and month-end finance close.',
  actions: [{ label: 'Schedule report', icon: 'fa-plus', primary: true }],
  kpis: [
    { label: 'Active schedules', value: 12, sublabel: 'across 8 reports' },
    { label: 'Runs today',       value: 4,  sublabel: '0 failed', color: 'var(--c-pos)' },
    { label: 'Next run',         value: '17:00 today', sublabel: 'Weekly sales pack' },
    { label: 'Failed last 7 d',  value: 1,  sublabel: 'SMTP timeout', color: 'var(--c-warn)' },
  ],
  columns: [
    { key: 'report',    label: 'Report',    type: 'jsx', render: r => <span className="fw-6">{r.report}</span> },
    { key: 'freq',      label: 'Frequency', type: 'tag' },
    { key: 'next',      label: 'Next run',  type: 'date' },
    { key: 'recipients',label: 'Recipients',type: 'jsx', render: r => <span className="muted-2 t-sm">{r.recipients}</span> },
    { key: 'format',    label: 'Format',    type: 'tag' },
    { key: 'owner',     label: 'Owner',     type: 'user' },
    { key: 'status',    label: 'Status',    type: 'pill',
      tone: v => ({on:'pos',paused:'muted',error:'neg'})[v] },
  ],
  rows: [
    { report: 'Weekly sales pack',     freq: 'Mon 09:00', next: 'Mon 09:00', recipients: 'sales-team@, ops@ (8 people)', format: 'PDF', owner: USERS[0], status: 'on' },
    { report: 'Daily cash position',   freq: 'Daily 06:00', next: '06:00 tmr', recipients: 'priya@, maria@',              format: 'PDF', owner: USERS[2], status: 'on' },
    { report: 'AR ageing',             freq: 'Mon 09:00', next: 'Mon 09:00', recipients: 'finance@',                       format: 'XLSX',owner: USERS[2], status: 'on' },
    { report: 'Low stock summary',     freq: 'Daily 18:00', next: '18:00',  recipients: 'ops@',                            format: 'PDF', owner: USERS[0], status: 'on' },
    { report: 'Monthly P&L',           freq: '1st 09:00', next: 'Jun 01',    recipients: 'leadership@',                    format: 'PDF', owner: USERS[2], status: 'on' },
    { report: 'Warehouse productivity',freq: 'Fri 17:00', next: 'Fri 17:00', recipients: 'daniel@',                        format: 'CSV', owner: USERS[1], status: 'on' },
    { report: 'Customer LTV',          freq: 'Quarterly', next: 'Jul 01',    recipients: 'leadership@',                    format: 'PDF', owner: USERS[0], status: 'paused' },
    { report: 'Tax summary',           freq: 'Monthly',   next: 'Jun 01',    recipients: 'priya@',                         format: 'PDF', owner: USERS[2], status: 'error' },
  ],
};

const salesSummary = {
  title: 'Sales summary',
  subtitle: 'Snapshot of revenue, units and margin — by period, channel and rep.',
  purpose: 'The standard sales report — pre-built KPIs and a breakout table by sales rep / channel. Save as PDF, email, or schedule. Drill any row to see the underlying orders.',
  actions: [{ label: 'Download PDF', icon: 'fa-file-pdf' }, { label: 'Schedule', icon: 'fa-clock' }],
  kpis: [
    { label: 'Revenue (period)', value: 284_932, money: true, delta: +12.4, sublabel: 'vs prior period' },
    { label: 'Gross profit',     value: 96_812,  money: true, delta: +8.1,  sublabel: '34.0% margin' },
    { label: 'Orders',           value: 1_284,   delta: +4.2, sublabel: 'avg $222' },
    { label: 'New customers',    value: 18,      delta: +20,  sublabel: 'first-time buyers' },
  ],
  filters: [['Last 30 days','This month','This quarter','YTD'], ['All channels','POS','Online','Wholesale','Phone']],
  columns: [
    { key: 'rep',    label: 'Sales rep',  type: 'user' },
    { key: 'channel',label: 'Channel',    type: 'tag' },
    { key: 'orders', label: 'Orders',     type: 'num', align: 'right' },
    { key: 'units',  label: 'Units',      type: 'num', align: 'right' },
    { key: 'rev',    label: 'Revenue',    type: 'money', align: 'right', dp: 0 },
    { key: 'cogs',   label: 'COGS',       type: 'money', align: 'right', dp: 0 },
    { key: 'gp',     label: 'Gross profit', type: 'money', align: 'right', dp: 0 },
    { key: 'gm',     label: 'GM%',        type: 'jsx', render: r => <span className="mono fw-6">{r.gm}%</span>, align: 'right' },
  ],
  rows: [
    { rep: USERS[0], channel: 'Wholesale', orders: 184, units: 4_280, rev: 142_400, cogs: 84_800,  gp: 57_600, gm: 40 },
    { rep: USERS[3], channel: 'Wholesale', orders: 142, units: 3_840, rev:  96_400, cogs: 56_240,  gp: 40_160, gm: 42 },
    { rep: USERS[0], channel: 'POS',       orders: 482, units: 2_140, rev:  18_240, cogs:  9_400,  gp:  8_840, gm: 48 },
    { rep: USERS[2], channel: 'Phone',     orders: 84,  units: 1_240, rev:  14_240, cogs:  8_400,  gp:  5_840, gm: 41 },
    { rep: USERS[3], channel: 'Online',    orders: 282, units:   980, rev:   8_400, cogs:  4_800,  gp:  3_600, gm: 43 },
    { rep: USERS[4], channel: 'Wholesale', orders: 38,  units:   840, rev:   5_240, cogs:  2_800,  gp:  2_440, gm: 47 },
  ],
};

const customReport = {
  title: 'Custom Report Builder',
  subtitle: 'Drag, drop, pivot — build any view of your data without SQL.',
  purpose: 'Pick a data source (sales, inventory, AR, etc.), pick fields, filter and group. Preview the result, then save it, schedule it, or pin it to your dashboard.',
  banner: { tone: 'info', icon: 'fa-circle-info', text: <>Try a starter: <a href="#" style={{color:'var(--brand)'}}>Sales by product, last 90 days</a> · <a href="#" style={{color:'var(--brand)'}}>Inventory turn by category</a> · <a href="#" style={{color:'var(--brand)'}}>Customer LTV by segment</a></> },
  actions: [{ label: 'New report', icon: 'fa-plus', primary: true }],
  kpis: [
    { label: 'Saved reports',  value: 24, sublabel: 'across the team' },
    { label: 'Pinned',         value: 8,  sublabel: 'on dashboards' },
    { label: 'Shared with you',value: 6,  sublabel: '2 unread', color: 'var(--c-info)' },
    { label: 'Run last 7 d',   value: 142,sublabel: 'across users' },
  ],
  columns: [
    { key: 'name',    label: 'Report name', type: 'jsx', render: r => <span className="fw-6">{r.name}</span> },
    { key: 'source',  label: 'Source',  type: 'tag' },
    { key: 'fields',  label: 'Fields',  type: 'num', align: 'right' },
    { key: 'owner',   label: 'Owner',   type: 'user' },
    { key: 'shared',  label: 'Shared',  type: 'pill',
      tone: v => ({yes:'info',no:'muted'})[v] },
    { key: 'lastRun', label: 'Last run',type: 'date' },
  ],
  rows: [
    { name: 'Sales by SKU — Top 50',     source: 'Sales',     fields: 8, owner: USERS[0], shared: 'yes', lastRun: '2h ago' },
    { name: 'Slow-moving inventory',     source: 'Inventory', fields: 6, owner: USERS[0], shared: 'no',  lastRun: 'Yesterday' },
    { name: 'Customer LTV by segment',   source: 'Sales',     fields: 7, owner: USERS[0], shared: 'yes', lastRun: '2 days ago' },
    { name: 'Margin drift by category',  source: 'Inventory', fields: 9, owner: USERS[2], shared: 'yes', lastRun: '3 days ago' },
    { name: 'Returns reason analysis',   source: 'Returns',   fields: 5, owner: USERS[3], shared: 'no',  lastRun: '1 wk ago' },
    { name: 'Supplier on-time vs spend', source: 'Purchases', fields: 7, owner: USERS[1], shared: 'yes', lastRun: '1 wk ago' },
  ],
};

Object.assign(window.WMS_CONFIGS, {
  // finance
  'journal-entries': journalEntries, 'accounts-payable': accountsPayable, 'accounts-receivable': accountsReceivable,
  expenses,
  // banking
  'bank-accounts': bankAccounts, banking,
  // employees
  employees, attendance, leave, payroll,
  // warehouse
  'warehouse-stock': warehouseStock, transactions, transfers, adjustments, stockcount, locations,
  // inventory
  reorder, categories, brands, units, barcode,
  // system
  activity, users,
  // reports
  scheduled, 'sales-summary': salesSummary, 'custom-report': customReport,
});
