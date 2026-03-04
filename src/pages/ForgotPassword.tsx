import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { api } from '../api/axios';

const schema = yup.object({
  email: yup.string().required('Email is required').email('Enter a valid email'),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      setServerError('');
      try {
        await api.post('/auth/forgot-password', { email: values.email });
        setSent(true);
      } catch (err: any) {
        setServerError(err.message ?? 'Something went wrong. Please try again.');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-healthcare-surface/30 p-6">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-clinical border border-healthcare-border p-8 md:p-10 animate-fade-in">
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm text-healthcare-text-muted hover:text-healthcare-text transition-colors mb-8 no-underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Login
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-healthcare-text tracking-tight mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-healthcare-text-muted font-medium">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
            <svg className="w-8 h-8 text-emerald-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-bold text-emerald-700">Reset link sent!</p>
            <p className="text-xs text-emerald-600">
              If that email is registered, you'll receive a link within a few minutes. Check your spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{serverError}</p>
              </div>
            )}
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
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500'
                      : 'border-healthcare-neutral/20'
                  } focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/20 font-medium placeholder:text-healthcare-text-muted/40`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs font-bold ml-1">{formik.errors.email}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-brand-blue text-white py-3.5 rounded-lg font-bold text-base hover:bg-healthcare-text active:scale-[0.99] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? 'Sending…' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
