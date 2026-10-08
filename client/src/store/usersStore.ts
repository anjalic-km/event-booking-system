import { create } from "zustand";
import type { userType } from "../interfaces";

export interface UserStoreType {
  currentUser: userType | null;
  setCurrentUser: (user: userType | null) => void;
}

const userGlobalStore = create<UserStoreType>((set) => ({
  currentUser: null,
  setCurrentUser: (user: userType | null) => set({ currentUser: user }),
}));

export default userGlobalStore;