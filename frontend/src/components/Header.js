import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

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
  if (!user?.id) return;

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/cart/${user.id}`
      );
      setCartCount(res.data.length);
    } catch (err) {
      console.error("Cart count error", err);
    }
  };

  fetchCartCount();

  // Optional auto-refresh every 5 sec
  const interval = setInterval(fetchCartCount, 5000);
  return () => clearInterval(interval);
}, [user?.id]);


  /* ✅ CLOSE DROPDOWN WHEN CLICKING OUTSIDE */
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
                document
                  .getElementById("my-learning")
                  ?.scrollIntoView({ behavior: "smooth" });
              }, 300);
            } else {
              document
                 .getElementById("my-learning")
                ?.scrollIntoView({ behavior: "smooth" });
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

        {/* ✅ Profile */}
        <div className="profile" ref={profileRef}>
          <span
            className="profile-name"
            onClick={() => setOpen((prev) => !prev)}
          >
            {user?.name || "Student"} ▼
          </span>

          {open && (
            <div className="profile-dropdown">
              <span onClick={() => navigate("/profile")}>Profile</span>
              <span onClick={logout}>Logout</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
