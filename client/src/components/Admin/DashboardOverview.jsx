import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react';
import { getAllLocations } from '../../services/locationService';
import api from '../../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalLocations: 0,
    activeObstacles: 0,
    pendingFeedback: 0,
    totalRoutes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch locations
      const locationsResponse = await getAllLocations();
      
      // Fetch obstacles
      const obstaclesResponse = await api.get('/admin/obstacles');
      
      // Fetch feedback
      const feedbackResponse = await api.get('/feedback');

      setStats({
        totalLocations: locationsResponse.data?.length || 0,
        activeObstacles: obstaclesResponse.data?.data?.length || 0,
        pendingFeedback: feedbackResponse.data?.data?.filter(f => f.status === 'New').length || 0,
        totalRoutes: 0 // Mock data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Locations',
      value: stats.totalLocations,
      icon: MapPin,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Obstacles',
      value: stats.activeObstacles,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Pending Feedback',
      value: stats.pendingFeedback,
      icon: MessageSquare,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Routes Calculated',
      value: stats.totalRoutes,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-umbc-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your campus navigator.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`${stat.color.replace('bg-', 'text-')} w-6 h-6`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-umbc-gold rounded-lg hover:bg-umbc-gold hover:text-black transition-colors">
            <MapPin className="mx-auto mb-2" size={24} />
            <p className="font-medium">Add Location</p>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <AlertTriangle className="mx-auto mb-2" size={24} />
            <p className="font-medium">Report Obstacle</p>
          </button>
          <button className="p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            <MessageSquare className="mx-auto mb-2" size={24} />
            <p className="font-medium">View Feedback</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;