import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiStar } from 'react-icons/fi';
import { formatDate, formatTime, formatPrice, getAvailabilityStatus, calculateAvailableTickets } from '../utils/helpers';

const EventCard = ({ event, featured = false }) => {
  const availabilityStatus = getAvailabilityStatus(event.capacity, event.booked);
  const availableTickets = calculateAvailableTickets(event.capacity, event.booked);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sold-out': return 'text-red-600 bg-red-50';
      case 'limited': return 'text-orange-600 bg-orange-50';
      case 'filling-up': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'sold-out': return 'Sold Out';
      case 'limited': return 'Limited Seats';
      case 'filling-up': return 'Filling Up';
      default: return 'Available';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`card hover:shadow-medium transition-all duration-300 ${featured ? 'ring-2 ring-primary-200' : ''}`}
    >
      <Link to={`/events/${event.id}`} className="block">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
          
          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center space-x-1 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                <FiStar className="w-3 h-3" />
                <span>Featured</span>
              </div>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(availabilityStatus)}`}>
              {getStatusText(availabilityStatus)}
            </span>
          </div>
          
          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FiClock className="w-4 h-4 mr-2" />
              <span>{formatTime(event.time)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FiMapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FiUsers className="w-4 h-4 mr-2" />
              <span>{availableTickets} of {event.capacity} seats available</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary-600">
              {formatPrice(event.price)}
            </div>
            
            <div className="text-sm text-gray-500">
              by {event.organizer}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(event.booked / event.capacity) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{event.booked} booked</span>
              <span>{event.capacity} capacity</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;