import React from 'react';
import { PlusCircle } from 'lucide-react';

const CreateEvent = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <PlusCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Create Event Coming Soon
          </h3>
          <p className="text-gray-600">
            Event creation form will be available here
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;