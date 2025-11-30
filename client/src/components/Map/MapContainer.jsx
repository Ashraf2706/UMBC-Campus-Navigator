import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { getMapStyle } from '../../utils/mapStyles';
import { useTheme } from '../../contexts/ThemeContext';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 39.2551,
  lng: -76.7130
};

const MapContainer = ({ 
  locations = [], 
  selectedLocation, 
  onMarkerClick,
  userLocation,
  route,
  onMapClick,
  mapClickMode = false
}) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isDarkMode } = useTheme(); // Get dark mode state

  // Map options with theme-aware styles
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: true,
    fullscreenControl: true,
    draggableCursor: mapClickMode ? 'crosshair' : 'default',
    clickableIcons: !mapClickMode,
    styles: getMapStyle(isDarkMode), // Apply theme-based style
    mapTypeId: 'roadmap',
    minZoom: 14,
    maxZoom: 20,
    gestureHandling: 'greedy',
  };

  const onLoad = useCallback((map) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsLoaded(false);
  }, []);

  // Update map style when theme changes
  useEffect(() => {
    if (map && isLoaded) {
      map.setOptions({ styles: getMapStyle(isDarkMode) });
    }
  }, [isDarkMode, map, isLoaded]);

  useEffect(() => {
    if (map && route && route.length > 0 && isLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      route.forEach(point => {
        bounds.extend(point);
      });
      map.fitBounds(bounds);
    }
  }, [map, route, isLoaded]);

  useEffect(() => {
    if (map && selectedLocation && isLoaded) {
      map.panTo({
        lat: selectedLocation.coordinates.lat,
        lng: selectedLocation.coordinates.lng
      });
      map.setZoom(17);
    }
  }, [map, selectedLocation, isLoaded]);

  const getBuildingIcon = (type) => {
    if (!window.google || !window.google.maps) {
      return null;
    }

    const colors = {
      'Academic': '#3B82F6',
      'Dining': '#F59E0B',
      'Recreation': '#10B981',
      'Residential': '#8B5CF6',
      'Administrative': '#6B7280',
      'Parking': '#EF4444',
    };
    
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type] || '#3B82F6',
      fillOpacity: 1,
      strokeColor: '#FFFFFF',
      strokeWeight: 2,
      scale: 8,
    };
  };

  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Google Maps API Key Missing</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please add your Google Maps API key to the .env file:</p>
          <code className="block bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm text-left text-gray-800 dark:text-gray-200">
            REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
          </code>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Then restart the development server (npm start)</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      loadingElement={
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-umbc-gold border-t-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading Google Maps...</p>
          </div>
        </div>
      }
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
        onClick={onMapClick}
      >
        {isLoaded && locations.map((location) => {
          const icon = getBuildingIcon(location.type);
          return icon ? (
            <Marker
              key={location.locationID}
              position={{
                lat: location.coordinates.lat,
                lng: location.coordinates.lng
              }}
              icon={icon}
              onClick={() => !mapClickMode && onMarkerClick(location)}
              title={location.name}
              opacity={mapClickMode ? 0.5 : 1}
            />
          ) : null;
        })}

        {isLoaded && userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
              scale: 10,
            }}
            title="Your Location"
          />
        )}

        {isLoaded && route && route.length > 0 && (
          <Polyline
            path={route}
            options={{
              strokeColor: isDarkMode ? '#60A5FA' : '#4285F4', // Lighter blue in dark mode
              strokeOpacity: 0.8,
              strokeWeight: 5,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;