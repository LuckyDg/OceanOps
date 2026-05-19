'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Ship,
  Package,
  BoxIcon,
  Anchor,
  BarChart3,
  Users,
  LogOut,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import type { UserRole } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'operator', 'auditor', 'user'],
  },
  {
    href: '/vessels',
    label: 'Vessels',
    icon: Ship,
    roles: ['admin', 'operator'],
  },
  {
    href: '/containers',
    label: 'Containers',
    icon: BoxIcon,
    roles: ['admin', 'operator'],
  },
  {
    href: '/cargo',
    label: 'Cargo',
    icon: Package,
    roles: ['admin', 'operator', 'auditor'],
  },
  {
    href: '/ports',
    label: 'Ports',
    icon: Anchor,
    roles: ['admin', 'operator'],
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: BarChart3,
    roles: ['admin', 'auditor'],
  },
  {
    href: '/users',
    label: 'Users',
    icon: Users,
    roles: ['admin'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#1F2937] bg-[#111827]">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#1F2937]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3B82F6]">
          <Waves className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold text-[#F9FAFB]">OceanOps</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      : 'text-[#6B7280] hover:bg-[#1F2937] hover:text-[#F9FAFB]'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[#1F2937] p-4">
        {user && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-bold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[#F9FAFB]">{user.name}</p>
              <p className="truncate text-xs text-[#6B7280] capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#1F2937] hover:text-[#EF4444]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
