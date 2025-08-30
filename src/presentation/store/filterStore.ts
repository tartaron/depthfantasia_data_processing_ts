import { create } from 'zustand';
import { FilterOptions } from '@/domain/entities/Filter';

interface FilterState {
  filters: FilterOptions;
  isActive: boolean;
  totalCount: number;
  filteredCount: number;
  setFilter: (key: keyof FilterOptions, value: any) => void;
  resetFilters: () => void;
  setActive: (active: boolean) => void;
  setCounts: (total: number, filtered: number) => void;
  clearFilters: () => void;
}

const initialFilters: FilterOptions = {};

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  isActive: false,
  totalCount: 0,
  filteredCount: 0,
  setFilter: (key, value) => set((state) => ({
    filters: { ...state.filters, [key]: value },
    isActive: true
  })),
  resetFilters: () => set({ filters: initialFilters, isActive: false }),
  setActive: (active) => set({ isActive: active }),
  setCounts: (total, filtered) => set({ totalCount: total, filteredCount: filtered }),
  clearFilters: () => set({ 
    filters: initialFilters, 
    isActive: false, 
    totalCount: 0, 
    filteredCount: 0 
  }),
}));
