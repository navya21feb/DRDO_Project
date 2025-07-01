import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Search, Eye, FileText, Award, Upload } from 'lucide-react';

const Applications = ({ applications, setApplications }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Selected': return 'bg-blue-100 text-blue-800';
      case 'Applied': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (app.department?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (app.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    'Applied': applications.filter(app => app.status === 'Applied').length,
    'Under Review': applications.filter(app => app.status === 'Under Review').length,
    'Shortlisted': applications.filter(app => app.status === 'Shortlisted').length,
    'Selected': applications.filter(app => app.status === 'Selected').length,
    'Rejected': applications.filter(app => app.status === 'Rejected').length,
  };

  const handleApplicationSubmit = (applicationData) => {
    const newApplication = {
      id: applications.length + 1,
      title: applicationData.position,
      department: 'DRDO',
      location: 'Delhi, India',
      duration: '6 months',
      status: 'Applied',
      appliedDate: new Date().toISOString().split('T')[0],
      stipend: '₹25,000/month',
      description: `Internship opportunity in ${applicationData.position} at Defence Research and Development Organisation`,
      requirements: applicationData.position === 'Software Development Intern (SDI)' 
        ? ['Python', 'Java', 'Data Structures', 'Algorithms']
        : applicationData.position === 'Cybersecurity Intern'
        ? ['Network Security', 'Ethical Hacking', 'Cryptography', 'Risk Assessment']
        : ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'Data Analysis']
    };
    setApplications([...applications, newApplication]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Applications</h2>
          <p className="text-gray-600">Track and manage your internship applications</p>
        </div>
        <button 
          onClick={() => setShowApplicationForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Apply for DRDO Internship
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-3 rounded-xl border border-gray-200 text-center transition-all duration-200 ${
              statusFilter === status 
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-sm text-gray-600 capitalize">{status}</p>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search applications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid gap-4">
        {filteredApplications.map(app => {
          const safeRequirements = Array.isArray(app.requirements) ? app.requirements : [];

          return (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{app.title}</h3>
                  <p className="text-gray-600 mb-2">{app.department}</p>
                  <p className="text-sm text-gray-500 mb-3">{app.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {app.location}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {app.duration}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Applied: {app.appliedDate}
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  {app.stipend}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-1">
                  {safeRequirements.slice(0, 3).map(req => (
                    <span key={req} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {req}
                    </span>
                  ))}
                  {safeRequirements.length > 3 && (
                    <span className="text-gray-500 text-xs">+{safeRequirements.length - 3} more</span>
                  )}
                </div>
                <button 
                  onClick={() => setSelectedApplication(app)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedApplication.title}</h2>
                  <p className="text-gray-600">{selectedApplication.department}</p>
                </div>
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p>{selectedApplication.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Location</h3>
                    <p>{selectedApplication.location}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Duration</h3>
                    <p>{selectedApplication.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Stipend</h3>
                    <p>{selectedApplication.stipend}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedApplication.requirements || []).map(req => (
                      <span key={req} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Download Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold">Apply for DRDO Internship</h2>

            <ApplicationForm 
              onSubmit={handleApplicationSubmit}
              onClose={() => setShowApplicationForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Application Form Component
const ApplicationForm = ({ onSubmit, onClose }) => {
  const [applicationData, setApplicationData] = useState({
    position: '',
    coverLetter: '',
    expectedStartDate: '',
    documents: []
  });

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      documents: Array.from(e.target.files)
    });
  };

  const handleSubmit = () => {
    if (!applicationData.position || !applicationData.coverLetter || !applicationData.expectedStartDate) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(applicationData);
    onClose();
  };

  return (
    <>
      <select 
        value={applicationData.position} 
        onChange={e => setApplicationData({ ...applicationData, position: e.target.value })}
        className="w-full border rounded px-3 py-2"
        required
      >
        <option value="">Select Position *</option>
        <option value="Software Development Intern (SDI)">Software Development Intern (SDI)</option>
        <option value="Cybersecurity Intern">Cybersecurity Intern</option>
        <option value="AI/ML Intern">AI/ML Intern</option>
      </select>

      <textarea 
        rows="4" 
        placeholder="Cover Letter - Tell us why you're interested in this position and what makes you a good fit *"
        className="w-full border rounded px-3 py-2"
        value={applicationData.coverLetter}
        onChange={e => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date *</label>
        <input 
          type="date" 
          className="w-full border rounded px-3 py-2"
          value={applicationData.expectedStartDate}
          onChange={e => setApplicationData({ ...applicationData, expectedStartDate: e.target.value })}
          required
        />
      </div>

      <div className="border border-dashed border-gray-300 p-4 text-center rounded">
        <Upload className="mx-auto text-gray-500 mb-2" size={24} />
        <p className="text-sm text-gray-600 mb-2">Upload documents (Resume, Cover Letter, Certificates)</p>
        <p className="text-xs text-gray-500 mb-2">PDF files only, max 5MB each</p>
        <input 
          type="file" 
          multiple 
          accept=".pdf" 
          onChange={handleFileChange}
          className="w-full"
        />
        {applicationData.documents.length > 0 && (
          <p className="text-sm text-green-600 mt-2">
            {applicationData.documents.length} file(s) selected
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </div>
    </>
  );
};

export default Applications;