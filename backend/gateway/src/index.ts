import express from 'express';
import userRoute from './routes/userRoute';
import expenseRoute from './routes/expenseRoute';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes'
import { globalRateLimiter } from './middlewares/rateLimiter';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Use CORS
app.use(cors());

app.use(express.json());

// Use morgan for logging
app.use(morgan(':method :url :status :response-time ms'));

// Apply global rate limiter to all routes
// app.use(globalRateLimiter);

// app.use('/users', userRoute);
// app.use('/expenses', expenseRoute);
// All API routes
app.use(routes);

app.listen(PORT, () => console.log(`Gateway service running on port ${PORT}`));