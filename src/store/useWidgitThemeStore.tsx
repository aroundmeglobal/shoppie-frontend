import create from "zustand";

interface ThemeFields {
  userBgColor: string;
  assistantBgColor: string;
  embedId: string;
  baseApiUrl: string;
  headerColor: string;
  textHeaderColor: string;
  bgColor: string;
  inputbarColor: string;
  cardBgColor: string;
  userTextColor: string;
  botTextColor: string;
  cardTextColor: string;
  cardTextSubColour: string;
  inputbarDisabled:boolean,
}

interface ThemeStoreState {
  theme: "light" | "dark";
  changedFields: ThemeFields;
  toggleTheme: (selectedTheme: "light" | "dark") => void;
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
  inputbarDisabled:true,
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
  inputbarDisabled:true,
};

const useWidgitThemeStore = create<ThemeStoreState>((set) => ({
  theme: "dark",
  changedFields: darkThemeValues,

  toggleTheme: (selectedTheme: "light" | "dark") => {
    if (selectedTheme === "light") {
      set({ changedFields: lightThemeValues, theme: "light" });
    } else {
      set({ changedFields: darkThemeValues, theme: "dark" });
    }
  },
}));

export default useWidgitThemeStore;
