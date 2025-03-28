import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeFields } from "../../types";

const useCustomWidgetThemeStore = create(
  persist(
    (set) => ({
      theme: {
        userBgColor: "",
        assistantBgColor: "",
        headerColor: "",
        textHeaderColor: "",
        bgColor: "",
        inputbarColor: "",
        cardBgColor: "",
        userTextColor: "",
        botTextColor: "",
        cardTextColor: "",
        cardTextSubColour: "",
        startingMessageTheme: "",
        openingMessageTextColor: "",
        InputTextColor: "",
        inputbarDisabled: true,
      },
      setTheme: (newTheme: ThemeFields) => set({ theme: newTheme }),
    }),
    {
      name: "theme-storage",
    }
  )
);

export default useCustomWidgetThemeStore;
