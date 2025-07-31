const express = require('express');
const { body, validationResult } = require('express-validator');
const eventService = require('../service/eventService');
const { protect, authorize, optionalAuth } = require('../config/auth');

const router = express.Router();

// Validation rules
const eventValidation = [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 2000 }).withMessage('Description is required and must be less than 2000 characters'),
  body('category').isIn(['conference', 'workshop', 'seminar', 'concert', 'festival', 'sports', 'networking', 'exhibition', 'party', 'other']).withMessage('Invalid category'),
  body('venue.name').trim().isLength({ min: 1 }).withMessage('Venue name is required'),
  body('venue.address.city').trim().isLength({ min: 1 }).withMessage('City is required'),
  body('venue.address.country').trim().isLength({ min: 1 }).withMessage('Country is required'),
  body('venue.capacity').isInt({ min: 1 }).withMessage('Venue capacity must be a positive integer'),
  body('dateTime.start').isISO8601().withMessage('Valid start date is required'),
  body('dateTime.end').isISO8601().withMessage('Valid end date is required'),
  body('registrationDeadline').isISO8601().withMessage('Valid registration deadline is required'),
  body('maxAttendees').isInt({ min: 1 }).withMessage('Max attendees must be a positive integer')
];

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const result = await eventService.getAllEvents(req.query);
    
    res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
router.post('/', protect, authorize('organizer', 'admin'), eventValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await eventService.createEvent(req.body, req.user._id);
    
    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Event Organizer/Admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body, req.user._id);
    
    res.status(200).json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Event Organizer/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming/list
// @access  Public
router.get('/upcoming/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const events = await eventService.getUpcomingEvents(limit);
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get featured events
// @route   GET /api/events/featured/list
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    const events = await eventService.getFeaturedEvents(limit);
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get events by category
// @route   GET /api/events/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const events = await eventService.getEventsByCategory(req.params.category, limit);
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Search events
// @route   GET /api/events/search/:term
// @access  Public
router.get('/search/:term', async (req, res) => {
  try {
    const events = await eventService.searchEvents(req.params.term);
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get organizer's events
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer/Admin)
router.get('/organizer/my-events', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const events = await eventService.getEventsByOrganizer(req.user._id);
    
    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;