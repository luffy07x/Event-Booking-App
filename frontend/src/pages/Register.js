import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EventHub</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            Join EventHub and start discovering amazing events
          </p>
        </div>
        
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Registration form coming soon!</p>
          <Link to="/login" className="btn-primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;