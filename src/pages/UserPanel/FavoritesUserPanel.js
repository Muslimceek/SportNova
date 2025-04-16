import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useAuthState } from "react-firebase-hooks/auth";

// Функция для получения избранных товаров для личного кабинета
const fetchFavoritesUserPanel = async (userUid) => {
  if (!userUid) return [];
  const favoritesRef = collection(db, "favorites");
  const q = query(favoritesRef, where("userId", "==", userUid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const FavoriteItem = ({ item }) => (
  <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow border border-gray-100">
    <h3 className="font-bold text-lg">{item.title || "Без названия"}</h3>
    <p className="text-gray-600 mt-2">{item.description || "Описание отсутствует"}</p>
  </div>
);

const FavoritesUserPanel = () => {
  // Получаем информацию об авторизованном пользователе
  const [user, loadingAuth, errorAuth] = useAuthState(auth);

  // Запрашиваем избранное только если пользователь авторизован
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ["favoritesUserPanel", user?.uid],
    queryFn: () => fetchFavoritesUserPanel(user.uid),
    enabled: !!user,
  });

  if (loadingAuth || isLoading) {
    return (
      <div className="p-8">
        <Skeleton height={40} count={3} className="mb-4" />
      </div>
    );
  }

  if (error || errorAuth) {
    return (
      <div className="p-8">
        <p className="text-red-600">Ошибка загрузки избранного</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8">
        <p className="text-gray-600">Пожалуйста, войдите в систему, чтобы видеть избранное.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Избранное</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-600">Избранные товары отсутствуют.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <FavoriteItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesUserPanel;
