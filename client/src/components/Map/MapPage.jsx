import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, Navigation, Bike, MapPin, Crosshair, RefreshCw, Menu, X } from 'lucide-react';
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
  const [routeLoading, setRouteLoading] = useState(false);
  const [activeObstacles, setActiveObstacles] = useState(1);
  const [locationAccuracy, setLocationAccuracy] = useState('high');
  const [locationError, setLocationError] = useState(null);
  const watchIdRef = useRef(null);
  
  // Mobile-specific states
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Obstacle reporting states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [mapClickMode, setMapClickMode] = useState(false);
  const [selectedObstacleCoords, setSelectedObstacleCoords] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetchLocations();
    if (!propUserLocation) {
      getUserLocationHighAccuracy();
    }
    
    if (location.state?.selectedLocation) {
      setSelectedBuilding(location.state.selectedLocation);
    }
    
    if (location.state?.enableObstacleMode) {
      setMapClickMode(true);
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      window.removeEventListener('resize', checkMobile);
    };
  }, [location.state, propUserLocation]);

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

  const getUserLocationHighAccuracy = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUserLocation({ lat: 39.2551, lng: -76.7130 });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setLocationAccuracy(position.coords.accuracy < 20 ? 'high' : position.coords.accuracy < 50 ? 'medium' : 'low');
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to get your location';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocationError(errorMessage);
        setUserLocation({ lat: 39.2551, lng: -76.7130 });
        setLocationAccuracy('low');
      },
      options
    );

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setLocationAccuracy(position.coords.accuracy < 20 ? 'high' : position.coords.accuracy < 50 ? 'medium' : 'low');
      },
      null,
      options
    );
  };

  const handleGetDirections = async (building) => {
    if (!userLocation) {
      alert('Unable to get your current location. Please enable location services.');
      return;
    }

    if (locationAccuracy === 'low') {
      const confirm = window.confirm(
        'Your location accuracy is low. Directions may not be precise. Continue?'
      );
      if (!confirm) return;
    }

    setRouteLoading(true);
    setRouteInfo(null);
    setRoutePath([]);
    setMobileControlsOpen(false);

    try {
      const response = await calculateRoute(
        userLocation.lat,
        userLocation.lng,
        building.coordinates.lat,
        building.coordinates.lng,
        travelMode === 'bicycling'
      );

      if (response.success && response.route) {
        setRouteInfo(response.route);
        
        try {
          const decodedPath = decodePolyline(response.route.polyline);
          if (decodedPath.length > 0) {
            setRoutePath(decodedPath);
          } else {
            throw new Error('Empty route path');
          }
        } catch (decodeError) {
          setRoutePath([
            { lat: userLocation.lat, lng: userLocation.lng },
            { lat: building.coordinates.lat, lng: building.coordinates.lng }
          ]);
        }
        
        setSelectedBuilding(null);
      } else {
        throw new Error('Failed to calculate route');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      alert('Failed to calculate route. Please try again.');
    } finally {
      setRouteLoading(false);
    }
  };

  const decodePolyline = (encoded) => {
    if (!encoded) throw new Error('No polyline to decode');

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
    getUserLocationHighAccuracy();
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
      if (isMobile) {
        setMobileControlsOpen(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-umbc-gold border-t-transparent mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }

  const getAccuracyColor = () => {
    switch(locationAccuracy) {
      case 'high': return 'text-green-600 dark:text-green-400';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'low': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getAccuracyText = () => {
    if (isMobile) {
      switch(locationAccuracy) {
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'low': return 'Low';
        default: return 'Unknown';
      }
    }
    switch(locationAccuracy) {
      case 'high': return 'High Accuracy (<20m)';
      case 'medium': return 'Medium Accuracy (20-50m)';
      case 'low': return 'Low Accuracy (>50m)';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Map Click Mode Banner */}
      {mapClickMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-umbc-gold text-black px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg max-w-xs md:max-w-none">
          <p className="font-semibold text-center text-sm md:text-base">
            📍 Click on the map where the obstacle is
          </p>
          <button
            onClick={() => setMapClickMode(false)}
            className="text-xs md:text-sm underline hover:no-underline block text-center mt-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Desktop Page Title */}
      {!mapClickMode && !isMobile && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Campus Map</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Explore UMBC campus locations and get directions</p>
        </div>
      )}

      {/* Mobile Header */}
      {!mapClickMode && isMobile && (
        <div className="absolute top-2 left-2 right-2 z-40 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white text-center">Campus Map</h1>
        </div>
      )}

      {/* Location Error Alert */}
      {locationError && (
        <div className={`absolute ${isMobile ? 'top-16' : 'top-24'} left-1/2 transform -translate-x-1/2 z-40 bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg max-w-xs md:max-w-md`}>
          <p className="text-xs md:text-sm font-medium">{locationError}</p>
          <button
            onClick={handleRecenterMap}
            className="text-xs underline hover:no-underline mt-1"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Route Loading Overlay */}
      {routeLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 px-6 md:px-8 py-4 md:py-6 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 md:gap-4">
            <RefreshCw className="animate-spin text-umbc-gold" size={isMobile ? 24 : 32} />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">Calculating Route...</p>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Please wait</p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Controls */}
      {!isMobile && (
        <div className="absolute top-20 right-4 z-30 space-y-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleToggleTravelMode('walking')}
              className={`w-full px-4 py-3 flex items-center justify-center gap-2 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                travelMode === 'walking' ? 'bg-umbc-gold text-black font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Navigation size={20} />
              <span className="font-medium">Walk</span>
            </button>
            <button
              onClick={() => handleToggleTravelMode('bicycling')}
              className={`w-full px-4 py-3 flex items-center justify-center gap-2 transition-colors ${
                travelMode === 'bicycling' ? 'bg-umbc-gold text-black font-semibold' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Bike size={20} />
              <span className="font-medium">Bike</span>
            </button>
          </div>

          <button 
            onClick={handleRecenterMap} 
            className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700"
          >
            <Crosshair size={20} className="text-umbc-blue dark:text-umbc-gold" />
            <span className="font-medium text-gray-700 dark:text-gray-300">Refresh Location</span>
          </button>

          <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center gap-2 text-sm ${getAccuracyColor()} border border-gray-200 dark:border-gray-700`}>
            <MapPin size={16} />
            <span className="font-medium">{getAccuracyText()}</span>
          </div>
        </div>
      )}

      {/* Mobile FAB */}
      {isMobile && !selectedBuilding && !routeInfo && (
        <button
          onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
          className="absolute bottom-6 right-6 z-40 bg-umbc-gold text-black p-4 rounded-full shadow-2xl active:scale-95 transition-transform"
        >
          {mobileControlsOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Mobile Controls Sheet */}
      {isMobile && mobileControlsOpen && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl pb-safe border-t border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Map Controls</h2>
          </div>
          
          <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Travel Mode</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleToggleTravelMode('walking');
                    setMobileControlsOpen(false);
                  }}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                    travelMode === 'walking' ? 'bg-umbc-gold text-black' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Navigation size={20} />
                  <span className="font-medium">Walk</span>
                </button>
                <button
                  onClick={() => {
                    handleToggleTravelMode('bicycling');
                    setMobileControlsOpen(false);
                  }}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 ${
                    travelMode === 'bicycling' ? 'bg-umbc-gold text-black' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Bike size={20} />
                  <span className="font-medium">Bike</span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Location</p>
              <button
                onClick={() => {
                  handleRecenterMap();
                  setMobileControlsOpen(false);
                }}
                className="w-full bg-umbc-blue dark:bg-umbc-gold text-white dark:text-black p-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Crosshair size={20} />
                <span className="font-medium">Refresh Location</span>
              </button>
              
              <div className={`mt-2 p-2 rounded-lg flex items-center gap-2 text-sm ${getAccuracyColor()} bg-gray-50 dark:bg-gray-700/50`}>
                <MapPin size={16} />
                <span className="font-medium">Accuracy: {getAccuracyText()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Obstacles Warning */}
      {activeObstacles > 0 && !isMobile && (
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
          isMobile={isMobile}
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
          isMobile={isMobile}
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