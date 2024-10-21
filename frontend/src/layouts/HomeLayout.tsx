import React from 'react';
import MonthlyChart from '../components/Charts/MonthlyChart';
import WeeklyChart from '../components/Charts/WeeklyChart';
import CategoryList from '../components/Categories/CategoryList';

const HomeLayout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-16">
        <div className="flex-grow lg:w-2/3 flex flex-col gap-8 lg:gap-4">
          <MonthlyChart />
          <WeeklyChart />
        </div>
        <div className="lg:w-1/3">
          <CategoryList />
        </div>
      </div>
    </div>
  );
};

export default HomeLayout;