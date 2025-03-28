import create from "zustand";
import { ThemeFields } from "../../types";
import useCustomWidgetThemeStore from "./useCustomWidgetThemeStore";

interface ThemeStoreState {
  theme: "light" | "dark" | "custom";
  changedFields: ThemeFields;
  toggleTheme: (selectedTheme: "light" | "dark" | "custom") => void;
}

const lightThemeValues: ThemeFields = {
  userBgColor: "#1e60fb",
  assistantBgColor: "#Fafafa",
  embedId: "bbc22a75-2033-41a9-8327-6e51caad0c39",
  baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
  headerColor: "#ededed",
  textHeaderColor: "#000",
  bgColor: "#e2e2e2",
  inputbarColor: "#FAFAFA",
  cardBgColor: "#d2d2d2",
  userTextColor: "#fff",
  botTextColor: "#000",
  cardTextColor: "#000",
  cardTextSubColour: "#a4a4a4",
  startingMessageTheme: "#ffff",
  openingMessageTextColor: "#1d1d1d",
  InputTextColor: "#a4a4a4",
  inputbarDisabled: true,
};

const darkThemeValues: ThemeFields = {
  userBgColor: "#1e60fb",
  assistantBgColor: "#1B1B1B",
  embedId: "bbc22a75-2033-41a9-8327-6e51caad0c39",
  baseApiUrl: "https://anythingllm.aroundme.global/api/embed",
  headerColor: "#222222",
  textHeaderColor: "#fff",
  bgColor: "#282828",
  inputbarColor: "#1d1d1d",
  cardBgColor: "#1d1d1d",
  userTextColor: "#fff",
  botTextColor: "#fff",
  cardTextColor: "#fff",
  cardTextSubColour: "#a4a4a4",
  startingMessageTheme: "#1d1d1d",
  openingMessageTextColor: "#ffff",
  InputTextColor: "#a4a4a4",
  inputbarDisabled: true,
};

const useWidgitThemeStore = create<ThemeStoreState>((set) => ({
  theme: "dark",
  changedFields: darkThemeValues,

  // toggleTheme: (selectedTheme: "light" | "dark" | "custom") => {
  //   if (selectedTheme === "light") {
  //     set({ changedFields: lightThemeValues, theme: "light" });
  //   } else if (selectedTheme === "dark") {
  //     set({ changedFields: darkThemeValues, theme: "dark" });
  //   } else if (selectedTheme === "custom") {
  //     const customTheme = useCustomWidgetThemeStore.getState().theme;
  //     console.log(customTheme,"customeTheme");

  //     set({ changedFields: customTheme, theme: "custom" });
  //   }
  // },
  toggleTheme: (selectedTheme: "light" | "dark" | "custom") => {
    // Check if the selected theme is already the current one, if yes, don't update.
    set((state) => {
      let newThemeFields = {};
      if (selectedTheme === "light") {
        newThemeFields = lightThemeValues;
      } else if (selectedTheme === "dark") {
        newThemeFields = darkThemeValues;
      } else if (selectedTheme === "custom") {
        const customTheme = useCustomWidgetThemeStore.getState().theme;
        newThemeFields = customTheme;
      }

      // Only update if the theme has actually changed
      return { changedFields: newThemeFields, theme: selectedTheme };
    });
  },
}));

export default useWidgitThemeStore;
