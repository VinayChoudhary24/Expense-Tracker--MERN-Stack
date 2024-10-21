import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Request, Response, NextFunction, Router } from 'express';
import dotenv from 'dotenv';
// import rateLimiter from '../middlewares/rateLimiter';

dotenv.config();

class UsersRoutes {
  public router: Router;
  private api: AxiosInstance;
  private uri: string;
  private module: string;

  constructor() {
    this.uri = process.env.USERS_URI as string; // User service URI
    this.router = Router();
    this.api = axios.create({ baseURL: this.uri });
    this.module = 'User Service';
    this.initRoutes();
  }

  private initRoutes() {
    // Handle POST login
    this.router.post('/api/user/login', async (req: Request, res: Response, next: NextFunction) => {
      try {
        this.api.post(req.path, req.body, {
          headers: req.headers
        })
        .then((response: AxiosResponse) => { 
          console.log("response.data", response.data)
          res.send(response.data); // Send the response back to the client
        })
        .catch((err: any) => next(err));
      } catch (err) {
        next(err);
      }
    });

    // Handle POST register
    // this.router.post('/api/user/register', async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     this.api.post(req.path, req.body, {
    //       headers: req.headers
    //     })
    //     .then((response: AxiosResponse) => { // Correctly typed AxiosResponse
    //       console.log("user-Signup.data", response.data)
    //       res.send(response.data); // Send the response back to the client
    //     })
    //     .catch((err: any) => next(err)); 
    //   } catch (err) {
    //     next(err);
    //   }
    // });
    this.router.post('/api/user/register', async (req: Request, res: Response, next: NextFunction) => {
      console.log("User-Register", req.path)
      try {
        this.api.post(req.path, req.body, {
          headers: req.headers
        })
        .then((response: AxiosResponse) => {
          console.log("user-signup.data", response.data)
          res.send(response.data); // Send the response back to the client
        })
        .catch((err: any) => next(err)); 
      } catch (err) {
        next(err);
      }
    });
  }
}

export default new UsersRoutes().router;