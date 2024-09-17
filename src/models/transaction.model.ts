import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  fromAccount: string;
  toAccount: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const TransactionSchema: Schema = new Schema({
  fromAccount: {
    type: String,
    required: true,
  },
  toAccount: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
