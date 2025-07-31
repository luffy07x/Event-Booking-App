import React from 'react';
import { BarChart3 } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Dashboard Coming Soon
          </h3>
          <p className="text-gray-600">
            Analytics and insights for your events will be available here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;