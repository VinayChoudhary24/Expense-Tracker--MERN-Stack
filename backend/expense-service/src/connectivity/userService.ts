import axios from 'axios';

const USER_SERVICE_URL = 'http://localhost:3001/api';

export const getUserInfo = async (userId: string) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};