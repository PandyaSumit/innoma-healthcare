import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const step1Schema = yup.object().shape({
  fullName: yup.string().required('Full name is required').min(2, 'Name too short'),
  email: yup.string().required('Email is required').email('Please enter a valid email'),
});

const step2Schema = yup.object().shape({
  otp: yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
});

const step3Schema = yup.object().shape({
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Please select an option'),
  occupation: yup.string().required('Please select your occupation'),
});

const step4Schema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[!@#$%^&*]/, 'Must contain special character'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const schemas = [step1Schema, step2Schema, step3Schema, step4Schema];
  const currentSchema = schemas[step - 1];

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      otp: '',
      dob: '',
      gender: '',
      occupation: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: currentSchema,
    onSubmit: async () => {
      setIsLoading(true);
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo, log in with patient credentials
      const result = await login('patient@innoma.com', 'Patient@123');

      if (result.success) {
        success('Account Created!', 'Welcome to Innoma Healthcare. Your journey begins now.');
        navigate('/dashboard');
      } else {
        showError('Account Created', 'Please login with patient@innoma.com / Patient@123');
        navigate('/login');
      }
      setIsLoading(false);
    },
  });

  // OTP Timer Effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus first OTP input when reaching step 2
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);

    // Update formik value
    formik.setFieldValue('otp', newOtpValues.join(''));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtpValues = [...otpValues];
    paste.split('').forEach((char, i) => {
      if (i < 6) newOtpValues[i] = char;
    });
    setOtpValues(newOtpValues);
    formik.setFieldValue('otp', newOtpValues.join(''));

    // Focus last filled input
    const lastIndex = Math.min(paste.length - 1, 5);
    otpRefs.current[lastIndex]?.focus();
  };

  const sendOtp = () => {
    if (resendCount >= 3) {
      showError('Too many attempts', 'Please try again later');
      return;
    }
    setResendTimer(60);
    setResendCount(resendCount + 1);
    success('OTP Sent!', `Verification code sent to ${formik.values.email}`);
  };

  const nextStep = async () => {
    const errors = await formik.validateForm();
    const currentStepFields = {
      1: ['fullName', 'email'],
      2: ['otp'],
      3: ['dob', 'gender', 'occupation'],
      4: ['password', 'confirmPassword'],
    }[step] || [];

    const hasErrors = currentStepFields.some((field) => errors[field as keyof typeof errors]);

    if (!hasErrors) {
      if (step === 1) {
        // Send OTP when moving from step 1 to step 2
        sendOtp();
      }
      setStep(step + 1);
    } else {
      currentStepFields.forEach((field) => {
        formik.setFieldTouched(field, true);
      });
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0) {
      formik.handleSubmit();
    } else {
      Object.keys(errors).forEach((key) => {
        formik.setFieldTouched(key, true);
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formik.values.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  // Calculate max date (18 years ago)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Visual Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-healthcare-surface overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-blue/10 blur-[100px]" />
          <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] rounded-full bg-brand-orange/5 blur-[80px]" />
          <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-healthcare-lavender/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-20 max-w-2xl">
          <Link to="/" className="mb-12 no-underline">
            <span className="text-3xl font-bold tracking-tight text-brand-blue">
              Innoma <span className="text-brand-orange">Healthcare</span>
            </span>
          </Link>

          <div className="space-y-8 animate-fade-in">
            <h2 className="text-4xl xl:text-5xl font-bold text-healthcare-text leading-tight tracking-tight">
              Begin your healing journey <span className="text-brand-blue">today.</span>
            </h2>
            <p className="text-xl text-healthcare-text-muted leading-relaxed max-w-lg">
              Join thousands who have found peace and clarity through our trusted mental health platform.
            </p>

            <div className="pt-8 grid grid-cols-2 gap-6 border-t border-healthcare-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-healthcare-text">Free Assessment</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-healthcare-text">100% Confidential</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-healthcare-text">Verified Therapists</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-healthcare-text">Flexible Scheduling</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16">
          <div className="w-full max-w-[440px] animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-block no-underline">
                <span className="text-2xl font-bold tracking-tight text-brand-blue">
                  Innoma <span className="text-brand-orange">HC</span>
                </span>
              </Link>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((s) => (
                  <React.Fragment key={s}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step > s
                          ? 'bg-green-500 text-white'
                          : step === s
                          ? 'bg-brand-blue text-white scale-110 shadow-lg shadow-brand-blue/30'
                          : 'bg-healthcare-surface text-healthcare-text-muted'
                      }`}
                    >
                      {step > s ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s
                      )}
                    </div>
                    {s < 4 && (
                      <div className={`flex-1 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-green-500' : 'bg-healthcare-surface'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-healthcare-text tracking-tight mb-1">
                {step === 1 && 'Create Your Account'}
                {step === 2 && 'Verify Your Email'}
                {step === 3 && 'Personal Information'}
                {step === 4 && 'Secure Your Account'}
              </h1>
              <p className="text-sm text-healthcare-text-muted">
                Step {step} of 4
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="space-y-5 animate-slide-up">
                  {/* Google OAuth Button */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-healthcare-border rounded-xl font-medium text-healthcare-text hover:bg-healthcare-surface transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-healthcare-border" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-healthcare-text-muted">or continue with email</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text">Full Name</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="John Doe"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium placeholder:text-healthcare-text-muted/40 transition-all`}
                      />
                    </div>
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formik.errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="you@example.com"
                        className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${formik.touched.email && formik.errors.email ? 'border-red-500 bg-red-50/50' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium placeholder:text-healthcare-text-muted/40 transition-all`}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {formik.errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-base hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20 mt-4"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {step === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-healthcare-text-muted">
                      We've sent a 6-digit code to<br />
                      <span className="font-semibold text-healthcare-text">{formik.values.email}</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text text-center">Enter Verification Code</label>
                    <div className="flex justify-center gap-2 md:gap-3" onPaste={handleOtpPaste}>
                      {otpValues.map((value, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={value}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border ${
                            formik.touched.otp && formik.errors.otp ? 'border-red-500' : 'border-healthcare-border'
                          } focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white transition-all`}
                        />
                      ))}
                    </div>
                    {formik.touched.otp && formik.errors.otp && (
                      <p className="text-red-500 text-xs font-medium text-center mt-2">{formik.errors.otp}</p>
                    )}
                  </div>

                  <div className="text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-healthcare-text-muted">
                        Resend code in <span className="font-semibold text-brand-blue">{resendTimer}s</span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={resendCount >= 3}
                        className="text-sm font-semibold text-brand-blue hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend Code {resendCount > 0 && `(${3 - resendCount} left)`}
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3.5 rounded-xl font-medium text-healthcare-text border border-healthcare-border hover:bg-healthcare-surface transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-brand-blue text-white py-3.5 rounded-xl font-bold hover:bg-brand-blue/90 transition-all"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Personal Information */}
              {step === 3 && (
                <div className="space-y-5 animate-slide-up">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-healthcare-text">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        max={maxDateStr}
                        className={`w-full px-4 py-3.5 rounded-xl border ${formik.touched.dob && formik.errors.dob ? 'border-red-500' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium transition-all`}
                      />
                      {formik.touched.dob && formik.errors.dob && (
                        <p className="text-red-500 text-xs font-medium">{formik.errors.dob}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-healthcare-text">Gender</label>
                      <select
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3.5 rounded-xl border ${formik.touched.gender && formik.errors.gender ? 'border-red-500' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium appearance-none transition-all`}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {formik.touched.gender && formik.errors.gender && (
                        <p className="text-red-500 text-xs font-medium">{formik.errors.gender}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text">Occupation</label>
                    <select
                      name="occupation"
                      value={formik.values.occupation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3.5 rounded-xl border ${formik.touched.occupation && formik.errors.occupation ? 'border-red-500' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium appearance-none transition-all`}
                    >
                      <option value="">Select your occupation</option>
                      <option value="Student">Student</option>
                      <option value="Employed">Employed</option>
                      <option value="Self-Employed">Self-Employed / Business</option>
                      <option value="Consultant">Consultant / Freelancer</option>
                      <option value="Homemaker">Homemaker</option>
                      <option value="Other">Other</option>
                    </select>
                    {formik.touched.occupation && formik.errors.occupation && (
                      <p className="text-red-500 text-xs font-medium">{formik.errors.occupation}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3.5 rounded-xl font-medium text-healthcare-text border border-healthcare-border hover:bg-healthcare-surface transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-brand-blue text-white py-3.5 rounded-xl font-bold hover:bg-brand-blue/90 transition-all"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Password */}
              {step === 4 && (
                <div className="space-y-5 animate-slide-up">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text">Create Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Create a strong password"
                        className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium placeholder:text-healthcare-text-muted/40 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted hover:text-healthcare-text"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formik.values.password && (
                      <div className="space-y-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((index) => (
                            <div
                              key={index}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-healthcare-border'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          passwordStrength < 2 ? 'text-red-500' : passwordStrength < 3 ? 'text-orange-500' : passwordStrength < 4 ? 'text-yellow-600' : 'text-green-500'
                        }`}>
                          {strengthLabels[passwordStrength - 1] || 'Too weak'}
                        </p>
                      </div>
                    )}

                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-xs font-medium">{formik.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text">Confirm Password</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Confirm your password"
                        className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-healthcare-border'} focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white font-medium placeholder:text-healthcare-text-muted/40 transition-all`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted hover:text-healthcare-text"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs font-medium">{formik.errors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Terms Agreement */}
                  <p className="text-xs text-healthcare-text-muted">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-brand-blue hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-brand-blue hover:underline">Privacy Policy</Link>.
                  </p>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 py-3.5 rounded-xl font-medium text-healthcare-text border border-healthcare-border hover:bg-healthcare-surface transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-brand-blue text-white py-3.5 rounded-xl font-bold hover:bg-brand-blue/90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="text-center mt-8 pt-6 border-t border-healthcare-border">
              <p className="text-sm text-healthcare-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-brand-blue font-semibold no-underline hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center bg-white border-t border-healthcare-border">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest opacity-60">
            <span>HIPAA Compliant</span>
            <span>•</span>
            <span>256-bit Encryption</span>
            <span>•</span>
            <span>Data Stored in India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
