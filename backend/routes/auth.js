import express from 'express';
import bcrypt from 'bcryptjs';
import { 
  createUser, 
  findUserByEmail, 
  findUserByUsername, 
  findUserById,
  updateUser,
  storeOTP, 
  verifyOTP,
  deleteOTP,
  getOTP
} from '../database/db.js';
import { generateToken, verifyToken } from '../middleware/auth.js';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername, 
  validateOTP,
  validateRequired 
} from '../utils/validators.js';
import { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import { 
  storePasswordReset, 
  findPasswordResetByTokenHash, 
  markPasswordResetUsed,
  purgeExpiredPasswordResets
} from '../database/db.js';

const router = express.Router();

const ADMIN_PASSWORD = 'Which@renewables';
const ADMIN_SEEDS = [
  {
    username: 'sanjaymaheshwaran0124',
    email: 'sanjaymaheshwaran0124@gmail.com',
  },
  {
    username: 'support',
    email: 'support@whichrenewables.com',
  },
  {
    username: 'frank.delargy',
    email: 'frank.delargy@whichrenewables.com',
  },
];

export const ensureAdminsSeeded = async () => {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  for (const admin of ADMIN_SEEDS) {
    const existing = await findUserByEmail(admin.email);
    if (existing) continue;

    await createUser({
      username: admin.username,
      email: admin.email,
      password: hashedPassword,
      role: 'admin',
      profileCompletion: 100,
      createdAt: new Date().toISOString(),
    });
  }
};

// await ensureAdminsSeeded(); // Moved to after connectDB

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ============ OTP ENDPOINTS ============

// Request OTP for signup
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!validateRequired(email)) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp);

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp);

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      if (process.env.NODE_ENV === 'development') {
        return res.json({
          ok: true,
          message: 'OTP generated, but failed to send email in development.',
          otp,
          emailError: emailResult.error,
        });
      }
      return res.status(500).json({
        error: 'Failed to send OTP. Please check your email configuration.',
        details: emailResult.error,
      });
    }

    res.json({
      ok: true,
      message: 'OTP sent to email',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    res.status(500).json({ error: 'Failed to request OTP' });
  }
});

