import { useEffect, useState } from 'react';
import axios from './api/axiosConfig'; 
const baseURL = import.meta.env.VITE_BACKEND_URL;
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
  Plus,
  RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// Admin Sidebar Component (unchanged)
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
    <div className="min-w-[16rem] bg-indigo-600 text-white min-h-screen flex flex-col">
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
    const status = app.status === 'on hold' ? 'hold' : app.status;
    acc[status] = (acc[status] || 0) + 1;
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
              <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{app.studentName}</p>
                  <p className="text-sm text-gray-600">{app.email}</p>
                  <p className="text-sm text-gray-500">{app.position}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'on hold' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status === 'on hold' ? 'hold' : app.status}
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

// Applications Management Component (with critical fixes)
const ApplicationsManagement = ({ applications, setApplications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const filteredApplications = applications.filter(app => {
    const frontendStatus = app.status === 'on hold' ? 'hold' : app.status;
    const matchesSearch = (
      app.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = (
      statusFilter === 'all' || 
      frontendStatus === statusFilter
    );
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (appId, newStatus) => {
  try {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      alert("Authentication token not found. Please log in again.");
      return;
    }

    // Status mapping to ensure backend compatibility
    const statusMap = {
      'hold': 'on hold',
      'approved': 'approved',
      'rejected': 'rejected',
      'pending': 'pending'
    };
    
    const backendStatus = statusMap[newStatus] || newStatus;
    const payload = { status: backendStatus };

    console.log('Status update request:', {
      appId,
      frontendStatus: newStatus,
      backendStatus,
      payload,
      url: `${baseURL}/applications/${appId}/status`
    });

    const response = await axios.put(
      `${baseURL}/applications/${appId}/status`,
      payload, // Send as plain object, not JSON.stringify
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Status update response:', response.data);

    // Update local state
    setApplications(prev => 
      prev.map(app => 
        app._id === appId ? { 
          ...app, 
          status: response.data.application?.status || backendStatus
        } : app
      )
    );

    alert(`Status updated to "${backendStatus}" successfully!`);

  } catch (error) {
    console.error("Status update failed:", {
      error: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });
    
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'Unknown error occurred';
    
    alert(`Failed to update status: ${errorMessage}`);
  }
};

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${baseURL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      setError("Failed to refresh applications");
      console.error("Refresh error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

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
              placeholder="Search students, emails, or positions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
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
          <button
            onClick={handleRefresh}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.resume ? (
                        <button
                          onClick={() => window.open(`${baseURL}/applications/resume/${app.resume}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900 underline flex items-center gap-1"
                        >
                          <FileText size={16} />
                          View Resume
                        </button>
                      ) : (
                        <span className="text-gray-400">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.dateApplied}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'on hold' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {app.status === 'on hold' ? 'hold' : app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(app._id, 'approved')}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, 'hold')}
                          className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                          title="Put on Hold"
                        >
                          <Clock size={16} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
                <div key={app._id} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">New Application Received</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>{app.studentName}</strong> ({app.email}) has applied for <strong>{app.position}</strong> position.
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
    name: '',
    email: '',
    phone: '',
    department: '',
    location: '',
  });

  // Fetch admin profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          const userData = response.data.user;
          setFormData({
            name: userData.name || 'Admin User',
            email: userData.email || 'admin@drdo.gov.in',
            phone: userData.phone || '(Add your phone number)',
            department: userData.department || 'Administration',
            location: userData.location || '(Add your location)',
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Fallback to currentUser if API fails
        setFormData({
          name: currentUser?.name || 'Admin User',
          email: currentUser?.email || 'admin@drdo.gov.in',
          phone: currentUser?.phone || '(Add your phone number)',
          department: currentUser?.department || 'Administration',
          location: currentUser?.location || '(Add your location)',
        });
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const response = await axios.put(
        `${baseURL}/users/update-profile`,
        {
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          location: formData.location
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update the current user state with the response data
        setCurrentUser(response.data.user);
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile';
      alert(`Error: ${errorMessage}`);
    }
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

const AdminDashboard = ({
  currentUser,
  setCurrentUser,
  onLogout
}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${baseURL}/applications`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal
        });
        setApplications(response.data);
      } catch (error) {
        if (error.name !== 'CanceledError') {
          setError("Failed to load applications");
          console.error("Fetch error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    
    
    return () => {
      controller.abort();
    };
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading dashboard...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="flex w-full min-h-screen bg-gray-50 overflow-x-hidden">
      <AdminSidebar currentUser={currentUser} onLogout={onLogout} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<AdminDashboardOverview applications={applications} />} />
          <Route path="/applications" element={
            <ApplicationsManagement 
              applications={applications} 
              setApplications={setApplications} 
            />
          } />
          <Route path="/notifications" element={<AdminNotifications applications={applications} />} />
          <Route path="/profile" element={
            <AdminProfile 
              currentUser={currentUser} 
              setCurrentUser={setCurrentUser} 
            />
          } />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;