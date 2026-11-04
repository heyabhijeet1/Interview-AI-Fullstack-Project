import { useEffect, useState } from "react";
import { ThemeContext } from "./theme.context";

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "light";
        return window.localStorage.getItem("interview-ai-theme-v2") || "dark";
    });

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem("interview-ai-theme-v2", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
