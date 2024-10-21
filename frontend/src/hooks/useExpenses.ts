import { useQuery, UseQueryResult } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';

interface Expense {
    userId: string;
    description: string;
    amount: number;
    category: string;
    subcategory: string;
    date: string;
  }
  
  export const useExpenses = (): UseQueryResult<Expense[], unknown> => {
    return useQuery<Expense[], unknown>('expenses', async (): Promise<Expense[]> => {
      // Retrieve the user object from localStorage
      const userString = localStorage.getItem('user');
      let userId = '';
  
      if (userString) {
        try {
          const user = JSON.parse(userString);
          userId = user.userId;
        } catch (error) {
          console.error('Error parsing user data from localStorage', error);
        }
      }
  
      // Construct the request URL with userId as a query parameter
      const requestUrl = `/expenses?userId=${encodeURIComponent(userId)}`;
  
      // Make GET request to the backend with userId query parameter
      const response: any = await await axiosInstance.get<Expense[]>(requestUrl);
      
      let data: Expense[] = [];
      if (response.data) {
        if (response.data.success === 1) {
          data = response.data.response;
        }
      }
  
      console.log("use-expense-response", data);
      return data;
    });
  };