import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { submitFeedback } from '../../services/feedbackServices';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitFeedback({
        issueType: 'Other',
        description: `Rating: ${rating}/5 stars\n\n${feedback}`,
        status: 'New'
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setRating(0);
        setFeedback('');
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Thank You!" size="sm">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Feedback Submitted!</h3>
          <p className="text-gray-600 dark:text-gray-400">Thank you for helping us improve UMBC Campus Navigator.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Your Feedback" size="md">
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Help us improve the UMBC Campus Navigator with your suggestions and comments.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            How would you rate your experience?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={40}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'fill-umbc-gold text-umbc-gold'
                      : 'text-gray-300 dark:text-gray-600'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Feedback
          </label>
          <textarea
            placeholder="Tell us what you think about the campus navigation system..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || rating === 0}
            className="flex-1"
            icon={MessageSquare}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;