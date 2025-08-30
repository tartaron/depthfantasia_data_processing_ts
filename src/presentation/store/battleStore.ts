import { create } from 'zustand';
import { Battle } from '@/domain/entities/Battle';

interface BattleState {
  battles: Battle[];
  selectedBattle: Battle | null;
  isLoading: boolean;
  error: string | null;
  setBattles: (battles: Battle[]) => void;
  setSelectedBattle: (battle: Battle | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addBattles: (battles: Battle[]) => void;
  clearBattles: () => void;
}

export const useBattleStore = create<BattleState>((set) => ({
  battles: [],
  selectedBattle: null,
  isLoading: false,
  error: null,
  setBattles: (battles) => set({ battles }),
  setSelectedBattle: (battle) => set({ selectedBattle: battle }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  addBattles: (battles) => set((state) => ({ 
    battles: [...state.battles, ...battles] 
  })),
  clearBattles: () => set({ battles: [], selectedBattle: null }),
}));
