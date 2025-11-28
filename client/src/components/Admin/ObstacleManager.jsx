import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import Button from '../UI/Button';
import api from '../../services/api';

const ObstacleManager = () => {
  const [obstacles, setObstacles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchObstacles();
  }, []);

  const fetchObstacles = async () => {
    try {
      const response = await api.get('/admin/obstacles');
      if (response.data.success) {
        setObstacles(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching obstacles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (obstacleID) => {
    if (!window.confirm('Are you sure you want to remove this obstacle?')) {
      return;
    }

    try {
      await api.delete(`/admin/obstacles/${obstacleID}`);
      setObstacles(obstacles.filter(obs => obs.obstacleID !== obstacleID));
      alert('Obstacle removed successfully!');
    } catch (error) {
      console.error('Error deleting obstacle:', error);
      alert('Failed to remove obstacle.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Obstacle Management</h1>
          <p className="text-gray-600">Manage construction zones and path closures</p>
        </div>
        <Button variant="primary" icon={Plus}>
          Add Obstacle
        </Button>
      </div>

      {/* Obstacles List */}
      <div className="space-y-4">
        {obstacles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <AlertTriangle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600">No active obstacles</p>
          </div>
        ) : (
          obstacles.map((obstacle) => (
            <div key={obstacle.obstacleID} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded">
                      {obstacle.type}
                    </span>
                    {obstacle.isActive && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium mb-2">{obstacle.description}</p>
                  <div className="text-sm text-gray-600">
                    <p>Start: {new Date(obstacle.startDate).toLocaleDateString()}</p>
                    {obstacle.endDate && (
                      <p>End: {new Date(obstacle.endDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(obstacle.obstacleID)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ObstacleManager;