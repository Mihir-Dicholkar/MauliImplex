import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faUpload,
  faBoxesStacked,
  faClipboardList,

  faRightFromBracket,
  faBars,
  faInbox,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faUpload,
  faBoxesStacked,
  faClipboardList,
  faVideo,
  faInbox,
  faRightFromBracket,
  faBars
);

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { label: "Upload", path: "/admin/upload", icon: faUpload },
    { label: "Inventory", path: "/admin/inventory", icon: faBoxesStacked },
    { label: "Inquiry", path: "/admin/inquiry", icon: faInbox },
    { label: "Existing Media", path: "/admin/existing-media", icon: faVideo },
  ];

  return (
    <>
      {/* Hamburger Icon */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-150 cursor-pointer"
      >
        <FontAwesomeIcon icon={faBars} className="text-2xl fixed text-black" />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="w-60 h-screen 
            bg-gradient-to-b from-[#f59e0b] via-[#fcd34d] to-[#fef9c3] 
            backdrop-blur-md text-white p-4 fixed left-0 top-0 z-40 shadow-lg 
            border-r border-white/20 rounded-tr-2xl rounded-br-2xl"
        >
          <h2 className="text-2xl font-bold mb-8 text-white text-center drop-shadow-lg">
            Admin Panel
          </h2>
          <nav className="space-y-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-black font-semibold 
 transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold shadow-md"
                      : "bg-white/5 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white"
                  }`
                }
              >
                <FontAwesomeIcon icon={item.icon} className="w-6 h-6" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </motion.aside>
      )}
    </>
  );
};

export default Sidebar;
