const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Anonymous'
  },
  email: {
    type: String,
    required: false,
    default: 'not-provided@example.com'
  },
  rating: {
    type: Number,
    required: false,
    default: 5,
    min: 1,
    max: 5
  },
  message: {
    type: String,
    required: false,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;