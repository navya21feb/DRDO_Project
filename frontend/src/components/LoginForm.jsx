import React, { useState } from 'react';

const LoginForm = ({ setCurrentUser, setUserRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserRole(formData.role);
    setCurrentUser({
      id: 1,
      name: formData.name || 'User',
      email: formData.email,
      role: formData.role
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DRDO Internship Portal</h1>
          <p className="text-gray-600">Defence Research and Development Organisation</p>
        </div>

        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-2 px-4 rounded-md ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-2 px-4 rounded-md ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input type="text" placeholder="Full Name" required className="w-full px-3 py-2 border rounded-md"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          )}
          <input type="email" placeholder="Email" required className="w-full px-3 py-2 border rounded-md"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="w-full px-3 py-2 border rounded-md"
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          {!isLogin && (
            <select className="w-full px-3 py-2 border rounded-md" value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="student">Student</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          )}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
