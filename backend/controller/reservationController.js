const express = require('express');
const { body, validationResult } = require('express-validator');
const reservationService = require('../service/reservationService');
const { protect, authorize } = require('../config/auth');

const router = express.Router();

// Validation rules
const reservationValidation = [
  body('event').isMongoId().withMessage('Valid event ID is required'),
  body('numberOfAttendees').isInt({ min: 1 }).withMessage('Number of attendees must be at least 1'),
  body('attendees').isArray({ min: 1 }).withMessage('At least one attendee is required'),
  body('attendees.*.name').trim().isLength({ min: 1 }).withMessage('Attendee name is required'),
  body('attendees.*.email').isEmail().withMessage('Valid attendee email is required')
];

// @desc    Create new reservation
// @route   POST /api/reservations
// @access  Private
router.post('/', protect, reservationValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const reservation = await reservationService.createReservation(req.body, req.user._id);
    
    res.status(201).json({
      success: true,
      data: reservation,
      message: 'Reservation created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get user's reservations
// @route   GET /api/reservations/my-reservations
// @access  Private
router.get('/my-reservations', protect, async (req, res) => {
  try {
    const result = await reservationService.getUserReservations(req.user._id, req.query);
    
    res.status(200).json({
      success: true,
      data: result.reservations,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const reservation = await reservationService.updateReservation(req.params.id, req.body, req.user._id);
    
    res.status(200).json({
      success: true,
      data: reservation,
      message: 'Reservation updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await reservationService.cancelReservation(req.params.id, req.user._id, reason);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get reservations for an event (Organizer only)
// @route   GET /api/reservations/event/:eventId
// @access  Private (Organizer/Admin)
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const reservations = await reservationService.getEventReservations(req.params.eventId, req.user._id);
    
    res.status(200).json({
      success: true,
      data: reservations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Check in reservation (Organizer only)
// @route   PUT /api/reservations/:id/checkin
// @access  Private (Organizer/Admin)
router.put('/:id/checkin', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const result = await reservationService.checkInReservation(req.params.id, req.user._id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get reservation by code
// @route   GET /api/reservations/code/:code
// @access  Private (Organizer/Admin)
router.get('/code/:code', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const reservation = await reservationService.getReservationByCode(req.params.code);
    
    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Confirm payment
// @route   PUT /api/reservations/:id/confirm-payment
// @access  Private (Admin or payment webhook)
router.put('/:id/confirm-payment', protect, async (req, res) => {
  try {
    const result = await reservationService.confirmPayment(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get reservation statistics (Organizer only)
// @route   GET /api/reservations/stats/overview
// @access  Private (Organizer/Admin)
router.get('/stats/overview', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const stats = await reservationService.getReservationStats(req.user._id);
    
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;