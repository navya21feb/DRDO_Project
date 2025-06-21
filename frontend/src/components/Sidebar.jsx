import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, FileText, BookOpen, Bell, Settings, LogOut, Home } from 'lucide-react';

const Sidebar = ({ currentUser, setCurrentUser, notifications }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, path: '/overview' },
    { id: 'applications', label: 'My Applications', icon: FileText, path: '/applications' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      path: '/notifications',
      badge: unreadCount > 0 ? unreadCount : null
    },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-lg h-screen w-64 fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">DRDO Portal</h1>
        <p className="text-sm text-gray-600">Internship Management</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center justify-between gap-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.label}
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('') : 'U'}
          </div>
          <div>
            <p className="font-medium text-sm">{currentUser?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser?.role || 'student'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-600 hover:text-red-800 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
