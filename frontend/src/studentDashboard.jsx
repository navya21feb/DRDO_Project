import React, { useEffect, useState } from "react";
import ApplicationForm from "./components/ApplicationForm";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from '../src/api/axiosConfig';

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
  Edit3,
  Save,
  GraduationCap,
  Building,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader2,
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

// Local Storage utilities
const STORAGE_KEY = "student_applications";

const saveApplicationsToStorage = (applications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error("Error saving applications to localStorage:", error);
  }
};

const loadApplicationsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading applications from localStorage:", error);
    return [];
  }
};

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div
        className={`flex items-center space-x-3 p-4 rounded-lg shadow-lg border-l-4 min-w-80 ${
          type === "success"
            ? "bg-green-50 border-green-400 text-green-800"
            : type === "error"
            ? "bg-red-50 border-red-400 text-red-800"
            : "bg-blue-50 border-blue-400 text-blue-800"
        }`}
      >
        <div className="flex-shrink-0">
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : type === "error" ? (
            <AlertCircle className="w-5 h-5 text-red-600" />
          ) : (
            <Bell className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

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
    <div className="w-64 bg-blue-600 text-white h-screen flex flex-col fixed">
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
  const activityData = applications.reduce((acc, app) => {
    const month = new Date(app.dateApplied).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.applications += 1;
    } else {
      acc.push({ month, applications: 1 });
    }
    return acc;
  }, []);

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
            {totalApplications > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No applications yet</p>
                  <p className="text-sm text-gray-400">
                    Submit your first application to see statistics
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Application Activity
          </h3>
          <div className="h-64">
            {activityData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No activity data</p>
                  <p className="text-sm text-gray-400">
                    Activity will appear after applications
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Applications
          </h3>
          <Eye className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                No applications submitted yet
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Start your journey by applying to your first lab
              </p>
              <button
                onClick={() => (window.location.href = "/student/apply")}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            </div>
          ) : (
            applications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {app.labApplied}
                    </p>
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const baseURL = "http://localhost:5000/api"; 

const MyApplications = ({ applications, onDeleteApplication }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      (app.labApplied || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.branch || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteApplication = async (appId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      await onDeleteApplication(appId);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-2">Track your lab applications and their status</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search labs or branches..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="hold">On Hold</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApplications.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              {applications.length === 0
                ? "No applications yet"
                : "No matching applications"}
            </p>
            <p className="text-gray-400 mb-6">
              {applications.length === 0
                ? "Start your journey by submitting your first application"
                : "Try adjusting your search or filter criteria"}
            </p>
            {applications.length === 0 && (
              <button
                onClick={() => (window.location.href = "/student/apply")}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                <span>Submit Application</span>
              </button>
            )}
          </div>
        ) : (
          filteredApplications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{app.labApplied}</h3>
                    <p className="text-sm text-gray-600">{app.branch}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
                  <button
                    onClick={() => handleDeleteApplication(app._id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete application"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
                <button
                  onClick={() => setSelectedApplication(app)}
                  className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-lg p-6 shadow-xl relative animate-fade-in-up">
            <button
              onClick={() => setSelectedApplication(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Application Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
              <p>
                <strong>Lab Applied:</strong> {selectedApplication.labApplied}
              </p>
              <p>
                <strong>Position:</strong> {selectedApplication.position}
              </p>
              <p>
                <strong>Status:</strong> {selectedApplication.status}
              </p>
              <p>
                <strong>Date Applied:</strong> {selectedApplication.dateApplied}
              </p>
              <p>
                <strong>Name:</strong> {selectedApplication.studentName}
              </p>
              <p>
                <strong>Email:</strong> {selectedApplication.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedApplication.phone}
              </p>
              <p>
                <strong>University:</strong> {selectedApplication.university}
              </p>
              <p>
                <strong>Branch:</strong> {selectedApplication.branch}
              </p>
              <p>
                <strong>Year:</strong> {selectedApplication.year}
              </p>
              <p>
                <strong>CGPA:</strong> {selectedApplication.cgpa}
              </p>
              <p>
                <strong>Location:</strong> {selectedApplication.location}
              </p>
            </div>
            {selectedApplication.coverLetter && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-1">
                  Cover Letter:
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {selectedApplication.coverLetter}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ApplyNow = ({ currentUser, onSubmitApplication, onCloseForm }) => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const isProfileComplete = () => {
      const requiredFields = ["name", "email", "university", "branch", "year"];
      return requiredFields.every((field) => currentUser[field]?.trim());
    };

    if (!isProfileComplete()) {
      setToast({
        message: "Please complete your profile before applying.",
        type: "error",
      });

      setTimeout(() => {
        navigate("/student/profile");
      }, 2000);
    }
  }, [currentUser, navigate]);

  const handleSubmit = (applicationData) => {
    const newApplication = {
      id: Date.now(),
      ...applicationData,
      status: "pending",
      dateApplied: new Date().toLocaleDateString(),
      studentName: currentUser?.name || "",
      email: currentUser?.email || "",
      branch: currentUser?.branch || "",
      university: currentUser?.university || "",
      year: currentUser?.year || "",
      cgpa: currentUser?.cgpa || "",
      phone: currentUser?.phone || "",
      location: currentUser?.location || "",
    };

    if (onSubmitApplication) {
      onSubmitApplication(newApplication);
    }

    // Show success toast
    setToast({
      message: "Application submitted successfully!",
      type: "success",
    });

    // Navigate to applications page after successful submission
    setTimeout(() => {
      navigate("/student/applications");
    }, 2000);
  };

  const isProfileComplete = ["name", "email", "university", "branch", "year"].every(
    (field) => currentUser[field]?.trim()
  );

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isProfileComplete && (
        <>
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
              currentUser={currentUser}
            />
          </div>
        </>
      )}
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

const StudentProfile = ({ currentUser, setCurrentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...currentUser });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Update form data when currentUser changes
  useEffect(() => {
    setFormData({ ...currentUser });
  }, [currentUser]);

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Validate required fields
      const requiredFields = ['name', 'email', 'university', 'branch', 'year'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        setToast({
          message: `Please fill in required fields: ${missingFields.join(', ')}`,
          type: 'error'
        });
        setIsLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setToast({
          message: 'Please enter a valid email address',
          type: 'error'
        });
        setIsLoading(false);
        return;
      }

      // Validate CGPA if provided
      if (formData.cgpa && (parseFloat(formData.cgpa) < 0 || parseFloat(formData.cgpa) > 10)) {
        setToast({
          message: 'CGPA must be between 0 and 10',
          type: 'error'
        });
        setIsLoading(false);
        return;
      }

      // Prepare update data (remove undefined/null values)
      const updateData = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          updateData[key] = formData[key];
        }
      });

      // Set profileCompleted to true if all required fields are filled
      updateData.profileCompleted = requiredFields.every(field => updateData[field]?.trim());

      // Make API call to update profile
      const response = await axios.put('/users/update-profile', updateData);
      
      if (response.data.success) {
        // Update current user state
        const updatedUser = response.data.user;
        setCurrentUser(updatedUser);
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        setToast({
          message: 'Profile updated successfully!',
          type: 'success'
        });
        
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setToast({
        message: error.response?.data?.message || 'Failed to update profile. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...currentUser });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    );
  };

  const fieldConfig = [
    {
      label: "Full Name",
      key: "name",
      placeholder: "e.g. Shreya Gupta",
      icon: User,
      required: true,
    },
    {
      label: "Email",
      key: "email",
      placeholder: "e.g. shreya@example.com",
      icon: Mail,
      type: "email",
      required: true,
    },
    {
      label: "Phone",
      key: "phone",
      placeholder: "e.g. 9876543210",
      icon: Phone,
      type: "tel",
    },
    {
      label: "University",
      key: "university",
      placeholder: "e.g. IGDTUW",
      icon: Building,
      required: true,
    },
    {
      label: "Branch",
      key: "branch",
      placeholder: "e.g. Computer Science",
      icon: GraduationCap,
      required: true,
    },
    {
      label: "Year",
      key: "year",
      type: "select",
      icon: Calendar,
      options: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"],
      required: true,
    },
    {
      label: "CGPA",
      key: "cgpa",
      placeholder: "e.g. 9.1",
      icon: Award,
      type: "number",
      step: "0.1",
      min: "0",
      max: "10",
    },
    {
      label: "Location",
      key: "location",
      placeholder: "e.g. New Delhi",
      icon: MapPin,
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 overflow-y-auto">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

            <div className="relative flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {getInitials(formData.name)}
                  </span>
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Camera size={16} className="text-gray-600" />
                  </button>
                )}
              </div>

              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-white/90 text-lg mb-1">
                  {formData.branch || "Your Branch"} Student
                </p>
                <p className="text-white/70 text-sm">
                  {formData.university || "Your University"}
                </p>
              </div>

              <div className="ml-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                      <span>{isLoading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10 text-white px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
                    >
                      <X size={18} />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fieldConfig.map(
                ({
                  label,
                  key,
                  placeholder,
                  icon: Icon,
                  type,
                  options,
                  required,
                  ...inputProps
                }) => (
                  <div key={key} className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <Icon size={16} className="text-gray-500" />
                      <span>{label}</span>
                      {required && <span className="text-red-500">*</span>}
                    </label>

                    {isEditing ? (
                      <div className="relative">
                        {type === "select" ? (
                          <select
                            value={formData[key] || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [key]: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                          >
                            <option value="" disabled>
                              Select {label}
                            </option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={type || "text"}
                            value={formData[key] || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [key]: e.target.value,
                              })
                            }
                            placeholder={placeholder}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white hover:border-gray-300"
                            {...inputProps}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-xl p-4 border-2 border-transparent hover:border-gray-200 transition-all duration-200">
                        <p
                          className={`text-sm ${
                            formData[key]
                              ? "text-gray-900 font-medium"
                              : "text-gray-400 italic"
                          }`}
                        >
                          {formData[key] || placeholder}
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Keep your profile updated to get the best experience</p>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = ({ currentUser, setCurrentUser, onLogout }) => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${baseURL}/applications/student/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setApplications(data);
        saveApplicationsToStorage(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        // Fallback to localStorage if server fails
        setApplications(loadApplicationsFromStorage());
      }
    };
    fetchApplications();
  }, []);

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${baseURL}/applications/${appId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.error || "Unknown error"}`);
        return;
      }

      const updated = applications.filter((app) => app._id !== appId);
      setApplications(updated);
      saveApplicationsToStorage(updated);

      alert("Application deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div className="flex w-full min-h-screen overflow-hidden">
      <StudentSidebar currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 ml-64">
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
            element={
              <MyApplications
                applications={applications}
                onDeleteApplication={handleDeleteApplication}
              />
            }
          />
          <Route
            path="/apply"
            element={
              <ApplyNow
                currentUser={currentUser}
                onSubmitApplication={(newApp) => {
                  const updated = [newApp, ...applications];
                  setApplications(updated);
                  saveApplicationsToStorage(updated);
                }}
              />
            }
          />
          <Route
            path="/notifications"
            element={<StudentNotifications applications={applications} />}
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