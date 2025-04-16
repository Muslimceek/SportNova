import React, { useState, createContext, useContext } from 'react';
import { ArrowUpDown, Filter, ChevronDown, X } from 'lucide-react';

// Создаём контекст для каждого выпадающего меню
const DropdownMenuContext = createContext();

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

// Общий стиль для кнопок-триггеров, что уменьшает дублирование кода
const baseTriggerStyles = "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full transition-all duration-200 hover:border-black hover:shadow-md focus:outline-none";

// Триггер выпадающего меню с улучшенной доступностью и плавной анимацией
const DropdownMenuTrigger = ({ children, className = '' }) => {
  const { open, setOpen } = useContext(DropdownMenuContext);
  return (
    <button
      onClick={() => setOpen(prev => !prev)}
      className={`${baseTriggerStyles} ${className}`}
      aria-expanded={open}
    >
      {children}
      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
  );
};

// Контент выпадающего меню, который всегда находится в DOM для плавного перехода
const DropdownMenuContent = ({ children, className = '' }) => {
  const { open } = useContext(DropdownMenuContext);
  return (
    <div 
      className={`absolute z-30 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 origin-top-right transform transition-all duration-200 ${open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"} ${className}`}
    >
      {children}
    </div>
  );
};

const DropdownMenuLabel = ({ children, className = '' }) => (
  <div className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-500 ${className}`}>
    {children}
  </div>
);

// Элемент меню с единообразными состояниями наведения и активного клика
const DropdownMenuItem = ({ children, className = '', onClick }) => {
  const { setOpen } = useContext(DropdownMenuContext);
  return (
    <div 
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

const Checkbox = ({ checked, onChange }) => (
  <div className="relative flex items-center">
    <input 
      type="checkbox" 
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-colors duration-200 focus:outline-none
      ${checked ? 'bg-black border-black' : 'border-gray-300'}`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  </div>
);

const SizePill = ({ size, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none
      ${selected ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
  >
    <span className="text-sm font-medium">{size}</span>
  </button>
);

const ActiveFilterTag = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
    <span className="text-sm">{label}</span>
    <button 
      onClick={onRemove}
      className="focus:outline-none"
      aria-label="Remove filter"
    >
      <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
    </button>
  </div>
);

// Компонент заголовка Избранного с улучшенной горизонтальной выравненностью, четкой иерархией и адаптивностью
const FavoritesHeader = ({
  sortOption,
  setSortOption,
  selectedCategories,
  toggleCategory,
  categories,
  selectedSizes,
  toggleSize,
  sizes,
}) => {
  const sortLabels = {
    newest: 'Новинки',
    priceAsc: 'Цена: по возрастанию',
    priceDesc: 'Цена: по убыванию'
  };

  return (
    <header className="px-6 py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4 md:mb-0">Избранное</h1>
          <div className="flex flex-wrap gap-3">
            {selectedCategories.map(catId => {
              const category = categories.find(c => c.id === catId);
              return (
                <ActiveFilterTag
                  key={catId}
                  label={category?.name.ru || ''}
                  onRemove={() => toggleCategory(catId)}
                />
              );
            })}
            {selectedSizes.map(size => (
              <ActiveFilterTag
                key={size}
                label={`Размер: ${size}`}
                onRemove={() => toggleSize(size)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Выпадающее меню для сортировки */}
          <DropdownMenu>
            <DropdownMenuTrigger className="font-medium text-[15px]">
              <ArrowUpDown className="w-5 h-5" />
              {sortLabels[sortOption]}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="py-2">
              <DropdownMenuLabel>Сортировать по</DropdownMenuLabel>
              {Object.entries(sortLabels).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setSortOption(key)}
                  className={`${sortOption === key ? 'bg-gray-50' : ''}`}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Выпадающее меню для фильтров */}
          <DropdownMenu>
            <DropdownMenuTrigger className="font-medium text-[15px]">
              <Filter className="w-5 h-5" />
              Фильтры
              {(selectedCategories.length > 0 || selectedSizes.length > 0) && (
                <span className="ml-1 text-gray-500">
                  ({selectedCategories.length + selectedSizes.length})
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[13px] font-semibold uppercase tracking-wide text-gray-600">Категории</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg transition-colors hover:bg-gray-50 focus:outline-none"
                      onClick={() => toggleCategory(category.id)}
                    >
                      <Checkbox 
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <span className="text-sm">{category.name.ru}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[13px] font-semibold uppercase tracking-wide text-gray-600">Размеры</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <SizePill
                      key={size}
                      size={size}
                      selected={selectedSizes.includes(size)}
                      onClick={() => toggleSize(size)}
                    />
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default FavoritesHeader;
