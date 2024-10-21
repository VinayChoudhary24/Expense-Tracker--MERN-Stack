// expense-service/src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import expenseRoutes from './routes/expenseRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
if (!MONGO_URI) {
    throw new Error("MONGO_URI must be defined in the environment variables");
  }
  
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

  // Use CORS
app.use(cors());

app.use(express.json());

// Use morgan for logging
app.use(morgan(':method :url :status :response-time ms'));

// Prefix routes to match gateway requests
app.use('/', expenseRoutes);

app.listen(PORT, () => console.log(`Expense service running on port ${PORT}`));