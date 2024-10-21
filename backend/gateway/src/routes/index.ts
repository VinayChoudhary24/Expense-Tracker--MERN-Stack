import { Router } from 'express';
import UsersRoutes from './userRoute';
import ExpenseRoutes from './expenseRoute';

const router = Router();

router.use(UsersRoutes);
router.use(ExpenseRoutes);

export default router;