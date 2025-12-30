import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import "./App.css";

// Lazy Load Components
const SalesLandingPage = lazy(() => import('./SalesLandingPage'));
const Login = lazy(() => import('./components/Login'));
const MultiRoleRegistration = lazy(() => import('./pages/MultiRoleRegistration'));
const StudentHomeScreen = lazy(() => import('./components/StudentHomeScreen'));
const CourseVideos = lazy(() => import('./components/CourseVideos'));
const CategoryPage = lazy(() => import('./components/CategoryPage'));
const RecommendedVideos = lazy(() => import('./components/RecommendedVideos'));
const PopularVideos = lazy(() => import('./components/PopularVideos'));
const NewVideos = lazy(() => import('./components/NewVideos'));
const StudentProfile = lazy(() => import('./pages/Profile'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Dashboard Components
const Layout = lazy(() => import('./components/Layout'));
const DashboardHome = lazy(() => import('./components/Dashboard/Home'));
const DashboardCourses = lazy(() => import('./components/Dashboard/Courses'));
const DashboardStudents = lazy(() => import('./components/Dashboard/Students'));
const Assignments = lazy(() => import('./components/Dashboard/Assignments'));
const LiveClasses = lazy(() => import('./components/Dashboard/LiveClasses'));
const Messages = lazy(() => import('./components/Dashboard/Messages'));
const Notifications = lazy(() => import('./components/Dashboard/Notifications'));
const DashboardProfile = lazy(() => import('./components/Dashboard/Profile'));
const Settings = lazy(() => import('./components/Dashboard/Settings'));

// Loading Spinner
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
  </div>
);

// ✅ NEW: Protected Route Component
// This checks if the user is logged in before showing the Dashboard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if token exists
  if (!token) {
    // If no token, redirect to Login
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <DashboardProvider>
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<SalesLandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<MultiRoleRegistration />} />
            
            {/* Student Routes (You can wrap these in ProtectedRoute too if needed) */}
            <Route path="/studenthomescreen" element={<StudentHomeScreen />} />
            <Route path="/course/:id" element={<CourseVideos />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/recommended-videos/:id" element={<RecommendedVideos />} />
            <Route path="/popular-videos/:id" element={<PopularVideos />} />
            <Route path="/new-videos/:id" element={<NewVideos />} />
            <Route path="/profile" element={<StudentProfile />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* ✅ PROTECTED TEACHER DASHBOARD ROUTES */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<DashboardHome />} />
              <Route path="courses" element={<DashboardCourses />} />
              <Route path="students" element={<DashboardStudents />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                <p className="text-xl text-gray-600">Page Not Found</p>
              </div>
            } />
          </Routes>
        </Suspense>
      </Router>
    </DashboardProvider>
  );
}

export default App;