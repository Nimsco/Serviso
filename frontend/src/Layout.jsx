import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "./store/authSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const workspacePaths = [
    "/admin",
    "/provider-dashboard",
    "/provider-register",
    "/provider-verify",
  ];

  if (user?.role === "provider" || user?.role === "admin") {
    workspacePaths.push("/profile", "/edit-profile");
  }

  const isWorkspacePath = workspacePaths.some((path) =>
    location.pathname === path || location.pathname.startsWith(path + "/")
  );
  
  // Always show nav/footer on the landing page, even for providers/admins, 
  // to avoid a completely blank screen without navigation, but hide it on workspace/profile paths.
  const hideCustomerLayout = isWorkspacePath && location.pathname !== "/";

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-250">
      {!hideCustomerLayout && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main className="flex-1">
        <Outlet context={{ theme, toggleTheme }} />
      </main>
      {!hideCustomerLayout && <Footer />}
    </div>
  );
};

export default Layout;
