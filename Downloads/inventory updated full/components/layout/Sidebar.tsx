'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

const MODULES = [
  { id: 'main',      label: 'Dashboard',  icon: 'fa-chart-pie',     color: 'oklch(0.62 0.18 268)', path: '/dashboard' },
  { id: 'reports',   label: 'Reports',    icon: 'fa-chart-line',    color: 'oklch(0.62 0.22 310)', path: '/reports' },
  { id: 'vendors',   label: 'Vendors',    icon: 'fa-truck',         color: 'oklch(0.70 0.16 50)',  path: '/purchases' },
  { id: 'customers', label: 'Customers',  icon: 'fa-user-friends',  color: 'oklch(0.65 0.16 240)', path: '/sales' },
  { id: 'finance',   label: 'Finance',    icon: 'fa-landmark',      color: 'oklch(0.65 0.15 160)', path: '/finance' },
  { id: 'employees', label: 'Employees',  icon: 'fa-id-badge',      color: 'oklch(0.65 0.20 340)', path: '/employees' },
  { id: 'warehouse', label: 'Warehouse',  icon: 'fa-warehouse',     color: 'oklch(0.72 0.15 80)',  path: '/warehouse' },
  { id: 'inventory', label: 'Inventory',  icon: 'fa-boxes-stacked', color: 'oklch(0.62 0.14 200)', path: '/inventory' },
  { id: 'system',    label: 'System',     icon: 'fa-gear',          color: 'oklch(0.58 0.04 270)', path: '/settings' },
]

