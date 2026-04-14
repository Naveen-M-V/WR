import mongoose from 'mongoose';

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  unsubscribedAt: Date
}, {
  timestamps: true
});

// Index for email
newsletterSubscriberSchema.index({ email: 1 });

const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
export default NewsletterSubscriber;
