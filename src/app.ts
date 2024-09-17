import express, { Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.config';
import customerRoutes from './routes/customer.routes'; // Example of routing
import accountRoutes from './routes/account.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

// Create Express App
const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Apply rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api', transactionRoutes);

// Global Error Handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get("/", (req: Request, res:Response) => {
  res.status(200).json({ message: "Hello World" });
});

export default app;
