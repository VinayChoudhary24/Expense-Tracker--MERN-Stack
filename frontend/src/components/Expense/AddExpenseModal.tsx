import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { eventEmitter } from '../../utils/eventEmitter';
import axiosInstance from '../../utils/axiosConfig';

interface FormData {
  description: string;
  amount: number;
  category: string;
  subcategory: string;
  userId: string; // Add userId to the form data structure
}

const categories = [
  {
    category: "Essential Expenses",
    subcategories: [
      { name: "Housing", icon: "🏠" },
      { name: "Transportation", icon: "🚗" },
      { name: "Food", icon: "🍔" },
      { name: "Utilities and Services", icon: "💡" },
      { name: "Healthcare", icon: "⚕️" },
      { name: "Insurance", icon: "📑" },
      { name: "Debt Repayments", icon: "💳" }
    ]
  },
  {
    category: "Non-Essential Expenses",
    subcategories: [
      { name: "Entertainment and Leisure", icon: "🎉" },
      { name: "Personal Care", icon: "💅" },
      { name: "Clothing and Accessories", icon: "👗" }
    ]
  },
  {
    category: "Savings and Investments",
    subcategories: [
      { name: "Savings", icon: "💰" },
      { name: "Investments", icon: "📈" }
    ]
  },
  {
    category: "Miscellaneous",
    subcategories: [
      { name: "Education and Self-Improvement", icon: "🎓" },
      { name: "Gifts and Donations", icon: "🎁" },
      { name: "Miscellaneous", icon: "🛠️" }
    ]
  }
];

const AddExpenseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();
  const watchCategory = watch('category', 'Essential Expenses');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const userString = localStorage.getItem('user');
    let userId;
    if (userString) {
        // Parse the JSON string to an object
        const user = JSON.parse(userString);
    
        // Access userId from the parsed object
        userId = user.userId;
    
        // Now you can use userId as needed
        console.log('User ID:', userId);
    }

    // if (!userId) {
    //   alert('User not logged in');
    //   navigate('/login');
    //   return;
    // }

    try {
      // await axios.post('http://localhost:8000/api/expenses', { ...data, userId });
      await axiosInstance.post('/expenses', { ...data, userId });
      // alert('Expense added successfully');
      toast.success("Expense added successfully");

      // Emit an event to notify observers
      eventEmitter.emit('expenseAdded');

      reset();
      onClose();
    } catch (error) {
      // console.log("Add-expense-data", data)
      // alert('Error adding expense');
      toast.error("Error adding expense");
    }
  };

  const currentSubcategories = categories.find(cat => cat.category === watchCategory)?.subcategories || [];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded p-6 shadow-lg w-80">
      <div className="flex justify-end">
      <button onClick={onClose} className="text-right mb-4">✖</button>
       </div>
        {/* <button onClick={onClose} className="text-right block mb-4">✖</button> */}
        <h2 className="text-xl font-semibold mb-4">New Expense</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register('description', { required: 'Description is required' })}
            placeholder="What did you spend on?"
            className="mb-2 p-2 border rounded w-full"
          />
          {errors.description && <p className="text-red-500">{errors.description.message}</p>}

          <input
            type="number"
            {...register('amount', { required: 'Amount is required', min: 1 })}
            placeholder="Amount"
            className="mb-2 p-2 border rounded w-full"
          />
          {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}

          <select
            {...register('category')}
            className="mb-2 p-2 border rounded w-full"
          >
            {categories.map(cat => (
              <option key={cat.category} value={cat.category}>{cat.category}</option>
            ))}
          </select>

          <select
            {...register('subcategory')}
            className="mb-2 p-2 border rounded w-full"
          >
            {currentSubcategories.map(sub => (
              <option key={sub.name} value={sub.name}>{sub.name}</option>
            ))}
          </select>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;