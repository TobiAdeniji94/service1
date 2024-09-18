import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';
import Account from '../models/account.model';

export const createTransaction = async (req: Request, res: Response) => {
  const { fromAccount, toAccount, amount } = req.body;

  try {
    // Find sender and receiver accounts
    const senderAccount = await Account.findOne({ accountNumber: fromAccount });
    const receiverAccount = await Account.findOne({ accountNumber: toAccount });

    // Check if both accounts exist
    if (!senderAccount || !receiverAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if sender has enough balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Deduct amount from sender's account
    senderAccount.balance -= amount;
    await senderAccount.save();

    try {
      // Add amount to receiver's account
      receiverAccount.balance += amount;
      await receiverAccount.save();

      // Create the transaction for both sender and receiver
      const debitTransaction = new Transaction({
        fromAccount,
        toAccount,
        amount,
        type: 'debit', // Debit for sender
        status: 'completed',
      });

      const creditTransaction = new Transaction({
        fromAccount,
        toAccount,
        amount,
        type: 'credit', // Credit for receiver
        status: 'completed',
      });

      // Save both transactions
      await debitTransaction.save();
      await creditTransaction.save();

      return res.status(201).json({ debitTransaction, creditTransaction });

    } catch (creditError) {
      // If crediting receiver fails, revert the deduction from sender
      senderAccount.balance += amount;
      await senderAccount.save();

      return res.status(500).json({
        message: 'Failed to credit receiver, funds have been reverted',
        error: creditError,
      });
    }

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


// get all transactions for an account
export const getTransactions = async (req: Request, res: Response) => {
  const { accountNumber } = req.params;

  try {
    const transactions = await Transaction.find({
      $or: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
    }).sort({ createdAt: -1 });

    if (!transactions) {
      return res.status(404).json({ message: 'Transactions not found' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
