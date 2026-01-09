import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useAuth } from "../../context/AuthContext";
import { MdDashboard, MdFolder, MdDeleteForever, MdLogout } from "react-icons/md";
import axios from "../../api"; // make sure your axios instance is correct

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  // ✅ Add this function
  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await axios.delete("http://localhost:5000/users/delete", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});


        alert("Account deleted successfully.");
        logout();
        navigate("/");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to delete account.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64
        bg-white border-r border-purple-200 shadow-lg
        transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-purple-100">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <MdDashboard className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-800">Dashboard</span>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => handleNavigation("/dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
              font-medium transition-all cursor-pointer
              ${location.pathname === "/dashboard" ? "bg-purple-600 text-white shadow-md" : "text-gray-700 hover:bg-purple-50"}`}
          >
            <MdDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => handleNavigation("/dashboard/projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
              font-medium transition-all cursor-pointer
              ${location.pathname === "/dashboard/projects" ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-indigo-50"}`}
          >
            <MdFolder className="w-5 h-5" />
            All Projects
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 my-2 border-t border-gray-200" />

        {/* Account Actions */}
        <div className="p-4 space-y-2">
          {/* ✅ Attach onClick handler */}
          
<button
  onClick={async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      await axios.delete("http://localhost:5000/users/delete", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // clear auth state
      logout();

      alert("Your account has been deleted successfully.");
      navigate("/"); // redirect to home/login page
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account. Please try again.");
    }
  }}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
    bg-red-50 text-red-700 font-medium hover:bg-red-100 transition-all cursor-pointer"
>
  <MdDeleteForever className="w-5 h-5" />
  Delete Account
</button>


          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
              bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-all cursor-pointer"
          >
            <MdLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
