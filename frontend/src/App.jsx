import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./Layout";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Providers from "./pages/Providers";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import BookService from "./pages/BookService";
import Cancel from "./pages/Cancel";
import Success from "./pages/Success";
import AdminDashboard from "./pages/AdminDashboard";
import CategoryServices from "../src/components/Services/CategoryServices";
import ProviderProfile from "../src/components/Providers/ProviderProfile";

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/book/:id" element={<BookService />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/services/:category" element={<CategoryServices />} />
          <Route path="/provider/:id" element={<ProviderProfile />} />


        </Route>
      </Routes>
    </Router>
  );
};

export default App;