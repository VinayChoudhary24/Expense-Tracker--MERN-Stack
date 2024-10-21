import { NextFunction, Request, Response } from 'express';
import Expense from '../models/Expense';
import { getUserInfo } from '../connectivity/userService';
import mongoose from 'mongoose';

// export const addExpense = async (req: Request, res: Response) => {
//   const { userId, amount, category, subcategory } = req.body;
//   try {
//     const newExpense = new Expense({ userId, amount, category, subcategory });
//     await newExpense.save();
//     res.status(201).send(newExpense);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };

// Function to add a new expense to the database
export const addExpense = async (req: Request, res: Response, next: NextFunction) => {
  // Destructure required fields from the request body
    const { userId, amount, category, subcategory, date } = req.body;
    console.log("Add-Expense-data",req.body)

    // Check if the userId is a valid ObjectId
  // if (!mongoose.Types.ObjectId.isValid(userId)) {
  //   return res.status(400).send('Invalid userId format');
  // }
  // Use a valid ObjectId for testing (e.g., "507f1f77bcf86cd799439011")
  // const demoId = "507f1f77bcf86cd799439011";

    try {
      // Create a new instance of the Expense model with the provided data
      const newExpense = new Expense({ 
        userId, 
        amount, 
        category, 
        subcategory, 
        date });
      await newExpense.save();
      console.log("newExpense", newExpense)
      res.status(201).json({
        success: 1,
        response: newExpense,
        message: 'Expense added succesfully'
      });
      // res.json()
    } catch (error) {
      console.error('Error saving expense:', error);
      res.status(400).send('Error adding expense');
    }
  };

  // Function to retrieve expenses from the database based on user ID
  export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
    console.log("get_Expenses")
    // Extract the userId from the request query parameters
    const { userId } = req.query;
    console.log("userId", userId)
    // Use a valid ObjectId for testing (e.g., "507f1f77bcf86cd799439011")
    // const demoId = "507f1f77bcf86cd799439011";
    try {
      // Find all expenses that match the given userId
      const expenses = await Expense.find({ userId });
      console.log("All-User-expenses", expenses)
      res.json({
        success: 1,
        response: expenses,
        message: 'Expenses fetched succesfully'
      });
    } catch (error) {
      console.error('Error saving expense:', error);
      res.status(400).send('Error fetching expenses');
    }
};
// export const getExpenses = async (req: Request, res: Response, next: NextFunction) => {
//   console.log("get_Expenses");
//   const { userId } = req.query;

//   try {
//     // Ensure the query uses the correct field name 'userId'
//     const expenses = await Expense.find({ userId: new mongoose.Types.ObjectId(userId as string) });
//     console.log("All-User-expenses", expenses);
//     res.json({
//       success: 1,
//       response: expenses,
//       message: 'Expenses fetched successfully'
//     });
//   } catch (error) {
//     console.error('Error fetching expenses:', error);
//     res.status(400).send('Error fetching expenses');
//   }
// };

export const filterExpenses = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, category, subcategory } = req.query;
    let filter: any = { userId };

    if (category) filter.category = category.toString();
    if (subcategory) filter.subcategory = subcategory.toString();

    // if (category) {
    //     filter?.category = category;
    //   }
    //   if (subcategory) {
    //     filter?.subcategory = subcategory;
    //   }
    try {
      const expenses = await Expense.find(filter);
      res.json(expenses);
    } catch (error) {
      res.status(400).send('Error filtering expenses');
    }
};

export const getExpenseStats = async (req: Request, res: Response) => {
    const { userId, period } = req.query; // period can be 'monthly' or 'weekly'
    const match = { userId };
    const groupBy = period === 'monthly' ? { $month: '$date' } : { $week: '$date' };
  
    try {
      const stats = await Expense.aggregate([
        { $match: match },
        { $group: { _id: groupBy, total: { $sum: '$amount' } } }
      ]);
      res.json(stats);
    } catch (error) {
      res.status(400).send('Error fetching statistics');
    }
};

export const fetchExpenseUserInfo = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const userInfo = await getUserInfo(userId);
      res.status(200).json(userInfo);
    } catch (error) {
      res.status(500).send('Error fetching user information');
    }
};

// Add additional handlers for fetching expenses or filtering