const NAV: Record<string, Array<{ id: string; label: string; icon: string; badge?: number; path: string }>> = {
  main: [
    { id: 'dashboard', label: 'Overview',      icon: 'fa-chart-pie', path: '/dashboard' },
    { id: 'workspace', label: 'My Workspace',  icon: 'fa-th-large',  path: '/workspace' },
  ],
  reports: [
    { id: 'reports',       label: 'Reports Library', icon: 'fa-chart-bar', path: '/reports' },
    { id: 'custom-report', label: 'Custom Report',   icon: 'fa-sliders',   path: '/reports/custom' },
  ],
  customers: [
    { id: 'estimates',     label: 'Estimates',          icon: 'fa-file-contract',       path: '/sales/estimates' },
    { id: 'sales',         label: 'Sales Orders',       icon: 'fa-file-invoice-dollar', path: '/sales' },
    { id: 'invoices',      label: 'Invoices',           icon: 'fa-receipt',             path: '/sales/invoices' },
    { id: 'payments',      label: 'Payments',           icon: 'fa-money-bill',          path: '/sales/record-payment' },
    { id: 'credit-notes',  label: 'Credit Notes',       icon: 'fa-rotate-left',         path: '/sales/credit-notes' },
    { id: 'debit-notes-s', label: 'Debit Notes',        icon: 'fa-arrow-right-long',    path: '/sales/debit-notes' },
    { id: 'returns',       label: 'Returns',            icon: 'fa-box-arrow-in-down-left', path: '/sales/returns' },
    { id: 'recurring',     label: 'Recurring Invoices', icon: 'fa-rotate',              path: '/sales/recurring' },
    { id: 'customers',     label: 'Customers',          icon: 'fa-user-friends',        path: '/customers' },
    { id: 'pos',           label: 'Point of Sale',      icon: 'fa-cash-register',       path: '/pos' },
  ],
  vendors: [
    { id: 'purchases',         label: 'Purchase Orders',  icon: 'fa-shopping-cart',     path: '/purchases' },
    { id: 'approvals',         label: 'Approval Queue',   icon: 'fa-circle-check',      path: '/purchases/approvals' },
    { id: 'grn',               label: 'Goods Receipts',   icon: 'fa-clipboard-check',   path: '/grn' },
    { id: 'purchase-invoices', label: 'Purchase Invoices',icon: 'fa-file-invoice',      badge: 3, path: '/purchases/invoices' },
    { id: 'debit-notes',       label: 'Debit Notes',      icon: 'fa-arrow-left-long',   path: '/purchases/debit-notes' },
    { id: 'bills',             label: 'Bills',            icon: 'fa-file-lines',        path: '/finance/bills' },
    { id: 'suppliers',         label: 'Suppliers',        icon: 'fa-truck',             path: '/suppliers' },
  ],
  finance: [
    { id: 'accounts',    label: 'Chart of Accounts', icon: 'fa-landmark',              path: '/finance/accounts' },
    { id: 'bills',       label: 'Vendor Bills',       icon: 'fa-file-invoice',          path: '/finance/bills' },
    { id: 'payments',    label: 'Payments',           icon: 'fa-circle-dollar-to-slot', path: '/finance/payments' },
    { id: 'expenses',    label: 'Expenses',           icon: 'fa-wallet',                path: '/finance/expenses' },
    { id: 'fin-reports', label: 'Financial Reports',  icon: 'fa-chart-bar',             path: '/finance/reports' },
    { id: 'journal',     label: 'Journal Entries',    icon: 'fa-book-open',             path: '/finance/journal-entry/new' },
  ],
  employees: [
    { id: 'employees',  label: 'Directory',     icon: 'fa-id-badge',           path: '/employees' },
    { id: 'attendance', label: 'Attendance',    icon: 'fa-user-check',         path: '/employees/attendance' },
    { id: 'leave',      label: 'Leave Tracker', icon: 'fa-calendar-minus',     path: '/employees/leave' },
    { id: 'payroll',    label: 'Payroll',       icon: 'fa-money-check-dollar', path: '/employees/payroll' },
  ],
  warehouse: [
    { id: 'warehouse-stock', label: 'Stock by Location', icon: 'fa-layer-group',       path: '/warehouse' },
    { id: 'transactions',    label: 'Stock Movements',   icon: 'fa-right-left',         path: '/warehouse/movements' },
    { id: 'transfers',       label: 'Transfers',          icon: 'fa-shuffle',           path: '/warehouse/transfers' },
    { id: 'adjustments',     label: 'Adjustments',        icon: 'fa-sliders',           path: '/warehouse/adjustments' },
    { id: 'stockcount',      label: 'Stock Count',        icon: 'fa-clipboard-check',   path: '/warehouse/count' },
    { id: 'locations',       label: 'Locations',          icon: 'fa-location-dot',      path: '/warehouse/locations' },
  ],
  inventory: [
    { id: 'inventory',  label: 'Products',       icon: 'fa-boxes-stacked', badge: 4, path: '/inventory' },
    { id: 'reorder',    label: 'Reorder Center', icon: 'fa-cart-plus',     badge: 4, path: '/inventory/reorder' },
    { id: 'categories', label: 'Categories',     icon: 'fa-tags',                    path: '/inventory/categories' },
    { id: 'brands',     label: 'Brands',         icon: 'fa-certificate',             path: '/inventory/brands' },
    { id: 'units',      label: 'Units',          icon: 'fa-ruler',                   path: '/inventory/units' },
    { id: 'barcodes',   label: 'Barcodes',       icon: 'fa-barcode',                 path: '/inventory/barcodes' },
  ],
  system: [
    { id: 'company',        label: 'Company Profile', icon: 'fa-building',          path: '/settings/company' },
    { id: 'users',          label: 'Users & Roles',   icon: 'fa-users-gear',        path: '/settings/users' },
    { id: 'settings',       label: 'Settings',        icon: 'fa-gear',              path: '/settings' },
    { id: 'custom-fields',  label: 'Custom Fields',   icon: 'fa-table-columns',     path: '/settings/custom-fields' },
    { id: 'discount-codes', label: 'Discount Codes',  icon: 'fa-tag',               path: '/settings/discount-codes' },
    { id: 'api-keys',       label: 'API Keys',        icon: 'fa-key',               path: '/settings/api-keys' },
    { id: 'tax-rates',      label: 'Tax Rates',       icon: 'fa-percent',           path: '/settings/tax-rates' },
    { id: 'activity',       label: 'Activity Log',    icon: 'fa-clock-rotate-left', path: '/settings/activity' },
  ],
}

