import express from 'express';
import { addExpense, getExpenses } from '../controllers/expenseController';

const router = express.Router();

router.post('/api/expenses', addExpense);
router.get('/api/expenses', getExpenses);

export default router;