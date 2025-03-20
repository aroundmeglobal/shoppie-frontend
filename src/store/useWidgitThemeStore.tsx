import create, { StateCreator } from "zustand";

// interface ThemeFields {
//     userBubbleColor: string;
//     assistantBubbleColor: string,
//     headerColor: string;
//     textHeaderColor: string;
//     bgColor: string;
//     inputbarColor: string;
//     cardBgColor: string;
//     userTextColor: string;
//     botTextColor: string;
//     cardTextColor: string;
//     cardTextSubColour: string;
//     prompotBgColor: string;
//     promptBorderColor: string;
//   }

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
  prompotBgColor: string;
  promptBorderColor: string;
}

interface ThemeStoreState {
  theme: "light" | "dark";
  changedFields: ThemeFields;
  toggleTheme: (selectedTheme: "light" | "dark") => void;
}

const lightThemeValues: ThemeFields = {
  userBgColor: "#1e60fb",
  assistantBgColor: "#Fafafa",
  embedId: "b5909a44-7e5b-494b-a9e4-3b29c35e1da2",
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
  prompotBgColor: "#1E60FB66",
  promptBorderColor: "#1E60FBBB",
};

const darkThemeValues: ThemeFields = {
  userBgColor: "#1e60fb",
  assistantBgColor: "#1B1B1B",
  embedId: "b5909a44-7e5b-494b-a9e4-3b29c35e1da2",
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
  prompotBgColor: "#1E60FB66",
  promptBorderColor: "#1E60FBBB",
};

const useWidgitThemeStore = create<ThemeStoreState>((set) => ({
  theme: "light",
  changedFields: lightThemeValues,

  toggleTheme: (selectedTheme: "light" | "dark") => {
    if (selectedTheme === "dark") {
      set({ changedFields: darkThemeValues, theme: "dark" });
    } else {
      set({ changedFields: lightThemeValues, theme: "light" });
    }
  },
}));

export default useWidgitThemeStore;
