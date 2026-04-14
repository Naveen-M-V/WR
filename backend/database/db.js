// MongoDB database layer using Mongoose
// Replaces the previous in-memory database with persistent MongoDB storage

import mongoose from 'mongoose';
import {
  User,
  Company,
  Content,
  OTP,
  FinanceContact,
  PasswordReset,
  AuditLog,
  NewsletterSubscriber
} from '../models/index.js';

const invalidObjectIdError = (value) => {
  const err = new Error(`Invalid ObjectId: ${value}`);
  err.code = 'INVALID_OBJECT_ID';
  err.status = 400;
  return err;
};

const toObjectId = (id) => {
  const stringId = String(id || '').trim();
  if (!mongoose.Types.ObjectId.isValid(stringId)) return null;
  return new mongoose.Types.ObjectId(stringId);
};

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/which-renewables';
    
    await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('[DB] MongoDB connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[DB] MongoDB disconnected. Attempting to reconnect...');
    });

    return true;
  } catch (err) {
    console.error('[DB] Failed to connect to MongoDB:', err.message);
    throw err;
  }
};

// Make ID helper (MongoDB uses ObjectId, but we can keep string IDs for compatibility)
const makeId = () => `${Date.now().toString()}-${Math.random().toString(16).slice(2)}`;

// ============================
// User Operations
// ============================

export const createUser = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
    return user.toObject();
  } catch (err) {
    console.error('[DB] Error creating user:', err.message);
    throw err;
  }
};

export const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    return user;
  } catch (err) {
    console.error('[DB] Error finding user by email:', err.message);
    return null;
  }
};

export const findUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ username: username.toLowerCase() }).lean();
    return user;
  } catch (err) {
    console.error('[DB] Error finding user by username:', err.message);
    return null;
  }
};

export const findUserById = async (id) => {
  try {
    const objectId = toObjectId(id);
    if (!objectId) throw invalidObjectIdError(id);
    const user = await User.findById(objectId).lean();
    return user;
  } catch (err) {
    if (err.code === 'INVALID_OBJECT_ID') throw err;
    console.error('[DB] Error finding user by id:', err.message);
    return null;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const objectId = toObjectId(id);
    if (!objectId) throw invalidObjectIdError(id);
    const user = await User.findByIdAndUpdate(
      objectId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();
    return user;
  } catch (err) {
    if (err.code === 'INVALID_OBJECT_ID') throw err;
    console.error('[DB] Error updating user:', err.message);
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const users = await User.find().lean();
    return users;
  } catch (err) {
    console.error('[DB] Error getting all users:', err.message);
    return [];
  }
};

// ============================
// OTP Operations
// ============================

export const storeOTP = async (email, otp) => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const normalizedEmail = email.toLowerCase();
    
    // Delete any existing OTP for this email
    await OTP.deleteOne({ email: normalizedEmail });
    
    // Create new OTP
    await OTP.create({
      email: normalizedEmail,
      code: otp,
      expiresAt
    });
    
    console.log(`[OTP] Stored OTP for ${normalizedEmail}: ${otp}`);
    return true;
  } catch (err) {
    console.error('[DB] Error storing OTP:', err.message);
    return false;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const normalizedEmail = email.toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail }).lean();

    console.log(`[OTP] Verifying OTP for ${normalizedEmail}`);
    console.log(`[OTP] Stored OTP data:`, otpRecord);
    console.log(`[OTP] Provided OTP: ${otp}`);

    if (!otpRecord) {
      console.log(`[OTP] OTP not found for ${normalizedEmail}`);
      return { valid: false, message: 'OTP not found' };
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ email: normalizedEmail });
      console.log(`[OTP] OTP expired for ${normalizedEmail}`);
      return { valid: false, message: 'OTP expired' };
    }

    if (otpRecord.code !== otp) {
      console.log(`[OTP] OTP mismatch. Expected: ${otpRecord.code}, Got: ${otp}`);
      return { valid: false, message: 'Invalid OTP' };
    }

    // Mark OTP as verified
    await OTP.updateOne(
      { email: normalizedEmail },
      { $set: { verified: true } }
    );
    
    console.log(`[OTP] OTP verified successfully for ${normalizedEmail}`);
    return { valid: true };
  } catch (err) {
    console.error('[DB] Error verifying OTP:', err.message);
    return { valid: false, message: 'Error verifying OTP' };
  }
};

export const deleteOTP = async (email) => {
  try {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return true;
  } catch (err) {
    console.error('[DB] Error deleting OTP:', err.message);
    return false;
  }
};

export const getOTP = async (email) => {
  try {
    const otp = await OTP.findOne({ email: email.toLowerCase() }).lean();
    return otp;
  } catch (err) {
    console.error('[DB] Error getting OTP:', err.message);
    return null;
  }
};

// ============================
// Company Operations
// ============================

export const createCompany = async (companyData) => {
  try {
    const baseSlug = companyData.companyName
      ? companyData.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      : 'company';
    
    const company = new Company({
      ...companyData,
      slug: `${baseSlug}-${makeId().slice(-6)}`,
      tabs: companyData.tabs || {}
    });
    
    await company.save();
    return company.toObject();
  } catch (err) {
    console.error('[DB] Error creating company:', err.message);
    throw err;
  }
};

