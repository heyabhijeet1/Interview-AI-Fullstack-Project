import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useTheme";

export default function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme } = useTheme();
    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-pressed={theme === "dark"}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
            className={`theme-toggle-button flex items-center justify-center rounded-full shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F03260] focus-visible:ring-offset-2 ${className}`}
        >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
    );
}
