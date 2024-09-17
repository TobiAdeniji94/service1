import mongoose, { Schema, Document } from 'mongoose';
import { ICustomer } from './customer.model';

export interface IAccount extends Document {
  customerId: mongoose.Types.ObjectId | ICustomer;
  accountNumber: string;
  accountType: string;
  balance: number;
}

const accountSchema: Schema = new Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true
  },

  accountNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },

  accountType: {
    type: String,
    enum: ['savings', 'current'],
    default: 'savings'
  },

  balance: {
    type: Number,
    required: true,
    default: 5000 
  },
});

const Account = mongoose.model<IAccount>('Account', accountSchema);

export default Account;