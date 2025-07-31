import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiCalendar, FiMapPin, FiClock, FiTicket, FiMail, FiPhone, FiEdit3 } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvent } from '../context/EventContext';
import { formatDate, formatTime, formatPrice } from '../utils/helpers';

const Profile = () => {
  const { bookings, events, loading } = useEvent();
  const location = useLocation();
  const [userBookings, setUserBookings] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15',
  });

  // Mock bookings for demonstration
  const mockBookings = [
    {
      id: 1,
      eventId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      tickets: 2,
      paymentMethod: 'card',
      totalAmount: 598,
      bookingDate: '2024-03-15T10:30:00Z',
      status: 'confirmed',
    },
    {
      id: 2,
      eventId: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      tickets: 1,
      paymentMethod: 'paypal',
      totalAmount: 89,
      bookingDate: '2024-03-10T14:20:00Z',
      status: 'confirmed',
    },
  ];

  useEffect(() => {
    // Check if there's a new booking from the location state
    if (location.state?.newBooking) {
      setUserBookings(prev => [location.state.newBooking, ...prev]);
    } else {
      // Load mock bookings for demonstration
      setUserBookings(mockBookings);
    }
  }, [location.state]);

  const getEventDetails = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalBookings: userBookings.length,
    totalSpent: userBookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    upcomingEvents: userBookings.filter(booking => {
      const event = getEventDetails(booking.eventId);
      return event && new Date(`${event.date}T${event.time}`) > new Date();
    }).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading your profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userInfo.firstName.charAt(0)}{userInfo.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userInfo.firstName} {userInfo.lastName}
                </h1>
                <p className="text-gray-600">Member since {formatDate(userInfo.joinDate)}</p>
              </div>
            </div>
            
            <button className="btn-secondary flex items-center space-x-2">
              <FiEdit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info & Stats */}
          <div className="space-y-6">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{userInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{userInfo.phone}</span>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="font-semibold text-gray-900">{stats.totalBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="font-semibold text-primary-600">{formatPrice(stats.totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Upcoming Events</span>
                  <span className="font-semibold text-green-600">{stats.upcomingEvents}</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/events"
                  className="block w-full btn-primary text-center"
                >
                  Browse Events
                </Link>
                <Link
                  to="/events?featured=true"
                  className="block w-full btn-secondary text-center"
                >
                  Featured Events
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Bookings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                <span className="text-sm text-gray-500">
                  {userBookings.length} booking{userBookings.length !== 1 ? 's' : ''}
                </span>
              </div>

              {userBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiTicket className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start exploring events and make your first booking!
                  </p>
                  <Link to="/events" className="btn-primary">
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userBookings.map((booking, index) => {
                    const event = getEventDetails(booking.eventId);
                    if (!event) return null;

                    const isUpcoming = new Date(`${event.date}T${event.time}`) > new Date();

                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-medium transition-shadow duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                          <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {event.title}
                              </h3>
                              <p className="text-gray-600">{event.organizer}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            {isUpcoming && (
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Upcoming
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiClock className="w-4 h-4" />
                            <span>{formatTime(event.time)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiMapPin className="w-4 h-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{booking.tickets} ticket{booking.tickets !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>Booked on {formatDate(booking.bookingDate.split('T')[0])}</span>
                          </div>
                          <div className="text-lg font-bold text-primary-600">
                            {formatPrice(booking.totalAmount)}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 mt-4">
                          <Link
                            to={`/events/${event.id}`}
                            className="btn-secondary text-sm"
                          >
                            View Event
                          </Link>
                          {isUpcoming && (
                            <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200">
                              Download Ticket
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;