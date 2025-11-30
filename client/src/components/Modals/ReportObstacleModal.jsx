import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, Crosshair, X } from 'lucide-react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { submitObstacleReport } from '../../services/feedbackServices';

const ReportObstacleModal = ({ isOpen, onClose, selectedCoordinates, userLocation, onRequestMapClick }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Construction',
    severity: 'Medium',
  });
  const [coordinates, setCoordinates] = useState(null);
  const [locationMethod, setLocationMethod] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (selectedCoordinates) {
        setCoordinates(selectedCoordinates);
        setLocationMethod('map');
      } else {
        setCoordinates(null);
        setLocationMethod(null);
      }
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'Construction',
        severity: 'Medium',
      });
      setCoordinates(null);
      setLocationMethod(null);
    }
  }, [isOpen, selectedCoordinates]);

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setCoordinates(userLocation);
      setLocationMethod('current');
    } else {
      alert('Unable to get your current location. Please enable location services or click on the map.');
    }
  };

  const handleClickOnMap = () => {
    if (onRequestMapClick) {
      onRequestMapClick();
    } else {
      alert('Please close this form and click on the map where the obstacle is located.');
      onClose();
    }
  };

  const handleClearLocation = () => {
    setCoordinates(null);
    setLocationMethod(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coordinates) {
      alert('Please select a location for the obstacle by clicking on the map or using your current location.');
      return;
    }

    setSubmitting(true);

    try {
      const obstacleData = {
        obstacleID: `OBS_${Date.now()}`,
        type: formData.type,
        description: `${formData.title} - ${formData.description}`,
        coordinates: {
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        severity: formData.severity,
        startDate: new Date(),
        isActive: true,
      };

      await submitObstacleReport(obstacleData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
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
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Thank You!</h3>
          <p className="text-gray-600 dark:text-gray-400">Your obstacle report has been submitted successfully.</p>
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
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <MapPin size={16} className="inline mr-2" />
            Obstacle Location *
          </label>
          
          {coordinates ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Location Selected</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Lat: {coordinates.lat.toFixed(6)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lng: {coordinates.lng.toFixed(6)}</p>
                  {locationMethod === 'current' && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-1">
                      <Crosshair size={12} />Using current location
                    </span>
                  )}
                  {locationMethod === 'map' && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                      <MapPin size={12} />Selected from map
                    </span>
                  )}
                </div>
                <button type="button" onClick={handleClearLocation} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                  <X size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button type="button" variant="outline" size="md" onClick={handleClickOnMap} className="w-full" icon={MapPin}>
                Click on Map to Select Location
              </Button>
              <Button type="button" variant="secondary" size="md" onClick={handleUseCurrentLocation} className="w-full" icon={Crosshair}>
                Use My Current Location
              </Button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            📍 Click on the map where the obstacle is located, or use your current location if you're at the site.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
          <input
            type="text"
            placeholder="e.g., Construction on Main Path"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description *</label>
          <textarea
            placeholder="Provide details about the obstacle..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Obstacle Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="Construction">Construction</option>
            <option value="Closed Path">Closed Path</option>
            <option value="Event">Event</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Weather">Weather Related</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Severity Level</label>
          <div className="space-y-2">
            {[
              { value: 'Low', label: 'Low - Minor inconvenience', description: 'Path is passable with slight detour' },
              { value: 'Medium', label: 'Medium - Requires detour', description: 'Significant rerouting needed' },
              { value: 'High', label: 'High - Pathway blocked', description: 'Complete blockage, alternate route required' },
            ].map((option) => (
              <label key={option.value} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="severity"
                  value={option.value}
                  checked={formData.severity === option.value}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-5 h-5 text-umbc-gold focus:ring-umbc-gold mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white font-medium">{option.label}</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" variant="primary" disabled={submitting || !coordinates} className="flex-1" icon={AlertTriangle}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportObstacleModal;