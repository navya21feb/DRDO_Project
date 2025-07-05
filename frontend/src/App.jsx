import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "../src/contexts/userContext";
import AdminDashboard from "./adminDashboard";
import axios from "./api/axiosConfig";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/Signup";
import StudentDashboard from "./studentDashboard";

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
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    // Clear axios authorization header
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <div className="flex bg-gray-50">
            <main
  className={`flex-1`}
>
<div className="flex w-full min-h-screen">
        <Routes>
          {/* Default route - redirect based on user role */}
          <Route
            path="/"
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* ✅ NEW: Single Student Dashboard Route */}
          <Route
            path="/student/*"
            element={
              currentUser && currentUser.role === "student" ? (
                <StudentDashboard
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  applications={applications}                  // ✅ NEW
                  setApplications={setApplications}            // ✅ NEW
                  onLogout={handleLogout}
                />

              ) : (
                <Navigate to="/login" replace />
              )
            }
          />


          {/* Admin Dashboard Route */}
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
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student" replace /> // ✅ CHANGED
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
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student" replace /> // ✅ CHANGED
                )
              ) : (
                <SignupForm setCurrentUser={setCurrentUser} />
              )
            }
          />

          {/* 404 Catch-All */}
          <Route
            path="*"
            element={
              currentUser ? (
                currentUser.role === "admin" ? (
                  <Navigate to="/admin" replace />
                ) : (
                  <Navigate to="/student" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [applications, setApplications] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const [students, setStudents] = useState([]);

  const [universities, setUniversities] = useState([]);

  // Enhanced setCurrentUser function that persists to localStorage
  const setCurrentUserWithPersistence = (userData) => {
    setCurrentUser(userData);
    if (userData) {
      localStorage.setItem("currentUser", JSON.stringify(userData));
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      // Clear axios authorization header
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Check for persisted login state on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check localStorage for saved user data and token
        const savedUser = localStorage.getItem("currentUser");
        const savedToken = localStorage.getItem("authToken");

        if (savedUser && savedToken) {
          const userData = JSON.parse(savedUser);

          // Validate the saved user data
          if (userData && userData.id && userData.role) {
            // Set the authorization header for axios
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${savedToken}`;

            // Verify token with backend
            try {
              const response = await axios.get("/auth/verify");
              if (response.data.valid) {
                // Update user data in case it changed on the server
                const updatedUser = response.data.user;
                setCurrentUser(updatedUser);
                localStorage.setItem(
                  "currentUser",
                  JSON.stringify(updatedUser)
                );
              }
            } catch (error) {
              console.error("Token verification failed:", error);
              // Token is invalid, clear everything
              localStorage.removeItem("currentUser");
              localStorage.removeItem("authToken");
              delete axios.defaults.headers.common["Authorization"];
            }
          } else {
            // Invalid user data, clear it
            localStorage.removeItem("currentUser");
            localStorage.removeItem("authToken");
          }
        }
      } catch (error) {
        console.error("Error loading saved user:", error);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("authToken");
        delete axios.defaults.headers.common["Authorization"];
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
    <UserProvider>
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
    </UserProvider>
  );
};

export default App;