import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear login token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="h-16 w-full flex items-center justify-between px-6 text-white bg-white/5 backdrop-blur-lg shadow border-b border-white/10">
      <h1 className="text-xl ml-20 text-center text-black font-bold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <p className=" opacity-80 text-3xl text-black">Welcome, Admin</p>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:text-red-700 transition"
          title="Log Out"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
