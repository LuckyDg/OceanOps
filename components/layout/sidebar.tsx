'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Waves, MapPin, TrendingUp, Zap, Wind, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/hooks/use-app-store';

const NAV = [
  { href: '/dashboard',   label: 'Resumen',          icon: LayoutDashboard },
  { href: '/zones',       label: 'Zonas de Pesca',   icon: MapPin },
  { href: '/conditions',  label: 'Condiciones',       icon: Waves },
  { href: '/tides',       label: 'Mareas',            icon: TrendingUp },
  { href: '/weather',     label: 'Tiempo Marino',     icon: Wind },
  { href: '/forecast',    label: 'Pronóstico IA',     icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col',
          'border-r border-border bg-surface',
          'transform transition-transform duration-200 ease-in-out',
          'md:relative md:z-auto md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
              <Waves className="h-3.5 w-3.5 text-accent" />
            </div>
            <div>
              <span className="text-sm font-semibold text-foreground tracking-tight">OceanOps</span>
              <p className="text-[10px] text-muted leading-none mt-0.5">Inteligencia Pesquera</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="md:hidden flex h-7 w-7 items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface-hover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-3 px-2">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted">
            Datos
          </p>
          <ul className="space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + '/');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => sidebarOpen && toggleSidebar()}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-all duration-150',
                      active
                        ? 'bg-accent/10 text-accent font-semibold'
                        : 'text-muted hover:bg-surface-hover hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', active && 'text-accent')} />
                    <span className="flex-1">{label}</span>
                    {active && <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3">
          <p className="text-[11px] text-muted/50 leading-relaxed">
            Datos marinos actualizados<br />diariamente
          </p>
        </div>
      </aside>
    </>
  );
}
