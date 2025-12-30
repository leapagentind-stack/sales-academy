import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    message.success("Logged out successfully");
    navigate('/login');
  };

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard/home' },
    { icon: '📚', label: 'Manage Courses', path: '/dashboard/courses' },
    { icon: '👥', label: 'Students', path: '/dashboard/students' },
    { icon: '📝', label: 'Assignments', path: '/dashboard/assignments' },
    { icon: '🎥', label: 'Live Classes', path: '/dashboard/live-classes' },
    { icon: '💬', label: 'Messages', path: '/dashboard/messages' },
    { icon: '🔔', label: 'Notifications', path: '/dashboard/notifications' },
    { icon: '👤', label: 'Profile', path: '/dashboard/profile' },
    { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
    
    // ✅ ADD LOGOUT HERE (Last Item)
    { icon: '🚪', label: 'Logout', path: '#' } 
  ];

  const handleItemClick = (e, item) => {
    if (onClose) onClose();

    // ✅ INTERCEPT LOGOUT CLICK
    if (item.label === 'Logout') {
      e.preventDefault(); // Stop navigation
      handleLogout();     // Run logic
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>🏫 Teacher Portal</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''} ${item.label === 'Logout' ? 'logout-btn' : ''}`}
              onClick={(e) => handleItemClick(e, item)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;