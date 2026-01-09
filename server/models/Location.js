const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  locationID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Academic', 'Dining', 'Recreation', 'Residential', 'Administrative', 'Parking', 'Athletic', 'Health', 'Other']
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  address: String,
  departments: [String],
  bikeFeatures: {
    bikeRackAvailable: {
      type: Boolean,
      default: false
    },
    bikeRackCapacity: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Create geospatial index for proximity searches
LocationSchema.index({ 'coordinates': '2dsphere' });

// Create text index for search functionality
LocationSchema.index({ name: 'text', shortName: 'text' });

module.exports = mongoose.model('Location', LocationSchema);