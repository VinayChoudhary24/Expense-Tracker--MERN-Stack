import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpenseModal from '../Expense/AddExpenseModal';
import axiosInstance from '../../utils/axiosConfig';
import { eventEmitter } from '../../utils/eventEmitter';

// Type definition for mapping category names to their respective icons
interface CategoryIconMap {
  [key: string]: string;
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

// Create a map of subcategory names to their corresponding icons
const subcategories: CategoryIconMap = categories.reduce((acc: CategoryIconMap, cat) => {
  cat.subcategories.forEach(sub => acc[sub.name] = sub.icon);
  return acc;
}, {});

// Options available for filtering transactions by category
const filterOptions = ["All", "Food", "Housing", "Utilities", "Healthcare"];

// for displaying the list of categories and transactions
const CategoryList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);

  const fetchExpenses = async () => {
    try {
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

      const url = `/expenses?userId=${encodeURIComponent(userId)}`;
      const response: any = await axiosInstance.get(url);
      setExpenses(response?.data?.response);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  useEffect(() => {
    fetchExpenses(); // Fetch expenses initially when the component mounts

    // Register event listener for the 'expenseAdded' event
    // Set up an event listener for the 'expenseAdded' event to refetch data
    eventEmitter.on('expenseAdded', fetchExpenses);

    // Cleanup on component unmount
    return () => {
      eventEmitter.off('expenseAdded', fetchExpenses);
    };
  }, []);
  // useEffect(() => {
  //   const fetchExpenses = async () => {
  //     try {
  //       // Retrieve the user object from localStorage
  //       const userString = localStorage.getItem('user');
  //       let userId = '';

  //       if (userString) {
  //         try {
  //           const user = JSON.parse(userString);
  //           userId = user.userId; // Assume userId is the key name used
  //         } catch (error) {
  //           console.error('Error parsing user data from localStorage', error);
  //         }
  //       }

  //       // Construct the URL with userId as a query parameter
  //       const url = `/expenses?userId=${encodeURIComponent(userId)}`;

  //       // Make the GET request using Axios
  //       const response: any = await axiosInstance.get(url);
  //       setExpenses(response?.data?.response);
  //     } catch (error) {
  //       console.error('Error fetching expenses:', error);
  //     }
  //   };

  //   fetchExpenses();
  // }, []);

   // Filter transactions based on the selected category and subcategory
  const filteredTransactions = expenses.filter(transaction =>
    (selectedCategory === "All" || !selectedCategory || transaction.subcategory === selectedCategory) &&
    (selectedMainCategory === "All" || categories.find(cat => cat.category === selectedMainCategory)?.subcategories.some(sub => sub.name === transaction.subcategory))
  );

  // Group transactions by date
  const transactionsByDate = filteredTransactions.reduce((acc: Record<string, any[]>, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <div
      className="bg-white shadow rounded p-4 mt-4"
      style={{
        width: '514px',
        height: '1040px',
        boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.25)',
        marginLeft: '-110px',
        marginTop: '0px',
        borderRadius: '16px',
      }}
    >
      <h2 className="text-sm font-bold mb-4 flex justify-between">
        Transactions
        <select onChange={(e) => setSelectedMainCategory(e.target.value)} className="rounded bg-gray-200 p-1">
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat.category} value={cat.category}>{cat.category}</option>
          ))}
        </select>
      </h2>
      <div
        className="text-sm flex gap-2 mb-4"
        style={{
          width: '318px',
          height: '22px',
          marginLeft: '17px',
        }}
      >
        {filterOptions.map(sub => (
          <button
            key={sub}
            onClick={() => setSelectedCategory(sub === "All" ? null : sub)}
            className={`p-0.5 rounded ${selectedCategory === sub ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {sub}
          </button>
        ))}
      </div>
      {Object.entries(transactionsByDate).map(([date, transactions]) => (
        <div key={date} className="mb-4">
          <h3 className="font-semibold">{date}</h3>
          {transactions.map(transaction => (
            <div key={transaction._id} className="flex justify-between mb-2 items-center">
              <div className="flex items-center">
                <span className="mr-2">{subcategories[transaction.subcategory]}</span>
                <div>
                  <p>{transaction.name}</p>
                  <p className="text-sm text-gray-500">{transaction.subcategory}</p>
                </div>
              </div>
              <span className="font-bold">-₹{transaction.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ))}
      <button onClick={() => setShowModal(true)} className="mt-4 bg-blue-500 text-white p-2 rounded">New Expense</button>
      {showModal && <AddExpenseModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default CategoryList;