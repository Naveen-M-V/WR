import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { createFinanceContact } from '../database/db.js';
import { sendFinanceContactEmail } from '../utils/emailService.js';

const router = express.Router();

// Rate limiter: 5 requests per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const validateFinanceContact = [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone number is required').escape(),
  body('companyName').trim().notEmpty().withMessage('Company name is required').escape(),
  body('fundingAmount').trim().notEmpty().withMessage('Funding amount is required').escape(),
  body('projectDescription').trim().notEmpty().withMessage('Project description is required').escape(),
];

// POST /api/finance-contact
router.post('/', contactLimiter, validateFinanceContact, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array().map(err => err.msg) 
      });
    }

    const { name, email, phone, companyName, fundingAmount, projectDescription } = req.body;

    // Save to database
    const contactData = {
      name,
      email,
      phone,
      companyName,
      fundingAmount,
      projectDescription,
      status: 'pending',
    };
    
    await createFinanceContact(contactData);

    // Send emails
    const emailResult = await sendFinanceContactEmail(contactData);

    if (!emailResult.success) {
      // We still return success to the user if the data was saved, but log the error
      console.error('Failed to send email notifications for finance contact');
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for your inquiry. We will be in touch shortly.',
    });

  } catch (error) {
    console.error('Error in finance contact route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
});

export default router;
