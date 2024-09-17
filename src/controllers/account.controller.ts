import { Request, Response } from 'express';
import Account from '../models/account.model';
import Customer from '../models/customer.model';
import mongoose from 'mongoose';
import { generateAccountNumber } from '../utils/account.utils';

// create a new account for a customer
export const createAccount = async (req: Request, res: Response) => {
  const { customerId } = req.body;

  try {
    // find the customer by their ID
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // check if customer already has 4 accounts
    if (customer.accountNumbers.length >= 4) {
      return res.status(400).json({ message: 'Maximum 4 accounts allowed per customer' });
    }

    // generate a new 10-digit account number (mock generation logic)
    const accountNumber = generateAccountNumber();

    // create the new account
    const account = new Account({
      accountNumber,
      customerId: customer._id
    });

    // save the new account to the database
    await account.save();

    // add the account's ObjectId to the customer's accountNumbers array
    customer.accountNumbers.push(account._id as mongoose.Types.ObjectId);
    await customer.save();

    res.status(201).json({ message: 'Account created successfully', account });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// get all accounts for a customer
export const getAccountsForCustomer = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    // find the customer by their ID and populate their accounts
    const customer = await Customer.findById(customerId).populate('accountNumbers');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ accounts: customer.accountNumbers });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// get details of a specific account
export const getAccountDetails = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    // find the account by its ID
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.status(200).json(account);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// delete an account for a customer
export const deleteAccount = async (req: Request, res: Response) => {
  const { accountId, customerId } = req.params;

  try {
    // find the account by its ID
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // find the customer and remove the account from their accountNumbers array
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $pull: { accountNumbers: accountId } },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // delete the account from the database
    await account.deleteOne();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
