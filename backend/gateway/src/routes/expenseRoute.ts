import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Request, Response, NextFunction, Router } from 'express';
import dotenv from 'dotenv';
import authenticate from '../middlewares/authentication';

dotenv.config();

class ExpenseRoutes {
  public router: Router;
  private api: AxiosInstance;
  private uri: string;

  constructor() {
    this.uri = process.env.EXPENSES_URI as string; // Expense service URI
    this.router = Router();
    this.api = axios.create({ baseURL: this.uri });
    this.initRoutes();
  }

  private initRoutes() {
    // Handle GET expenses
    this.router.get('/api/expenses', authenticate, async (req: Request, res: Response, next: NextFunction) => {
      console.log("GET_EXPENSES", req.path)
      try {
        console.log("Try-Expenses")
        // Redirecting to the Service
        this.api.get(req.path, { params: req.query })
        .then((response: AxiosResponse) => { 
          console.log("get-expense-response.data", response.data)
          res.send(response.data); // Send the response back to the client
        })
        .catch((err: any) => next(err)); 
      } catch (err) {
        next(err);
      }
    });

    // Handle POST expense
    this.router.post('/api/expenses', authenticate, async (req: Request, res: Response, next: NextFunction) => {
      console.log("Add-Expenses", req.path)
      try {
        this.api.post(req.path, req.body, {
          headers: req.headers
        })
        .then((response: AxiosResponse) => { 
          console.log("add-expense-response.data", response.data)
          res.send(response.data); // Send the response back to the client
        })
        .catch((err: any) => next(err)); 
      } catch (err) {
        next(err);
      }
    });
  }
}

export default new ExpenseRoutes().router;