import React, { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdClose } from 'react-icons/io';

const CartModal = ({ cartItems, totalAmount, onClose, onRemoveItem }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => modalRef.current && !modalRef.current.contains(e.target) && onClose();
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleClose = useCallback((e) => { e.stopPropagation(); onClose(); }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-end p-4 z-50"
      >
        <motion.div
          key="modal"
          ref={modalRef}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '20%', opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-sm md:max-w-md bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 border-opacity-50 relative"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Корзина</h2>
            <button
              onClick={handleClose}
              className="p-3 rounded-full hover:bg-gray-200 hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 dark:text-gray-300 dark:hover:text-gray-100 text-2xl transition-transform duration-300 hover:rotate-90"
            >
              <IoMdClose />
            </button>
          </div>
          {cartItems.length === 0 ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-gray-600 dark:text-gray-300 text-center"
            >
              Ваша корзина пуста.
            </motion.p>
          ) : (
            <div className="space-y-6">
              <div className="max-h-72 overflow-y-auto scroll-smooth pr-2">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="flex justify-between items-center bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg border border-gray-100 dark:border-gray-600 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
                    >
                      <div className="flex items-center">
                        <img
                          src={item.url || '/images/default.jpg'}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                        <div className="ml-4 overflow-hidden text-ellipsis whitespace-nowrap">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                            {item.quantity} шт. x {item.price.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-blue-600">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-3 rounded-full text-red-500 hover:text-red-700 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between text-xl font-medium">
                  <span className="text-gray-800 dark:text-gray-100">Итого:</span>
                  <span className="font-extrabold text-gray-900 dark:text-gray-100">
                    {totalAmount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <Link
                  to="/cart"
                  onClick={onClose}
                  className="mt-6 block w-full py-4 text-center text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-[1.02]"
                >
                  Перейти в корзину
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartModal;
