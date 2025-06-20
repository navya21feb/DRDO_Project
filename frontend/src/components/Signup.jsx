import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm = ({ setCurrentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // For now, we'll just auto-login the user after signup
    setCurrentUser({
      id: Date.now(),
      ...formData
    });

    navigate('/overview');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="mb-4 w-full px-4 py-2 border rounded"
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="mb-4 w-full px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="mb-4 w-full px-4 py-2 border rounded"
        />

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="mb-4 w-full px-4 py-2 border rounded"
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
