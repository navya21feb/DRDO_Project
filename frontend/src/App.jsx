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

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [students, setStudents] = useState([]);
  const [universities, setUniversities] = useState([]);

  // ✅ Safe JSON parse helper
  const safeParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return {};
    }
  };

  // ✅ Enhanced setter with debug logs
const setCurrentUserWithPersistence = (userData) => {
  setCurrentUser(userData);

  if (userData) {
    localStorage.setItem("currentUser", JSON.stringify(userData));
  } else {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common["Authorization"];
  }
};


  useEffect(() => {
  const checkAuthStatus = async () => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      const savedToken = localStorage.getItem("authToken");

      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);

        if (userData?.id && userData?.role) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

          try {
            const response = await axios.get("/auth/verify");

            if (response.data.valid) {
              const updatedUser = response.data.user;
              const mergedUser = { ...userData, ...updatedUser };
              setCurrentUser(mergedUser);
              localStorage.setItem("currentUser", JSON.stringify(mergedUser));
            }
          } catch {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("authToken");
            delete axios.defaults.headers.common["Authorization"];
          }
        }
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false);
    }
  };

  checkAuthStatus();
}, []);

useEffect(() => {
  // Update happens silently
}, [currentUser]);


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

  // ✅ Moved AppContent INSIDE App component
  const AppContent = () => {
    const location = useLocation();

    const handleLogout = () => {
      setCurrentUserWithPersistence(null);
    };

    return (
      <div className="flex bg-gray-50">
        <main className="flex-1">
          <div className="flex w-full min-h-screen">
            <Routes>
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
              <Route
                path="/student/*"
                element={
                  currentUser && currentUser.role === "student" ? (
                    <StudentDashboard
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUserWithPersistence}
                      onLogout={handleLogout}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/admin/*"
                element={
                  currentUser && currentUser.role === "admin" ? (
                    <AdminDashboard
                      currentUser={currentUser}
                      setCurrentUser={setCurrentUserWithPersistence}
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
              <Route
                path="/login"
                element={
                  currentUser ? (
                    currentUser.role === "admin" ? (
                      <Navigate to="/admin" replace />
                    ) : (
                      <Navigate to="/student" replace />
                    )
                  ) : (
                    <LoginForm setCurrentUser={setCurrentUserWithPersistence} />
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
                      <Navigate to="/student" replace />
                    )
                  ) : (
                    <SignupForm setCurrentUser={setCurrentUserWithPersistence} />
                  )
                }
              />
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


  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
