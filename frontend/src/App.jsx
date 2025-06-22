import React, { useState } from "react";
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
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/Signup";

const AppContent = ({
  currentUser,
  setCurrentUser,
  applications,
  setApplications,
  notifications,
  setNotifications,
}) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Show Sidebar only if user is logged in */}
      {currentUser && (
        <Sidebar
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          notifications={notifications}
        />
      )}

      <main className={`${currentUser ? "ml-64" : ""} flex-1 p-6`}>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />

          <Route
            path="/overview"
            element={
              currentUser ? (
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
              currentUser ? (
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
              currentUser ? (
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
              currentUser ? (
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
            path="/login"
            element={<LoginForm setCurrentUser={setCurrentUser} />}
          />

          <Route
            path="/signup"
            element={<SignupForm setCurrentUser={setCurrentUser} />}
          />

          <Route
            path="/settings"
            element={
              currentUser ? (
                <Settings
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
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

  const [applications, setApplications] = useState([
    // your application data...
  ]);

  const [notifications, setNotifications] = useState([
    // your notifications data...
  ]);

  return (
    <Router>
      <AppContent
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        applications={applications}
        setApplications={setApplications}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </Router>
  );
};

export default App;
