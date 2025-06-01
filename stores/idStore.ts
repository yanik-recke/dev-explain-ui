// store/idStore.ts
import { create } from "zustand";

interface IdStore {
  id: string | null;
  setId: (id: string) => void;
}

export const useIdStore = create<IdStore>((set) => ({
  id: null,
  setId: (id) => {
    console.log("set id");
    set({ id });
  },
}));
