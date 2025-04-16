import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Heart, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import ProductCard from '../../components/ProductCard';
import FavoritesHeader from './FavoritesHeader';

const FavoritesPage = () => {
  const { currentUser, getIdToken } = useAuth();
  const { removeFavorite } = useFavorites();
  const [favoritesData, setFavoritesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState('newest');

  const categories = Array.from(
    new Map(favoritesData.map(product => [product.category.id, product.category])).values()
  );
  const sizes = Array.from(
    new Set(favoritesData.map(product => product.selectedSize))
  ).filter(Boolean);

  useEffect(() => {
    const fetchFavoritesProducts = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const token = await getIdToken();
        const response = await axios.get('/api/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavoritesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Ошибка загрузки избранных товаров:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritesProducts();
  }, [currentUser, getIdToken]);

  useEffect(() => {
    let result = [...favoritesData];
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.category.id)
      );
    }
    if (selectedSizes.length > 0) {
      result = result.filter(product =>
        selectedSizes.includes(product.selectedSize)
      );
    }
    switch (sortOption) {
      case 'priceAsc':
        result.sort((a, b) => a.pricing.minPrice - b.pricing.minPrice);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.pricing.minPrice - a.pricing.minPrice);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    setFilteredData(result);
  }, [selectedCategories, selectedSizes, sortOption, favoritesData]);

  const handleRemove = async (favoriteId) => {
    await removeFavorite(favoriteId);
    setFavoritesData(prev => prev.filter(item => item.id !== favoriteId));
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
        <Heart className="text-gray-300 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Войдите для просмотра избранного</h2>
        <p className="text-gray-600 mb-6">Сохраняйте понравившиеся товары и покупайте их позже</p>
        <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Войти
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Heart className="w-12 h-12 text-gray-300 animate-bounce" />
        </div>
      </div>
    );
  }

  if (favoritesData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50">
        <Heart className="text-gray-300 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Нет избранных товаров</h2>
        <p className="text-gray-600 mb-6">Просмотрите нашу коллекцию и сохраните понравившиеся товары</p>
        <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
          Перейти к покупкам <ChevronRight className="inline-block ml-2" />
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <FavoritesHeader
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        categories={categories}
        selectedSizes={selectedSizes}
        toggleSize={toggleSize}
        sizes={sizes}
      />
      <div className="mb-4 text-gray-600">
        {filteredData.length} из {favoritesData.length} товаров
      </div>
      {filteredData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Нет товаров, соответствующих выбранным фильтрам.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredData.map(product => (
            <div 
              key={product.id} 
              className="relative group transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden"
            >
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product.id)}
                className="absolute top-3 right-3 bg-white border border-gray-200 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600 focus:outline-none"
                aria-label="Удалить из избранного"
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
