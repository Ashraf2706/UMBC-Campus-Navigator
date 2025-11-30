const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// @route   GET /api/locations
// @desc    Get all locations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find();
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/locations/search
// @desc    Search locations by name, short form, or department/office
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Query parameter required' });
    }

    // Search by name, shortName, OR departments (case-insensitive)
    const locations = await Location.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { shortName: { $regex: query, $options: 'i' } },
        { departments: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/locations/:id
// @desc    Get single location by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findOne({ locationID: req.params.id });
    
    if (!location) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }

    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;