import { create } from 'zustand';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  type User 
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

interface UserState {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  init: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  login: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  },
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  },
  init: () => {
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        set({ user, loading: false });
      });
    } else {
      set({ loading: false });
    }
  }
}));
