import { create } from 'zustand';
import type { FishingZoneId } from '@/types';

interface AppStore {
  selectedZone: FishingZoneId | null;
  sidebarOpen: boolean;
  setSelectedZone: (zone: FishingZoneId | null) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedZone: null,
  sidebarOpen: false,
  setSelectedZone: (zone) => set({ selectedZone: zone }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
