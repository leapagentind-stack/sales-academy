import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { message } from 'antd';

const Layout = () => {
  const navigate = useNavigate();

  // --- 1. LOGOUT LOGIC ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Logged out successfully");
    navigate('/login');
  };

  // Helper for Link Styling
  const getLinkClass = ({ isActive }) => 
    isActive 
      ? "flex items-center px-4 py-3 bg-blue-500 rounded-lg text-white shadow-sm transition-all mb-1" 
      : "flex items-center px-4 py-3 text-blue-100 hover:bg-blue-500 hover:text-white rounded-lg transition-all mb-1";

  // Style for the Logout Button (matches the links above)
  const logoutButtonStyle = "w-full flex items-center px-4 py-3 text-blue-100 hover:bg-red-500 hover:text-white rounded-lg transition-all mb-1 text-left";

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

          <NavLink to="settings" className={getLinkClass}>
            <i className="fa-solid fa-gear w-6 text-center"></i>
            <span className="font-medium ml-2">Settings</span>
          </NavLink>

          {/* --- LOGOUT BUTTON (Inside the list now) --- */}
          <button onClick={handleLogout} className={logoutButtonStyle}>
            {/* SVG Icon ensures it displays even without FontAwesome */}
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className="font-medium ml-2">Logout</span>
          </button>

        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Topbar */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 z-10 flex-shrink-0">
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
            <NavLink to="profile">
                <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:ring-4 hover:ring-blue-100 transition-all">
                  A
                </div>
            </NavLink>
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