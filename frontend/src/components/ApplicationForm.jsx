import React, { useState } from 'react';
import { Upload, User, Building, Calendar, FileText, X, CheckCircle, Shield, Globe } from 'lucide-react';
import axios from '../api/axiosConfig';

const baseURL = import.meta.env.VITE_BACKEND_URL;

const ApplicationForm = ({ onSubmit, onClose, currentUser }) => {
  const [applicationData, setApplicationData] = useState({
    laboratory: '',
    position: '',
    researchArea: '',
    coverLetter: '',
    expectedStartDate: '',
    duration: '',
    resume: null,
  });

  // DRDO Labs data based on search results
  const drdoLabs = [
    {
      code: 'SSPL',
      name: 'Solid State Physics Laboratory',
      location: 'Delhi',
      area: 'Materials & Electronics',
    },
    {
      code: 'DESIDOC',
      name: 'Defence Scientific Information & Documentation Centre',
      location: 'Delhi',
      area: 'Scientific Documentation & Library Sciences',
    },
    {
      code: 'DIPR',
      name: 'Defence Institute of Psychological Research',
      location: 'Delhi',
      area: 'Psychological Research & Human Behaviour',
    },
    {
      code: 'INMAS',
      name: 'Institute of Nuclear Medicine & Allied Sciences',
      location: 'Delhi',
      area: 'Biomedical & Nuclear Medicine',
    },
    {
      code: 'SAG',
      name: 'Scientific Analysis Group',
      location: 'Delhi',
      area: 'Cybersecurity & Cryptology',
    },
    {
      code: 'ITRDC',
      name: 'Institute for Technology Research and Development Cell',
      location: 'Delhi',
      area: 'Technology Innovation & R&D Support',
    },
  ];

  const positions = [
    'Project Training Intern',
    'Summer Research Intern',
    'Junior Research Fellow (JRF)',
    'Project Assistant',
    'Research Associate',
    'Technical Associate',
  ];

  const researchAreas = [
    'Aeronautics & Aerospace',
    'Armaments & Ballistics',
    'Combat Vehicles',
    'Electronics & Communication',
    'Computer Science & AI',
    'Cybersecurity',
    'Missile Systems',
    'Materials Science',
    'Chemical Defence',
    'Life Sciences',
    'Naval Systems',
    'Radar & Sonar',
    'Simulation & Modelling',
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationData({
        ...applicationData,
        resume: e.target.files[0],
      });
    }
  };

  const handleSubmit = async () => {
    const { laboratory, position, researchArea, coverLetter, expectedStartDate, duration, resume } = applicationData;

    // Validation
    if (!laboratory || !position || !researchArea || !coverLetter || !expectedStartDate || !duration) {
      alert('Please fill in all required fields');
      return;
    }

    if (!resume) {
      alert('Please upload your resume');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    
    // Add form fields
    formData.append('laboratory', laboratory);
    formData.append('position', position);
    formData.append('researchArea', researchArea);
    formData.append('coverLetter', coverLetter);
    formData.append('expectedStartDate', expectedStartDate);
    formData.append('duration', duration);
    
    // Add resume file
    formData.append('resume', resume);

    try {
      const token = localStorage.getItem('authToken');
      
      // Submit application to backend
      await axios.post(`${baseURL}/applications`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('DRDO Application submitted successfully!');
      
      // Fetch updated applications list
      const response = await axios.get(`${baseURL}/applications/student/mine`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Call parent onSubmit with updated data
      onSubmit(response.data);
      
      // Reset form
      setApplicationData({
        laboratory: '',
        position: '',
        researchArea: '',
        coverLetter: '',
        expectedStartDate: '',
        duration: '',
        resume: null,
      });
      
      // Close modal
      if (onClose) onClose();

    } catch (error) {
      console.error('DRDO Application submission error:', error);
      alert('Application submission failed. Please try again or contact support.');
    }
  };

  const removeFile = () => {
    setApplicationData({ ...applicationData, resume: null });
  };

  const selectedLab = drdoLabs.find(lab => lab.code === applicationData.laboratory);

  return (
    <div className="mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* DRDO Header */}
      <div className="bg-gradient-to-r from-blue-600 via-white to-blue-600 px-8 py-6 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-violet-600/90"></div>
        <div className="relative z-10">
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Shield className="text-white" size={32} />
              <Globe className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">DRDO Internship Application</h1>
              <p className="text-orange-100">Defence Research and Development Organisation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Application Form */}
        <div className="space-y-6">
          {/* Laboratory Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Building className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                DRDO Laboratory/Establishment <span className="text-red-500">*</span>
              </label>
            </div>
            <select
              value={applicationData.laboratory}
              onChange={(e) =>
                setApplicationData({ ...applicationData, laboratory: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors bg-white"
              required
            >
              <option value="">Select DRDO Laboratory</option>
              {drdoLabs.map((lab) => (
                <option key={lab.code} value={lab.code}>
                  {lab.name} ({lab.code}) - {lab.location}
                </option>
              ))}
            </select>
            {selectedLab && (
              <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Research Area:</strong> {selectedLab.area} | <strong>Location:</strong> {selectedLab.location}
                </p>
              </div>
            )}
          </div>

          {/* Position Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                Position Type <span className="text-red-500">*</span>
              </label>
            </div>
            <select
              value={applicationData.position}
              onChange={(e) =>
                setApplicationData({ ...applicationData, position: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors bg-white"
              required
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          {/* Research Area */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                Research Area of Interest <span className="text-red-500">*</span>
              </label>
            </div>
            <select
              value={applicationData.researchArea}
              onChange={(e) =>
                setApplicationData({ ...applicationData, researchArea: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors bg-white"
              required
            >
              <option value="">Select Research Area</option>
              {researchAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                Duration <span className="text-red-500">*</span>
              </label>
            </div>
            <select
              value={applicationData.duration}
              onChange={(e) =>
                setApplicationData({ ...applicationData, duration: e.target.value })
              }
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors bg-white"
              required
            >
              <option value="">Select Duration</option>
              <option value="2-4 weeks">2-4 weeks (Summer Training)</option>
              <option value="6-8 weeks">6-8 weeks (Industrial Training)</option>
              <option value="3-6 months">3-6 months (Project Internship)</option>
              <option value="6-12 months">6-12 months (Research Fellowship)</option>
            </select>
          </div>

          {/* Expected Start Date */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                Expected Start Date <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="date"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors"
              value={applicationData.expectedStartDate}
              onChange={(e) =>
                setApplicationData({ ...applicationData, expectedStartDate: e.target.value })
              }
              required
            />
          </div>

          {/* Statement of Purpose */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                Statement of Purpose <span className="text-red-500">*</span>
              </label>
            </div>
            <textarea
              rows="6"
              placeholder="Explain your interest in defence research, relevant academic background, and how this internship aligns with your career goals. Mention any specific projects or technologies you're interested in..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:outline-none transition-colors resize-none"
              value={applicationData.coverLetter}
              onChange={(e) =>
                setApplicationData({ ...applicationData, coverLetter: e.target.value })
              }
              required
            />
            <p className="text-xs text-gray-500">
              {applicationData.coverLetter.length}/1000 characters
            </p>
          </div>

          {/* Resume Upload */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="text-orange-600" size={18} />
              <label className="text-sm font-semibold text-gray-700">
                Resume <span className="text-red-500">*</span>
              </label>
            </div>
            
            <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors bg-orange-50/50 relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-3 pointer-events-none">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
                  <Upload className="text-orange-600" size={24} />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Click to upload your resume
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, DOCX files only, max 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {applicationData.resume && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  Uploaded Resume
                </h4>
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="text-green-600" size={16} />
                    <span className="text-sm font-medium text-green-800">
                      {applicationData.resume.name}
                    </span>
                    <span className="text-xs text-green-600">
                      {(applicationData.resume.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-1 hover:bg-green-100 rounded-full transition-colors"
                  >
                    <X className="text-green-600" size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Declaration */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• All information provided must be accurate and verifiable</li>
              <li>• Security clearance may be required for certain projects</li>
              <li>• Accommodation arrangements to be made by the applicant</li>
              <li>• No stipend is provided for project training internships</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-green-600 text-white rounded-xl hover:from-orange-700 hover:to-green-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;