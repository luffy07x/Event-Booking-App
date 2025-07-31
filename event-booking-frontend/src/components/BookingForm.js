import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { formatPrice, validateEmail, validatePhone } from '../utils/helpers';
import toast from 'react-hot-toast';

const BookingForm = ({ event, onSubmit, loading = false }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const watchedEmail = watch('email');
  const watchedPhone = watch('phone');

  const totalAmount = event.price * ticketCount;
  const availableTickets = event.capacity - event.booked;

  const onFormSubmit = (data) => {
    const bookingData = {
      ...data,
      tickets: ticketCount,
      paymentMethod,
      totalAmount,
    };
    onSubmit(bookingData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-medium p-6 sticky top-24"
    >
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Book Your Tickets</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FiCalendar className="w-4 h-4 mr-1" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin className="w-4 h-4 mr-1" />
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Ticket Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Tickets
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              disabled={ticketCount <= 1}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-primary-600">{ticketCount}</span>
              <div className="text-xs text-gray-500">
                {availableTickets} available
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTicketCount(Math.min(availableTickets, ticketCount + 1))}
              disabled={ticketCount >= availableTickets}
              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <FiUser className="w-4 h-4 mr-2" />
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  validate: (value) => validateEmail(value) || 'Please enter a valid email address'
                })}
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="tel"
                {...register('phone', {
                  required: 'Phone number is required',
                  validate: (value) => validatePhone(value) || 'Please enter a valid phone number'
                })}
                className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <FiCreditCard className="w-4 h-4 mr-2" />
            Payment Method
          </h4>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-primary-600"
              />
              <FiCreditCard className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-primary-600"
              />
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="font-medium">PayPal</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900">Order Summary</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Event</span>
              <span className="font-medium">{event.title}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Price per ticket</span>
              <span className="font-medium">{formatPrice(event.price)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Number of tickets</span>
              <span className="font-medium">{ticketCount}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary-600">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || availableTickets === 0}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
            loading || availableTickets === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : availableTickets === 0 ? (
            'Sold Out'
          ) : (
            `Book Now - ${formatPrice(totalAmount)}`
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By booking, you agree to our terms and conditions. 
          You will receive a confirmation email after payment.
        </p>
      </form>
    </motion.div>
  );
};

export default BookingForm;