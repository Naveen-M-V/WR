import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,  // Relaxed to accept any type (array or object)
    default: []
  }
}, {
  timestamps: true
});

// Index for section lookups
contentSchema.index({ section: 1 });

const Content = mongoose.model('Content', contentSchema);
export default Content;
