const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const Obstacle = require('../models/Obstacle');
const Feedback = require('../models/Feedback');
const { protect } = require('../middleware/auth');

// All routes are protected (admin only)
router.use(protect);

// ============================================
// LOCATION MANAGEMENT
// ============================================

// @route   POST /api/admin/locations
// @desc    Add new location
// @access  Private/Admin
router.post('/locations', async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/admin/locations/:id
// @desc    Update location
// @access  Private/Admin
router.put('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findOneAndUpdate(
      { locationID: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/locations/:id
// @desc    Delete location
// @access  Private/Admin
router.delete('/locations/:id', async (req, res) => {
  try {
    const location = await Location.findOneAndDelete({ locationID: req.params.id });

    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    res.json({ success: true, message: 'Location removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// OBSTACLE MANAGEMENT
// ============================================

// @route   POST /api/admin/obstacles
// @desc    Create obstacle (admin can add manually)
// @access  Private/Admin
router.post('/obstacles', async (req, res) => {
  try {
    console.log('Received obstacle data:', req.body);
    
    // If coordinates provided, use them; otherwise use default UMBC center
    if (req.body.coordinates) {
      req.body.affectedArea = {
        type: 'Point',
        coordinates: [req.body.coordinates.lng, req.body.coordinates.lat]
      };
    } else {
      req.body.affectedArea = {
        type: 'Point',
        coordinates: [-76.7130, 39.2551] // Default to UMBC center
      };
    }
    
    // Remove the coordinates field since we're using affectedArea
    delete req.body.coordinates;
    
    const obstacle = await Obstacle.create(req.body);
    res.status(201).json({ success: true, data: obstacle });
  } catch (error) {
    console.error('Obstacle creation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/admin/obstacles
// @desc    Get all obstacles for admin dashboard
// @access  Private/Admin
router.get('/obstacles', async (req, res) => {
  try {
    const obstacles = await Obstacle.find().sort({ submittedAt: -1 });
    res.json({ 
      success: true, 
      count: obstacles.length,
      data: obstacles 
    });
  } catch (error) {
    console.error('Error fetching obstacles:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PATCH /api/admin/obstacles/:id
// @desc    Update obstacle (mark as inactive/resolved)
// @access  Private/Admin
router.patch('/obstacles/:id', async (req, res) => {
  try {
    const { isActive, endDate } = req.body;
    
    const obstacle = await Obstacle.findByIdAndUpdate(
      req.params.id,
      { isActive, endDate },
      { new: true }
    );

    if (!obstacle) {
      return res.status(404).json({ success: false, error: 'Obstacle not found' });
    }
    
    res.json({ success: true, data: obstacle });
  } catch (error) {
    console.error('Error updating obstacle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/obstacles/:id
// @desc    Delete obstacle
// @access  Private/Admin
router.delete('/obstacles/:id', async (req, res) => {
  try {
    const obstacle = await Obstacle.findByIdAndDelete(req.params.id);

    if (!obstacle) {
      return res.status(404).json({ success: false, error: 'Obstacle not found' });
    }

    res.json({ success: true, message: 'Obstacle removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// FEEDBACK MANAGEMENT
// ============================================

// @route   GET /api/admin/feedback
// @desc    Get all feedback for admin dashboard
// @access  Private/Admin
router.get('/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ submittedAt: -1 });
    
    res.json({
      success: true,
      count: feedback.length,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// @route   PATCH /api/admin/feedback/:id
// @desc    Update feedback status
// @access  Private/Admin
router.patch('/feedback/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }
    
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/feedback/:id
// @desc    Delete feedback
// @access  Private/Admin
router.delete('/feedback/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({ success: false, error: 'Feedback not found' });
    }

    res.json({ success: true, message: 'Feedback removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// DASHBOARD STATISTICS
// ============================================

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const feedbackCount = await Feedback.countDocuments();
    const obstacleCount = await Obstacle.countDocuments();
    const activeObstacles = await Obstacle.countDocuments({ isActive: true });
    const newFeedback = await Feedback.countDocuments({ status: 'new' });
    const locationCount = await Location.countDocuments();
    
    res.json({
      success: true,
      data: {
        totalFeedback: feedbackCount,
        newFeedback: newFeedback,
        totalObstacles: obstacleCount,
        activeObstacles: activeObstacles,
        totalLocations: locationCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

module.exports = router;