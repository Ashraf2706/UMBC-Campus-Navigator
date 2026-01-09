const mongoose = require('mongoose');

const routeLogSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  travelMode: {
    type: String,
    enum: ['WALKING', 'BICYCLING'],
    default: 'WALKING'
  },
  distance: {
    type: Number, // in meters
  },
  duration: {
    type: Number, // in seconds
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
routeLogSchema.index({ calculatedAt: -1 });

const RouteLog = mongoose.model('RouteLog', routeLogSchema);

module.exports = RouteLog;