// SR#199 - Resend OTP for email verification
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateRequired(email)) return res.status(400).json({ error: 'Email is required' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });

    // Delete old OTP and generate new one
    await deleteOTP(email);
    const otp = generateOTP();
    await storeOTP(email, otp);

    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      if (process.env.NODE_ENV === 'development') {
        return res.json({ ok: true, message: 'OTP resent (dev mode)', otp });
      }
      return res.status(500).json({ error: 'Failed to resend OTP. Please try again.' });
    }

    res.json({ ok: true, message: 'New OTP sent to your email' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate inputs
    if (!validateRequired(email) || !validateRequired(otp)) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!validateOTP(otp)) {
      return res.status(400).json({ error: 'OTP must be 6 digits' });
    }

    // Verify OTP
    const result = await verifyOTP(email, otp);

    if (!result.valid) {
      return res.status(400).json({ error: result.message });
    }

    res.json({
      ok: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// ============ SIGNUP ENDPOINT ============

// Register user (after OTP verification)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;

    // Validate all required fields
    if (!validateRequired(email) || !validateRequired(password) || !validateRequired(otp)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Handle username generation/validation
    let finalUsername = username;
    
    // If username is missing or invalid format, generate from email
    if (!finalUsername || !validateUsername(finalUsername)) {
        // Sanitize email part
        let base = email.split('@')[0].replace(/[^a-zA-Z0-9_.-]/g, '');
        if (base.length < 3) base = `user_${base}`;
        if (base.length > 30) base = base.substring(0, 30);
        finalUsername = base;
    }

    // Ensure uniqueness
    let uniqueUsername = finalUsername;
    let counter = 1;
    while (await findUserByUsername(uniqueUsername)) {
        uniqueUsername = `${finalUsername}${counter}`;
        counter++;
    }
    finalUsername = uniqueUsername;

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters with uppercase, lowercase, and numbers' 
      });
    }

    // Validate OTP format
    if (!validateOTP(otp)) {
      return res.status(400).json({ error: 'Invalid OTP format' });
    }

    // Check if email already exists
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if OTP was previously verified
    const otpData = await getOTP(email);
    if (!otpData) {
      return res.status(400).json({ error: 'OTP not found. Please request a new OTP.' });
    }
    
    if (!otpData.verified) {
      return res.status(400).json({ error: 'OTP not verified. Please verify OTP first.' });
    }
    
    if (new Date() > otpData.expiresAt) {
      await deleteOTP(email);
      return res.status(400).json({ error: 'OTP expired. Please request a new OTP.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      username: finalUsername,
      email,
      password: hashedPassword,
      role: 'user',
      profileCompletion: 0,
      createdAt: new Date().toISOString(),
    });

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.username, user.role);

    // Delete OTP after successful registration
    await deleteOTP(email);

    // Send welcome email
    await sendWelcomeEmail(email, finalUsername);

    res.status(201).json({
      ok: true,
      message: 'User registered successfully',
      data: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// ============ LOGIN ENDPOINT ============

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!validateRequired(email) || !validateRequired(password)) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email, user.username, user.role);

    res.json({
      ok: true,
      message: 'Login successful',
      data: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        profileCompletion: user.profileCompletion || 0,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// ============ CHECK USER EXISTS ============

// Check if a user exists by email (for password reset and UI feedback)
router.get('/check-user-exists', async (req, res) => {
  try {
    const { email } = req.query;

    if (!validateRequired(email)) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const user = await findUserByEmail(email);
    const exists = !!user;

    res.json({ 
      success: true, 
      exists: exists,
      message: exists ? 'User found' : 'User not found'
    });
  } catch (error) {
    console.error('Check user exists error:', error);
    res.status(500).json({ success: false, error: 'Failed to check user', exists: false });
  }
});

// ============ PASSWORD RESET ============

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

// Request password reset
router.post('/forgot-password', forgotLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!validateRequired(email)) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      // Prevent user enumeration: respond success regardless
      console.warn(`[Auth] Password reset requested for non-existent email: ${email}`);
      return res.json({ success: true, message: 'If an account exists, a reset link has been emailed' });
    }

    await purgeExpiredPasswordResets();

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes

    await storePasswordReset({
      userId: user._id.toString(),
      email: user.email,
      tokenHash,
      expiresAt,
      used: false,
    });

    const baseUrl = process.env.RESET_PASSWORD_URL || 'https://stage.whichrenewables.com/reset-password';
    const resetLink = `${baseUrl}?token=${rawToken}`;

    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      name: user.username || user.email.split('@')[0],
      resetLink,
    });

    if (!emailResult.success) {
      console.error('[Auth] Failed to send reset email:', emailResult.error);
      return res.status(500).json({ success: false, error: 'Failed to send reset email' });
    }

    res.json({
      success: true,
      message: 'If an account exists, a reset link has been emailed',
      token: (process.env.NODE_ENV === 'development' || process.env.EMAIL_DEBUG === 'true') ? rawToken : undefined,
      expiresInMinutes: 30,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, error: 'Failed to process request' });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};

    if (!validateRequired(token) || !validateRequired(newPassword)) {
      return res.status(400).json({ success: false, error: 'Token and new password are required' });
    }

    // Allow any password for reset (user-requested relaxation)

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const rec = await findPasswordResetByTokenHash(tokenHash);

    if (!rec) {
      return res.status(400).json({ success: false, error: 'Invalid or expired reset token' });
    }
    if (rec.used) {
      return res.status(400).json({ success: false, error: 'Reset token has already been used' });
    }
    if (Date.now() > rec.expiresAt) {
      return res.status(400).json({ success: false, error: 'Reset token has expired' });
    }

    const user = await findUserById(rec.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User no longer exists' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUser(user._id.toString(), { password: hashedPassword });
    await markPasswordResetUsed(tokenHash);

    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    if (error?.code === 'INVALID_OBJECT_ID' || error?.status === 400) {
      return res.status(400).json({ success: false, error: 'Invalid user id' });
    }
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

// OTP-based password reset
router.post('/forgot-password-otp', forgotLimiter, async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!validateRequired(email)) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.json({ success: true, message: 'If an account exists, an OTP has been sent' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await storeOTP(email, otp);
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ success: false, error: 'Failed to send OTP', details: emailResult.error });
    }
    res.json({ success: true, message: 'OTP sent if the account exists' });
  } catch (error) {
    console.error('Forgot password OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to process request' });
  }
});

router.post('/verify-password-otp', async (req, res) => {
  try {
    const { email, otp } = req.body || {};
    if (!validateRequired(email) || !validateRequired(otp)) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }
    const result = await verifyOTP(email, otp);
    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.message || 'Invalid OTP' });
    }
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('Verify password OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to verify OTP' });
  }
});

router.post('/reset-password-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};
    if (!validateRequired(email) || !validateRequired(otp) || !validateRequired(newPassword)) {
      return res.status(400).json({ success: false, error: 'Email, OTP and new password are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    // Allow any password for reset (user-requested relaxation)
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const result = await verifyOTP(email, otp);
    if (!result.valid) {
      return res.status(400).json({ success: false, error: result.message || 'Invalid OTP' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUser(user._id.toString(), { password: hashedPassword });
    await deleteOTP(email);
    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    if (error?.code === 'INVALID_OBJECT_ID' || error?.status === 400) {
      return res.status(400).json({ success: false, error: 'Invalid user id' });
    }
    console.error('Reset password via OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
});

// ============ PROFILE ENDPOINTS ============

// Get user profile (protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password
    const { password, ...userWithoutPassword } = user;

    res.json({
      ok: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    if (error?.code === 'INVALID_OBJECT_ID' || error?.status === 400) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile (protected)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email, ...otherUpdates } = req.body;
    const userId = req.user.userId;

    // Check if email is being changed
    if (email && email !== req.user.email) {
      const existingEmail = await findUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Check if username is being changed
    if (username && username !== req.user.username) {
      const existingUsername = await findUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Update user
    const updatedUser = await updateUser(userId, {
      username: username || req.user.username,
      email: email || req.user.email,
      ...otherUpdates,
    });

    // Don't send password
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      ok: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    if (error?.code === 'INVALID_OBJECT_ID' || error?.status === 400) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============ LOGOUT ENDPOINT ============

// Logout (protected)
router.post('/logout', verifyToken, (req, res) => {
  // In a real app, you might invalidate the token in a blacklist
  res.json({
    ok: true,
    message: 'Logged out successfully',
  });
});

export default router;
