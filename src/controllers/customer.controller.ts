import mongoose, { Document, Types } from 'mongoose';
import { Request, Response } from 'express';
import Customer from '../models/customer.model';
import Account from '../models/account.model';
import jwt from 'jsonwebtoken';
import { generateAccountNumber } from '../utils/account.utils';

interface MyRequest extends Request {
    customerId?: string;
}

// register a new customer
export const registerCustomer = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // create new customer
    const customer = new Customer({ name, email, password });
    await customer.save();

    // create one default account
    const accountNumber = generateAccountNumber();
    const account = new Account({
        customerId: customer._id,
        accountNumber,
    })
    await account.save();

    // link account to customer
    customer.accountNumbers.push(account._id as mongoose.Types.ObjectId);
    await customer.save();

    // generate a JWT token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    res.status(201).json({ token, customer, account });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// customer login
export const loginCustomer = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // find the customer by email
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // compare passwords
    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // generate JWT token
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    // console.log('Generated Token:', token);

    res.status(200).json({ token, customer });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// get customer details (for authenticated users)
export const getCustomerDetails = async (req: MyRequest, res: Response) => {
    try {
      // console.log('customer id from token', req.customerId)
      const customer = await Customer.findById(req.customerId).select('-password');
      // console.log('found customer:', customer)

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      res.status(200).json(customer);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ message: 'Server error', error: err.message });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  };

// get all customers
export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    // Retrieve all customers from the database
    const customers = await Customer.find().select('-password'); // Exclude passwords from the response

    if (customers.length === 0) {
      return res.status(404).json({ message: 'No customers found' });
    }

    res.status(200).json(customers);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};
  
// delete a customer and associated accounts using customerId from params
export const deleteCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    // find the customer by ID
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // delete all associated accounts
    await Account.deleteMany({ customerId });

    // delete the customer
    await Customer.findByIdAndDelete(customerId);

    res.status(200).json({ message: 'Customer and associated accounts deleted successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};
