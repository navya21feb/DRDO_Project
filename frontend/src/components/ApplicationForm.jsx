import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const ApplicationForm = ({ setShowApplicationForm, onSubmit }) => {
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
    onSubmit(applicationData);
    setShowApplicationForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold">Apply for Internship</h2>

        <select value={applicationData.position} onChange={e => setApplicationData({ ...applicationData, position: e.target.value })}
          className="w-full border rounded px-3 py-2">
          <option value="">Select Position</option>
          <option value="Software Development Intern">Software Development Intern</option>
          <option value="Research Intern">Research Intern</option>
          <option value="Data Science Intern">Data Science Intern</option>
        </select>

        <textarea rows="3" placeholder="Cover Letter"
          className="w-full border rounded px-3 py-2"
          value={applicationData.coverLetter}
          onChange={e => setApplicationData({ ...applicationData, coverLetter: e.target.value })} />

        <input type="date" className="w-full border rounded px-3 py-2"
          value={applicationData.expectedStartDate}
          onChange={e => setApplicationData({ ...applicationData, expectedStartDate: e.target.value })} />

        <div className="border border-dashed p-4 text-center rounded">
          <Upload className="mx-auto text-gray-500" />
          <p className="text-sm">Upload documents (PDF)</p>
          <input type="file" multiple accept=".pdf" onChange={handleFileChange} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={() => setShowApplicationForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;