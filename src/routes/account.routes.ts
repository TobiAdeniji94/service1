import { Router } from 'express';
import { createAccount, getAccountsForCustomer, getAccountDetails, deleteAccount } from '../controllers/account.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

// create a new account for a customer
/**
 * @openapi
 * '/api/accounts/create':
 * post:
 *      tags:
 *      - Account
 *      summary: Create an Account
 *      
 */
router.post('/create', authMiddleware, createAccount);

// get all accounts of a customer using customer ID
router.get('/:customerId', authMiddleware, getAccountsForCustomer);

// get details of a specific account using account ID
router.get('/accountId/:accountId', authMiddleware, getAccountDetails);

// delete account
router.delete('/:customerId/:accountId', authMiddleware, deleteAccount);

export default router;
