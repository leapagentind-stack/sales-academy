import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import SalesLandingPage from "./SalesLandingPage";
import MultiRoleRegistration from "./pages/MultiRoleRegistration";
import StudentHomeScreen from "./components/StudentHomeScreen";
import CourseVideos from "./components/CourseVideos";
import CategoryPage from "./components/CategoryPage";
import RecommendedVideos from "./components/RecommendedVideos";
import PopularVideos from "./components/PopularVideos";
import NewVideos from "./components/NewVideos";
import Profile from "./pages/Profile";
import SearchResults from "./components/SearchResults";
import Cart  from "./pages/Cart";
import Checkout from "./pages/Checkout";

<Route path="/checkout" element={<Checkout />} />

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Landing Page */}
        <Route path="/" element={<SalesLandingPage />} />
       
        {/* Registration Page */}
        <Route path="/register" element={<MultiRoleRegistration />} />
        <Route path="/login" element={<Login />} />
         {/* Student Dashboard */}
        <Route path="/studenthomescreen" element={<StudentHomeScreen />} />
        <Route path="/course/:id" element={<CourseVideos />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/recommended-videos/:id" element={<RecommendedVideos />} />
        <Route path="/popular-videos/:id" element={<PopularVideos />} />
        <Route path="/new-videos/:id" element={<NewVideos />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout />} />

      </Routes> 
    </Router>
  );
}

export default App;
