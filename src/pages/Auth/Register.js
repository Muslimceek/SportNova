import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

const TextInput = ({ id, label, type = "text", value, onChange, placeholder, required, showToggle, toggleVisible, inputRef, error, icon: Icon }) => (
  <div className="mb-6 relative group">
    <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-gray-200 mb-2 transition-all duration-300 group-focus-within:text-blue-400">
      {Icon && <Icon className="w-4 h-4" />} {label}
    </label>
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        ref={inputRef}
        className={`w-full px-5 py-4 border-2 rounded-xl bg-gray-800/80 backdrop-blur-sm text-gray-100 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 relative z-10 
          ${error ? "border-red-500 focus:border-red-600 focus:ring-red-500" : "border-gray-700 focus:border-blue-500 focus:ring-blue-500 group-hover:border-blue-400/50"}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggleVisible}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 z-20"
          aria-label={type === "password" ? "Показать пароль" : "Скрыть пароль"}
        >
          {type === "password" ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
    {error && <p id={`${id}-error`} className="text-xs text-red-400 mt-2 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
  </div>
);

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);
  useEffect(() => { setProgress((Object.values(form).filter(f => f.trim()).length / 4) * 100); }, [form]);

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErr = { name: "", email: "", password: "", confirmPassword: "", general: "" };
    if (!form.name.trim()) { newErr.name = "Имя обязательно"; valid = false; }
    if (!form.email.trim()) { newErr.email = "Email обязателен"; valid = false; }
    else if (!/\S+@\S+\.\S+/.test(form.email)) { newErr.email = "Некорректный email"; valid = false; }
    if (!form.password) { newErr.password = "Пароль обязателен"; valid = false; }
    else if (form.password.length < 6) { newErr.password = "Минимум 6 символов"; valid = false; }
    if (form.password !== form.confirmPassword) { newErr.confirmPassword = "Пароли не совпадают"; valid = false; }
    setErrors(newErr);
    return valid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(user, { displayName: form.name });
      await setDoc(doc(db, "users", user.uid), { email: user.email, displayName: form.name, role: "user", createdAt: serverTimestamp() });
      navigate("/");
    } catch (err) {
      const msg = err.message || "Ошибка регистрации";
      setErrors(prev => (msg.includes("email-already-in-use") ? { ...prev, email: "Этот email уже используется" } : { ...prev, general: msg }));
    } finally { setIsLoading(false); }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Фоновый анимационный слой */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute top-2/3 left-1/3 w-72 h-72 bg-cyan-600/20 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
        </div>
        <img src="https://source.unsplash.com/1600x900/?sports,fitness" alt="Фон" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
      </div>
      {/* Контейнер регистрации */}
      <section className="relative z-10 w-full max-w-md p-1 rounded-2xl shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl opacity-80 animate-gradient-x"></div>
        <div className="relative bg-gray-900 p-8 rounded-2xl backdrop-blur-sm border border-gray-800/50">
          <header className="mb-8 text-center">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-70 animate-spin-slow"></div>
              <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                <img src="https://i.ibb.co/3mvJzbrv/Frame-13.png" alt="Logo" className="h-14 w-14 object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Регистрация в SportNova
            </h1>
            <p className="text-gray-400 mt-2">Создайте аккаунт и получите персональные предложения</p>
          </header>
          {/* Прогресс заполнения */}
          <div className="w-full h-1 bg-gray-800 rounded-full mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          {errors.general && (
            <div role="alert" className="mb-6 p-4 bg-red-900/30 border border-red-800/50 rounded-lg text-red-400 text-sm flex items-center gap-2 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500" /> {errors.general}
            </div>
          )}
          <form onSubmit={handleRegister} noValidate className="space-y-2">
            <TextInput id="name" label="Имя" value={form.name} onChange={handleChange("name")} placeholder="Ваше имя" required inputRef={nameRef} error={errors.name} icon={User} />
            <TextInput id="email" label="Email" type="email" value={form.email} onChange={handleChange("email")} placeholder="example@mail.com" required error={errors.email} icon={Mail} />
            <TextInput id="password" label="Пароль" type={visible ? "text" : "password"} value={form.password} onChange={handleChange("password")} placeholder="Минимум 6 символов" required showToggle toggleVisible={() => setVisible(v => !v)} error={errors.password} icon={Lock} />
            <TextInput id="confirmPassword" label="Подтвердите пароль" type={visible ? "text" : "password"} value={form.confirmPassword} onChange={handleChange("confirmPassword")} placeholder="Повторите пароль" required showToggle toggleVisible={() => setVisible(v => !v)} error={errors.confirmPassword} icon={Lock} />
            <button type="submit" disabled={isLoading} className="w-full relative overflow-hidden group rounded-xl py-4 font-semibold text-white transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 animate-gradient-x"></div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              <div className="absolute inset-0 opacity-0 group-active:opacity-30 bg-black transition-opacity duration-150"></div>
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full bg-white animate-ping absolute"></span>
                    <span className="h-4 w-4 rounded-full bg-white relative"></span>
                    <span className="ml-2">Регистрация...</span>
                  </div>
                ) : (
                  <>
                    <span>Зарегистрироваться</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>
          </form>
          <footer className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Уже есть аккаунт?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 relative group">
                <span>Войти</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
          </footer>
          <div className="mt-6 text-center text-xs text-gray-500">
            <p className="flex items-center justify-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" /> Ваши данные защищены. Мы не передаём вашу информацию третьим лицам.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
