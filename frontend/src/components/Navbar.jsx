import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import Button from "./Button";
import NotificationBell from "./Notifications/NotificationBell";

const Navbar = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Read user from Redux store (reactive — updates instantly on login/logout)
  const user = useSelector(selectUser);

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[var(--primary)] font-semibold border-b-2 border-[var(--primary)] pb-1 transition duration-200"
      : "text-[var(--text-secondary)] hover:text-[var(--primary)] transition duration-200";

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "text-[var(--primary)] font-semibold bg-[var(--primary-light)] px-3 py-2 rounded-lg"
      : "text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-card-hover)] px-3 py-2 rounded-lg transition duration-200";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--bg-card)] border-b border-[var(--border)] shadow-xs px-6 md:px-10 py-4 transition-all duration-200">
      
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="Serviso Logo"
            className="h-10 w-10 object-contain rounded-full border border-[var(--border)] shadow-xs transition group-hover:scale-105"
            onError={(e) => {
              e.target.src = "https://img.icons8.com/color/96/maintenance.png";
            }}
          />
          <span className="text-2xl font-bold tracking-tight text-[var(--primary)] hover:opacity-90">
            Serviso
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium text-sm lg:text-base">
          <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>About Us</NavLink></li>
          <li><NavLink to="/services" className={linkClass}>Services</NavLink></li>
          <li><NavLink to="/providers" className={linkClass}>Service Providers</NavLink></li>
          {user?.role === "provider" && (
            <li><NavLink to="/provider-dashboard" className={linkClass}>Dashboard</NavLink></li>
          )}
          {user?.role === "admin" && (
            <li><NavLink to="/admin" className={linkClass}>Admin</NavLink></li>
          )}
          <li><NavLink to="/contact" className={linkClass}>Contact</NavLink></li>
        </ul>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <NotificationBell user={user} />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--primary)] border border-[var(--border)] transition duration-200 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              // Sun Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              // Moon Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <img
                src={user.profilePic || "/user.png"}
                alt="profile"
                onClick={() => navigate("/profile")}
                className="h-10 w-10 rounded-full object-cover border border-[var(--border)] cursor-pointer hover:scale-105 hover:border-[var(--primary)] shadow-xs transition"
                onError={(e) => {
                  e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
                }}
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
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden mt-4 bg-[var(--bg-card)] border border-[var(--border)] shadow-lg rounded-xl p-4 transition-all duration-200">
          <ul className="flex flex-col gap-2 font-medium">
            <li><NavLink to="/" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink></li>
            <li><NavLink to="/about" className={mobileLinkClass} onClick={() => setIsOpen(false)}>About Us</NavLink></li>
            <li><NavLink to="/services" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Services</NavLink></li>
            <li><NavLink to="/providers" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Service Providers</NavLink></li>
            {user?.role === "provider" && (
              <li><NavLink to="/provider-dashboard" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink></li>
            )}
            {user?.role === "admin" && (
              <li><NavLink to="/admin" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Admin</NavLink></li>
            )}
            <li><NavLink to="/contact" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Contact</NavLink></li>

            {/* MOBILE AUTH */}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-[var(--border)]">
              {user ? (
                <div
                  onClick={() => {
                    navigate("/profile");
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-card-hover)]"
                >
                  <img
                    src={user.profilePic || "/user.png"}
                    alt="profile"
                    className="h-10 w-10 rounded-full object-cover border border-[var(--border)]"
                    onError={(e) => {
                      e.target.src = "https://img.icons8.com/color/96/user-male-circle--v1.png";
                    }}
                  />
                  <span className="text-[var(--primary)] font-medium">
                    View Profile
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
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
                </div>
              )}
            </div>
          </ul>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
