import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
// import { IAccount } from './account.model';

export interface ICustomer extends Document {
  name: string;
  email: string;
  password: string;
  accountNumbers: mongoose.Types.ObjectId[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const CustomerSchema: Schema = new mongoose.Schema({
  name: {
    type: String, 
    required: true
  },
  email: {
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  accountNumbers: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref:'Account',
  }]
});

// Password hashing middleware
CustomerSchema.pre<ICustomer>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
CustomerSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
