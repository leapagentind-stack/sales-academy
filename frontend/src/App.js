import 'antd/dist/reset.css';
import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import SalesLandingPage from "./SalesLandingPage";   // your file
import MultiRoleRegistration from './components/MultiRoleRegistration';
import Login from "./loginpage/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalesLandingPage />} />
        <Route path="/register" element={<MultiRoleRegistration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
