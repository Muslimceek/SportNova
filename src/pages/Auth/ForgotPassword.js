import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { MailCheck, Loader2, AlertCircle } from "lucide-react";

const ForgotPassword = () => {
  // Состояния: email, статус (idle, loading, success, error) и сообщение об ошибке
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState("");
  
  // Реф для управления фокусом при ошибке
  const inputRef = useRef(null);
  const auth = getAuth();

  // Функция валидации email с использованием регулярного выражения
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // При возникновении ошибки переводим фокус на инпут для улучшения доступности
  useEffect(() => {
    if (status === "error" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверяем валидность email до отправки запроса
    if (!isValidEmail(email)) {
      setError("Введите корректный email.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      // Отправляем запрос на сброс пароля через Firebase
      await sendPasswordResetEmail(auth, email);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError("Ошибка при отправке письма. Повторите позже.");
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 p-4">
      {/* Основная секция формы с aria-labelledby для улучшения навигации screen reader'ов */}
      <section
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 animate-fade-in"
        aria-labelledby="forgot-password-title"
      >
        <header className="text-center mb-6">
          <h1 id="forgot-password-title" className="text-2xl font-bold text-gray-900">
            Восстановление пароля
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Введите ваш email, чтобы получить ссылку для сброса пароля.
          </p>
        </header>

        {/* Состояние успешной отправки письма */}
        {status === "success" ? (
          <div
            role="alert"
            className="flex items-center gap-2 bg-green-100 text-green-800 text-sm px-4 py-3 rounded-lg mb-4"
          >
            <MailCheck size={18} />
            Письмо отправлено! Проверьте вашу почту.
          </div>
        ) : (
          // Форма сброса пароля
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                ref={inputRef}
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                required
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? "email-error" : undefined}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>

            {/* Отображение сообщения об ошибке */}
            {error && (
              <div
                id="email-error"
                role="alert"
                className="flex items-center gap-2 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg mb-4"
              >
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className={`w-full py-3 font-semibold rounded-lg transition text-white focus:outline-none ${
                status === "loading"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
              aria-busy={status === "loading"}
            >
              {status === "loading" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Отправка...
                </span>
              ) : (
                "Отправить ссылку"
              )}
            </button>
          </form>
        )}

        <footer className="mt-6 text-center text-sm text-gray-700">
          Вспомнили пароль?{" "}
          <Link to="/login" className="text-black hover:underline font-medium">
            Войти
          </Link>
        </footer>
      </section>
    </main>
  );
};

export default ForgotPassword;
