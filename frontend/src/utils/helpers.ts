interface Expense {
    userId: string;
    description: string;
    amount: number;
    category: string;
    subcategory: string;
    date: string;
  }

  export const extractMonthlyData = (expenses: Expense[]) => {
    const categorySums: Record<string, number> = {
      'Essential Expenses': 0,
      'Non-Essential Expenses': 0,
      'Miscellaneous': 0,
      'Savings and Investments': 0,
    };
    
    expenses.forEach((expense) => {
      if (expense.category in categorySums) {
        categorySums[expense.category] += expense.amount;
      }
    });
  
    const total = Object.values(categorySums).reduce((a, b) => a + b, 0);
  
    return [
      (categorySums['Essential Expenses'] / total) * 100,
      (categorySums['Non-Essential Expenses'] / total) * 100,
      (categorySums['Miscellaneous'] / total) * 100,
      (categorySums['Savings and Investments'] / total) * 100,
    ];
  };
  
  export const extractWeeklyData = (expenses: Expense[]) => {
    // Array for each day, each containing objects for each category
    const categories = ['Essential Expenses', 'Non-Essential Expenses', 'Miscellaneous', 'Savings and Investments'];
    const weeklyData: any = Array(7).fill(null).map(() => {
      return categories.reduce((acc, category) => ({ ...acc, [category]: 0 }), {});
    });
  
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayOfWeek = (date.getDay() + 6) % 7; // Adjusted to start week from Monday
      if (weeklyData[dayOfWeek][expense.category] !== undefined) {
        weeklyData[dayOfWeek][expense.category] += expense.amount;
      }
    });
  
    return weeklyData;
  };