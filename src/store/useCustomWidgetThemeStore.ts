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
        embedId: "bbc22a75-2033-41a9-8327-6e51caad0c39",
        baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
        bgColor: "",
        inputbarColor: "",
        cardBgColor: "",
        userTextColor: "",
        botTextColor: "",
        cardTextColor: "",
        cardTextSubColour: "",
        startingMessageTheme: "",
        openingMessageTextColor: "",
        inputTextColor: "",
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
