import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { submitObstacleReport } from '../../services/feedbackServices';

const ReportObstacleModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Construction',
    severity: 'Medium',
    // latitude: '',
    // longitude: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const obstacleData = {
        obstacleID: `OBS_${Date.now()}`,
        type: formData.type,
        description: `${formData.title} - ${formData.description}`,
        // coordinates: {
        //   lat: parseFloat(formData.latitude),
        //   lng: parseFloat(formData.longitude),
        // },
        severity: formData.severity,
        startDate: new Date(),
        isActive: true,
      };

      await submitObstacleReport(obstacleData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setFormData({
          title: '',
          description: '',
          type: 'Construction',
          severity: 'Medium',
          // latitude: '',
          // longitude: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting obstacle report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Report Submitted" size="sm">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600">Your obstacle report has been submitted successfully.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report an Obstacle" size="md">
      <p className="text-gray-600 mb-6">
        Help keep the campus navigation accurate by reporting construction, closures, or other obstacles.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="e.g., Construction on Main Path"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Provide details about the obstacle..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent"
          />
        </div>

        {/* Obstacle Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Obstacle Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent"
          >
            <option value="Construction">Construction</option>
            <option value="Closed Path">Closed Path</option>
            <option value="Event">Event</option>
          </select>
        </div>

        {/* Severity Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity Level
          </label>
          <div className="space-y-2">
            {[
              { value: 'Low', label: 'Low - Minor inconvenience', color: 'yellow' },
              { value: 'Medium', label: 'Medium - Requires detour', color: 'orange' },
              { value: 'High', label: 'High - Pathway blocked', color: 'red' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="severity"
                  value={option.value}
                  checked={formData.severity === option.value}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-5 h-5 text-umbc-gold focus:ring-umbc-gold"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Coordinates */}
        {/* <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              placeholder="39.2544"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              placeholder="-76.7112"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent"
            />
          </div>
        </div> */}

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
            disabled={submitting}
            className="flex-1"
            icon={AlertTriangle}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportObstacleModal;