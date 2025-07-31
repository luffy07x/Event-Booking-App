import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  } catch (error) {
    return timeString;
  }
};

export const formatDateTime = (dateString, timeString) => {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateAvailableTickets = (capacity, booked) => {
  return Math.max(0, capacity - booked);
};

export const getAvailabilityStatus = (capacity, booked) => {
  const available = calculateAvailableTickets(capacity, booked);
  const percentage = (available / capacity) * 100;
  
  if (percentage === 0) return 'sold-out';
  if (percentage <= 10) return 'limited';
  if (percentage <= 30) return 'filling-up';
  return 'available';
};

export const isEventUpcoming = (dateString, timeString) => {
  try {
    const eventDateTime = new Date(`${dateString}T${timeString}`);
    return isAfter(eventDateTime, new Date());
  } catch (error) {
    return false;
  }
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateBookingId = () => {
  return 'BK' + Date.now().toString(36).toUpperCase();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};