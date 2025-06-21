// Settings.jsx
import React, { useState } from 'react';
import { Lock, BellRing, Mail, User, Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    email: 'rahul.sharma@email.com',
    username: 'rahulsharma99',
    changePassword: '',
    confirmPassword: '',
    notifications: true,
    newsletter: false
  });

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-600">Manage your preferences and account settings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center border px-3 py-2 rounded-lg border-gray-300">
              <Mail className="h-4 w-4 mr-2 text-gray-500" />
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full outline-none text-gray-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center border px-3 py-2 rounded-lg border-gray-300">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <input
                type="text"
                value={settings.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full outline-none text-gray-800"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="flex items-center border px-3 py-2 rounded-lg border-gray-300">
              <Lock className="h-4 w-4 mr-2 text-gray-500" />
              <input
                type="password"
                value={settings.changePassword}
                onChange={(e) => handleChange('changePassword', e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="flex items-center border px-3 py-2 rounded-lg border-gray-300">
              <Lock className="h-4 w-4 mr-2 text-gray-500" />
              <input
                type="password"
                value={settings.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="w-full outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">