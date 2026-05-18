// src/App.jsx
// Layout routes: dashboard gets NO Navbar/Footer — it has its own header
// All other pages use MainLayout (Navbar + Footer)

import { Routes, Route, Outlet } from "react-router-dom";
import Navbar  from "./components/Navbar";
import Footer  from "./components/Footer";

import Home            from "./pages/Home";
import SearchResults   from "./pages/SearchResults";
import GarageDetails   from "./pages/GarageDetails";
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import GarageRegister  from "./pages/GarageRegister";
import GarageDashboard from "./pages/GarageDashboard";

// All public pages — includes Navbar + Footer
function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// Dashboard — NO Navbar, NO Footer (dashboard has its own built-in header)
function DashboardLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      {/* Public pages with Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/"                element={<GarageDashboard />} />
        <Route path="/search"          element={<SearchResults />} />
        <Route path="/garage/:id"      element={<GarageDetails />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/register/garage" element={<GarageRegister />} />
      </Route>

      {/* Dashboard — self-contained, no shared Navbar */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<GarageDashboard />} />
      </Route>
    </Routes>
  );
}