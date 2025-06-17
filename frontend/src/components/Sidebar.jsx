import React from 'react';
import { User, FileText, Calendar, BarChart3, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, currentUser, setCurrentUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">DRDO Portal</h1>
        <p className="text-sm text-gray-600">Internship Management</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
              activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-600'
            }`}>
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-sm">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.role}</p>
          </div>
        </div>
        <button onClick={() => setCurrentUser(null)}
          className="w-full flex items-center gap-2 text-red-600 hover:text-red-800 text-sm">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
