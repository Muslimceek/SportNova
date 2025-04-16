import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Providers from "./contexts/Providers";
import { FavoritesProvider } from "./contexts/FavoritesContext"; // ✅ Добавляем избранное
import AppRoutes from "./routes/AppRoutes";

// Подключаем Stripe
const stripePromise = loadStripe("pk_test_1234567890abcdef");

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Providers>
        {/* ✅ Оборачиваем в провайдер избранного */}
        <FavoritesProvider>
          <AppRoutes />
        </FavoritesProvider>
      </Providers>
    </Elements>
  );
}

export default App;