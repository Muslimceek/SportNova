import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { currentUser, getIdToken } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = async (product) => {
    if (favorites.find((item) => item.id === product.id)) return;
    if (!currentUser) {
      console.warn("User not logged in, saving favorites locally");
      setFavorites((prev) => [...prev, product]);
      return;
    }
    try {
      const token = await getIdToken();
      await axios.post(
        '/api/favorites',
        {
          productId: product.id,
          selectedColor: product.selectedColor || "Не выбран",
          selectedSize: product.selectedSize || "Не выбран",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites((prev) => [...prev, product]);
    } catch (error) {
      console.error("Error saving favorite:", error.response?.data || error.message);
    }
  };

  const removeFavorite = async (productId) => {
    if (!currentUser) {
      console.warn("User not logged in, removing favorite locally");
      setFavorites((prev) => prev.filter((item) => item.id !== productId));
      return;
    }
    try {
      const token = await getIdToken();
      await axios.delete(`/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((item) => item.id !== productId));
    } catch (error) {
      console.error("Error removing favorite:", error.response?.data || error.message);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
