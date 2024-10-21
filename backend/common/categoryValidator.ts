// common/categoryValidator.ts
export const validateCategory = (category: string, subcategory: string) => {
    const categories = [
      {
        category: "Essential Expenses",
        subcategories: ["Housing", "Transportation", "Food", "Utilities and Services", "Healthcare", "Insurance", "Debt Repayments"]
      },
      {
        category: "Non-Essential Expenses",
        subcategories: ["Entertainment and Leisure", "Personal Care", "Clothing and Accessories"]
      },
      {
        category: "Savings and Investments",
        subcategories: ["Savings", "Investments"]
      },
      {
        category: "Miscellaneous",
        subcategories: ["Education and Self-Improvement", "Gifts and Donations", "Miscellaneous"]
      }
    ];
  
    const cat = categories.find(cat => cat.category === category);
    return cat && cat.subcategories.includes(subcategory);
  };