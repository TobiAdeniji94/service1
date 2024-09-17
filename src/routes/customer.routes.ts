import { Router } from 'express';
import { registerCustomer, loginCustomer, getCustomerDetails } from '../controllers/customer.controller';
import authMiddleware from '../middlewares/auth.middleware'; // Authentication middleware

const router = Router();

// register a new customer
router.post('/register', registerCustomer);

// route for customer login
router.post('/login', loginCustomer);

// get customer details (protected route)
router.get('/me', authMiddleware, getCustomerDetails);

export default router;