function getActiveModule(pathname: string) {
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/workspace')) return 'main'
  if (pathname.startsWith('/reports'))   return 'reports'
  if (pathname.startsWith('/purchases') || pathname.startsWith('/grn') || pathname.startsWith('/suppliers')) return 'vendors'
  if (pathname.startsWith('/sales') || pathname.startsWith('/customers') || pathname.startsWith('/pos')) return 'customers'
  if (pathname.startsWith('/finance'))   return 'finance'
  if (pathname.startsWith('/employees')) return 'employees'
  if (pathname.startsWith('/warehouse')) return 'warehouse'
  if (pathname.startsWith('/inventory')) return 'inventory'
  if (pathname.startsWith('/settings'))  return 'system'
  return 'main'
}

export default function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [q, setQ] = useState('')

  const activeModule = getActiveModule(pathname)
  const mod = MODULES.find(m => m.id === activeModule) || MODULES[0]
  const items = NAV[activeModule] || []
  const filtered = useMemo(
    () => items.filter(it => !q || it.label.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  )

  const initials = session?.user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('') || 'U'

  return (
    <>
      {/* ── Icon rail ───────────────────────────────────── */}
      <nav className="rail">
        <div className="rail-logo">
          <span className="rail-logo-mark">W</span>
          <span className="rail-logo-name">WMS Pro</span>
        </div>

        <div className="rail-stack">
          {MODULES.map(m => {
            const badge   = (NAV[m.id] || []).reduce((n: number, it: any) => n + (it.badge || 0), 0)
            const isActive = m.id === activeModule
            const firstPath = NAV[m.id]?.[0]?.path ?? m.path
            return (
              <Link
                key={m.id}
                href={firstPath}
                prefetch
                className={'rail-btn' + (isActive ? ' is-active' : '')}
                style={{ '--mod': m.color, textDecoration: 'none' } as any}
              >
                <span className="rail-icn">
                  <i className={'fa-solid ' + m.icon} />
                  <span className="mod-dot" />
                </span>
                <span className="rail-lbl">{m.label}</span>
                {badge > 0 && <span className="rail-badge">{badge}</span>}
              </Link>
            )
          })}
        </div>

        <div className="rail-spacer" />

        <div className="rail-stack">
          <button className="rail-btn rail-btn-util" onClick={onToggle}>
            <span className="rail-icn">
              <i className={'fa-solid ' + (collapsed ? 'fa-angles-right' : 'fa-angles-left')} />
            </span>
            <span className="rail-lbl">{collapsed ? 'Expand' : 'Collapse'}</span>
          </button>
        </div>
      </nav>

      {/* ── Side panel ──────────────────────────────────── */}
      <aside className="sidepanel" style={{ '--mod': mod.color } as any}>
        <div className="sp-head">
          <div className="sp-icon"><i className={'fa-solid ' + mod.icon} /></div>
          <div>
            <div className="sp-title">{mod.label}</div>
            <div className="sp-sub">{items.length} section{items.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        <div className="sp-search">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Jump to…"
          />
        </div>

        <div className="sp-list">
          {filtered.map(it => (
            <Link
              key={it.id}
              href={it.path}
              prefetch
              className={'sp-item' + (pathname === it.path || pathname.startsWith(it.path + '/') ? ' is-active' : '')}
              style={{ textDecoration: 'none' }}
            >
              <i className={'fa-solid ' + it.icon} />
              <span>{it.label}</span>
              {it.badge ? <span className="sp-badge">{it.badge}</span> : null}
            </Link>
          ))}
        </div>

        <div className="sp-foot">
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="uname">{session?.user?.name || 'User'}</div>
            <div className="urole">{(session?.user as any)?.role || 'Staff'}</div>
          </div>
          <button
            className="uicon-btn"
            title="Sign out"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </div>
      </aside>
    </>
  )
}
