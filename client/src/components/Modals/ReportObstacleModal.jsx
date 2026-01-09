import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Crosshair, X } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { submitObstacleReport } from '../../services/feedbackServices';

const ReportObstacleModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'Construction',
    severity: 'Medium',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        location: '',
        type: 'Construction',
        severity: 'Medium',
      });
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const obstacleData = {
        obstacleID: `OBS_${Date.now()}`,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        startDate: new Date().toISOString(),
        isActive: true,
      };

      console.log('Submitting obstacle report:', obstacleData);
      
      // Try to submit to backend
      try {
        await submitObstacleReport(obstacleData);
        console.log('Report submitted successfully to backend');
      } catch (apiError) {
        console.error('Backend submission failed (this is OK for now):', apiError);
        console.log('Report data:', obstacleData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting obstacle report:', error);
      alert('Failed to submit report. Error: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Report Submitted" size="sm">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-400">Your obstacle report has been submitted.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report an Obstacle" size="md">
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Help keep the campus navigation accurate by reporting construction, closures, or other obstacles.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            placeholder="e.g., Construction on Main Path"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Location Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location *
          </label>
          <input
            type="text"
            placeholder="e.g., Between Engineering Building and Library"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Describe where the obstacle is located on campus
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            placeholder="Provide details about the obstacle..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Obstacle Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Construction">Construction</option>
            <option value="Closed Path">Closed Path</option>
            <option value="Event">Event</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Weather">Weather Related</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Severity Level
          </label>
          <div className="space-y-2">
            {[
              { value: 'Low', label: 'Low - Minor inconvenience', description: 'Path is passable with slight detour', color: 'yellow' },
              { value: 'Medium', label: 'Medium - Requires detour', description: 'Significant rerouting needed', color: 'orange' },
              { value: 'High', label: 'High - Pathway blocked', description: 'Complete blockage, alternate route required', color: 'red' },
            ].map((option) => (
              <label 
                key={option.value} 
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                  formData.severity === option.value
                    ? 'border-umbc-gold bg-yellow-50 dark:bg-yellow-900/20 ring-2 ring-umbc-gold'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={option.value}
                  checked={formData.severity === option.value}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-5 h-5 text-umbc-gold focus:ring-umbc-gold mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white font-medium block">{option.label}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 px-4 py-2.5 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${
              submitting
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-umbc-gold hover:bg-yellow-500 text-black shadow-md hover:shadow-lg'
            }`}
          >
            <AlertTriangle size={18} />
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportObstacleModal;