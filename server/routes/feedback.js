const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Obstacle = require('../models/Obstacle');

// ============================================
// FEEDBACK ROUTES
// ============================================

// Submit general feedback
router.post('/', async (req, res) => {
  try {
    console.log('Received feedback:', req.body);
    
    // Create feedback with flexible field mapping
    const feedbackData = {
      name: req.body.name || req.body.userName || 'Anonymous',
      email: req.body.email || req.body.userEmail || 'not-provided@example.com',
      rating: req.body.rating || req.body.stars || 5,
      message: req.body.message || req.body.feedback || req.body.comment || '',
      status: 'new'
    };
    
    console.log('Creating feedback with data:', feedbackData);
    
    const feedback = new Feedback(feedbackData);
    const savedFeedback = await feedback.save();
    
    console.log('Feedback saved successfully:', savedFeedback._id);
    
    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: savedFeedback
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    console.error('Error details:', error.message);
    console.error('Validation errors:', error.errors);
    
    res.status(500).json({
      success: false,
      message: 'Failed to save feedback',
      error: error.message,
      details: error.errors
    });
  }
});

// Get all feedback
router.get('/', async (req, res) => {
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

// ============================================
// OBSTACLE ROUTES
// ============================================

// Submit obstacle report
router.post('/obstacle', async (req, res) => {
  try {
    console.log('Received obstacle report:', req.body);
    
    const obstacle = new Obstacle({
      obstacleID: req.body.obstacleID || `OBS_${Date.now()}`,
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      type: req.body.type,
      severity: req.body.severity,
      startDate: req.body.startDate || new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    
    const savedObstacle = await obstacle.save();
    console.log('Obstacle saved successfully:', savedObstacle._id);
    
    res.status(201).json({
      success: true,
      message: 'Obstacle report submitted successfully',
      data: savedObstacle
    });
  } catch (error) {
    console.error('Error saving obstacle:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save obstacle report',
      error: error.message
    });
  }
});

// Get all obstacles
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch obstacles',
      error: error.message
    });
  }
});

module.exports = router;