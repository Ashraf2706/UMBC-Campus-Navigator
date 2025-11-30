import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import Button from '../UI/Button';
import { getAllLocations } from '../../services/locationService';

const PopularLocations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await getAllLocations();
      if (response.success) {
        // Get first 6 locations as "popular"
        setLocations(response.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBuildingIcon = (type) => {
    const icons = {
      'Academic': '🏫',
      'Dining': '🍽️',
      'Recreation': '🏃',
      'Residential': '🏠',
      'Administrative': '🏢',
      'Parking': '🅿️',
    };
    return icons[type] || '📍';
  };

  const handleGetDirections = (location) => {
    navigate('/map', { state: { selectedLocation: location } });
  };

  if (loading) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-umbc-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Popular Locations</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Quick access to frequently visited campus destinations</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {locations.map((location) => (
            <div
              key={location.locationID}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-transparent dark:border-gray-700"
            >
              <div className="p-6">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{getBuildingIcon(location.type)}</div>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded font-medium">
                    Accessible
                  </span>
                </div>

                {/* Building Name */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {location.name}
                </h3>

                {/* Short Name and Type */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-umbc-gold">
                    {location.shortName}
                  </span>
                </div>

                {/* Address */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  {location.address}
                </p>

                {/* Description */}
                {location.departments && location.departments.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {location.departments[0]}
                    {location.departments.length > 1 && ` and ${location.departments.length - 1} more`}
                  </p>
                )}

                {/* Get Directions Button */}
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleGetDirections(location)}
                  className="w-full"
                  icon={Navigation}
                >
                  Get Directions
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/map')}
            className="px-12"
          >
            View All Locations on Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopularLocations;