import { create } from "zustand";
import { persist } from "zustand/middleware";

// Enhance your store interface to clearly define the shape of your store
interface UserSessionStoreState {
  sessionId: string;
  setSessionId: (newSession: string) => void;
}

const userSessionStore = create<UserSessionStoreState>()(
  persist(
    (set) => ({
      // Initial state
      sessionId: "",

      // Setters
      setSessionId: (newSessionId) => set({ sessionId: newSessionId }),
    }),
    {
      name: "user-session-storage", // Key for localStorage
    }
  )
);

export default userSessionStore;
