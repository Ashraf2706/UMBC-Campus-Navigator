import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, Navigation, Bike, MapPin, Crosshair } from 'lucide-react';
import MapContainer from './MapContainer';
import BuildingDetailsPanel from '../Building/BuildingDetailsPanel';
import RouteInfoPanel from './RouteInfoPanel';
import ReportObstacleModal from '../Modals/ReportObstacleModal';
import { getAllLocations } from '../../services/locationService';
import { calculateRoute } from '../../services/routeService';

const MapPage = ({ userLocation: propUserLocation }) => {
  const location = useLocation();
  const [locations, setLocations] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [userLocation, setUserLocation] = useState(propUserLocation);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routePath, setRoutePath] = useState([]);
  const [travelMode, setTravelMode] = useState('walking');
  const [loading, setLoading] = useState(true);
  const [activeObstacles, setActiveObstacles] = useState(1);
  const [locationAccuracy, setLocationAccuracy] = useState('high');
  
  // Obstacle reporting states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [mapClickMode, setMapClickMode] = useState(false);
  const [selectedObstacleCoords, setSelectedObstacleCoords] = useState(null);

  useEffect(() => {
    fetchLocations();
    if (!propUserLocation) {
      getUserLocation();
    }
    
    if (location.state?.selectedLocation) {
      setSelectedBuilding(location.state.selectedLocation);
    }
    
    // Check if we should enable map click mode from navigation
    if (location.state?.enableObstacleMode) {
      setMapClickMode(true);
    }
  }, [location.state, propUserLocation]);

  // Update userLocation when prop changes
  useEffect(() => {
    if (propUserLocation) {
      setUserLocation(propUserLocation);
    }
  }, [propUserLocation]);

  const fetchLocations = async () => {
    try {
      const response = await getAllLocations();
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationAccuracy(position.coords.accuracy < 50 ? 'high' : 'low');
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 39.2551, lng: -76.7130 });
          setLocationAccuracy('low');
        }
      );
    }
  };

  const handleGetDirections = async (building) => {
    if (!userLocation) {
      alert('Unable to get your current location. Please enable location services.');
      return;
    }

    try {
      const response = await calculateRoute(
        userLocation.lat,
        userLocation.lng,
        building.coordinates.lat,
        building.coordinates.lng,
        travelMode === 'bicycling'
      );

      if (response.success) {
        setRouteInfo(response.route);
        const decodedPath = decodePolyline(response.route.polyline);
        setRoutePath(decodedPath);
        setSelectedBuilding(null);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try again.');
    }
  };

  const decodePolyline = (encoded) => {
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return poly;
  };

  const handleToggleTravelMode = async (mode) => {
    setTravelMode(mode);
    
    if (routeInfo && userLocation && selectedBuilding) {
      await handleGetDirections(selectedBuilding);
    }
  };

  const handleStartNavigation = () => {
    alert('Turn-by-turn navigation would start here with real-time updates.');
  };

  const handleRecenterMap = () => {
    getUserLocation();
  };

  const handleMapClick = (event) => {
    if (mapClickMode && event.latLng) {
      const coords = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setSelectedObstacleCoords(coords);
      setMapClickMode(false);
      setIsReportModalOpen(true);
    }
  };

  const handleEnableMapClickMode = () => {
    setMapClickMode(true);
    setSelectedBuilding(null);
    setRouteInfo(null);
    setIsReportModalOpen(false);
  };

  const handleMarkerClick = (location) => {
    if (!mapClickMode) {
      setSelectedBuilding(location);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-umbc-gold border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Map Click Mode Banner */}
      {mapClickMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-umbc-gold text-black px-6 py-3 rounded-lg shadow-lg">
          <p className="font-semibold text-center">
            📍 Click on the map where the obstacle is located
          </p>
          <button
            onClick={() => setMapClickMode(false)}
            className="text-sm underline hover:no-underline block text-center mt-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Page Title */}
      {!mapClickMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white px-6 py-3 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">Interactive Campus Map</h1>
          <p className="text-sm text-gray-600 text-center">Explore UMBC campus locations and get directions</p>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-20 right-4 z-30 space-y-2">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => handleToggleTravelMode('walking')}
            className={`w-full px-4 py-3 flex items-center justify-center gap-2 transition-colors border-b ${
              travelMode === 'walking' ? 'bg-umbc-gold text-black font-semibold' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Navigation size={20} />
            <span className="font-medium">Walk</span>
          </button>
          <button
            onClick={() => handleToggleTravelMode('bicycling')}
            className={`w-full px-4 py-3 flex items-center justify-center gap-2 transition-colors ${
              travelMode === 'bicycling' ? 'bg-umbc-gold text-black font-semibold' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Bike size={20} />
            <span className="font-medium">Bike</span>
          </button>
        </div>

        <button onClick={handleRecenterMap} className="w-full bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <Crosshair size={20} className="text-umbc-blue" />
          <span className="font-medium text-gray-700">My Location</span>
        </button>

        <div className={`bg-white rounded-lg shadow-lg p-3 flex items-center gap-2 text-sm ${
          locationAccuracy === 'high' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          <MapPin size={16} />
          <span className="font-medium">{locationAccuracy === 'high' ? 'High' : 'Low'} Accuracy</span>
        </div>
      </div>

      {/* Active Obstacles */}
      {activeObstacles > 0 && (
        <div className="absolute top-80 right-4 z-30">
          <div className="bg-red-500 text-white rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-xs">
            <AlertCircle size={24} className="flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">{activeObstacles} Active Obstacle{activeObstacles !== 1 ? 's' : ''}</p>
              <p className="text-xs text-red-100">Routes may be affected</p>
            </div>
          </div>
        </div>
      )}

      <MapContainer
        locations={locations}
        selectedLocation={selectedBuilding}
        onMarkerClick={handleMarkerClick}
        userLocation={userLocation}
        route={routePath}
        onMapClick={handleMapClick}
        mapClickMode={mapClickMode}
      />

      {selectedBuilding && !routeInfo && !mapClickMode && (
        <BuildingDetailsPanel
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onGetDirections={handleGetDirections}
        />
      )}

      {routeInfo && !mapClickMode && (
        <RouteInfoPanel
          routeInfo={routeInfo}
          onClose={() => {
            setRouteInfo(null);
            setRoutePath([]);
          }}
          onStartNavigation={handleStartNavigation}
          travelMode={travelMode}
          onToggleMode={handleToggleTravelMode}
        />
      )}

      <ReportObstacleModal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setSelectedObstacleCoords(null);
        }}
        selectedCoordinates={selectedObstacleCoords}
        userLocation={userLocation}
        onRequestMapClick={handleEnableMapClickMode}
      />
    </div>
  );
};

export default MapPage;