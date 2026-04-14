import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  userId: {
    type: String,  // Changed from ObjectId to String to match custom ID generation
    required: true
  },
  createdByUserId: {
    type: String,  // Added for admin-created companies
    default: null
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyRegNumber: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  companyAddress: String,
  postCode: String,
  companyWebsite: String,
  websiteLink: String,
  socialMediaLinks: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  companyPhone: String,
  companyEmail: String,
  companyLogo: String,
  productImages: [String],
  mainSector: String,
  industrySector: [String],
  productsServiceCategories: [String],
  hierarchicalProductsServices: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  description: String,
  yearEstablished: Number,
  employeeCount: String,
  isRecruitmentCompany: {
    type: String,
    default: 'No'
  },
  regions: [String],
  selectedSubsectors: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  spotlight: {
    enabled: { type: Boolean, default: false },
    addedAt: Date,
    removedAt: Date,
    companyLogo: String
  },
  contactPerson: {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    role: String
  },
  tabs: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  companyNews: [{
    type: mongoose.Schema.Types.Mixed
  }],
  companyBio: String,
  productsServices: String,
  status: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Archived', 'Suspended']
  },
  subscription: {
    plan: { type: String, default: 'basic' },
    status: { type: String, default: 'active' },
    startDate: Date,
    endDate: Date,
    months: Number,
    billingCycle: { type: String, default: 'monthly' },
    addons: [String],
    addonDetails: [{
      id: String,
      name: String,
      purchaseDate: Date,
      expiryDate: Date
    }]
  },
  profileCompletion: {
    contactInfo: { type: Boolean, default: false },
    companyDetails: { type: Boolean, default: false },
    sectors: { type: Boolean, default: false },
    regions: { type: Boolean, default: false },
    subscription: { type: Boolean, default: false },
    productsServices: { type: Boolean, default: false },
    hierarchicalProductsServices: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Indexes
companySchema.index({ userId: 1 });
companySchema.index({ slug: 1 });
companySchema.index({ companyName: 'text' });

const Company = mongoose.model('Company', companySchema);
export default Company;
