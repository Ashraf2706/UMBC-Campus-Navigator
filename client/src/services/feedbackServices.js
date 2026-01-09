import api from './api';

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const submitObstacleReport = async (obstacleData) => {
  const response = await api.post('/feedback/obstacle', obstacleData);
  return response.data;
};