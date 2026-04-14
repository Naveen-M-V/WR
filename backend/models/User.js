import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'company'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    avatar: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);
export default User;
