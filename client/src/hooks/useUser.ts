import userGlobalStore, { type UserStoreType } from "../store/usersStore";

/**
 * Custom hook to access the current user from Zustand store
 * Usage: const { currentUser, setCurrentUser } = useUser();
 */
export const useUser = () => {
  return userGlobalStore() as UserStoreType;
};