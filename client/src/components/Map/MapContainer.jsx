import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 39.2551,
  lng: -76.7130
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

const MapContainer = ({ 
  locations = [], 
  selectedLocation, 
  onMarkerClick,
  userLocation,
  route,
  onMapClick 
}) => {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = useCallback((map) => {
    setMap(map);
    setIsLoaded(true);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
    setIsLoaded(false);
  }, []);

  // Fit map bounds when route changes
  useEffect(() => {
    if (map && route && route.length > 0 && isLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      route.forEach(point => {
        bounds.extend(point);
      });
      map.fitBounds(bounds);
    }
  }, [map, route, isLoaded]);

  // Center on selected location
  useEffect(() => {
    if (map && selectedLocation && isLoaded) {
      map.panTo({
        lat: selectedLocation.coordinates.lat,
        lng: selectedLocation.coordinates.lng
      });
      map.setZoom(17);
    }
  }, [map, selectedLocation, isLoaded]);

  // This function now safely checks if google.maps is loaded
  const getBuildingIcon = (type) => {
    // Check if google maps is loaded
    if (!window.google || !window.google.maps) {
      return null; // Return null if not loaded yet
    }

    const colors = {
      'Academic': '#3B82F6',      // Blue
      'Dining': '#F59E0B',        // Orange
      'Recreation': '#10B981',     // Green
      'Residential': '#8B5CF6',    // Purple
      'Administrative': '#6B7280', // Gray
      'Parking': '#EF4444',        // Red
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

  // Check if API key is present
  if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Google Maps API Key Missing
          </h2>
          <p className="text-gray-600 mb-4">
            Please add your Google Maps API key to the .env file:
          </p>
          <code className="block bg-gray-100 p-3 rounded text-sm text-left">
            REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
          </code>
          <p className="text-sm text-gray-500 mt-4">
            Then restart the development server (npm start)
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      loadingElement={
        <div className="h-full flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-umbc-gold border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
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
        {/* Only render markers if Google Maps is loaded */}
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
              onClick={() => onMarkerClick(location)}
              title={location.name}
            />
          ) : null;
        })}

        {/* User Location Marker */}
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

        {/* Route Polyline */}
        {isLoaded && route && route.length > 0 && (
          <Polyline
            path={route}
            options={{
              strokeColor: '#4285F4',
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