export const applyFilters = (products, filters) => {
    const { searchQuery, selectedCategory, selectedSubcategory, selectedBrand, minPrice, maxPrice, minDiscount, inStockOnly } = filters;
    
    return products.filter(p => {
      // Фильтр по категории
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      
      // Фильтр по подкатегории
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) {
        return false;
      }
      
      // Фильтр по бренду
      if (selectedBrand && p.brand !== selectedBrand) {
        return false;
      }
      
      // Фильтры по цене
      const price = p.pricing?.discounted || p.pricing?.basePrice || p.pricing?.minPrice || 0;
      if (minPrice && price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && price > parseFloat(maxPrice)) {
        return false;
      }
      
      // Фильтр по скидке
      const discount = p.pricing?.discountPercentage || 0;
      if (minDiscount && discount < parseFloat(minDiscount)) {
        return false;
      }
      
      // Фильтр по наличию товара
      if (inStockOnly && !p.inStock) {
        return false;
      }
      
      // Фильтр по поисковому запросу
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        
        // Преобразование свойств в строку для безопасного вызова toLowerCase()
        const name = p.name ? String(p.name) : "";
        const description = p.description ? String(p.description) : "";
        const brand = p.brand ? String(p.brand) : "";
        
        const nameMatch = name.toLowerCase().includes(query);
        const descMatch = description.toLowerCase().includes(query);
        const brandMatch = brand.toLowerCase().includes(query);
        
        return nameMatch || descMatch || brandMatch;
      }
      
      return true;
    });
  };
  