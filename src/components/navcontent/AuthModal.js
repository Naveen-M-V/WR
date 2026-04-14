import React, { useState } from 'react';
import { X, Eye, EyeOff, CreditCard, Building, Mail, Phone, Globe, MapPin, User, Lock, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationPopup from './NotificationPopup';
import DocumentModal from '../common/DocumentModal';
import { useAuth } from '../../contexts/AuthContext';
import { requestOTP, verifyOTP, registerUser, loginUser, requestPasswordReset, requestPasswordResetOTP, verifyPasswordResetOTP, resetPasswordWithOTP, checkUserExists, resendOTP } from '../../utils/authAPI';

const AuthModal = ({ onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [authMode, setAuthMode] = useState(''); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [devOtpInfo, setDevOtpInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotShowNewPassword, setForgotShowNewPassword] = useState(false);
  const [forgotShowConfirmPassword, setForgotShowConfirmPassword] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyEmail: '',
    description: '',
    companyLogo: null,
    location: '',
    contactNo: '',
    website: '',
    subscription: '',
    billingPeriod: 'monthly', // 'monthly' or 'annual'
    paymentMethod: '',
    termsAccepted: false,
    privacyAccepted: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper function to get pricing
  const getPricing = (plan, period) => {
    const pricing = {
      standard: {
        monthly: { amount: 100, currency: '£', period: 'per month' },
        annual: { amount: 960, currency: '£', period: 'per year', savings: '20% off' }
      },
      premium: {
        monthly: { amount: 250, currency: '£', period: 'per month' },
        annual: { amount: 2400, currency: '£', period: 'per year', savings: '20% off' }
      }
    };
    return pricing[plan]?.[period] || pricing.standard.monthly;
  };


  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleAuthModeSelect = (mode) => {
    setAuthMode(mode);
    if (mode === 'login') {
      setCurrentStep(2); // Skip to login form
    } else {
      setCurrentStep(2); // Go to signup form
    }
  };

  const handleFinalSubmit = () => {
    // Existing handler primarily used for login and legacy flows
    console.log('Final form data:', formData);

    const userData = {
      email: formData.email,
      companyName: formData.companyName || 'User Company',
      subscription: formData.subscription,
      billingPeriod: formData.billingPeriod,
      joinedAt: new Date().toISOString(),
      profileCompletion: 10,
    };

    login(userData);

    if (authMode === 'signup') {
      setShowNotification(true);
    } else {
      onClose();
    }
  };

  const handleSignupSubmit = async () => {
    const email = (formData.email || '').trim();
    const password = formData.password || '';
    const confirmPassword = formData.confirmPassword || '';

    // Validation for required fields in signup flow
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!otpVerified) {
      setError('OTP not verified. Please verify OTP first.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // FIX: Create user account immediately so they have a valid token for payment
      const registerResult = await registerUser(email, password, formData.otp);
      
      if (!registerResult?.success || !registerResult?.data?.data) {
        setError(registerResult?.error || 'Failed to create account. Please try again.');
        return;
      }

      // Create user object for login using the data from registerUser response
      const userData = {
        id: registerResult.data.data.userId,
        email: registerResult.data.data.email,
        role: registerResult.data.data.role || 'company',
      };

      // Log the user in so they have a valid authToken
      login(userData);

      // Store flag in sessionStorage to indicate company profile needs to be created after payment
      sessionStorage.setItem('pendingCompanyProfile', JSON.stringify({
        timestamp: new Date().toISOString()
      }));

      // Close modal and redirect to profile completion
      onClose();
      navigate('/profile-completion?pendingSignup=true');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipSubscription = () => {
    // Create user data for skipped subscription
    const userData = {
      email: formData.email,
      companyName: formData.companyName || 'User Company',
      subscription: 'not_subscribed',
      billingPeriod: 'monthly',
      joinedAt: new Date().toISOString()
    };

    // Login the user with no subscription
    login(userData);

    // Close modal and redirect directly without notification popup
    onClose();
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    onClose();
    // Redirect to home page after notification closes
    setTimeout(() => {
      window.location.href = '/';
    }, 300);
  };

  // Step 1: Login/Signup Selection
  const renderAuthSelection = () => (
    <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
          <div className="text-center">
            <div className="text-white font-semibold text-xl">Welcome</div>
            <div className="mt-1 text-xs text-white/70">Choose how you'd like to continue</div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleAuthModeSelect('login')}
              className="w-full rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-4 transition"
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                <span className="text-sm">Login to Your Account</span>
              </div>
            </button>

            <button
              onClick={() => handleAuthModeSelect('signup')}
              className="w-full rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white font-semibold py-3 px-4 transition"
            >
              <div className="flex items-center justify-center gap-2">
                <Building className="w-5 h-5" />
                <span className="text-sm">Create New Account</span>
              </div>
            </button>

            <div className="pt-2 text-center text-[11px]" style={{color: "#10b981"}}>
              Renewable Energy • Sustainability • ESG
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Email Form (for signup)
  const renderSignupEmailStep = () => (
    <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Create your account</h2>
            <p className="text-xs text-white/70">Enter your email to receive an OTP</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs text-slate-100/80 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={otpSent}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35 disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="termsPrivacyCheckbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleInputChange('termsAccepted', checked);
                    handleInputChange('privacyAccepted', checked);
                  }}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/20 bg-white/10 transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:border-white/30"
                />
                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <label htmlFor="termsPrivacyCheckbox" className="text-xs text-white/70 cursor-pointer select-none">
                I accept the <button type="button" onClick={() => setTermsModalOpen(true)} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">Terms and Conditions</button> & <button type="button" onClick={() => setPrivacyModalOpen(true)} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">Privacy Policy</button>
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-50/90">{error}</p>
            </div>
          )}

          <button
            onClick={async () => {
              if (!formData.email) {
                setError('Please enter email');
                return;
              }

              // Validate email format
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address');
                return;
              }

              if (!formData.termsAccepted) {
                setError('Please accept the Terms and Conditions');
                return;
              }

              if (!formData.privacyAccepted) {
                setError('Please accept the Privacy Policy');
                return;
              }

              setError('');
              setLoading(true);

              // Call backend API to send OTP
              const result = await requestOTP(formData.email);

              if (result.success) {
                setOtpSent(true);
                setError('');
                if (result.data?.otp) {
                  const suffix = result.data?.emailError ? `\nEmail error: ${result.data.emailError}` : '';
                  setDevOtpInfo(`OTP: ${result.data.otp}${suffix}`);
                } else {
                  setDevOtpInfo(null);
                }
                setCurrentStep(3);
              } else {
                setError(result.error || 'Failed to send OTP. Please try again.');
              }

              setLoading(false);
            }}
            disabled={loading || otpSent}
            className="mt-5 w-full rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : otpSent ? 'OTP Sent ✓' : 'Send OTP'}
          </button>
        </div>
      </div>
    </div>
  );

  // Step 3: OTP Verification Form (for signup)
  const renderSignupOtpStep = () => (
    <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Verify your email</h2>
            <p className="text-xs text-white/70">Enter the OTP sent to {formData.email}</p>
          </div>

          <div className="mt-6">
            <label className="block text-xs text-slate-100/80 mb-1">OTP Code</label>
            <input
              type="text"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              maxLength="6"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
              placeholder="000000"
            />
            <p className="text-[11px] text-white/60 mt-2">Check your email for the 6-digit code</p>
            {/* SR#199 - Resend OTP */}
            <button
              onClick={async () => {
                setError('');
                setLoading(true);
                const result = await resendOTP(formData.email);
                setLoading(false);
                if (result.success) {
                  setError('');
                  if (result.data?.otp) setDevOtpInfo(`New OTP: ${result.data.otp}`);
                } else {
                  setError(result.error || 'Failed to resend OTP. Please try again.');
                }
              }}
              disabled={loading}
              className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 bg-transparent border-none cursor-pointer disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending…' : "Didn't receive it? Resend OTP"}
            </button>
            {devOtpInfo && (
              <pre className="text-xs text-amber-100 bg-amber-500/10 border border-amber-400/20 rounded-lg p-2 mt-3 whitespace-pre-wrap">
                {devOtpInfo}
              </pre>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-50/90">{error}</p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => {
                setOtpSent(false);
                setError('');
                setCurrentStep(2);
              }}
              className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
            >
              Back
            </button>
            <button
              onClick={async () => {
                if (!formData.otp || formData.otp.length !== 6) {
                  setError('Please enter a valid 6-digit OTP');
                  return;
                }
                setError('');
                setLoading(true);

                // Call backend API to verify OTP
                const result = await verifyOTP(formData.email, formData.otp);

                if (result.success) {
                  setOtpVerified(true);
                  setError('');
                  setCurrentStep(4);
                } else {
                  setError(result.error || 'Invalid or expired OTP. Please try again.');
                }

                setLoading(false);
              }}
              disabled={loading}
              className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Password Creation (for signup)
  const renderSignupPasswordStep = () => (
    <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Create a password</h2>
            <p className="text-xs text-white/70">Set a secure password for your account</p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-xs text-slate-100/80 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              <p className="text-[11px] text-white/60 mt-2">At least 8 characters with uppercase, lowercase, and numbers</p>
            </div>

            <div>
              <label className="block text-xs text-slate-100/80 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
              <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-50/90">{error}</p>
            </div>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => {
                setCurrentStep(3);
              }}
              className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (!otpVerified) {
                  setError('OTP not verified. Please verify OTP first.');
                  return;
                }
                setError('');
                handleSignupSubmit();
              }}
              disabled={loading || !otpVerified}
              className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Login Form
  const renderLoginForm = () => (
    <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
          <div className="text-white font-semibold text-lg">Sign in</div>
            <div className="mt-1 text-xs text-slate-100/70">Enter your credentials to continue</div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-100/80 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-100/80 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 pr-11 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                    placeholder="************"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    onClick={async () => {
                      setError('');
                      setForgotOpen(true);
                      setForgotStep(1);
                    }}
                    className="text-xs text-white/75 hover:text-white underline underline-offset-4"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
                <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-50/90">{error}</p>
              </div>
            )}

            <button
              onClick={async () => {
                if (!formData.email || !formData.password) {
                  setError("Please enter email and password");
                  return;
                }

                setError("");
                setLoading(true);

                try {
                  const result = await loginUser(formData.email, formData.password);

                  if (result.success) {
                    const userData = {
                      email: result.data.data?.email,
                      userId: result.data.data?.userId,
                      role: result.data.data?.role,
                      profileCompletion: result.data.data?.profileCompletion || 0,
                    };

                    login(userData);
                    onClose();
                    if (userData.role === "admin") {
                      navigate("/admin/dashboard");
                    } else {
                      navigate("/");
                    }
                  } else {
                    setError(result.error || "Login failed. Please try again.");
                  }
                } catch (err) {
                  setError("An error occurred during login. Please try again.");
                  console.error("Login error:", err);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "SIGN IN"}
            </button>

            <div className="mt-4 text-center text-xs text-white/70">
              Are you new?
              {" "}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setAuthMode("signup");
                  setCurrentStep(2);
                }}
                className="text-white underline underline-offset-4 hover:opacity-90"
              >
                Create an Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForgotFlow = () => (
    <div className="relative z-10 w-full p-6 sm:p-8 lg:p-10">
      <div className="flex items-center justify-center">
        <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-5 sm:p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
          >
            <X className="w-6 h-6 text-white/80" />
          </button>
          {forgotStep === 1 && (
            <>
              <div className="text-white font-semibold text-lg">Reset password</div>
              <div className="mt-1 text-xs text-slate-100/70">Enter your email to receive an OTP</div>
              <div className="mt-5">
                <label className="block text-xs text-slate-100/80 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                  placeholder="Enter your email"
                />
              </div>
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-50/90">{error}</p>
                </div>
              )}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => { setForgotOpen(false); setError(''); }}
                  className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    if (!formData.email) { setError('Please enter email'); return; }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(formData.email)) { setError('Please enter a valid email address'); return; }
                    setLoading(true); setError('');
                    // Check if user exists before sending OTP
                    const userCheck = await checkUserExists(formData.email);
                    if (!userCheck.success || !userCheck.exists) {
                      setError('You don\'t have an account. Please sign up first.');
                      setLoading(false);
                      return;
                    }
                    const result = await requestPasswordResetOTP(formData.email);
                    if (result.success) { setForgotStep(2); } else { setError(result.error || 'Failed to send OTP'); }
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Continue'}
                </button>
              </div>
            </>
          )}
          {forgotStep === 2 && (
            <>
              <div className="text-white font-semibold text-lg">Enter OTP</div>
              <div className="mt-1 text-xs text-slate-100/70">Enter the 6-digit code sent to {formData.email}</div>
              <div className="mt-5">
                <label className="block text-xs text-slate-100/80 mb-1">OTP Code</label>
                <input
                  type="text"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  maxLength={6}
                  className="w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35 text-center tracking-widest"
                  placeholder="000000"
                />
              </div>
              {/* Resend OTP for forgot password */}
              <button
                onClick={async () => {
                  setError('');
                  setLoading(true);
                  const result = await requestPasswordResetOTP(formData.email);
                  setLoading(false);
                  if (result.success) {
                    setError('');
                  } else {
                    setError(result.error || 'Failed to resend OTP. Please try again.');
                  }
                }}
                disabled={loading}
                className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 bg-transparent border-none cursor-pointer disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending…' : "Didn't receive it? Resend OTP"}
              </button>
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-50/90">{error}</p>
                </div>
              )}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => { setForgotStep(1); setError(''); }}
                  className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    if (!forgotOtp || forgotOtp.length !== 6) { setError('Please enter a valid 6-digit OTP'); return; }
                    setLoading(true); setError('');
                    const result = await verifyPasswordResetOTP(formData.email, forgotOtp);
                    if (result.success) { setForgotStep(3); } else { setError(result.error || 'Invalid or expired OTP'); }
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </>
          )}
          {forgotStep === 3 && (
            <>
              <div className="text-white font-semibold text-lg">Create new password</div>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs text-slate-100/80 mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={forgotShowNewPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full pr-11 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setForgotShowNewPassword(!forgotShowNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                      aria-label={forgotShowNewPassword ? 'Hide password' : 'Show password'}
                    >
                      {forgotShowNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-100/80 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={forgotShowConfirmPassword ? 'text' : 'password'}
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      className="w-full pr-11 rounded-xl border border-white/10 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setForgotShowConfirmPassword(!forgotShowConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
                      aria-label={forgotShowConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {forgotShowConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>
              </div>
              {error && (
                <div className="mt-4 rounded-xl border border-red-500/25 bg-red-500/15 px-3 py-2 flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-red-100 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-50/90">{error}</p>
                </div>
              )}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => { setForgotStep(2); setError(''); }}
                  className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
                >
                  Back
                </button>
                <button
                  onClick={async () => {
                    if (!forgotNewPassword || !forgotConfirmPassword) { setError('Please enter both passwords'); return; }
                    if (forgotNewPassword !== forgotConfirmPassword) { setError('Passwords do not match'); return; }
                    // Password strength check removed per request
                    setLoading(true); setError('');
                    const result = await resetPasswordWithOTP(formData.email, forgotOtp, forgotNewPassword);
                    if (result.success) {
                      setForgotOpen(false);
                      setError('');
                      setShowNotification(true);
                    } else {
                      setError(result.error || 'Failed to reset password');
                    }
                    setLoading(false);
                  }}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
  // Step 3: Company Details Form
  const renderCompanyForm = () => (
    <div className="max-w-3xl mx-auto">
      <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
        >
          <X className="w-6 h-6 text-white/80" />
        </button>
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Company details</h2>
          <p className="text-xs text-white/70">Tell us about your company</p>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-slate-100/80 mb-1">Company Name</label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-slate-100/80 mb-1">Company Logo</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="authCompanyLogo"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) handleInputChange('companyLogo', file);
                }}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="authCompanyLogo"
                className="px-4 py-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white cursor-pointer transition-colors text-xs font-semibold"
              >
                Upload Logo
              </label>
              {formData.companyLogo && (
                <span className="text-xs text-emerald-200">
                  {formData.companyLogo.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-100/80 mb-1">Company Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
              <input
                type="email"
                value={formData.companyEmail}
                onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                placeholder="company@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-100/80 mb-1">Contact Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
              <input
                type="tel"
                value={formData.contactNo}
                onChange={(e) => handleInputChange('contactNo', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                placeholder="+44 123 456 7890"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-100/80 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-100/80 mb-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4.5 h-4.5" />
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/10 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400/35"
                placeholder="https://www.company.com"
              />
            </div>
          </div>

        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={prevStep}
            className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );

  // Step 4: Subscription Selection
  const renderSubscriptionForm = () => (
    <div className="max-w-5xl mx-auto">
      <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
        >
          <X className="w-6 h-6 text-white/80" />
        </button>
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Choose your plan</h2>
          <p className="text-xs text-white/70">Select the subscription that fits your needs</p>
        </div>

        {/* Billing Period Toggle */}
        <div className="flex justify-center my-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/10">
            <div className="flex">
              <button
                onClick={() => handleInputChange('billingPeriod', 'monthly')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${formData.billingPeriod === 'monthly'
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                Monthly
              </button>
              <button
                onClick={() => handleInputChange('billingPeriod', 'annual')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative ${formData.billingPeriod === 'annual'
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">
                  20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Standard Plan */}
          <div
            onClick={() => handleInputChange("subscription", "standard")}
            className={`w-full p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.subscription === "standard"
              ? "border-emerald-300/60 bg-white/10 backdrop-blur-lg"
              : "border-white/10 bg-white/5 backdrop-blur-lg hover:border-white/20"
              }`}
          >
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white">Standard</h3>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {getPricing('standard', formData.billingPeriod).currency}{getPricing('standard', formData.billingPeriod).amount}
                </div>
                <p className="text-sm text-white/70">{getPricing('standard', formData.billingPeriod).period}</p>
                {formData.billingPeriod === 'annual' && (
                  <p className="text-xs text-emerald-200 font-semibold">
                    {getPricing('standard', formData.billingPeriod).savings}
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="text-sm text-white/75 space-y-2 text-left w-full px-4">
                <li>✅ Company Name & Logo on WR Website</li>
                <li>✅ Company Contact details on WR Website</li>
                <li>✅ Brief company description (up to 100 words)</li>
                <li>✅ Placement in Region-specific Supplier List</li>
                <li>✅ Appear in "Find a Company" search</li>
                <li>✅ Link to your company website</li>
                <li>✅ Priority search listing in WR directory</li>
                <li>✅ Showcase Services in 1 category + upload 2 images</li>
                <li>✅ Access to Industry-related webinars</li>
              </ul>

              {/* Check icon */}
              <div className="flex items-center justify-center">
                {formData.subscription === "standard" && (
                  <Check className="w-6 h-6 text-emerald-200" />
                )}
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div
            onClick={() => handleInputChange("subscription", "premium")}
            className={`w-full p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${formData.subscription === "premium"
              ? "border-sky-300/60 bg-white/10 backdrop-blur-lg"
              : "border-white/10 bg-white/5 backdrop-blur-lg hover:border-white/20"
              }`}
          >
            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white">Premium</h3>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {getPricing('premium', formData.billingPeriod).currency}{getPricing('premium', formData.billingPeriod).amount}
                </div>
                <p className="text-sm text-white/70">{getPricing('premium', formData.billingPeriod).period}</p>
                {formData.billingPeriod === 'annual' && (
                  <p className="text-xs text-emerald-200 font-semibold">
                    {getPricing('premium', formData.billingPeriod).savings}
                  </p>
                )}
              </div>

              {/* Features List */}
              <ul className="text-sm text-white/75 space-y-2 text-left w-full px-4">
                <li>✅ Company Name & Logo on WR Website</li>
                <li>✅ Company Contact details on WR Website</li>
                <li>✅ Brief company description (up to 500 words)</li>
                <li>✅ Placement in Regional & National Supplier list</li>
                <li>✅ Appear in "Find a Company" search on WR Website</li>
                <li>✅ Link to your company website</li>
                <li>✅ Priority search listing in WR directory</li>
                <li>✅ Showcase Services in 2 categories + upload up to 4 images</li>
                <li>✅ Access to Industry-related webinars</li>
                <li>✅ Invitation to Join Which Renewables Expert Panel</li>
                <li>✅ Contribute to our Expert Panel Blog</li>
                <li>✅ Get listed as a "Premium Recruiter"</li>
              </ul>

              {/* Check icon */}
              <div className="flex items-center justify-center">
                {formData.subscription === "premium" && (
                  <Check className="w-6 h-6 text-sky-200" />
                )}
              </div>
            </div>
          </div>
        </div>


        <div className="mt-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <h4 className="font-semibold text-white mb-3">Subscription Benefits:</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-200 mt-0.5 flex-shrink-0" />
              <span>Sign up for our Annual Subscription and get a discount of 20%.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-200 mt-0.5 flex-shrink-0" />
              <span>Our Standard Subscription comes with a credit of £300 per annum to be used on our exclusive services.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-200 mt-0.5 flex-shrink-0" />
              <span>Our Premium Subscription comes with a credit of £600 per annum to be used on our exclusive services.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-200 mt-0.5 flex-shrink-0" />
              <span>Your loyalty matters - collect points as you renew every month and unlock special benefits.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Skip for now button */}
          <div className="text-center">
            <button
              onClick={handleSkipSubscription}
              className="inline-flex items-center gap-2 px-6 py-2 text-white/70 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-white/10 rounded-lg"
            >
              <span>Skip for now</span>
              <span className="text-xs bg-white/10 text-white px-2 py-1 rounded-full border border-white/10">Free Trial</span>
            </button>
            <p className="text-xs text-white/55 mt-1">You can upgrade anytime later</p>
          </div>

          {/* Main action buttons */}
          <div className="flex gap-3">
            <button
              onClick={prevStep}
              className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!formData.subscription}
              className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 5: Payment Method
  const renderPaymentForm = () => (
    <div className="max-w-4xl mx-auto">
      <div className="relative rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl p-6 shadow-[0_10px_50px_rgba(15,23,42,0.6)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 p-2 rounded-full transition-colors duration-200 bg-white/0 hover:bg-white/10"
        >
          <X className="w-6 h-6 text-white/80" />
        </button>
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">Payment method</h2>
          <p className="text-xs text-white/70">Choose how you'd like to pay</p>
        </div>

        <div className="mt-6 space-y-3">
          <div
            onClick={() => handleInputChange('paymentMethod', 'card')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'card'
              ? 'border-emerald-300/60 bg-white/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-white/80" />
              <div>
                <h3 className="font-semibold text-white">Credit/Debit Card</h3>
                <p className="text-xs text-white/65">Pay securely with your card</p>
              </div>
              {formData.paymentMethod === 'card' && (
                <Check className="w-5 h-5 text-emerald-200 ml-auto" />
              )}
            </div>
          </div>

          <div
            onClick={() => handleInputChange('paymentMethod', 'paypal')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'paypal'
              ? 'border-emerald-300/60 bg-white/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/15 rounded flex items-center justify-center text-white text-[10px] font-bold border border-white/10">
                PP
              </div>
              <div>
                <h3 className="font-semibold text-white">PayPal</h3>
                <p className="text-xs text-white/65">Pay with your PayPal account</p>
              </div>
              {formData.paymentMethod === 'paypal' && (
                <Check className="w-5 h-5 text-emerald-200 ml-auto" />
              )}
            </div>
          </div>

          <div
            onClick={() => handleInputChange('paymentMethod', 'bank')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'bank'
              ? 'border-emerald-300/60 bg-white/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
          >
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-white/80" />
              <div>
                <h3 className="font-semibold text-white">Bank Transfer</h3>
                <p className="text-xs text-white/65">Direct bank transfer</p>
              </div>
              {formData.paymentMethod === 'bank' && (
                <Check className="w-5 h-5 text-emerald-200 ml-auto" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Total Amount:</span>
            <span className="text-2xl font-bold text-white">
              {getPricing(formData.subscription || 'standard', formData.billingPeriod).currency}
              {getPricing(formData.subscription || 'standard', formData.billingPeriod).amount}
            </span>
          </div>
          <p className="text-xs text-white/70 mt-1">
            {formData.subscription === 'premium' ? 'Premium' : 'Standard'} subscription - {formData.billingPeriod === 'annual' ? 'Annual' : 'Monthly'} billing
          </p>
          {formData.billingPeriod === 'annual' && (
            <p className="text-xs text-emerald-200 font-semibold mt-1">
              You save 20% with annual billing
            </p>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={prevStep}
            className="flex-1 rounded-xl border border-white/15 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold py-2.5 transition"
          >
            Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={!formData.paymentMethod}
            className="flex-1 rounded-xl bg-[#1e7fe6] hover:bg-[#176fd0] text-white text-sm font-semibold py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderAuthSelection();
      case 2:
        if (authMode === 'login') {
          return forgotOpen ? renderForgotFlow() : renderLoginForm();
        } else {
          return renderSignupEmailStep();
        }
      case 3:
        if (authMode === 'signup') {
          return renderSignupOtpStep();
        } else {
          return renderCompanyForm();
        }
      case 4:
        if (authMode === 'signup') {
          return renderSignupPasswordStep();
        } else {
          return renderSubscriptionForm();
        }
      case 5:
        if (authMode === 'signup') {
          return renderCompanyForm();
        } else {
          return renderPaymentForm();
        }
      default:
        return renderAuthSelection();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content Container */}
      <div className="relative w-full flex items-center justify-center max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {renderCurrentStep()}
      </div>

      {/* Notification Popup */}
      <NotificationPopup
        isVisible={showNotification}
        onClose={handleNotificationClose}
        subscriptionType={formData.subscription}
        userName={formData.companyName}
      />

      <DocumentModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title="Terms and Conditions"
        fileName="/ACCEPTABLE CONTENT AND COMMUNITY GUIDELINES.docx"
      />

      <DocumentModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        title="Privacy Policy"
        fileName="/Privacy Policy.docx"
      />
    </div>
  );
};

export default AuthModal;
