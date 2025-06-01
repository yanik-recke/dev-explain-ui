import { create } from "zustand";

export interface Commit {
  sha: string;
  message: string;
}

interface CommitStore {
  commits: Commit[] | null;
  setCommits: (commits: Commit[]) => void;
}

export const useCommitStore = create<CommitStore>((set) => ({
  commits: null,
  setCommits: (commits) => {
    console.log("WASDAWDASD" + commits);
    set({ commits });
  },
}));
