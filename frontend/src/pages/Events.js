import React from 'react';
import { Calendar, Search } from 'lucide-react';

const Events = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Events
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find amazing events happening near you
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input pl-10 w-full"
              placeholder="Search events..."
            />
          </div>
        </div>
        
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Events Coming Soon
          </h3>
          <p className="text-gray-600">
            The events listing page is under development. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Events;