// store/idStore.ts
import { create } from "zustand";

interface IdStore {
  id: string | null;
  setId: (id: string) => void;
}

export const useIdStore = create<IdStore>((set) => ({
  id: null,
  setId: (id) => set({ id }),
}));
