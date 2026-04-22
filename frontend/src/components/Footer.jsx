import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-500 px-10 py-12 mt-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          <img
            src="/logo.png"
            alt="Serviso Logo"
            className="h-10 mb-4 rounded-full"
          />

          <p className="text-sm text-gray-500">
            Serviso connects you with trusted service providers across Nepal.
            Simple, reliable, and easy to use.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-blue-500 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-500">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-500">About Us</Link></li>
            <li><Link to="/services" className="hover:text-blue-500">Services</Link></li>
            <li><Link to="/providers" className="hover:text-blue-500">Providers</Link></li>
            <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-semibold text-blue-500 mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Plumbing</li>
            <li>Electrical Work</li>
            <li>Cleaning</li>
            <li>Tutoring</li>
            <li>Technical Help</li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="font-semibold text-blue-500 mb-4">Contact</h3>

          <p className="text-sm">Kathmandu, Nepal</p>
          <p className="text-sm">support@serviso.com</p>
          <p className="text-sm mb-4">+977-9765289135</p>

          {/* Social Icons (replace paths) */}
          <div className="flex gap-4 mt-2">
            <img src="/facebook.png" alt="fb" className="h-5 w-5 cursor-pointer" />
            <img src="/instagram.png" alt="ig" className="h-5 w-5 cursor-pointer" />
            <img src="/x-icon.png" alt="tw" className="h-5 w-5 cursor-pointer bg-white" />
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 mt-10 border-t pt-5">
        © {year} Serviso. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;