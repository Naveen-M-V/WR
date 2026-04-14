import 'dotenv/config';
import { sendAdminNewsletterEmail } from './utils/emailService.js';

sendAdminNewsletterEmail('test@example.com').then(console.log).catch(console.error);
