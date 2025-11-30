import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import Modal from '../UI/Modal';
import { searchLocations } from '../../services/locationService';

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchDebounce = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await searchLocations(query);
      if (response.success) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (location) => {
    navigate('/map', { state: { selectedLocation: location } });
    onClose();
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Locations" size="md">
      {/* Search Input - ALWAYS VISIBLE TEXT */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" size={20} />
        <input
          type="text"
          placeholder="Search buildings, departments, or amenities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-umbc-gold dark:border-umbc-gold/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-umbc-gold bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          autoFocus
        />
      </div>

      {/* Search Results or Empty State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-umbc-gold border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.map((location) => (
            <div
              key={location.locationID}
              onClick={() => handleSelectLocation(location)}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors bg-white dark:bg-gray-800/50"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{getBuildingIcon(location.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{location.name}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 dark:bg-gray-600 text-white text-xs rounded font-medium">
                      {location.shortName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{location.type}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">{location.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : query.trim() ? (
        <div className="text-center py-12">
          <MapPin className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">No locations found for "{query}"</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try searching for "ENG" or "Library"</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400">Start typing to search for locations</p>
        </div>
      )}
    </Modal>
  );
};

export default SearchModal;