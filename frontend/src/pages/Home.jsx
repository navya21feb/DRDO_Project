import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import StudentDashboard from '../components/StudentdashBoard';
import AdminDashboard from '../components/AdminDashboard';
import Sidebar from '../components/Sidebar';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    if (currentUser) {
      setApplications([
        {
          id: 1,
          studentName: 'Alice Johnson',
          email: 'alice@example.com',
          position: 'Software Development Intern',
          status: 'pending',
          appliedDate: '2024-06-15',
          documents: ['resume.pdf']
        }
      ]);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginForm setCurrentUser={setCurrentUser} setUserRole={setUserRole} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <div className="ml-64 p-8 w-full">
        {currentUser.role === 'student' ? (
          <StudentDashboard applications={applications} setApplications={setApplications} />
        ) : (
          <AdminDashboard applications={applications} setApplications={setApplications} />
        )}
      </div>
    </div>
  );
};

export default Home;