export const findCompanyById = async (id, options = {}) => {
  try {
    const { allowSlug = false } = options;
    const objectId = toObjectId(id);
    if (objectId) {
      const company = await Company.findById(objectId);
      return company;
    }

    if (allowSlug) {
      const slug = String(id || '').trim();
      if (!slug) return null;
      return await Company.findOne({ slug });
    }

    throw invalidObjectIdError(id);
  } catch (err) {
    if (err.code === 'INVALID_OBJECT_ID') throw err;
    console.error('[DB] Error finding company by id:', err.message);
    return null;
  }
};

export const findCompanyByUserId = async (userId) => {
  try {
    const searchId = String(userId || '').trim();
    if (!searchId) return null;
    return await Company.findOne({ userId: String(searchId) });
  } catch (err) {
    console.error('[DB] Error finding company by user id:', err.message);
    return null;
  }
};

export const updateCompany = async (id, updates) => {
  try {
    const objectId = toObjectId(id);
    if (!objectId) throw invalidObjectIdError(id);
    const company = await Company.findByIdAndUpdate(
      objectId,
      { $set: updates },
      { new: true, runValidators: true }
    );
    return company;
  } catch (err) {
    if (err.code === 'INVALID_OBJECT_ID') throw err;
    console.error('[DB] Error updating company:', err.message);
    return null;
  }
};

export const getAllCompanies = async () => {
  try {
    const companies = await Company.find();
    return companies;
  } catch (err) {
    console.error('[DB] Error getting all companies:', err.message);
    return [];
  }
};

export const deleteCompany = async (id) => {
  try {
    const objectId = toObjectId(id);
    if (!objectId) throw invalidObjectIdError(id);
    const result = await Company.findByIdAndDelete(objectId);
    return !!result;
  } catch (err) {
    if (err.code === 'INVALID_OBJECT_ID') throw err;
    console.error('[DB] Error deleting company:', err.message);
    return false;
  }
};

// ============================
// Audit Log Operations
// ============================

export const addAuditLog = async (entry) => {
  try {
    const log = await AuditLog.create(entry);
    return log.toObject();
  } catch (err) {
    console.error('[DB] Error adding audit log:', err.message);
    return null;
  }
};

export const getAuditLogs = async () => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .lean();
    return logs;
  } catch (err) {
    console.error('[DB] Error getting audit logs:', err.message);
    return [];
  }
};

// ============================
// Content Operations
// ============================

export const getContent = async (section) => {
  try {
    if (!section) {
      // Return all content sections as an object
      const allContent = await Content.find().lean();
      const contentObj = {};
      allContent.forEach(item => {
        contentObj[item.section] = item.data;
      });
      return contentObj;
    }
    
    const content = await Content.findOne({ section }).lean();
    return content ? content.data : [];
  } catch (err) {
    console.error('[DB] Error getting content:', err.message);
    return section ? [] : {};
  }
};

export const updateContent = async (section, data) => {
  try {
    const content = await Content.findOneAndUpdate(
      { section },
      { $set: { data } },
      { new: true, upsert: true }
    ).lean();
    
    return content.data;
  } catch (err) {
    console.error('[DB] Error updating content:', err.message);
    throw err;
  }
};

// ============================
// Finance Contact Operations
// ============================

export const createFinanceContact = async (contactData) => {
  try {
    const contact = await FinanceContact.create(contactData);
    return contact.toObject();
  } catch (err) {
    console.error('[DB] Error creating finance contact:', err.message);
    throw err;
  }
};

// ============================
// Password Reset Operations
// ============================

export const storePasswordReset = async (resetData) => {
  try {
    const record = await PasswordReset.create(resetData);
    return record.toObject();
  } catch (err) {
    console.error('[DB] Error storing password reset:', err.message);
    throw err;
  }
};

export const findPasswordResetByTokenHash = async (tokenHash) => {
  try {
    const record = await PasswordReset.findOne({ tokenHash }).lean();
    return record;
  } catch (err) {
    console.error('[DB] Error finding password reset:', err.message);
    return null;
  }
};

export const markPasswordResetUsed = async (tokenHash) => {
  try {
    const record = await PasswordReset.findOneAndUpdate(
      { tokenHash },
      { $set: { used: true, usedAt: new Date() } },
      { new: true }
    ).lean();
    return record;
  } catch (err) {
    console.error('[DB] Error marking password reset used:', err.message);
    return null;
  }
};

export const purgeExpiredPasswordResets = async () => {
  try {
    const result = await PasswordReset.deleteMany({
      $or: [
        { used: true },
        { expiresAt: { $lt: new Date() } }
      ]
    });
    console.log(`[DB] Purged ${result.deletedCount} expired password resets`);
    return result.deletedCount;
  } catch (err) {
    console.error('[DB] Error purging password resets:', err.message);
    return 0;
  }
};

// ============================
// Newsletter Subscriber Operations
// ============================

export const addNewsletterSubscriber = async (email) => {
  try {
    await NewsletterSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        $setOnInsert: { email: email.toLowerCase() },
        $set: { active: true }
      },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('[DB] Error adding newsletter subscriber:', err.message);
    return false;
  }
};

export const getNewsletterSubscribers = async () => {
  try {
    const subscribers = await NewsletterSubscriber.find({ active: true }).lean();
    return subscribers;
  } catch (err) {
    console.error('[DB] Error getting newsletter subscribers:', err.message);
    return [];
  }
};

// Export connection for use in server.js
export { mongoose };

// Legacy db export for backward compatibility (returns empty structures)
export const db = {
  users: [],
  companies: [],
  otps: {},
  content: {},
  financeContacts: [],
  passwordResets: [],
  auditLogs: [],
  newsletterSubscribers: []
};
