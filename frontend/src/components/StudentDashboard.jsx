import React, { useState } from 'react';
import { FileText, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import ApplicationForm from './ApplicationForm';

const StudentDashboard = ({ applications, setApplications }) => {
  const [showForm, setShowForm] = useState(false);

  const handleNewApplication = (formData) => {
    const newApp = {
      id: applications.length + 1,
      studentName: 'You',
      email: 'you@example.com',
      position: formData.position,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      documents: formData.documents.map(f => f.name)
    };
    setApplications([newApp, ...applications]);
  };

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Student Dashboard</h2>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FileText className="w-4 h-4" /> New Application
        </button>
      </div>

      {/* Dashboard summary */}
      {/* Applications List */}
      {/* ... */}
      {showForm && (
        <ApplicationForm
          setShowApplicationForm={setShowForm}
          onSubmit={handleNewApplication}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
