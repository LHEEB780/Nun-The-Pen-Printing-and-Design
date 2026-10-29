import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/useAuthStore';
import { X, Mail, Lock, User, Phone, MapPin, Sparkles, Loader2, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { login, register, forgotPassword } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset transient feedback state whenever the modal opens or tab changes
  React.useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setLoading(false);
    }
  }, [isOpen]);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState('بغداد - الكرخ');
  const [address, setAddress] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
        setTimeout(() => {
          onClose();
          if (onLoginSuccess) onLoginSuccess();
        }, 350);
      } else {
        setErrorMessage(res.error || (isAr ? 'فشل تسجيل الدخول' : 'Login failed'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(isAr ? 'حدث خطأ غير متوقع، حاول مرة أخرى' : 'Unexpected error, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await register(
        {
          email,
          fullName,
          phone,
          governorate,
          address,
        },
        password
      );
      if (res.success) {
        setSuccessMessage(isAr ? 'تم إنشاء الحساب بنجاح!' : 'Account registered successfully!');
        setTimeout(() => {
          onClose();
          if (onLoginSuccess) onLoginSuccess();
        }, 350);
      } else {
        setErrorMessage(res.error || (isAr ? 'فشل إنشاء الحساب' : 'Registration failed'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage(isAr ? 'حدث خطأ غير متوقع، حاول مرة أخرى' : 'Unexpected error, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccessMessage(isAr ? res.message : 'Password reset link sent to your email.');
      } else {
        setErrorMessage(isAr ? 'تعذر إرسال رابط الاستعادة' : 'Could not send reset link');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setErrorMessage(isAr ? 'حدث خطأ غير متوقع، حاول مرة أخرى' : 'Unexpected error, please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login('laheeb@noonwalqalam.com', 'demo1234');
      if (res.success) {
        setSuccessMessage(isAr ? 'تم الدخول بالحساب التجريبي!' : 'Logged in as Demo User!');
        setTimeout(() => {
          onClose();
          if (onLoginSuccess) onLoginSuccess();
        }, 350);
      } else {
        setErrorMessage(res.error || (isAr ? 'فشل الدخول التجريبي' : 'Demo login failed'));
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setErrorMessage(isAr ? 'حدث خطأ غير متوقع، حاول مرة أخرى' : 'Unexpected error, please try again');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200/90 animate-scale">
        {/* Header */}
        <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-200/60 p-1 flex items-center justify-center shrink-0">
              <img
                src="/images/noon_walqalam_logo.png"
                alt="شعار نون والقلم"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 leading-none">
                {activeTab === 'login' && (isAr ? 'تسجيل الدخول' : 'Sign In')}
                {activeTab === 'register' && (isAr ? 'إنشاء حساب جديد' : 'Create Account')}
                {activeTab === 'forgot' && (isAr ? 'استعادة كلمة المرور' : 'Reset Password')}
              </h3>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {isAr ? 'نون والقلم للطباعة والتصميم' : 'Noon & Pen Design Studio'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers (Login vs Register) */}
        {activeTab !== 'forgot' && (
          <div className="p-2 bg-slate-100/70 flex border-b border-slate-200/60 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              type="button"
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                activeTab === 'login'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'تسجيل الدخول' : 'Sign In'}
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              type="button"
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
                activeTab === 'register'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isAr ? 'حساب جديد' : 'Sign Up'}
            </button>
          </div>
        )}

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status feedback */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form 1: Log In */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="laheeb@noonwalqalam.com"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">
                    {isAr ? 'كلمة المرور' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('forgot');
                      setErrorMessage('');
                    }}
                    className="text-xs text-purple-700 hover:underline cursor-pointer"
                  >
                    {isAr ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>

              {/* Social Login Options */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400 font-semibold">
                    {isAr ? 'أو المتابعة باستخدام' : 'Or continue with'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleDemoLogin();
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDemoLogin();
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.05-1.82.93-2.88-.91.04-2 .61-2.65 1.37-.58.67-1.09 1.74-.95 2.78 1.02.08 2.04-.51 2.67-1.27z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Quick Demo Login Option */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'دخول سريع بحساب تجريبي (مصطفى حيدر)' : 'One-Click Demo Login'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Form 2: Sign Up */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isAr ? 'مثال: أحمد الخفاجي' : 'Ahmed Al-Khafaji'}
                    className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'البريد الإلكتروني *' : 'Email *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+964 780 000 0000"
                    className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'كلمة المرور *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full ps-10 pe-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                  {isAr ? 'المحافظة والعنوان الافتراضي' : 'Governorate & Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={isAr ? 'بغداد، المنصور، شارع 14 رمضان' : 'Baghdad, Mansour'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md mt-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isAr ? 'إنشاء الحساب' : 'Create Account'}</span>
              </button>
            </form>
          )}

          {/* Form 3: Forgot Password */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAr
                  ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مشفراً لإعادة تعيين كلمة المرور فوراً.'
                  : 'Enter your registered email address to receive a secure password reset link.'}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                <span>{isAr ? 'إرسال رابط الاستعادة' : 'Send Reset Link'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-purple-700 font-bold hover:underline cursor-pointer"
                >
                  {isAr ? 'العودة لتسجيل الدخول' : 'Back to Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
