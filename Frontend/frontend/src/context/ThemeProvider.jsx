import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const defaultTheme = localStorage.getItem("theme") || "light";

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
