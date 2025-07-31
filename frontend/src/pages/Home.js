import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  ArrowRight, 
  Sparkles,
  Clock,
  Ticket
} from 'lucide-react';
import { eventsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';

const Home = () => {
  // Fetch featured events
  const { data: featuredEvents, isLoading: featuredLoading } = useQuery(
    'featuredEvents',
    () => eventsAPI.getFeaturedEvents(4),
    {
      select: (response) => response.data.data,
    }
  );

  // Fetch upcoming events
  const { data: upcomingEvents, isLoading: upcomingLoading } = useQuery(
    'upcomingEvents',
    () => eventsAPI.getUpcomingEvents(6),
    {
      select: (response) => response.data.data,
    }
  );

  const stats = [
    { label: 'Events Hosted', value: '10,000+', icon: Calendar },
    { label: 'Happy Attendees', value: '50,000+', icon: Users },
    { label: 'Cities Covered', value: '100+', icon: MapPin },
    { label: 'Average Rating', value: '4.9/5', icon: Star },
  ];

  const categories = [
    { name: 'Conferences', count: '200+', color: 'bg-blue-500', icon: '🎯' },
    { name: 'Workshops', count: '150+', color: 'bg-green-500', icon: '🛠️' },
    { name: 'Concerts', count: '300+', color: 'bg-purple-500', icon: '🎵' },
    { name: 'Festivals', count: '100+', color: 'bg-yellow-500', icon: '🎉' },
    { name: 'Sports', count: '80+', color: 'bg-red-500', icon: '⚽' },
    { name: 'Networking', count: '120+', color: 'bg-indigo-500', icon: '🤝' },
  ];

  const EventCard = ({ event }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="card-hover p-6"
    >
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <div className="w-full h-48 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
          <Calendar className="w-12 h-12 text-white opacity-50" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="badge-primary">{event.category}</span>
          {event.pricing.type === 'free' ? (
            <span className="badge-success">Free</span>
          ) : (
            <span className="text-sm font-semibold text-gray-900">
              ${event.pricing.amount}
            </span>
          )}
        </div>
        
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
          {event.title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{format(new Date(event.dateTime.start), 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{event.venue.city}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Users className="w-4 h-4" />
            <span>{event.availableSpots} spots left</span>
          </div>
          <Link
            to={`/events/${event.id}`}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e0f2fe" fill-opacity="0.3"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Sparkles className="w-6 h-6 text-primary-500" />
                <span className="text-primary-600 font-medium">Welcome to EventHub</span>
                <Sparkles className="w-6 h-6 text-primary-500" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Discover Amazing
                <span className="text-gradient block">Events Near You</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                From conferences to concerts, workshops to festivals - find and book 
                unforgettable experiences that match your interests and schedule.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/events"
                  className="btn-primary btn-lg w-full sm:w-auto"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Browse Events
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary btn-lg w-full sm:w-auto"
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-secondary-200 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find events that match your interests across various categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center cursor-pointer group"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents && featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Featured Events
                </h2>
                <p className="text-xl text-gray-600">
                  Don't miss these handpicked amazing events
                </p>
              </div>
              <Link
                to="/events?featured=true"
                className="btn-ghost hidden sm:flex"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {featuredLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading featured events..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Upcoming Events
                </h2>
                <p className="text-xl text-gray-600">
                  Discover what's happening soon
                </p>
              </div>
              <Link
                to="/events"
                className="btn-ghost hidden sm:flex"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            
            {upcomingLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" text="Loading upcoming events..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.slice(0, 6).map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Create Your Own Event?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of organizers who trust EventHub to manage their events. 
              It's easy, powerful, and completely free to get started.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Organizing Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;