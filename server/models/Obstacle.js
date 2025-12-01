const mongoose = require('mongoose');

const obstacleSchema = new mongoose.Schema({
  obstacleID: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Construction', 'Closed Path', 'Event', 'Maintenance', 'Weather', 'Other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Obstacle = mongoose.model('Obstacle', obstacleSchema);

module.exports = Obstacle;