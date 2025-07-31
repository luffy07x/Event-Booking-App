import React from 'react';
import { User } from 'lucide-react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Page Coming Soon
          </h3>
          <p className="text-gray-600">
            Manage your profile settings here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;