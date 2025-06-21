import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Calendar, Edit2, Save, X, Upload, Award, BookOpen
} from 'lucide-react';

const Profile = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Rahul Sharma',
    email: currentUser?.email || 'rahul.sharma@email.com',
    phone: '+91 9876543210',
    dateOfBirth: '1999-05-15',
    address: 'New Delhi, India',
    college: 'Indian Institute of Technology, Delhi',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    cgpa: '8.7',
    rollNumber: '2022CSE087',
    skills: ['Python', 'Machine Learning', 'React', 'Data Analysis', 'Cybersecurity', 'Java', 'SQL'],
    languages: ['English', 'Hindi', 'Tamil'],
    interests: ['Artificial Intelligence', 'Quantum Computing', 'Cybersecurity', 'Space Technology'],
    bio: 'Passionate computer science student with a strong interest in AI/ML and cybersecurity. Eager to contribute to India\'s defense research and development through innovative technology solutions.',
    achievements: [
      'Winner - National Cybersecurity Challenge 2024',
      'Published research paper on ML in cybersecurity',
      'Google Summer of Code 2024 participant',
      'Dean\'s List for 4 consecutive semesters'
    ],
    projects: [
      {
        name: 'AI-Powered Intrusion Detection System',
        description: 'Developed a machine learning model to detect network intrusions with 96% accuracy',
        technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'Network Security']
      },
      {
        name: 'Quantum Cryptography Simulator',
        description: 'Built a quantum key distribution simulator for secure communications',
        technologies: ['Python', 'Qiskit', 'Quantum Computing', 'Cryptography']
      }
    ]
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = (newSkill) => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const renderEditableField = (label, field, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={profileData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <input
            type={type}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={profileData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
          />
        )
      ) : (
        <p className="text-gray-600 py-2">{profileData[field] || 'Not provided'}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {profileData.name.split(' ').map(n => n[0]).join('')}
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700">
                <Upload className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold">{profileData.name}</h3>
          <p className="text-gray-600">{profileData.branch}</p>
          <p className="text-sm text-gray-500">{profileData.college}</p>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-center items-center gap-2">
              <Mail className="h-4 w-4" /> {profileData.email}
            </div>
            <div className="flex justify-center items-center gap-2">
              <Phone className="h-4 w-4" /> {profileData.phone}
            </div>
            <div className="flex justify-center items-center gap-2">
              <MapPin className="h-4 w-4" /> {profileData.address}
            </div>
          </div>
        </div>

        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField('Full Name', 'name')}
              {renderEditableField('Email', 'email', 'email')}
              {renderEditableField('Phone', 'phone')}
              {renderEditableField('Date of Birth', 'dateOfBirth', 'date')}
              {renderEditableField('Address', 'address')}
              <div className="md:col-span-2">
                {renderEditableField('Bio', 'bio', 'textarea', 'Tell us about yourself')}
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField('College', 'college')}
              {renderEditableField('Branch', 'branch')}
              {renderEditableField('Year', 'year')}
              {renderEditableField('Roll Number', 'rollNumber')}
              {renderEditableField('CGPA', 'cgpa')}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.skills.map(skill => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleSkillRemove(skill)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <input
                type="text"
                placeholder="Add a skill and press Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSkillAdd(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
            )}
          </div>

          {/* Projects */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects</h3>
            <div className="space-y-4">
              {profileData.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{project.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map(tech => (
                      <span key={tech} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
            <div className="space-y-3">
              {profileData.achievements.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-yellow-500 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
