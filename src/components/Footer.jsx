import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
 <motion.footer
  className="bg-white/20 backdrop-blur-md shadow-inner rounded-t-3xl py-12 mt-10 overflow-hidden"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-gray-700">
    {/* Information Section */}
    <div className="bg-white/10 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-bold mb-4">Information</h3>
      <ul className="space-y-2">
        {["About Us", "Our Products", "Careers", "Blog"].map((item) => (
          <li
            key={item}
            className="hover:text-orange-500 transition-all cursor-pointer"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>

    {/* Help Section */}
    <div className="bg-white/10 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-bold mb-4">Help</h3>
      <ul className="space-y-2">
        {["FAQs", "Shipping Info", "Returns & Refunds", "Privacy Policy"].map(
          (item) => (
            <li
              key={item}
              className="hover:text-orange-500 transition-all cursor-pointer"
            >
              {item}
            </li>
          )
        )}
      </ul>
    </div>

    {/* Contact Section */}
    <div className="bg-white/10 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <h3 className="text-lg font-bold mb-4">Contact Us</h3>
      <ul className="space-y-3">
        <li className="flex items-start gap-3 hover:scale-105 transition-all">
          <FaMapMarkerAlt className="text-orange-500 mt-1" />
          B 103, Suyash Swaraj CHS, Plot 44-45, Sec-8, Koperkhairne, Navi Mumbai
        </li>
        <li className="flex items-center gap-3 hover:scale-105 transition-all">
          <FaEnvelope className="text-orange-500" />
          info@maulimpex.com
        </li>
        <li className="flex items-center gap-3 hover:scale-105 transition-all">
          <FaPhoneAlt className="text-orange-500" />
          +91 8698890909
        </li>
      </ul>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="mt-10 border-t border-gray-300/30 pt-6 text-center space-y-4">
    <p className="text-sm text-gray-600">
      © {new Date().getFullYear()} Mauli Impex. All rights reserved.
    </p>
    <div className="flex justify-center space-x-6 text-gray-600 text-xl">
      {[FaGithub, FaLinkedin, FaEnvelope].map((Icon, i) => (
        <a
          key={i}
          href="#"
          className="hover:text-orange-500 transition-all duration-300 hover:scale-110"
        >
          <Icon />
        </a>
      ))}
    </div>
  </div>
</motion.footer>

  );
};

export default Footer;
