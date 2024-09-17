import { Router } from 'express';
import { createTransaction, getTransactions } from '../controllers/transaction.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// route to create a transaction
router.post('/transactions', authMiddleware, createTransaction);

// route to get transactions by account number
router.get('/transactions/:accountNumber', authMiddleware, getTransactions);

export default router;
