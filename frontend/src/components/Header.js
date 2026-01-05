import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css"; 
// Make sure this path is correct for your project structure
// If your css is in the same folder, use "./Header.css"

export default function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  
  // ✅ DEFAULT TO 'U', BUT UPDATE IMMEDIATELY
  const [initial, setInitial] = useState("U"); 
  const [displayName, setDisplayName] = useState("User");

  // ✅ FIXED LOGIC: EXACTLY MATCHING YOUR DASHBOARD (HOME.JS)
  useEffect(() => {
    // 1. READ ALL POSSIBLE STORAGE KEYS
    const storedUser = localStorage.getItem("user");
    const storedEmail = localStorage.getItem("email");
    
    let identifier = "";

    // 2. DETERMINE THE IDENTIFIER (Name or Email)
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            // Check for name, username, or email inside the user object
            identifier = parsed.name || parsed.username || parsed.email || storedEmail || "";
        } catch(e) { 
            // If parse fails, assume it's a string
            identifier = storedUser || storedEmail || ""; 
        }
    } else {
        identifier = storedEmail || "";
    }

    // 3. EXTRACT THE INITIAL
    if (identifier) {
        // Remove @gmail.com if present
        let namePart = identifier;
        if (namePart.includes("@")) {
            namePart = namePart.split("@")[0];
        }

        // Set the Full Name for the dropdown
        setDisplayName(namePart);

        // Set the Single Letter for the Circle (M for Mutchunaveen)
        const firstLetter = namePart.charAt(0).toUpperCase();
        setInitial(firstLetter);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return;

    const fetchCartCount = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/cart/${user.id}`);
        setCartCount(res.data.length);
      } catch (err) {
        console.error("Cart count error", err);
      }
    };

    fetchCartCount();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      {/* Left */}
      <div className="header-left" onClick={() => navigate("/studenthomescreen")}>
        <span className="logo">Sales Academy</span>
      </div>

      {/* Center */}
      <div className="header-center">
        <input
          type="text"
          placeholder="Search courses..."
          className="header-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      {/* Right */}
      <div className="header-right">
        <span onClick={() => navigate("/")}>Home</span>

        <span
          onClick={() => {
            if (window.location.pathname !== "/studenthomescreen") {
              navigate("/studenthomescreen");
              setTimeout(() => {
                document.getElementById("my-learning")?.scrollIntoView({ behavior: "smooth" });
              }, 300);
            } else {
              document.getElementById("my-learning")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          My Learning
        </span>
        
        <div className="cart-icon" onClick={() => navigate("/cart")}>
          🛒
          {cartCount > 0 && (
            <span className="cart-count">{cartCount}</span>
          )}
        </div>

        {/* ✅ PROFILE AVATAR SECTION */}
        <div className="profile" ref={profileRef}>
          
          {/* THE CIRCLE WITH THE INITIAL */}
          <div
            className="profile-avatar-circle"
            onClick={() => setOpen((prev) => !prev)}
            style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6', // Blue color like in your screenshot
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '16px',
                textTransform: 'uppercase', // Ensures M is capitalized
                userSelect: 'none'
            }}
          >
            {initial}
          </div>

          {open && (
            <div className="profile-dropdown">
              <div style={{ 
                  padding: '10px 15px', 
                  borderBottom: '1px solid #eee', 
                  fontWeight: 'bold', 
                  color: '#333',
                  textTransform: 'capitalize'
              }}>
                 {displayName}
              </div>
              <span onClick={() => navigate("/dashboard/profile")}>Profile</span>
              <span onClick={logout}>Logout</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}