import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Button from '../UI/Button';
import { getAllLocations } from '../../services/locationService';
import api from '../../services/api';

const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

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

  const handleDelete = async (locationID) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await api.delete(`/admin/locations/${locationID}`);
      setLocations(locations.filter(loc => loc.locationID !== locationID));
      alert('Location deleted successfully!');
    } catch (error) {
      console.error('Error deleting location:', error);
      alert('Failed to delete location.');
    }
  };

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Location Management</h1>
          <p className="text-gray-600">Manage campus buildings and points of interest</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Add Location
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-umbc-gold focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Building
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Short Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bike Rack
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLocations.map((location) => (
              <tr key={location.locationID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-500">{location.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-umbc-gold text-black rounded">
                    {location.shortName}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {location.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {location.bikeFeatures?.bikeRackAvailable ? (
                    <span className="text-green-600">✓ {location.bikeFeatures.bikeRackCapacity}</span>
                  ) : (
                    <span className="text-gray-400">✗</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-umbc-blue hover:text-umbc-dark-gold mr-3">
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(location.locationID)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationManager;