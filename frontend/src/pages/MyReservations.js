import React from 'react';
import { BookOpen } from 'lucide-react';

const MyReservations = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            My Bookings Coming Soon
          </h3>
          <p className="text-gray-600">
            View and manage your event reservations here
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyReservations;