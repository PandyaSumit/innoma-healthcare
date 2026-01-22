import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required')
    .email('Please enter a valid clinical email'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: false
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setLoginError('');

      const result = await login(values.email, values.password);

      setIsLoading(false);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setLoginError(result.error || 'Login failed. Please try again.');
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Visual Left Section - Therapeutic Background */}
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
              A clinical approach to <span className="text-brand-blue">emotional healing.</span>
            </h2>
            <p className="text-xl text-healthcare-text-muted leading-relaxed max-w-lg">
              Securely access your patient records, care schedules, and professional assessments in one centralized ecosystem.
            </p>
            
            <div className="pt-12 grid grid-cols-2 gap-8 border-t border-healthcare-border">
              <div>
                <p className="text-sm font-bold text-healthcare-text mb-1 italic">"The process was seamless and incredibly professional."</p>
                <p className="text-xs text-healthcare-text-muted">— Verified Member</p>
              </div>
              <div>
                <p className="text-sm font-bold text-healthcare-text mb-1 italic">"Total privacy and a calm digital environment."</p>
                <p className="text-xs text-healthcare-text-muted">— Verified Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right Section - Clinical Integrated Surface */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white overflow-y-auto">
        <div className="flex-grow flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-[420px] animate-fade-in">
            {/* Mobile Logo Visibility */}
            <div className="lg:hidden text-center mb-12">
              <Link to="/" className="inline-block no-underline">
                <span className="text-2xl font-bold tracking-tight text-brand-blue">
                  Innoma <span className="text-brand-orange">HC</span>
                </span>
              </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-healthcare-text tracking-tight mb-2">Login</h1>
              <p className="text-base text-healthcare-text-muted font-medium">Access your professional clinical dashboard</p>
            </div>

            {/* Login Credentials Info Box */}
            <div className="mb-6 p-4 bg-healthcare-lavender/20 border border-healthcare-lavender/30 rounded-lg">
              <p className="text-xs font-semibold text-healthcare-text mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-healthcare-text-muted">
                <p><strong>Patient:</strong> patient@innoma.com / Patient@123</p>
                <p><strong>Therapist:</strong> therapist@innoma.com / Therapist@123</p>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">{loginError}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-healthcare-text tracking-tight ml-1">Email Address</label>
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-healthcare-neutral/20'} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/20 font-medium placeholder:text-healthcare-text-muted/40`}
                  />
                </div>
                {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="block text-sm font-semibold text-healthcare-text tracking-tight">Password</label>
                  <button type="button" className="text-xs font-bold text-brand-blue hover:text-healthcare-text transition-colors bg-transparent border-none cursor-pointer p-0">Forgot Password?</button>
                </div>
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
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-healthcare-neutral/20'} focus:border-brand-blue outline-none text-healthcare-text bg-healthcare-surface/20 font-medium placeholder:text-healthcare-text-muted/40`}
                  />
                </div>
                {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1 font-bold ml-1">{formik.errors.password}</p>}
              </div>

              <div className="pt-2 flex items-center gap-2.5 ml-1">
                <input 
                  type="checkbox" 
                  id="remember" 
                  name="remember"
                  checked={formik.values.remember}
                  onChange={formik.handleChange}
                  className="w-4 h-4 rounded border-healthcare-neutral/30 text-brand-blue focus:ring-brand-blue cursor-pointer" 
                />
                <label htmlFor="remember" className="text-sm font-medium text-healthcare-text-muted cursor-pointer select-none">Remember me</label>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-brand-blue text-white py-3.5 rounded-lg font-bold text-base hover:bg-healthcare-text active:scale-[0.99] transition-all cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
               </div>
            </form>

            <div className="pt-8 border-t border-healthcare-neutral/5 text-center">
              <p className="text-sm text-healthcare-text-muted font-medium">
                New to the medical network?{' '}
                <Link to="/signup" className="text-brand-blue font-bold no-underline hover:underline">
                  Initiate Patient Intake
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Minimalist Footer */}
        <div className="p-8 text-center bg-white border-t border-healthcare-neutral/5">
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest opacity-60">
            <span>HIPAA SECURE</span>
            <span>•</span>
            <span>ENCRYPTED PORTAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
