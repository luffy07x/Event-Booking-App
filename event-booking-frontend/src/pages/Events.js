import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiGrid, FiList, FiFilter } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useEvent } from '../context/EventContext';

const Events = () => {
  const { events, loading, fetchEvents } = useEvent();
  const [searchParams] = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [currentFilters, setCurrentFilters] = useState({});

  // Get initial filters from URL params
  useEffect(() => {
    const initialFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      featured: searchParams.get('featured') === 'true',
    };
    setCurrentFilters(initialFilters);
  }, [searchParams]);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events based on current filters
  useEffect(() => {
    let filtered = [...events];

    if (currentFilters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        event.description.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        event.location.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    if (currentFilters.category) {
      filtered = filtered.filter(event =>
        event.category.toLowerCase() === currentFilters.category.toLowerCase()
      );
    }

    if (currentFilters.featured) {
      filtered = filtered.filter(event => event.featured);
    }

    setFilteredEvents(filtered);
  }, [events, currentFilters]);

  const handleFiltersChange = useCallback((filters) => {
    setCurrentFilters(filters);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FilterBar onFiltersChange={handleFiltersChange} initialFilters={currentFilters} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSpinner size="lg" text="Loading events..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterBar onFiltersChange={handleFiltersChange} initialFilters={currentFilters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {currentFilters.category ? `${currentFilters.category} Events` : 'All Events'}
            </h1>
            <p className="text-gray-600">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              {currentFilters.search && ` for "${currentFilters.search}"`}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid/List */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFilter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">
              {currentFilters.search || currentFilters.category || currentFilters.featured
                ? 'Try adjusting your filters to see more events.'
                : 'There are no events available at the moment.'}
            </p>
            {(currentFilters.search || currentFilters.category || currentFilters.featured) && (
              <button
                onClick={() => setCurrentFilters({ search: '', category: '', featured: false })}
                className="btn-primary"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'space-y-6'
            }
          >
            {filteredEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                {viewMode === 'grid' ? (
                  <EventCard event={event} featured={event.featured} />
                ) : (
                  <div className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow duration-200">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          {event.featured && (
                            <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-primary-600">
                            ${event.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            {event.capacity - event.booked} seats left
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Load More Button (if needed) */}
        {filteredEvents.length > 0 && filteredEvents.length >= 12 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <button className="btn-secondary">
              Load More Events
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Events;