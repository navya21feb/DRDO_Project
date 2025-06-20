// Notifications.jsx
import React from 'react';
import { Bell, BellRing, CheckCircle } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, message: 'Your profile was viewed by DRDO Director', time: 'Just now', type: 'info' },
    { id: 2, message: 'Application for Cybersecurity Analysis was approved', time: '2 hours ago', type: 'success' },
    { id: 3, message: 'New internship opportunity: Quantum Systems', time: '1 day ago', type: 'update' }
  ];

  const typeStyle = (type) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          <p className="text-gray-600">Latest updates regarding your internships</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200">
          <CheckCircle className="h-4 w-4" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.map(notif => (
          <div key={notif.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex justify-between items-start">
            <div className="flex items-start gap-3">
              <BellRing className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-gray-800 font-medium">{notif.message}</p>
                <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyle(notif.type)}`}>
              {notif.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;