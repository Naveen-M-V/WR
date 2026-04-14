import 'dotenv/config';

console.log('=== Environment Variables Debug ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');
console.log('EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'NOT SET');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'SET (hidden)' : 'NOT SET');
console.log('APP_URL:', process.env.APP_URL || 'NOT SET');
console.log('=====================================');
