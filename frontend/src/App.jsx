import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import "./App.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Layout = lazy(() => import('./components/Layout'));
const DashboardHome = lazy(() => import('./components/Teacher/Home'));
const DashboardCourses = lazy(() => import('./components/Teacher/Courses'));
const DashboardOffers = lazy(() => import('./components/Teacher/Offers'));
const DashboardStudents = lazy(() => import('./components/Teacher/Students'));
const Assignments = lazy(() => import('./components/Teacher/Assignments'));
const LiveClasses = lazy(() => import('./components/Teacher/LiveClasses'));
const Messages = lazy(() => import('./components/Teacher/Messages'));
const Notifications = lazy(() => import('./components/Teacher/Notifications'));
const DashboardProfile = lazy(() => import('./components/Teacher/Profile'));
const Settings = lazy(() => import('./components/Teacher/Settings'));

// Admin Component
const AdminAnnouncements = lazy(() => import('./components/Admin/AdminAnnouncements'));

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <DashboardProvider>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          style={{ zIndex: 999999 }} 
        />

        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<SalesLandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<MultiRoleRegistration />} />

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

            {/* TEACHER DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<DashboardHome />} />
              {/* Announcements Route Removed from Teacher Dashboard */}
              <Route path="courses" element={<DashboardCourses />} />
              <Route path="offers" element={<DashboardOffers />} />
              <Route path="students" element={<DashboardStudents />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="live-classes" element={<LiveClasses />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="announcements" element={<AdminAnnouncements />} />
            </Route>

            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                  <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                  <p className="text-xl text-gray-600">Page Not Found</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </DashboardProvider>
  );
}

export default App;