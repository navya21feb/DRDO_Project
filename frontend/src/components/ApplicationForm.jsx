import React, { useState } from 'react';
import { Upload } from 'lucide-react';

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
        className="w-full border rounded px-3 py-2 mb-4"
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
        className="w-full border rounded px-3 py-2 mb-4"
        value={applicationData.coverLetter}
        onChange={e => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date *</label>
        <input 
          type="date" 
          className="w-full border rounded px-3 py-2 mb-4"
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
          className="px-4 py-2 mb-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button 
          onClick={handleSubmit} 
          className="px-4 py-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit Application
        </button>
      </div>
    </>
  );
};

export default ApplicationForm;