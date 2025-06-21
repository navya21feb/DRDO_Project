import React from 'react';
import { FileText, Award, Clock, BookOpen } from 'lucide-react';

const Overview = ({ currentUser }) => {
  const applications = [
    {
      id: 1,
      title: 'AI/ML Research Internship',
      department: 'Electronics & Computer Sciences',
      location: 'DRDO Bangalore',
      status: 'Under Review',
      appliedDate: '2025-06-15',
      duration: '3 months',
    },
    {
      id: 2,
      title: 'Cybersecurity Analysis',
      department: 'Centre for Artificial Intelligence & Robotics',
      location: 'DRDO Bangalore',
      status: 'Shortlisted',
      appliedDate: '2025-06-10',
      duration: '6 months',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Selected': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow">
        <h2 className="text-2xl font-bold mb-1">Welcome back, {currentUser?.name || 'Student'}!</h2>
        <p className="text-sm opacity-90">Track your internship applications and explore new opportunities at DRDO</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Applications',
            value: applications.length,
            icon: <FileText className="h-8 w-8 text-blue-600" />,
            color: 'text-blue-600',
          },
          {
            label: 'Shortlisted',
            value: applications.filter(app => app.status === 'Shortlisted').length,
            icon: <Award className="h-8 w-8 text-green-600" />,
            color: 'text-green-600',
          },
          {
            label: 'Under Review',
            value: applications.filter(app => app.status === 'Under Review').length,
            icon: <Clock className="h-8 w-8 text-yellow-600" />,
            color: 'text-yellow-600',
          },
          {
            label: 'CGPA',
            value: '8.7',
            icon: <BookOpen className="h-8 w-8 text-purple-600" />,
            color: 'text-purple-600',
          },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{label}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Applications</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {applications.slice(0, 3).map(app => (
            <div key={app.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <div>
                <h4 className="font-medium text-gray-800">{app.title}</h4>
                <p className="text-sm text-gray-600">{app.department}</p>
                <p className="text-xs text-gray-500">Applied: {app.appliedDate}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Browse Opportunities',
              desc: 'Find new internships',
              icon: <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />,
              color: 'text-blue-600',
              border: 'border-blue-300 hover:border-blue-500 hover:bg-blue-50',
            },
            {
              title: 'Update Profile',
              desc: 'Keep your info current',
              icon: <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />,
              color: 'text-green-600',
              border: 'border-green-300 hover:border-green-500 hover:bg-green-50',
            },
            {
              title: 'Schedule Interview',
              desc: 'Manage your interviews',
              icon: <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />,
              color: 'text-purple-600',
              border: 'border-purple-300 hover:border-purple-500 hover:bg-purple-50',
            },
          ].map(({ title, desc, icon, color, border }) => (
            <button
              key={title}
              className={`flex items-center justify-center p-4 border-2 border-dashed rounded-xl transition-colors ${border}`}
            >
              <div className="text-center">
                {icon}
                <p className={`font-medium ${color}`}>{title}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
