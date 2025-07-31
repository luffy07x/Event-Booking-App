import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvent } from '../context/EventContext';

const Home = () => {
  const { events, loading, fetchEvents } = useEvent();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    happyCustomers: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (events.length > 0) {
      const featured = events.filter(event => event.featured).slice(0, 3);
      setFeaturedEvents(featured);
      
      // Calculate stats
      const totalBookings = events.reduce((sum, event) => sum + event.booked, 0);
      setStats({
        totalEvents: events.length,
        totalBookings,
        happyCustomers: Math.floor(totalBookings * 0.95), // Assuming 95% satisfaction
      });
    }
  }, [events]);

  const categories = [
    { name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-800' },
    { name: 'Music', icon: '🎵', color: 'bg-purple-100 text-purple-800' },
    { name: 'Business', icon: '💼', color: 'bg-green-100 text-green-800' },
    { name: 'Art', icon: '🎨', color: 'bg-pink-100 text-pink-800' },
    { name: 'Food', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
    { name: 'Education', icon: '📚', color: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Discover Amazing
              <span className="block text-yellow-300">Events</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              From tech conferences to music festivals, find and book tickets for the most exciting events in your area.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
              >
                <span>Explore Events</span>
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/events?featured=true"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                <FiStar className="mr-2 w-5 h-5" />
                <span>Featured Events</span>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce delay-75"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-300 bg-opacity-20 rounded-full animate-bounce delay-150"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-300 bg-opacity-20 rounded-full animate-bounce"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalEvents}+</h3>
              <p className="text-gray-600">Amazing Events</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalBookings.toLocaleString()}+</h3>
              <p className="text-gray-600">Tickets Sold</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.happyCustomers.toLocaleString()}+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find events that match your interests from our diverse range of categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/events?category=${encodeURIComponent(category.name)}`}
                  className="block p-6 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 text-center group"
                >
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <FiTrendingUp className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-4xl font-bold text-gray-900">Featured Events</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these popular and trending events
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner size="lg" text="Loading featured events..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <EventCard event={event} featured={true} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 transform hover:scale-105"
            >
              <span>View All Events</span>
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-200">
              Join thousands of event-goers who trust EventHub for their entertainment needs
            </p>
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
            >
              <span>Start Exploring</span>
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;