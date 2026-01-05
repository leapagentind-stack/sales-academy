import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { User, Settings, LogOut } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const [initial, setInitial] = useState("U");
  
  // --- DROPDOWN STATE ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- 1. DYNAMIC INITIAL LOGIC ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("email");
    
    let identifier = "";

    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            identifier = parsed.name || parsed.username || parsed.email || storedEmail || "";
        } catch(e) { 
            identifier = storedEmail || ""; 
        }
    } else {
        identifier = storedEmail || "";
    }

    if (identifier) {
        let namePart = identifier.split('@')[0];
        setInitial(namePart.charAt(0).toUpperCase());
    }
  }, []);

  // --- CLOSE DROPDOWN WHEN CLICKING OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 2. LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email"); 
    message.success("Logged out successfully");
    navigate('/login');
  };

  // Helper for Link Styling
  const getLinkClass = ({ isActive }) => 
    isActive 
      ? "flex items-center px-4 py-3 bg-blue-500 rounded-lg text-white shadow-sm transition-all mb-1" 
      : "flex items-center px-4 py-3 text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-all mb-1";

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-blue-600 text-white flex-shrink-0 flex flex-col transition-all duration-300">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-blue-500">
          <i className="fa-solid fa-graduation-cap text-2xl mr-3"></i>
          <span className="text-xl font-bold tracking-wide">Sales Academy</span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          
          <NavLink to="home" className={getLinkClass}>
            <i className="fa-solid fa-chart-line w-6 text-center"></i>
            <span className="font-medium ml-2">Dashboard</span>
          </NavLink>
          
          <NavLink to="courses" className={getLinkClass}>
            <i className="fa-solid fa-briefcase w-6 text-center"></i>
            <span className="font-medium ml-2">Courses</span>
          </NavLink>

          <NavLink to="offers" className={getLinkClass}>
            <i className="fa-solid fa-tags w-6 text-center"></i>
            <span className="font-medium ml-2">Offers</span>
          </NavLink>
          
          <NavLink to="students" className={getLinkClass}>
            <i className="fa-solid fa-user-group w-6 text-center"></i>
            <span className="font-medium ml-2">Students</span>
          </NavLink>

          <NavLink to="live-classes" className={getLinkClass}>
            <i className="fa-solid fa-video w-6 text-center"></i>
            <span className="font-medium ml-2">Live Classes</span>
          </NavLink>
          
          <NavLink to="assignments" className={getLinkClass}>
            <i className="fa-solid fa-book w-6 text-center"></i>
            <span className="font-medium ml-2">Assignments</span>
          </NavLink>

          

          {/* ❌ REMOVED: Settings Link */}
          {/* ❌ REMOVED: Logout Button */}
          
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 flex-shrink-0 relative">
          
          {/* Search */}
          <div className="relative flex-1 max-w-2xl mr-8"> 
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input 
              type="text" 
              placeholder="Search courses, students, or activities..." 
              className="w-full bg-gray-100 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Profile & Icons */}
          <div className="flex items-center space-x-6">
            <NavLink to="notifications" className="relative text-gray-500 hover:text-blue-600 transition-colors">
              <i className="fa-regular fa-bell text-xl"></i>
            </NavLink>
            <NavLink to="messages" className="relative text-gray-500 hover:text-blue-600 transition-colors">
              <i className="fa-regular fa-envelope text-xl"></i>
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-orange-500 rounded-full border border-white"></span>
            </NavLink>
            
            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none hover:opacity-90 transition-opacity"
                >
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer border-2 border-white shadow-md transition-all uppercase select-none">
                      {initial}
                    </div>
                </button>

                {/* --- DROPDOWN MENU POPUP --- */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right z-50">
                        
                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                            <p className="text-sm font-semibold text-gray-800">My Account</p>
                            <p className="text-xs text-gray-500 truncate">Manage your profile</p>
                        </div>

                        <button 
                            onClick={() => { navigate('profile'); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                        >
                            <User size={16} /> Profile
                        </button>

                        <button 
                            onClick={() => { navigate('settings'); setIsDropdownOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                        >
                            <Settings size={16} /> Settings
                        </button>

                        <div className="h-px bg-gray-100 my-1 mx-2"></div>

                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                        >
                            <LogOut size={16} /> Log out
                        </button>
                    </div>
                )}
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;