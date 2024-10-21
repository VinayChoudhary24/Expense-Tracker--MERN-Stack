import axios from 'axios';

const EXPENSE_SERVICE_URL = 'http://localhost:3002/api';

export const getUserExpenses = async (userId: string) => {
  try {
    const response = await axios.get(`${EXPENSE_SERVICE_URL}/expenses`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user expenses:', error);
    throw error;
  }
};