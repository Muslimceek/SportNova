import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  MessageSquare,
  Smartphone,
  Loader2,
  CheckCircle,
  AlertCircle,
  Mail,
  ArrowRight,
} from "lucide-react";

// FadeIn with minimal logic & smooth transition
const FadeIn = ({ children, delay = 0, className = "", ...props }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      {...props}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

FadeIn.propTypes = {
  children: PropTypes.node.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
};

// Reusable ContactCard with clean structure
const ContactCard = ({ icon: Icon, title, children }) => (
  <section
    aria-label={title}
    className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-2xl shadow border hover:shadow-lg transform hover:-translate-y-1 transition"
  >
    <div className="p-3 bg-primary-50 rounded-full">
      <Icon className="w-8 h-8 text-primary-600" aria-hidden="true" />
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <div className="text-gray-600 space-y-1">{children}</div>
  </section>
);

ContactCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// InputField with focus management
const InputField = ({ label, type = "text", name, value, onChange, required, placeholder }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`w-full px-4 py-3 border rounded-lg bg-white transition ${
          focused ? "border-primary-500 ring-2 ring-primary-100" : "border-gray-300"
        }`}
      />
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
};

// Production-ready ContactForm with complete feedback states
const ContactForm = () => {
  const initialData = { name: "", email: "", phone: "", subject: "", message: "" };
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState({ state: "idle", error: null });
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback(
    (e) => {
      setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      !touched && setTouched(true);
    },
    [touched]
  );

  const isValid = useCallback(
    () => data.name.trim() && data.email.trim() && data.message.trim(),
    [data]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", error: null });
    try {
      const { data: res } = await axios.post("/api/contact", data);
      if (res.success) {
        setStatus({ state: "success", error: null });
        setData(initialData);
        setTouched(false);
      } else {
        setStatus({ state: "error", error: res.error || "Ошибка отправки" });
      }
    } catch (err) {
      setStatus({ state: "error", error: err.response?.data?.error || "Ошибка. Повторите позже." });
    }
  };

  useEffect(() => {
    if (status.state === "success") {
      const timer = setTimeout(() => setStatus({ state: "idle", error: null }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status.state]);

  return (
    <section aria-labelledby="contact-heading" className="space-y-6">
      <h2 id="contact-heading" className="text-2xl font-bold text-gray-900">
        Свяжитесь с нами
      </h2>
      {status.state === "success" && (
        <div role="alert" className="flex items-center gap-3 p-5 bg-green-50 text-green-700 rounded-lg border animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Сообщение успешно отправлено! Ожидайте ответа.</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Ваше имя" name="name" value={data.name} onChange={handleChange} placeholder="Иван Иванов" required />
          <InputField label="Email адрес" type="email" name="email" value={data.email} onChange={handleChange} placeholder="example@mail.com" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Телефон" type="tel" name="phone" value={data.phone} onChange={handleChange} placeholder="+7 (___) ___-__-__" />
          <InputField label="Тема" name="subject" value={data.subject} onChange={handleChange} placeholder="Вопрос о продукте" />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Сообщение <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            required
            value={data.message}
            onChange={handleChange}
            placeholder="Опишите ваш вопрос..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg transition focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-sm text-gray-500">Конфиденциальность гарантирована</p>
        </div>
        {status.state === "error" && (
          <div role="alert" className="flex items-center gap-3 p-4 bg-red-50 text-red-700 border rounded-lg animate-shake">
            <AlertCircle className="w-5 h-5" />
            <span>{status.error}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={status.state === "loading" || (touched && !isValid())}
          className={`group w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-full focus:outline-none transition ${
            touched && !isValid() ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {status.state === "loading" ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              Отправить сообщение
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </section>
  );
};

// YandexMap loads the API and initializes the map
const YandexMap = () => {
  const mapRef = useRef(null);
  useEffect(() => {
    const initMap = () => {
      if (mapRef.current) {
        const map = new window.ymaps.Map(mapRef.current, { center: [55.76, 37.64], zoom: 10 });
        map.geoObjects.add(
          new window.ymaps.Placemark([55.76, 37.64], {}, { preset: "islands#icon", iconColor: "#0095b6" })
        );
      }
    };
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
      script.async = true;
      script.onload = () => window.ymaps.ready(initMap);
      document.body.appendChild(script);
    } else {
      window.ymaps.ready(initMap);
    }
  }, []);
  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};

// Office location display
const LocationCard = () => (
  <div className="relative w-full h-64 rounded-xl overflow-hidden shadow border">
    <YandexMap />
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90">
      <h3 className="font-semibold">Наш главный офис</h3>
      <p className="text-sm text-gray-600">Москва, ул. Пример, 123</p>
    </div>
  </div>
);

// FAQ component
const FAQList = () => {
  const items = ["Как отследить мой заказ?", "Политика возврата", "Доставка и оплата"];
  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h3>
      <ul className="space-y-4">
        {items.map((text, i) => (
          <li key={i} className={i ? "border-t pt-4" : ""}>
            <button className="w-full flex justify-between items-center text-left text-gray-700 hover:text-primary-600 transition">
              <span>{text}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main Contact page integrating all components with a container consistent with Navbar
const ContactPage = () => (
  <main className="bg-gray-50 pt-24 pb-16 md:pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Остались вопросы? Мы на связи 7:00–00:00, 7 дней в неделю. Ответим в течение 24 часов.
          </p>
        </header>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {[
          {
            delay: 100,
            icon: MessageSquare,
            title: "Онлайн-чат",
            content: (
              <>
                <p>Быстрые ответы</p>
                <p className="text-sm">7:00 – 00:00 ежедневно</p>
                <button className="mt-4 text-primary-600 font-medium hover:underline transition flex items-center mx-auto">
                  Начать чат <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </>
            ),
          },
          {
            delay: 200,
            icon: Smartphone,
            title: "Телефон",
            content: (
              <>
                <p>+7 (900) 123-45-67</p>
                <p className="text-sm">Пн–Пт: 9:00–21:00</p>
                <p className="text-sm">Сб–Вс: 10:00–18:00</p>
                <p className="text-xs text-gray-500 mt-2">Международные звонки</p>
              </>
            ),
          },
          {
            delay: 300,
            icon: Mail,
            title: "Email",
            content: (
              <>
                <p>support@example.com</p>
                <p className="text-sm">Ответим за 24 часа</p>
                <p className="text-xs text-gray-500 mt-2">Для срочных вопросов используйте чат</p>
              </>
            ),
          },
        ].map(({ delay, icon, title, content }, i) => (
          <FadeIn key={i} delay={delay}>
            <ContactCard icon={icon} title={title}>
              {content}
            </ContactCard>
          </FadeIn>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <FadeIn delay={400} className="lg:col-span-3">
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow border">
            <ContactForm />
          </section>
        </FadeIn>
        <FadeIn delay={500} className="lg:col-span-2 space-y-8">
          <FAQList />
          <LocationCard />
        </FadeIn>
      </div>
    </div>
  </main>
);

export default memo(ContactPage);