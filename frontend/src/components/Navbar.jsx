import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // SAFE USER PARSE
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-500 font-semibold"
      : "text-gray-700 hover:text-blue-500 transition";

  return (
    <nav className="w-full bg-white shadow-md px-6 md:px-10 py-4">
      
      <div className="flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Serviso Logo"
            className="h-10 w-10 object-contain rounded-full"
          />
          <span className="text-2xl font-bold text-blue-500">
            Serviso
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-sm md:text-base">
          <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>About Us</NavLink></li>
          <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
          <li><NavLink to="/providers" className={linkClass}>Service Providers</NavLink></li>
          <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-3">

            {user ? (
              <img
                src={user.profilePic || "/user.png"}
                alt="profile"
                onClick={() => navigate("/profile")}
                className="h-10 w-10 rounded-full object-cover border cursor-pointer hover:scale-105 transition"
              />
            ) : (
              <>
                <Button
                  text="Login"
                  type="secondary"
                  onClick={() => navigate("/login")}
                />
                <Button
                  text="Register"
                  type="primary"
                  onClick={() => navigate("/register")}
                />
              </>
            )}

          </div>

          {/* MOBILE MENU ICON */}
          <div className="md:hidden">
            <img
              src="/menu.png"
              alt="menu"
              className="h-6 w-6 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 bg-white shadow-md rounded-lg p-4 font-medium">

          <li><NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>Home</NavLink></li>
          <li><NavLink to="/about" className={linkClass} onClick={() => setIsOpen(false)}>About Us</NavLink></li>
          <li><NavLink to="/services" className={linkClass} onClick={() => setIsOpen(false)}>Services</NavLink></li>
          <li><NavLink to="/providers" className={linkClass} onClick={() => setIsOpen(false)}>Service Providers</NavLink></li>
          <li><NavLink to="/contact" className={linkClass} onClick={() => setIsOpen(false)}>Contact</NavLink></li>

          {/* MOBILE AUTH */}
          <div className="flex flex-col gap-2 mt-3">

            {user ? (
              <div
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <img
                  src={user.profilePic || "/user.png"}
                  alt="profile"
                  className="h-10 w-10 rounded-full object-cover border"
                />
                <span className="text-blue-500 font-medium">
                  View Profile
                </span>
              </div>
            ) : (
              <>
                <Button
                  text="Login"
                  type="secondary"
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                />
                <Button
                  text="Register"
                  type="primary"
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                />
              </>
            )}

          </div>

        </ul>
      )}

    </nav>
  );
};

export default Navbar;