import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomColors } from "../constants/CustomColor";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  colors: typeof CustomColors.light;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  colors: CustomColors.dark,
  toggleTheme: () => {},
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  // Load saved theme
  useEffect(() => {
    (async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("user-theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
        }
      } catch (err) {
        console.warn("Failed to load theme:", err);
      }
    })();
  }, []);

  // Save theme
  useEffect(() => {
    AsyncStorage.setItem("user-theme", theme).catch((err) =>
      console.warn("Failed to save theme:", err)
    );
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));

  const colors = theme === "dark" ? CustomColors.dark : CustomColors.light;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useThemeColors = () => useContext(ThemeContext);
