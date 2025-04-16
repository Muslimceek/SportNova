import React, { useState, useCallback, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { db } from "../../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Breadcrumbs from "../../components/Breadcrumbs";

const stripePromise = loadStripe(
  "pk_test_51Qtw8YDteedlQTnKyhbJ5PfULoOscVODxCf6EwH6dEFX26NGMddmZXDcfDDOWizMQ8XdvmuZ3YycTe8FMEofouUI00GRTRhXR7"
);

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      fontFamily: '"Inter", sans-serif',
      color: '#1f2937',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
};

const CheckoutFormComponent = ({ amount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingMethod, setShippingMethod] = useState(
    localStorage.getItem("shippingMethod") || "pickup"
  );
  const [shippingAddress, setShippingAddress] = useState(
    localStorage.getItem("shippingAddress") || ""
  );
  const [deliveryDate, setDeliveryDate] = useState(
    localStorage.getItem("deliveryDate") || ""
  );
  const [addressError, setAddressError] = useState("");
  const [pickupSearch, setPickupSearch] = useState("");
  const [mapSrc, setMapSrc] = useState(
    "https://yandex.ru/map-widget/v1/?text=SportNova"
  );
  const [pickupSuggestions, setPickupSuggestions] = useState([]);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { cartItems, clearCart } = useCart();

  useEffect(() => {
    localStorage.setItem("shippingMethod", shippingMethod);
    localStorage.setItem("shippingAddress", shippingAddress);
    localStorage.setItem("deliveryDate", deliveryDate);
  }, [shippingMethod, shippingAddress, deliveryDate]);

  const handlePickupSearch = useCallback(() => {
    if (!pickupSearch.trim()) {
      setAddressError("Введите адрес или название для поиска.");
      return;
    }
    setMapSrc(
      `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(pickupSearch)}`
    );
    setPickupSuggestions([
      `${pickupSearch} ул. Ленина, 10`,
      `${pickupSearch} проспект Мира, 5`,
      `${pickupSearch} ул. Пушкина, 3`,
    ]);
    setAddressError("");
  }, [pickupSearch]);

  const handleSelectSuggestion = useCallback((suggestion) => {
    setShippingAddress(`Самовывоз: ${suggestion}`);
    setPickupSearch(suggestion);
    setPickupSuggestions([]);
    setAddressError("");
  }, []);

  const handleCheckout = useCallback(
    async (e) => {
      e.preventDefault();
      if (!stripe || !elements || !currentUser) return;

      if (shippingMethod !== "pickup" && shippingAddress.trim().length < 5) {
        setAddressError("Пожалуйста, укажите корректный адрес.");
        return;
      }
      if (shippingMethod === "pickup" && !shippingAddress.includes("Самовывоз:")) {
        setAddressError("Пожалуйста, выберите точку самовывоза.");
        return;
      }

      setIsProcessing(true);
      try {
        const res = await fetch(
          "http://localhost:4000/api/stripe/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency: "RUB" }),
          }
        );
        const { clientSecret, error: backendError } = await res.json();
        if (backendError || !clientSecret) {
          throw new Error(backendError || "Не получен clientSecret");
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          { payment_method: { card: cardElement } }
        );

        if (error) {
          alert(`Ошибка оплаты: ${error.message}`);
          return;
        }
        if (paymentIntent?.status === "succeeded") {
          const paymentMethod =
            paymentIntent.payment_method_types?.[0] || "card";
          await setDoc(doc(db, "orders", paymentIntent.id), {
            userId: currentUser.uid,
            items: cartItems,
            amount: paymentIntent.amount / 100,
            currency: paymentIntent.currency,
            status: "paid",
            paymentMethod,
            shippingMethod,
            shippingAddress,
            deliveryDate,
            createdAt: serverTimestamp(),
          });
          clearCart();
          navigate("/user/orders");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        alert("Произошла ошибка при оплате.");
      } finally {
        setIsProcessing(false);
      }
    },
    [
      stripe,
      elements,
      amount,
      currentUser,
      cartItems,
      clearCart,
      navigate,
      shippingMethod,
      shippingAddress,
      deliveryDate,
    ]
  );

  return (
    <form onSubmit={handleCheckout} className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-medium text-gray-800">Оплата</h2>
        <span className="text-2xl font-medium text-gray-800">₽{amount.toFixed(2)}</span>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Способ доставки</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'pickup', label: 'Самовывоз' },
              { id: 'courier', label: 'Курьер' },
              { id: 'post', label: 'Почта' }
            ].map(method => (
              <button
                key={method.id}
                type="button"
                onClick={() => {
                  setShippingMethod(method.id);
                  if (method.id !== "pickup") {
                    setShippingAddress("");
                    setPickupSuggestions([]);
                  }
                }}
                className={`py-2.5 rounded-lg transition-all ${
                  shippingMethod === method.id
                    ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200 font-medium'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>

        {shippingMethod !== "pickup" ? (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Адрес доставки</label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => {
                setShippingAddress(e.target.value);
                setAddressError("");
              }}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Город, улица, дом, квартира"
            />
            {addressError && (
              <p className="text-xs text-red-500 mt-1">{addressError}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Точка самовывоза</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={pickupSearch}
                onChange={(e) => setPickupSearch(e.target.value)}
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Введите адрес..."
              />
              <button
                type="button"
                onClick={handlePickupSearch}
                className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <iframe
              title="Пункт самовывоза"
              src={mapSrc}
              className="w-full h-48 rounded-lg border border-gray-200 mb-3"
              allowFullScreen
            />
            
            {pickupSuggestions.length > 0 && (
              <ul className="text-sm border border-gray-200 rounded-lg overflow-hidden">
                {pickupSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 border-gray-200"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            
            {addressError && (
              <p className="text-xs text-red-500 mt-1">{addressError}</p>
            )}
          </div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Дата и время доставки</label>
          <input
            type="datetime-local"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Данные карты</label>
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <CardElement options={cardStyle} />
          </div>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full py-3.5 rounded-lg font-medium text-base mt-8 transition-colors ${
          isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Обработка...
          </span>
        ) : (
          'Оплатить'
        )}
      </button>
    </form>
  );
};

const CheckoutForm = ({ amount }) => {
  const { isAdmin } = useAuth();
  
  if (isAdmin)
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-amber-50 border-l-4 border-amber-400 text-amber-700 rounded-lg">
        Оплата не предназначена для администраторов.
      </div>
    );
    
  return (
    <Elements stripe={stripePromise}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto mb-6">
          <Breadcrumbs />
        </div>
        <CheckoutFormComponent amount={amount} />
      </div>
    </Elements>
  );
};

export default CheckoutForm;
