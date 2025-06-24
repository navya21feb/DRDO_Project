import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Overview from "./studentDashboard/Overview";
import Applications from "./studentDashboard/Applications";
import Profile from "./studentDashboard/Profile";
import Notifications from "./studentDashboard/Notifications";
import Settings from "./studentDashboard/Settings";
import AdminDashboard from "./adminDashboard";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/Signup";

const AppContent = ({
  currentUser,
  setCurrentUser,
  applications,
  setApplications,
  notifications,
  setNotifications,
  students,
  setStudents,
  universities,
  setUniversities,
}) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Function to handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken'); // Clear auth token if you have one
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* UPDATED: Simplified sidebar logic - only show sidebar for students now */}
      {/* Admin dashboard now has its own internal sidebar */}
      {currentUser && currentUser.role === "student" && (
        <Sidebar
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          notifications={notifications}
          onLogout={handleLogout}
        />
      )}

      <main className={`${currentUser && currentUser.role === "student" ? "ml-64" : ""} ${currentUser && currentUser.role === "admin" ? "" : "p-6"} flex-1`}>
        <Routes>
          {/* Default route - redirect based on user role */}
          <Route 
            path="/" 
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/overview" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Student Dashboard Routes */}
          <Route
            path="/overview"
            element={
              currentUser && currentUser.role === "student" ? (
                <Overview
                  currentUser={currentUser}
                  applications={applications}
                  notifications={notifications}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/applications"
            element={
              currentUser && currentUser.role === "student" ? (
                <Applications
                  applications={applications}
                  setApplications={setApplications}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/profile"
            element={
              currentUser && currentUser.role === "student" ? (
                <Profile
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/notifications"
            element={
              currentUser && currentUser.role === "student" ? (
                <Notifications
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/settings"
            element={
              currentUser && currentUser.role === "student" ? (
                <Settings
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* UPDATED: Single Admin Dashboard Route */}
          {/* All admin routes now handled by the AdminDashboard component internally */}
          <Route
            path="/admin/*"
            element={
              currentUser && currentUser.role === "admin" ? (
                <AdminDashboard
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  students={students}
                  setStudents={setStudents}
                  applications={applications}
                  setApplications={setApplications}
                  universities={universities}
                  setUniversities={setUniversities}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Authentication Routes */}
          <Route
            path="/login"
            element={
              currentUser ? (
                // If already logged in, redirect to appropriate dashboard
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/overview" replace />
                )
              ) : (
                <LoginForm setCurrentUser={setCurrentUser} />
              )
            }
          />

          <Route
            path="/signup"
            element={
              currentUser ? (
                // If already logged in, redirect to appropriate dashboard
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/overview" replace />
                )
              ) : (
                <SignupForm setCurrentUser={setCurrentUser} />
              )
            }
          />

          {/* 404 Route - redirect to login if not authenticated, otherwise to dashboard */}
          <Route
            path="*"
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/overview" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [applications, setApplications] = useState([
    // Sample application data
    {
      id: 1,
      studentId: 1,
      universityId: 1,
      program: "Computer Science",
      status: "pending",
      submittedAt: "2024-01-15",
      documents: ["transcript", "sop", "lor"]
    },
    {
      id: 2,
      studentId: 2,
      universityId: 2,
      program: "Business Administration",
      status: "accepted",
      submittedAt: "2024-01-10",
      documents: ["transcript", "sop"]
    }
  ]);

  const [notifications, setNotifications] = useState([
    // Sample notification data
    {
      id: 1,
      title: "Application Status Update",
      message: "Your application to MIT has been reviewed",
      type: "info",
      read: false,
      timestamp: "2024-01-20"
    }
  ]);

  const [students, setStudents] = useState([
    // Sample student data
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      country: "USA",
      gpa: 3.8,
      status: "active",
      joinedAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      country: "Canada",
      gpa: 3.9,
      status: "active",
      joinedAt: "2024-01-05"
    }
  ]);

  const [universities, setUniversities] = useState([
    // Sample university data
    {
      id: 1,
      name: "Massachusetts Institute of Technology",
      country: "USA",
      ranking: 1,
      programs: ["Computer Science", "Engineering", "Business"],
      applicationFee: 100,
      status: "active"
    },
    {
      id: 2,
      name: "Stanford University",
      country: "USA",
      ranking: 2,
      programs: ["Computer Science", "Business Administration", "Medicine"],
      applicationFee: 125,
      status: "active"
    }
  ]);

  // Enhanced setCurrentUser function that persists to localStorage
  const setCurrentUserWithPersistence = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Check for persisted login state on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check localStorage for saved user data
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // Validate the saved user data
          if (userData && userData.id && userData.role) {
            setCurrentUser(userData);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppContent
        currentUser={currentUser}
        setCurrentUser={setCurrentUserWithPersistence}
        applications={applications}
        setApplications={setApplications}
        notifications={notifications}
        setNotifications={setNotifications}
        students={students}
        setStudents={setStudents}
        universities={universities}
        setUniversities={setUniversities}
      />
    </Router>
  );
};

export default App;