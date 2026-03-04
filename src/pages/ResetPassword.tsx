import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { api } from '../api/axios';

const schema = yup.object({
  password: yup.string().required('Password is required').min(8, 'Minimum 8 characters'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [serverError, setServerError] = useState('');

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!token) {
        setServerError('Invalid or missing reset token.');
        return;
      }
      setServerError('');
      try {
        await api.post('/auth/reset-password', { token, newPassword: values.password });
        navigate('/login', { replace: true });
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
            Set New Password
          </h1>
          <p className="text-sm text-healthcare-text-muted font-medium">
            Enter your new password below.
          </p>
        </div>

        {!token ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              This reset link is invalid or has expired.{' '}
              <Link to="/forgot-password" className="underline">
                Request a new one
              </Link>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{serverError}</p>
              </div>
            )}
            {(['password', 'confirmPassword'] as const).map((field) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">
                  {field === 'password' ? 'New Password' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formik.touched[field] && formik.errors[field]
                      ? 'border-red-500'
                      : 'border-healthcare-neutral/20'
                  } focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/20 font-medium placeholder:text-healthcare-text-muted/40`}
                />
                {formik.touched[field] && formik.errors[field] && (
                  <p className="text-red-500 text-xs font-bold ml-1">{formik.errors[field]}</p>
                )}
              </div>
            ))}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-brand-blue text-white py-3.5 rounded-lg font-bold text-base hover:bg-healthcare-text active:scale-[0.99] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? 'Saving…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
