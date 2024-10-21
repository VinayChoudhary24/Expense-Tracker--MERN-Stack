import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useExpenses } from '../../hooks/useExpenses';
import { extractWeeklyData } from '../../utils/helpers';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { eventEmitter } from '../../utils/eventEmitter';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyChart: React.FC = () => {
  const { data: expenses = [], isLoading, refetch } = useExpenses();

  useEffect(() => {
    const updateData = () => {
      console.log("Event-Coming");
      refetch();
    };
    eventEmitter.on('expenseAdded', updateData);
    return () => {
      eventEmitter.off('expenseAdded', updateData);
    };
  }, [refetch]);

  const weeklyData: any = extractWeeklyData(expenses);

  const categories = ['Essential Expenses', 'Non-Essential Expenses', 'Miscellaneous', 'Savings and Investments'];

  const datasets = categories.map((category, index) => {
    return {
      label: category,
      data: weeklyData.map((dayData: Record<string, number>) => dayData[category]),
      backgroundColor: ['#27AE60', '#F2C94C', '#BFC5D4', '#005FE4'][index],
    };
  });

  if (isLoading || expenses.length === 0) {
    return (
      <div
        className="bg-white shadow rounded p-4 flex flex-col items-center justify-center"
        style={{
          width: '664px',
          height: '632px',
          boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.25)',
          marginTop: '37px',
          marginLeft: '17px',
          borderRadius: '16px',
        }}
      >
        <svg
          className="w-16 h-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3l18 18M4 7h16M9 11l4 4-4 4M3 12h18"
          ></path>
        </svg>
        <p className="mt-4 text-gray-500">No data available</p>
      </div>
    );
  }

  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: datasets,
  };

  const options = {
    plugins: {
      legend: {
        display: false, // Enable legend for bar descriptions
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            return `${label}: ₹${value}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true, // Enable stacking on the x-axis
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true, // Enable stacking on y-axis
        grid: {
          display: true,
          borderDash: [8, 4],
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function (value: any) {
            return `₹${value}`;
          },
        },
      },
    },
  };

  return (
    <div
      className="bg-white shadow rounded p-4"
      style={{
        width: '664px',
        height: '632px',
        boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.25)',
        marginTop: '37px',
        marginLeft: '17px',
        borderRadius: '16px',
      }}
    >
      <h2 className="text-xl font-bold mb-4">Last Week</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default WeeklyChart;