import mongoose from 'mongoose';

const financeContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  company: String,
  phone: String,
  message: String,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Indexes
financeContactSchema.index({ email: 1 });
financeContactSchema.index({ status: 1 });

const FinanceContact = mongoose.model('FinanceContact', financeContactSchema);
export default FinanceContact;
