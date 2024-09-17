import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';
import Account from '../models/account.model';

export const createTransaction = async (req: Request, res: Response) => {
  const { fromAccount, toAccount, amount } = req.body;

  try {
    // find sender and receiver accounts
    const senderAccount = await Account.findOne({ accountNumber: fromAccount });
    const receiverAccount = await Account.findOne({ accountNumber: toAccount });

    // check if both accounts exist
    if (!senderAccount || !receiverAccount) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // check if sender has enough balance
    if (senderAccount.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    // deduct amount from sender account
    senderAccount.balance -= amount;
    await senderAccount.save();

    try {
      // add amount to receiver account
      receiverAccount.balance += amount;
      await receiverAccount.save();

      // create the transaction
      const transaction = new Transaction({
        fromAccount,
        toAccount,
        amount,
        type: 'debit',
        status: 'completed',
      });

      await transaction.save();

      return res.status(201).json(transaction);

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
