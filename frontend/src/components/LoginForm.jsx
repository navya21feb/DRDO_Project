import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

const LoginForm = ({ setCurrentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", { email, password });

      const { token, user } = res.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("currentUser", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setCurrentUser(user);
      navigate(user.role === "admin" ? "/admin" : "/overview");
    } catch (err) {
      alert("Login failed. Please check credentials.");
      console.error(err);
    }
  };

  return (
<div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
  <form
    onSubmit={handleLogin}
    className="bg-white p-8 rounded shadow-md w-full max-w-md"
  >
    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

    <div className="mb-4">
      <label className="block text-gray-600 mb-1">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
        required
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-600 mb-1">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
        required
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
    >
      Login
    </button>

    <p className="mt-4 text-sm text-gray-600 text-center">
      Don't have an account?{" "}
      <a href="/signup" className="text-blue-600 hover:underline">
        Sign Up
      </a>
    </p>
  </form>
</div>

  );
};

export default LoginForm;
