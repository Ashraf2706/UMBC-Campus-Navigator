const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const Obstacle = require('../models/Obstacle');
const { protect } = require('../middleware/auth');

// All routes are protected (admin only)
router.use(protect);

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

// @route   POST /api/admin/obstacles
// @desc    Mark obstacle (coordinates optional)
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
// @desc    Get all obstacles
// @access  Private/Admin
router.get('/obstacles', async (req, res) => {
  try {
    const obstacles = await Obstacle.find({ isActive: true });
    res.json({ success: true, data: obstacles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/admin/obstacles/:id
// @desc    Delete obstacle
// @access  Private/Admin
router.delete('/obstacles/:id', async (req, res) => {
  try {
    const obstacle = await Obstacle.findOneAndDelete({ obstacleID: req.params.id });

    if (!obstacle) {
      return res.status(404).json({ success: false, error: 'Obstacle not found' });
    }

    res.json({ success: true, message: 'Obstacle removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;