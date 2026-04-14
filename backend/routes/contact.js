import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { sendAdminContactEmail, sendAdminNewsletterEmail, sendNewsletterUserConfirmation, sendContactAcknowledgementEmail } from '../utils/emailService.js';
import { addNewsletterSubscriber, getNewsletterSubscribers } from '../database/db.js';
import {
  validateEmail,
  validateRequired,
} from '../utils/validators.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/newsletter', async (req, res) => {
  try {
    const subscribers = await getNewsletterSubscribers();
    return res.json({ success: true, data: subscribers });
  } catch (error) {
    console.error('Failed to get newsletter subscribers:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
  }
});

router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!validateRequired(email)) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    // Send admin notification
    const adminResult = await sendAdminNewsletterEmail(email);
    
    // Send user confirmation
    const userResult = await sendNewsletterUserConfirmation(email);

    if (!adminResult.success || !userResult.success) {
      const errorMsg = adminResult.error || userResult.error || 'Failed to send subscription emails';
      console.error('Email sending failed. Error:', errorMsg);
      return res.status(500).json({ success: false, error: errorMsg });
    }

    // Add to DB
    await addNewsletterSubscriber(email);

    return res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return res.status(500).json({ success: false, error: 'Failed to subscribe: ' + error.message });
  }
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const payload = req.body || {};

    // Add file path to payload if file exists
    if (req.file) {
      payload.file = req.file;
    }

    const type = payload.type;
    const name = payload.contactName || payload.name;
    const email = payload.contactEmail || payload.email;

    if (!validateRequired(type)) {
      return res.status(400).json({ success: false, error: 'Type is required' });
    }

    if (!validateRequired(name)) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    if (!validateRequired(email)) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }

    const adminResult = await sendAdminContactEmail(payload);

    // Send acknowledgment email to user
    const userResult = await sendContactAcknowledgementEmail(payload);

    if (!adminResult.success) {
      return res.status(500).json({ success: false, error: 'Failed to send email', details: adminResult.error });
    }

    // Log if user acknowledgment failed but don't block the request
    if (!userResult.success) {
      console.error('Failed to send user acknowledgment email:', userResult.error);
    }

    return res.json({ success: true, message: 'Submitted successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ success: false, error: 'Failed to submit contact request' });
  }
});

export default router;
