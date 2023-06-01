import React, { useContext } from "react";
import { HiSun, HiMoon } from "react-icons/hi";
import { ThemeContext } from "../context/ThemeContext";

//  toggle between light and dark themes

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className="p-2 ease-in-out">
      {theme === "dark" ? (
        <div
          className="flex items-center cursor-pointer "
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <HiSun className="text-primary text-2xl mr-2 hover:text-accent" />
          Light Mode
        </div>
      ) : (
        <div
          className="flex items-center cursor-pointer "
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <HiMoon className="text-primary text-2xl mr-2 hover:text-accent" />
          Dark Mode
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
