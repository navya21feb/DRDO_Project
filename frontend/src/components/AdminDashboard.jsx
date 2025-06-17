import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = ({ applications, setApplications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplications, setSelectedApplications] = useState([]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleBulkAction = (action) => {
    const updated = applications.map(app =>
      selectedApplications.includes(app.id) ? { ...app, status: action } : app
    );
    setApplications(updated);
    setSelectedApplications([]);
  };

  const handleStatusUpdate = (id, status) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, status } : app
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-600 mb-2">Total Applications</h3>
          <p className="text-2xl font-bold text-blue-600">{applications.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-600 mb-2">Pending Review</h3>
          <p className="text-2xl font-bold text-yellow-600">{applications.filter(app => app.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-600 mb-2">Approved</h3>
          <p className="text-2xl font-bold text-green-600">{applications.filter(app => app.status === 'approved').length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold text-gray-600 mb-2">Rejected</h3>
          <p className="text-2xl font-bold text-red-600">{applications.filter(app => app.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold">Applications Management</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-md" value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {selectedApplications.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between">
              <span>{selectedApplications.length} applications selected</span>
              <div className="flex gap-2">
                <button onClick={() => handleBulkAction('approved')} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Approve</button>
                <button onClick={() => handleBulkAction('rejected')} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Reject</button>
              </div>
            </div>
          )}

          <table className="w-full">
            <thead><tr><th></th><th>Student</th><th>Position</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredApplications.map(app => (
                <tr key={app.id}>
                  <td><input type="checkbox" checked={selectedApplications.includes(app.id)}
                    onChange={(e) => {
                      setSelectedApplications(e.target.checked ? [...selectedApplications, app.id] :
                        selectedApplications.filter(id => id !== app.id));
                    }} /></td>
                  <td>{app.studentName}<div className="text-sm text-gray-500">{app.email}</div></td>
                  <td>{app.position}</td>
                  <td>{app.appliedDate}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>{app.status}</span>
                  </td>
                  <td className="flex gap-2">
                    <button><Eye className="h-4 w-4 text-gray-500" /></button>
                    <button onClick={() => handleStatusUpdate(app.id, 'approved')}><CheckCircle className="h-4 w-4 text-green-600" /></button>
                    <button onClick={() => handleStatusUpdate(app.id, 'rejected')}><XCircle className="h-4 w-4 text-red-600" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;