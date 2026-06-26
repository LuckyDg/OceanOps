'use client';

import { Menu, RefreshCw } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { useAppStore } from '@/hooks/use-app-store';

interface TopbarProps {
  title: string;
  subtitle?: string;
  updatedAt?: string;
}

export function Topbar({ title, subtitle, updatedAt }: TopbarProps) {
  const { toggleSidebar } = useAppStore();

  return (
    <header className="sticky top-0 z-30 flex h-13 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md px-4 md:px-6">
      {/* Mobile hamburger */}
      <button
        onClick={toggleSidebar}
        className="md:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-muted truncate">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-1">
        {updatedAt && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted mr-2">
            <RefreshCw className="h-3 w-3" />
            <span>{updatedAt}</span>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
