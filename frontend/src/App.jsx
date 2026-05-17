import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GarageDetails from "./pages/GarageDetails";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GarageRegister from "./pages/GarageRegister";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<GarageRegister />} />
      <Route path="/register" element={<Register />} />
      <Route path="/garage-register" element={<GarageRegister />} />
      <Route path="/garage/:id" element={<GarageDetails />} />
      <Route path="/search" element={<SearchResults />} />
    </Routes>
    <Footer />
    </>
    
  );
}



// inside <Routes>:



