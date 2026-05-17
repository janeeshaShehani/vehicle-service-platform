import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GarageDetails from "./pages/GarageDetails";
import SearchResults from "./pages/SearchResults";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/garage/:id" element={<GarageDetails />} />
      <Route path="/search" element={<SearchResults />} />
    </Routes>
    <Footer />
    </>
    
  );
}



// inside <Routes>:



