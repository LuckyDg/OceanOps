'use client';

import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#1F2937] bg-[#0A0F1E] px-6">
      <h1 className="text-lg font-semibold text-[#F9FAFB]">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#6B7280]" />
          <Input placeholder="Quick search..." className="w-64 pl-9" />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
            3
          </span>
        </Button>
        {user && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6] text-xs font-bold text-white">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}
