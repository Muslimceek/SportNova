import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Eye, EyeOff, Mail, ArrowRight, AlertCircle } from "lucide-react";

const FIREBASE_ERROR_MESSAGES = {
  "auth/user-not-found": "Пользователь с таким email не найден",
  "auth/wrong-password": "Неверный пароль",
  "auth/invalid-email": "Некорректный формат email",
  "auth/too-many-requests": "Слишком много попыток входа. Попробуйте позже",
  default: "Ошибка при входе. Проверьте данные и попробуйте снова",
};

const Input = ({ id, label, type, value, onChange, Icon, showToggle, onToggle, error }) => (
  <div className="mb-6 relative">
    <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-2">
      <Icon className="w-4 h-4" /> {label}
    </label>
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        autoComplete={id}
        placeholder={label}
        className={`w-full px-5 py-4 pr-12 rounded-xl border-2 bg-gray-800/80 backdrop-blur-sm text-gray-100 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          error ? "border-red-500 focus:border-red-600 focus:ring-red-500" : "border-gray-700 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400"
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Показать или скрыть пароль"
        >
          {type === "password" ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} className="mt-2 text-xs text-red-400 flex items-center gap-1">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

const Login = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validateForm = useCallback(() => {
    const newErrors = { email: "", password: "", general: "" };
    let isValid = true;
    if (!creds.email) { newErrors.email = "Email обязателен"; isValid = false; }
    else if (!/\S+@\S+\.\S+/.test(creds.email)) { newErrors.email = "Некорректный формат email"; isValid = false; }
    if (!creds.password) { newErrors.password = "Пароль обязателен"; isValid = false; }
    else if (creds.password.length < 6) { newErrors.password = "Пароль должен содержать минимум 6 символов"; isValid = false; }
    setErrors(newErrors);
    return isValid;
  }, [creds]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({ email: "", password: "", general: "" });
    try {
      await signInWithEmailAndPassword(auth, creds.email, creds.password);
      navigate("/");
    } catch (error) {
      const msg = FIREBASE_ERROR_MESSAGES[error.code] || FIREBASE_ERROR_MESSAGES.default;
      setErrors((prev) => error.code === "auth/invalid-email" ? { ...prev, email: msg } : { ...prev, general: msg });
    } finally { setLoading(false); }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-cyan-600/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>
        <img src="https://source.unsplash.com/1600x900/?sports,fitness" alt="Фон" className="w-full h-full object-cover opacity-20 mix-blend-overlay" loading="lazy"
          onError={(e) => { e.target.style.display = "none"; e.target.parentElement.style.background = "#1f2937"; }} 
        />
      </div>
      {/* Login Card */}
      <section className="relative z-10 w-full max-w-md p-1 rounded-2xl shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl opacity-80 animate-gradient-x"></div>
        <div className="relative bg-gray-900 p-8 rounded-2xl backdrop-blur-sm border border-gray-800/50">
          <div className="text-center mb-8">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-70 animate-spin-slow"></div>
              <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                <img src="https://i.ibb.co/3mvJzbrv/Frame-13.png" alt="SportNova Logo" className="h-14 w-14 object-contain" loading="lazy" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Добро пожаловать в SportNova
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Войдите в аккаунт, чтобы начать покупки и получать персональные предложения
            </p>
          </div>
          {errors.general && (
            <div role="alert" aria-live="assertive" className="mb-6 flex items-center gap-2 rounded-lg bg-red-900/30 p-4 text-red-400 border border-red-800/50 backdrop-blur-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500" /> {errors.general}
            </div>
          )}
          <form onSubmit={handleLogin} noValidate aria-label="Форма логина" className="space-y-2">
            <Input
              id="email"
              label="Email"
              type="email"
              value={creds.email}
              onChange={(e) => setCreds(prev => ({ ...prev, email: e.target.value }))}
              Icon={Mail}
              error={errors.email}
            />
            <Input
              id="password"
              label="Пароль"
              type={showPassword ? "text" : "password"}
              value={creds.password}
              onChange={(e) => setCreds(prev => ({ ...prev, password: e.target.value }))}
              Icon={Lock}
              showToggle
              onToggle={() => setShowPassword(prev => !prev)}
              error={errors.password}
            />
            <button type="submit" disabled={loading} aria-busy={loading} className="mt-6 w-full relative overflow-hidden group rounded-xl py-4 font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient-x"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-active:opacity-30 bg-black transition-opacity duration-150"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-white animate-ping absolute"></span>
                    <span className="h-4 w-4 rounded-full bg-white relative"></span>
                    <span className="ml-2">Проверяем...</span>
                  </div>
                ) : (
                  <>
                    <span>Войти в аккаунт</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>
          <div className="mt-8 text-center">
            <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors duration-300 relative group">
              <span>Забыли пароль?</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Нет аккаунта?{" "}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-300 relative group">
                <span>Зарегистрируйтесь</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </div>
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Ваши данные защищены. Мы не передаём вашу информацию третьим лицам.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
