import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eventService } from '../services/eventService';

const EventContext = createContext();

const initialState = {
  events: [],
  bookings: [],
  loading: false,
  error: null,
  user: null,
  selectedEvent: null,
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload, loading: false };
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  const fetchEvents = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const events = await eventService.getAllEvents();
      dispatch({ type: 'SET_EVENTS', payload: events });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const bookEvent = async (eventId, bookingData) => {
    try {
      const booking = await eventService.bookEvent(eventId, bookingData);
      dispatch({ type: 'ADD_BOOKING', payload: booking });
      return booking;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const value = {
    ...state,
    fetchEvents,
    bookEvent,
    dispatch,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};