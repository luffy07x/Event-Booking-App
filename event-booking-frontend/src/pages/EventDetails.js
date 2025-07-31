import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiStar, FiShare2, FiHeart, FiArrowLeft } from 'react-icons/fi';
import BookingForm from '../components/BookingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvent } from '../context/EventContext';
import { eventService } from '../services/eventService';
import { formatDate, formatTime, formatPrice, getAvailabilityStatus, calculateAvailableTickets } from '../utils/helpers';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookEvent } = useEvent();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
        toast.error('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleBooking = async (bookingData) => {
    try {
      setBookingLoading(true);
      const booking = await bookEvent(id, bookingData);
      toast.success('Booking confirmed! Check your email for details.');
      navigate('/profile', { state: { newBooking: booking } });
    } catch (err) {
      toast.error(err.message || 'Failed to book event');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading event details..." />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/events')}
            className="btn-primary"
          >
            Browse Other Events
          </button>
        </div>
      </div>
    );
  }

  const availabilityStatus = getAvailabilityStatus(event.capacity, event.booked);
  const availableTickets = calculateAvailableTickets(event.capacity, event.booked);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-3 rounded-full transition-all duration-200 flex items-center justify-center"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex space-x-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-full transition-all duration-200 ${
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900'
            }`}
          >
            <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-3 rounded-full transition-all duration-200"
          >
            <FiShare2 className="w-5 h-5" />
          </button>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
                {event.featured && (
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <FiStar className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-xl text-gray-200">
                by {event.organizer}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FiCalendar className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">{formatDate(event.date)}</p>
                      <p className="text-sm text-gray-500">Event Date</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FiClock className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">{formatTime(event.time)}</p>
                      <p className="text-sm text-gray-500">Start Time</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FiMapPin className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                      <p className="text-sm text-gray-500">Venue</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <FiUsers className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">{availableTickets} / {event.capacity}</p>
                      <p className="text-sm text-gray-500">Available Seats</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-3 mr-4" style={{ width: '200px' }}>
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          availabilityStatus === 'sold-out' ? 'bg-red-500' :
                          availabilityStatus === 'limited' ? 'bg-orange-500' :
                          availabilityStatus === 'filling-up' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(event.booked / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm font-medium ${
                      availabilityStatus === 'sold-out' ? 'text-red-600' :
                      availabilityStatus === 'limited' ? 'text-orange-600' :
                      availabilityStatus === 'filling-up' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {availabilityStatus === 'sold-out' ? 'Sold Out' :
                       availabilityStatus === 'limited' ? 'Limited Seats' :
                       availabilityStatus === 'filling-up' ? 'Filling Up Fast' : 'Available'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-primary-600">
                    {formatPrice(event.price)}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {event.description}
              </p>
              
              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Organizer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Organizer</h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-xl">
                    {event.organizer.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{event.organizer}</h3>
                  <p className="text-gray-600">Event Organizer</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <BookingForm
                event={event}
                onSubmit={handleBooking}
                loading={bookingLoading}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;