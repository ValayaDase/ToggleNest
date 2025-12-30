// src/components/layout/Navbar.jsx

import { MdMenu, MdWorkspaces } from "react-icons/md";

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-sm">
      
      {/* Left Side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 hover:bg-purple-50 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <MdMenu className="w-6 h-6 text-gray-700" />
        </button>

        {/* Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">TN</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
            ToggleNest
          </span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
          <MdWorkspaces className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            Team Workspace
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
