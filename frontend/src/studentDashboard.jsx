import React, { useEffect, useState } from "react";
import ApplicationForm from "./components/ApplicationForm";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
  Upload,
  Calendar,
  MapPin,
  Mail,
  Phone,
  BookOpen,
  Award,
  Send,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Student Sidebar Component
const StudentSidebar = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/student",
    },
    {
      id: "applications",
      label: "My Applications",
      icon: FileText,
      path: "/student/applications",
    },
    { id: "apply", label: "Apply Now", icon: Plus, path: "/student/apply" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/student/notifications",
    },
    { id: "profile", label: "Profile", icon: User, path: "/student/profile" },
  ];

  const isActive = (path) => {
    if (path === "/student") {
      return location.pathname === "/student";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold">D</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">DRDO Portal</h2>
            <p className="text-blue-200 text-sm">Student Panel</p>
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
                      ? "bg-blue-700 text-white"
                      : "text-blue-200 hover:bg-blue-700 hover:text-white"
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
      <div className="p-4 border-t border-blue-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="font-medium">{currentUser?.name || "Student"}</p>
            <p className="text-blue-200 text-sm">Student</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full p-3 rounded-lg text-blue-200 hover:bg-blue-700 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const StudentDashboardOverview = ({ applications, currentUser }) => {
  // Calculate application statistics
  const stats = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const chartData = [
    { name: "Approved", value: stats.approved || 0, color: "#10B981" },
    { name: "Pending", value: stats.pending || 0, color: "#F59E0B" },
    { name: "On Hold", value: stats.hold || 0, color: "#6B7280" },
  ];

  const totalApplications = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // Sample activity data
  const activityData = [
    { month: "Jan", applications: 2 },
    { month: "Feb", applications: 1 },
    { month: "Mar", applications: 3 },
    { month: "Apr", applications: 2 },
    { month: "May", applications: 4 },
    { month: "Jun", applications: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {currentUser?.name || "Student"}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalApplications}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {chartData.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
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

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Status Overview
          </h3>
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

        {/* Application Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Activity
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="h-20 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h3>
          <Eye className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {applications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{app.labApplied}</p>
                  <p className="text-sm text-gray-600">{app.branch}</p>
                  <p className="text-sm text-gray-500">
                    Applied on {app.dateApplied}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  app.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : app.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.status === "hold"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// My Applications Component
const MyApplications = ({ applications }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.labApplied.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">
          Track your lab applications and their status
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search labs or branches..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hold">On Hold</option>
        </select>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {app.labApplied}
                  </h3>
                  <p className="text-sm text-gray-600">{app.branch}</p>
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  app.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : app.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : app.status === "hold"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {app.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Applied: {app.dateApplied}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Status: {app.status}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ApplyNow = ({ onSubmitApplication, onCloseForm }) => {

  const handleSubmit = (applicationData) => {
    const newApplication = {
      id: Date.now(),
      ...applicationData,
      status: 'pending',
      dateApplied: new Date().toLocaleDateString(),
      studentName: 'Current Student',
      email: 'student@example.com',
    };

    if (onSubmitApplication) {
      onSubmitApplication(newApplication);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Apply Now</h1>
        <p className="text-gray-600 mt-2">
          Submit your application for an internship position
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ApplicationForm 
          onSubmit={handleSubmit} 
          onClose={onCloseForm} 
        />
      </div>
    </div>
  );
};


// Student Notifications Component
const StudentNotifications = ({ applications }) => {
  const notifications = applications
    .filter((app) => app.status === "approved" || app.status === "rejected")
    .map((app) => ({
      id: app.id,
      type: app.status,
      title:
        app.status === "approved"
          ? "Application Approved!"
          : "Application Update",
      message:
        app.status === "approved"
          ? `Your application for ${app.labApplied} has been approved. Congratulations!`
          : `Your application for ${app.labApplied} has been ${app.status}.`,
      date: app.dateApplied,
      lab: app.labApplied,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          Stay updated with your application status
        </p>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Updates ({notifications.length})
          </h3>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 ${
                    notification.type === "approved"
                      ? "bg-green-50 border-green-400"
                      : notification.type === "rejected"
                      ? "bg-red-50 border-red-400"
                      : "bg-yellow-50 border-yellow-400"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === "approved"
                          ? "bg-green-100"
                          : notification.type === "rejected"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {notification.type === "approved" ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : notification.type === "rejected" ? (
                        <X className="w-5 h-5 text-red-600" />
                      ) : (
                        <Bell className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Updated on {notification.date}
                    </p>
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

// Student Profile Component
const StudentProfile = ({ currentUser, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "Student Name",
    email: currentUser?.email || "student@university.edu",
    phone: currentUser?.phone || "(Add your phone number)",
    university: currentUser?.university || "University Name",
    branch: currentUser?.branch || "Computer Science",
    year: currentUser?.year || "3rd Year",
    cgpa: currentUser?.cgpa || "8.5",
    location: currentUser?.location || "(Add your location)",
  });

  const handleSave = () => {
    setCurrentUser({ ...currentUser, ...formData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={40} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formData.name}
            </h3>
            <p className="text-gray-600">{formData.branch} Student</p>
            <p className="text-sm text-gray-500">{formData.university}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.university}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.branch}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            {isEditing ? (
              <select
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            ) : (
              <p className="text-gray-900">{formData.year}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CGPA
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) =>
                  setFormData({ ...formData, cgpa: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{formData.cgpa}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      {/* Academic Information Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Academic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch</p>
              <p className="font-medium text-gray-900">{formData.branch}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CGPA</p>
              <p className="font-medium text-gray-900">{formData.cgpa}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Year</p>
              <p className="font-medium text-gray-900">{formData.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = ({ currentUser, setCurrentUser, onLogout }) => {
  const [applications, setApplications] = useState([]);

  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      <StudentSidebar currentUser={currentUser} onLogout={onLogout} />

      <main className="flex-1 p-6 overflow-y-auto bg-gray-50">

        <Routes>
          <Route
            path="/"
            element={
              <StudentDashboardOverview
                applications={applications}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/applications"
            element={<MyApplications applications={applications} />}
          />
          <Route
            path="/apply"
            element={
              <ApplyNow
                onSubmitApplication={(newApp) =>
                  setApplications((prev) => [newApp, ...prev])
                }
              />
            }
          />
          <Route
            path="/notifications"
            element={
              <StudentNotifications applications={applications} />
            }
          />
          <Route
            path="/profile"
            element={
              <StudentProfile
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
