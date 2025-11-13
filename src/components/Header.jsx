import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Our-Gallery", path: "/gallery" },
    { name: "Certification", path: "/certification" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
  <header className="bg-white/30 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 ">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img src="/navlogo.png" alt="Mauli Implex" className="h-22 w-auto" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="relative text-gray-900 text-xl px-3 py-1 transition-all duration-300
                 before:content-[''] before:absolute before:bottom-0 before:left-0
                 before:w-full before:h-0.5 before:bg-[#dfc39a]
                 before:scale-x-0 hover:before:scale-x-100 before:origin-left
                 before:transition-transform before:duration-300 hover:text-[#ff7070]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-700"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pt-2 pb-6 flex flex-col items-center space-y-4 shadow">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="w-full text-center text-gray-700 text-lg px-3 py-2 rounded transition-all duration-300 ease-in-out hover:text-white hover:bg-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
