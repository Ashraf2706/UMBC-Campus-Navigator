import React, { useState, useEffect } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import api from '../../services/api';

const FeedbackManager = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await api.get('/feedback');
      if (response.data.success) {
        setFeedback(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Reviewed': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Management</h1>
        <p className="text-gray-600">Review and respond to user feedback</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex gap-2">
          {['all', 'New', 'Reviewed', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-umbc-gold text-black'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status}
              <span className="ml-2 text-sm">
                ({feedback.filter(f => status === 'all' || f.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600">No feedback to display</p>
          </div>
        ) : (
          filteredFeedback.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                    {item.issueType}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-gray-900 mb-4">{item.description}</p>
              {item.locationID && (
                <p className="text-sm text-gray-600 mb-4">Location: {item.locationID}</p>
              )}
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-umbc-gold text-black rounded-lg hover:bg-umbc-dark-gold transition-colors text-sm font-medium">
                  Mark as Reviewed
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                  Mark as Resolved
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeedbackManager;