import React, { useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { useExpenses } from '../../hooks/useExpenses';
import { extractMonthlyData } from '../../utils/helpers';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { eventEmitter } from '../../utils/eventEmitter';

// Register chart elements and plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const MonthlyChart: React.FC = () => {
  // Destructure properties returned from the useExpenses hook
  const { data: expenses = [], isLoading, refetch  } = useExpenses();

  // Effect to refetch expenses when the 'expenseAdded' event is emitted
  useEffect(() => {
    const updateData = () => {
      console.log("Event-Coming")
      refetch();
    };
    eventEmitter.on('expenseAdded', updateData);
    return () => {
      eventEmitter.off('expenseAdded', updateData);
    };
  }, [refetch]); // Dependency on refetch to ensure the effect is updated accordingly

  // Extract and calculate monthly data from expenses
  const monthlyData = expenses.length > 0 ? extractMonthlyData(expenses) : [];
  // Calculate total amounts in each category
  const categorySums: Record<string, number> = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // Compile data array for chart display based on predefined categories
  const currencyData = expenses.length > 0 ? [
    categorySums['Essential Expenses'] || 0,
    categorySums['Non-Essential Expenses'] || 0,
    categorySums['Miscellaneous'] || 0,
    categorySums['Savings and Investments'] || 0,
  ] : [];

  // if (isLoading) return <p>Loading...</p>;

  if (isLoading || expenses.length === 0) {
    return (
      <div
        className="bg-white shadow rounded p-4 flex flex-col items-center justify-center"
        style={{
          width: '664px',
          height: '355px',
          boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.25)',
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
    labels: ['Essential', 'Non-Essential', 'Miscellaneous', 'Savings'],
    datasets: [
      {
        data: monthlyData,
        backgroundColor: ['#27AE60', '#F2C94C', '#BFC5D4', '#005FE4'],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  const options = {
    cutout: '50%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return value > 0 ? `${label}: ${value.toFixed(2)}%` : '';
          },
        },
      },
      datalabels: {
        display: true,
        color: 'black',
        formatter: (value: number) => (value > 0 ? `${value.toFixed(2)}%` : ''),
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 flex lg:flex-row"
      style={{
        width: '664px',
        height: '355px',
        boxShadow: '2px 4px 8px 2px rgba(0, 0, 0, 0.25)',
        marginLeft: '17px',
        borderRadius: '16px',
      }}
    >
      <div style={{ flex: '1', width: '280px', height: '280px' }}>
        <h2 className="text-lg font-bold mb-4" style={{ marginLeft: '16px' }}>
          This month
        </h2>
        <Pie data={data} options={options} />
      </div>
      <div
        className="flex flex-col justify-center ml-4"
        style={{
          width: '157px',
          height: '154px',
          marginTop: '99px',
          borderRadius: '5px',
        }}
      >
        {data.labels.map((label, index) => (
          <div key={label} className="flex flex-col items-start mb-2" 
          style={{ width: '147px', height: '36px', borderRadius: '5px' }}>
            <div className="flex items-center" style={{ width: '147px', height: '36px' }}>
              <div 
              style={{ width: '32px', height: '32px', backgroundColor: data.datasets[0].backgroundColor[index], marginRight: '8px', borderRadius: '5px' }}></div>
              <span className="text-gray-700" style={{ lineHeight: '36px', marginTop: '-17px', marginLeft: '8px' }}>{label}</span>
            </div>
            <span className="text-gray-500" style={{ paddingLeft: '40px', marginTop: '-17px', marginLeft: '8px' }}>
              {currencyData[index] ? `₹${currencyData[index].toLocaleString()}` : '₹0'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyChart;