import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/axios";

const MIN_AGE = 18;

function getMaxDob() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - MIN_AGE);
  return d.toISOString().split("T")[0];
}

const step1Schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Required")
    .max(100, "Max 100 characters"),
  email: yup.string().required("Required").email("Invalid email"),
});

const step2Schema = yup.object().shape({
  dob: yup
    .string()
    .required("Required")
    .test("age", `You must be at least ${MIN_AGE} years old`, (val) => {
      if (!val) return false;
      const dob = new Date(val);
      const age = Math.floor(
        (Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25),
      );
      return age >= MIN_AGE;
    }),
  gender: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
});

const step3Schema = yup.object().shape({
  password: yup
    .string()
    .required("Required")
    .min(8, "Min 8 characters")
    .matches(/[A-Z]/, "Must contain at least 1 uppercase letter")
    .matches(/[0-9]/, "Must contain at least 1 digit"),
  confirmPassword: yup
    .string()
    .required("Required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const step4Schema = yup.object().shape({
  otp: yup
    .string()
    .required("Required")
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits"),
});

const TOTAL_STEPS = 4;

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [otpResends, setOtpResends] = useState(0);
  const [otpSending, setOtpSending] = useState(false);

  const schemas = [step1Schema, step2Schema, step3Schema, step4Schema];
  const currentSchema = schemas[step - 1];

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      dob: "",
      gender: "",
      occupation: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
    validationSchema: currentSchema,
    onSubmit: async (values) => {
      setApiError("");

      if (step < 3) {
        setStep(step + 1);
        return;
      }

      if (step === 3) {
        // Register the user — get userId for OTP verification
        const result = await register({
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          dob: values.dob,
          gender: values.gender,
          occupation: values.occupation,
        });

        if (result.success && result.userId) {
          setPendingUserId(result.userId);
          setStep(4);
        } else {
          setApiError(result.error || "Registration failed. Please try again.");
        }
        return;
      }

      if (step === 4 && pendingUserId) {
        // Verify OTP and log in
        try {
          const { data } = await api.post("/auth/verify-otp", {
            userId: pendingUserId,
            otp: values.otp,
          });
          const { accessToken, refreshToken, user: u } = data.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem(
            "authUser",
            JSON.stringify({
              id: u.id,
              email: u.email,
              role: u.role,
              name: u.name,
              avatar: u.avatar ?? null,
            }),
          );
          navigate("/dashboard");
        } catch (err: any) {
          setApiError(
            err.message || "Invalid OTP. Please try again.",
          );
        }
      }
    },
  });

  const nextStep = async () => {
    const errors = await formik.validateForm();
    const stepFields: Record<number, string[]> = {
      1: ["fullName", "email"],
      2: ["dob", "gender", "occupation"],
      3: ["password", "confirmPassword"],
    };
    const relevantErrors = Object.keys(errors).filter((k) =>
      stepFields[step]?.includes(k),
    );
    if (relevantErrors.length === 0) {
      setStep(step + 1);
    } else {
      relevantErrors.forEach((key) => formik.setFieldTouched(key, true));
    }
  };

  const prevStep = () => {
    setApiError("");
    setStep(step - 1);
  };

  const handleResendOtp = async () => {
    if (!pendingUserId || otpResends >= 3) return;
    setOtpSending(true);
    setApiError("");
    try {
      await api.post("/auth/send-otp", { userId: pendingUserId });
      setOtpResends((r) => r + 1);
    } catch (err: any) {
      setApiError(err.message || "Failed to resend OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    const stepFields: Record<number, string[]> = {
      1: ["fullName", "email"],
      2: ["dob", "gender", "occupation"],
      3: ["password", "confirmPassword"],
      4: ["otp"],
    };
    const relevantErrors = Object.keys(errors).filter((k) =>
      stepFields[step]?.includes(k),
    );
    if (relevantErrors.length === 0) {
      formik.handleSubmit();
    } else {
      relevantErrors.forEach((key) => formik.setFieldTouched(key, true));
    }
  };

  const stepLabels = ["Identity", "Clinical Profile", "Credentials", "Verify Email"];

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Visual Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-healthcare-surface overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-brand-blue/10 blur-[100px]" />
          <div className="absolute bottom-[0%] right-[-5%] w-[50%] h-[50%] rounded-full bg-brand-orange/5 blur-[80px]" />
          <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-healthcare-lavender/10 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-20 max-w-2xl">
          <Link to="/" className="mb-12 no-underline">
            <span className="text-3xl font-bold tracking-tight text-brand-blue">
              Innoma <span className="text-brand-orange">Healthcare</span>
            </span>
          </Link>

          <div className="space-y-8 animate-fade-in">
            <h2 className="text-5xl font-bold text-healthcare-text leading-[1.15] tracking-tight">
              A healthcare experience{" "}
              <span className="text-brand-blue">reimagined.</span>
            </h2>
            <p className="text-xl text-healthcare-text-muted leading-relaxed max-w-lg">
              Our clinical ecosystem provides the security and precision
              required for modern patient care management.
            </p>

            <div className="pt-12 grid grid-cols-2 gap-8 border-t border-healthcare-border">
              <div>
                <p className="text-sm font-bold text-healthcare-text mb-1 italic">
                  "The interface is clean and builds trust instantly."
                </p>
                <p className="text-xs text-healthcare-text-muted">
                  — Dr. Sarah Chen
                </p>
              </div>
              <div>
                <p className="text-sm font-bold text-healthcare-text mb-1 italic">
                  "Highly secure and extremely intuitive to use."
                </p>
                <p className="text-xs text-healthcare-text-muted">
                  — James Wilson, Patient
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        <div className="flex-grow flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-[440px] animate-fade-in">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-10">
              <Link to="/" className="inline-block no-underline">
                <span className="text-2xl font-bold tracking-tight text-brand-blue">
                  Innoma <span className="text-brand-orange">HC</span>
                </span>
              </Link>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${step > i ? "w-12 bg-brand-blue" : "w-4 bg-healthcare-neutral/10"}`}
                  />
                ))}
              </div>
              <h1 className="text-3xl font-bold text-healthcare-text tracking-tight mb-2">
                Registration
              </h1>
              <p className="text-base text-healthcare-text-muted font-medium italic">
                Step {step} of {TOTAL_STEPS}: {stepLabels[step - 1]}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{apiError}</p>
                </div>
              )}

              {/* Step 1: Identity */}
              {step === 1 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                      Full Legal Name
                    </label>
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
                        maxLength={100}
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${formik.touched.fullName && formik.errors.fullName ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium placeholder:text-healthcare-text-muted/40`}
                      />
                    </div>
                    {formik.touched.fullName && formik.errors.fullName && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                      Email Address
                    </label>
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
                        placeholder="name@example.com"
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium placeholder:text-healthcare-text-muted/40`}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.email}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold text-base hover:bg-healthcare-text transition-all cursor-pointer border-none shadow-lg shadow-brand-blue/10"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Clinical Profile */}
              {step === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        max={getMaxDob()}
                        className={`w-full px-4 py-3 rounded-lg border ${formik.touched.dob && formik.errors.dob ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium`}
                      />
                      {formik.touched.dob && formik.errors.dob && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.dob}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-3 rounded-lg border ${formik.touched.gender && formik.errors.gender ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium appearance-none min-h-[48px]`}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                      {formik.touched.gender && formik.errors.gender && (
                        <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.gender}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                      Occupation
                    </label>
                    <select
                      name="occupation"
                      value={formik.values.occupation}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full px-4 py-3 rounded-lg border ${formik.touched.occupation && formik.errors.occupation ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium appearance-none min-h-[48px]`}
                    >
                      <option value="">Select occupation</option>
                      <option value="Student">Student</option>
                      <option value="Job">Employment</option>
                      <option value="Business">Business</option>
                      <option value="Consultant">Consultant</option>
                      <option value="Other">Other</option>
                    </select>
                    {formik.touched.occupation && formik.errors.occupation && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.occupation}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-white text-healthcare-text py-3 rounded-lg font-bold text-sm border border-healthcare-neutral/10 hover:bg-healthcare-surface cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-brand-blue text-white py-3.5 rounded-lg font-bold text-base hover:bg-healthcare-text active:scale-[0.99] transition-all cursor-pointer border-none"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Credentials */}
              {step === 3 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                      Secure Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <input
                        type="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="••••••••"
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium placeholder:text-healthcare-text-muted/40`}
                      />
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="••••••••"
                        className={`w-full pl-12 pr-4 py-3 rounded-lg border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10 font-medium placeholder:text-healthcare-text-muted/40`}
                      />
                    </div>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-white text-healthcare-text py-3 rounded-lg font-bold text-sm border border-healthcare-neutral/10 hover:bg-healthcare-surface cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="flex-1 bg-brand-blue text-white py-3.5 rounded-lg font-bold text-base hover:bg-healthcare-text active:scale-[0.99] transition-all cursor-pointer border-none disabled:opacity-60"
                    >
                      {formik.isSubmitting ? "Creating account..." : "Create Account"}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: OTP Verification */}
              {step === 4 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-lg">
                    <p className="text-sm text-healthcare-text font-medium">
                      We've sent a 6-digit verification code to{" "}
                      <strong>{formik.values.email}</strong>. It expires in 5 minutes.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={formik.values.otp}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className={`w-full px-4 py-3 rounded-lg border text-center text-2xl font-bold tracking-widest ${formik.touched.otp && formik.errors.otp ? "border-red-500" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/10`}
                    />
                    {formik.touched.otp && formik.errors.otp && (
                      <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.otp}</p>
                    )}
                  </div>

                  <div className="text-center">
                    {otpResends < 3 ? (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={otpSending}
                        className="text-sm text-brand-blue font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                      >
                        {otpSending ? "Sending..." : "Resend OTP"}
                        {otpResends > 0 && ` (${3 - otpResends} left)`}
                      </button>
                    ) : (
                      <p className="text-sm text-healthcare-text-muted">
                        Maximum resend attempts reached.{" "}
                        <Link to="/support" className="text-brand-blue font-semibold hover:underline">
                          Contact Support
                        </Link>
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-white text-healthcare-text py-3 rounded-lg font-bold text-sm border border-healthcare-neutral/10 hover:bg-healthcare-surface cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="flex-1 bg-brand-blue text-white py-3.5 rounded-lg font-bold text-base hover:bg-healthcare-text active:scale-[0.99] transition-all cursor-pointer border-none disabled:opacity-60"
                    >
                      {formik.isSubmitting ? "Verifying..." : "Verify & Continue"}
                    </button>
                  </div>
                </div>
              )}
            </form>

            <div className="text-center border-t border-healthcare-neutral/5 pt-8">
              <p className="text-sm text-healthcare-text-muted font-medium">
                Already registered?{" "}
                <Link to="/login" className="text-brand-blue font-bold no-underline hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 text-center bg-white border-t border-healthcare-neutral/5">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest opacity-60">
            <span>HIPAA SECURE DATA</span>
            <span>•</span>
            <span>256-BIT ENCRYPTION</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
