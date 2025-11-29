import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!userId || !password) {
      setError("Please enter both fields.");
      return;
    }

    try {
      // Call backend login API
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        adminID: userId,
        password: password,
      });

      // Save the JWT token returned by backend
      localStorage.setItem("token", res.data.token);

      // Navigate to admin dashboard
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-white to-green-800 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-10 w-full max-w-md border border-white/30"
      >
        <h2 className="text-3xl font-bold text-black text-center mb-8">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mb-5 relative">
          <FontAwesomeIcon
            icon={faUser}
            className="absolute left-3 top-3 text-black/70"
          />
          <input
            type="text"
            placeholder="Admin ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full pl-10 p-3 rounded-lg bg-white border border-white/30 text-black placeholder-white/70 focus:outline-none"
          />
        </div>

        <div className="mb-6 relative">
          <FontAwesomeIcon
            icon={faLock}
            className="absolute left-3 top-3 text-black/70"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 p-3 rounded-lg bg-white/20 border text-black border-white/30 placeholder-white/70 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-green-600 font-semibold py-2 rounded-lg hover:bg-green-100 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
