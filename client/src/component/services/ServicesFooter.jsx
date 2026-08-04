import React from "react";
import { Link } from "react-router-dom";

const ServicesFooter = () => {
  return (
    <footer className="mt-12 py-6 text-center">

      <div className="flex justify-center gap-25 text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/about" className="hover:text-blue-600">About Us</Link>
        <Link to="/services" className="hover:text-blue-600">Services</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
      </div>

      <p className="text-xs text-gray-500">
        ©2024 New Purnagiri Automobiles. All rights reserved.
      </p>

    </footer>
  );
};

export default ServicesFooter;