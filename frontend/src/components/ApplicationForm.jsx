import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from '../api/axiosConfig';
const baseURL = import.meta.env.VITE_BACKEND_URL;

import { Upload, User, Building, Calendar, FileText, X, CheckCircle, Shield, Globe } from 'lucide-react';

const DRDOApplicationForm = ({ onSubmit, onClose, currentUser }) => {
  const [applicationData, setApplicationData] = useState({
  position: '',
  coverLetter: '',
  expectedStartDate: '',
  resume: null  // ✅ Only resume
});

const handleFileChange = (e) => {
  setApplicationData({
    ...applicationData,
    resume: e.target.files[0]  // ✅ Single file only
  });
};

const handleSubmit = async () => {
  const { position, coverLetter, expectedStartDate, resume } = applicationData;

  if (!position || !coverLetter || !expectedStartDate || !resume) {
    alert('Please fill in all required fields and upload a resume.');
    return;
  }

  const formData = new FormData();
  formData.append('position', position);
  formData.append('coverLetter', coverLetter);
  formData.append('expectedStartDate', expectedStartDate);
  formData.append('resume', resume); // ✅ Upload resume

  try {
    const token = localStorage.getItem('authToken');
    await axios.post(`${baseURL}/applications`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    alert('Application submitted successfully!');
    const response = await axios.get(`${baseURL}/applications/student/mine`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    onSubmit(response.data);
    setApplicationData({
      position: '',
      coverLetter: '',
      expectedStartDate: '',
      resume: null
    });
    if (onClose) onClose();

  } catch (error) {
    console.error('Submission error:', error);
    alert('You will be informed about the status of your application.');
  }
};


 
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

      <div className="border border-dashed border-gray-300 p-4 text-center rounded">
        <Upload className="mx-auto text-gray-500 mb-2" size={24} />
        <p className="text-sm text-gray-600 mb-2">Upload documents (Resume, Cover Letter, Certificates)</p>
        <p className="text-xs text-gray-500 mb-2">PDF files only, max 5MB each</p>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange}
          className="w-full"
        />
        {applicationData.resume && (
          <p className="text-sm text-green-600 mt-2">
            {applicationData.resume.name} selected
          </p>
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

export default DRDOApplicationForm;