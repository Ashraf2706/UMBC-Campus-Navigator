const axios = require('axios');

// Cache for route calculations to reduce API calls
const routeCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generate cache key from coordinates
const getCacheKey = (startLat, startLng, endLat, endLng, bikeMode) => {
  // Round to 4 decimal places (~11 meters precision) for cache hits
  const roundCoord = (coord) => Math.round(coord * 10000) / 10000;
  return `${roundCoord(startLat)},${roundCoord(startLng)}-${roundCoord(endLat)},${roundCoord(endLng)}-${bikeMode}`;
};

const calculateRoute = async (startLat, startLng, endLat, endLng, bikeMode = false) => {
  try {
    // Validate inputs
    if (!startLat || !startLng || !endLat || !endLng) {
      throw new Error('Invalid coordinates provided');
    }

    // Check if coordinates are reasonable
    if (Math.abs(startLat) > 90 || Math.abs(endLat) > 90 || 
        Math.abs(startLng) > 180 || Math.abs(endLng) > 180) {
      throw new Error('Coordinates out of valid range');
    }

    // Check cache first
    const cacheKey = getCacheKey(startLat, startLng, endLat, endLng, bikeMode);
    const cached = routeCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log('Returning cached route');
      return cached.data;
    }

    // Google Maps API configuration
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    
    const params = {
      origin: `${startLat},${startLng}`,
      destination: `${endLat},${endLng}`,
      mode: bikeMode ? 'bicycling' : 'walking',
      key: process.env.GOOGLE_MAPS_API_KEY,
      units: 'imperial',
      alternatives: false,
      optimize: true
    };

    console.log('Requesting route from Google Maps API...');
    console.log('From:', params.origin, 'To:', params.destination, 'Mode:', params.mode);

    // Make API request with timeout
    const response = await axios.get(url, { 
      params,
      timeout: 10000
    });

    console.log('Google Maps API Status:', response.data.status);

    // Handle API response status
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('No route found between these locations');
    }

    if (response.data.status === 'NOT_FOUND') {
      throw new Error('One or more locations could not be found');
    }

    if (response.data.status === 'INVALID_REQUEST') {
      throw new Error('Invalid request to Google Maps API');
    }

    if (response.data.status === 'OVER_QUERY_LIMIT') {
      throw new Error('Google Maps API quota exceeded. Please try again later.');
    }

    if (response.data.status === 'REQUEST_DENIED') {
      throw new Error('Google Maps API request denied. Check API key configuration.');
    }

    if (response.data.status === 'UNKNOWN_ERROR') {
      throw new Error('Google Maps server error. Please try again.');
    }

    if (response.data.status !== 'OK') {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    if (!route || !leg) {
      throw new Error('Invalid route data received from Google Maps');
    }

    // Process steps
    const processedSteps = leg.steps.map(step => {
      let instruction = step.html_instructions
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

      return {
        instruction,
        distance: step.distance.text,
        duration: step.duration.text,
        startLocation: step.start_location,
        endLocation: step.end_location
      };
    });

    const routeData = {
      success: true,
      route: {
        distance: leg.distance.value,
        duration: leg.duration.value,
        distanceText: leg.distance.text,
        durationText: leg.duration.text,
        steps: processedSteps,
        polyline: route.overview_polyline.points,
        bikeMode: bikeMode,
        startAddress: leg.start_address,
        endAddress: leg.end_address,
        bounds: route.bounds
      }
    };

    // Cache the result
    routeCache.set(cacheKey, {
      data: routeData,
      timestamp: Date.now()
    });

    if (routeCache.size > 100) {
      const oldestKey = routeCache.keys().next().value;
      routeCache.delete(oldestKey);
    }

    console.log('Route calculated successfully:', {
      distance: routeData.route.distanceText,
      duration: routeData.route.durationText,
      steps: routeData.route.steps.length
    });

    return routeData;

  } catch (error) {
    console.error('Google Maps API Error:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Google Maps. Please check your internet connection.');
    }

    if (axios.isAxiosError(error)) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }

    throw error;
  }
};

const clearCache = () => {
  routeCache.clear();
  console.log('Route cache cleared');
};

module.exports = { calculateRoute, clearCache };