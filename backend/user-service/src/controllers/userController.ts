import { NextFunction, Request, Response } from 'express';
import User from '../models/User';
import { getUserExpenses } from '../connectivity/expenseService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// export const registerUser = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   try {
//     const newUser = new User({ email, password });
//     await newUser.save();
//     res.status(201).send(newUser);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// };
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      // Hash the given password using bcrypt with a saltRounds value of 10
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
      res.status(201).send({
        success: 1,
        response: newUser,
        message: 'User registered'
      });
    } catch (error) {
      console.log("user-signup-err", error)
      res.status(400).send('Error registering user');
    }
  };

  export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
  
      // Check if the user exists and if the provided password matches the stored hashed password
      if (user && await bcrypt.compare(password, user.password)) {
        // Optionally, you can generate a token here
        // const token = jwt.sign({ userId: user._id });

        // Exclude password from the user object
        const { password, ...userWithoutPassword } = user.toObject();
        
        res.status(200).json({
          success: 1,
          response: userWithoutPassword,
          message: 'Login successful',
        });
      } else {
        res.status(401).json({
          success: 0,
          message: 'Invalid credentials',
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({
        success: 0,
        message: 'Error logging in',
      });
    }
  };

export const fetchUserExpenses = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const expenses = await getUserExpenses(userId);
      res.status(200).json(expenses);
    } catch (error) {
      res.status(500).send('Error fetching expenses');
    }
};

// Add login handler if needed