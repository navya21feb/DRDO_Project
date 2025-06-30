import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Bell, 
  User, 
  LogOut,
  Search,
  Eye,
  Check,
  X,
  Clock,
  Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Admin Sidebar Component
const AdminSidebar = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'applications', label: 'Applications', icon: FileText, path: '/admin/applications' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { id: 'profile', label: 'Profile', icon: User, path: '/admin/profile' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-indigo-600 text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 font-bold">L</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">DRDO Portal</h2>
            <p className="text-indigo-200 text-sm">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-indigo-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="font-medium">{currentUser?.name || 'Admin'}</p>
            <p className="text-indigo-200 text-sm">Administrator</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg text-indigo-200 hover:bg-indigo-700 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const AdminDashboardOverview = ({ applications }) => {
  // Calculate application statistics
  const stats = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: 'Approved', value: stats.approved || 0, color: '#10B981' },
    { name: 'Pending', value: stats.pending || 0, color: '#F59E0B' },
    { name: 'On Hold', value: stats.hold || 0, color: '#6B7280' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#EF4444' },
  ];

  const totalApplications = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, Admin</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {chartData.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: stat.color }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{app.studentName}</p>
                  <p className="text-sm text-gray-600">{app.email}</p>
                  <p className="text-sm text-gray-500">{app.labApplied} - {app.branch}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'hold' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{app.dateApplied}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Applications Management Component
const ApplicationsManagement = ({ applications, setApplications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.labApplied.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (appId, newStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Applications Management</h1>
        <p className="text-gray-600 mt-2">Review and manage student applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students, emails, or labs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hold">On Hold</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                      <div className="text-sm text-gray-500">{app.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.labApplied}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.dateApplied}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'hold' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(app.id, 'approved')}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'hold')}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                        title="Put on Hold"
                      >
                        <Clock size={16} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(app.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Notifications Component
const AdminNotifications = ({ applications }) => {
  const newApplications = applications.filter(app => app.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">New application notifications</p>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Applications ({newApplications.length})
          </h3>
          {newApplications.length === 0 ? (
            <p className="text-gray-500">No new applications</p>
          ) : (
            <div className="space-y-4">
              {newApplications.map((app) => (
                <div key={app.id} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">New Application Received</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>{app.studentName}</strong> ({app.email}) has applied for <strong>{app.labApplied}</strong> lab in {app.branch} branch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Applied on {app.dateApplied}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Admin Profile Component
const AdminProfile = ({ currentUser, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Admin User',
    email: currentUser?.email || 'admin@drdo.gov.in',
    phone: currentUser?.phone || '(Add your phone number)',
    department: currentUser?.department || 'Administration',
    location: currentUser?.location || '(Add your location)',
  });

  const handleSave = () => {
    setCurrentUser({ ...currentUser, ...formData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
        <p className="text-gray-600 mt-2">Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{formData.name}</h3>
            <p className="text-gray-600">Administrator</p>
            <p className="text-sm text-gray-500">DRDO Portal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{formData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{formData.department}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            ) : (
              <p className="text-gray-900">{formData.location}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = ({
  currentUser,
  setCurrentUser,
  students,
  setStudents,
  applications: originalApplications,
  setApplications: setOriginalApplications,
  universities,
  setUniversities,
  notifications,
  setNotifications,
  onLogout
}) => {
  const [applications, setApplications] = useState([]);

  const baseURL = import.meta.env.VITE_BACKEND_URL;

useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await fetch(`${baseURL}/api/applications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  };

  fetchApplications();
}, []);


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar currentUser={currentUser} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={
            <AdminDashboardOverview applications={applications} />
          } />
          <Route path="/applications" element={
            <ApplicationsManagement 
              applications={applications} 
              setApplications={setApplications} 
            />
          } />
          <Route path="/notifications" element={
            <AdminNotifications applications={applications} />
          } />
          <Route path="/profile" element={
            <AdminProfile 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser} 
            />
          } />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;