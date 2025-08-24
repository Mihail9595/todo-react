import NetworkProvider from "../providers/NetworkProvider";
import Notification from "./Notification";
import { FaSun, FaMoon } from "react-icons/fa";

const ToggleTheme = ({ toggleTheme, theme }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <button
          className="relative cursor-pointer"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Светлая тема" : "Темная тема"}
        >
          <div
            className="bg-grey-300 dark:bg-btn-dark shadow-inner rounded-full 
          w-14 h-7 duration-300"
          ></div>
          <div
            className="text-sm top-0.5 left-0.5 absolute bg-white shadow-md 
          rounded-full w-6 h-6 transition-transform translate-x-0 
          dark:translate-x-7 duration-300 transform flex items-center justify-center"
          >
            {theme === "light" ? (
              <FaSun className="text-yellow-500" />
            ) : (
              <FaMoon className="text-blue-700" />
            )}
          </div>
        </button>
      </div>
      <NetworkProvider>
        <Notification />
      </NetworkProvider>
    </div>
  );
};

export default ToggleTheme;
