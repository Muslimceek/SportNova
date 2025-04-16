import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { db } from "../firebaseConfig";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

// Remove undefined fields
const sanitizeItem = item =>
  Object.entries(item).reduce((acc, [k, v]) => {
    if (v !== undefined) {
      acc[k] = v;
    }
    return acc;
  }, {});

// Get price with variant & discount
const getItemPrice = item => {
  if (item.pricing?.variants) {
    const variant = item.pricing.variants.find(v => v.color === item.selectedColor && v.size === item.selectedSize);
    const price = variant?.price ? Number(variant.price) : Number(item.pricing.basePrice || 0);
    const discount = item.promotions?.find(p => p.type === "discount" && p.active);
    return discount ? price * (1 - discount.value / 100) : price;
  }
  return 0;
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Update Firebase cart
  const updateFirebase = useCallback(
    async items => {
      const userId = currentUser?.uid || "guest";
      try {
        await setDoc(doc(db, "carts", userId), { items: items.map(sanitizeItem) }, { merge: true });
      } catch (e) {
        console.error("Ошибка обновления корзины:", e);
      }
    },
    [currentUser]
  );

  // Update local and remote cart
  const updateCartItems = useCallback(
    updater => setCartItems(prev => {
      const updated = updater(prev);
      updateFirebase(updated);
      return updated;
    }),
    [updateFirebase]
  );

  // Merge guest cart with user cart on login
  const mergeGuestCart = useCallback(async userId => {
    const userRef = doc(db, "carts", userId);
    const guestRef = doc(db, "carts", "guest");
    try {
      const [userSnap, guestSnap] = await Promise.all([getDoc(userRef), getDoc(guestRef)]);
      const userItems = userSnap.exists() ? userSnap.data().items || [] : [];
      const guestItems = guestSnap.exists() ? guestSnap.data().items || [] : [];
      if (guestItems.length) {
        const merged = [...userItems];
        guestItems.forEach(gi => {
          const exist = merged.find(i => i.id === gi.id && i.selectedSize === gi.selectedSize && i.selectedColor === gi.selectedColor);
          if (exist) {
            exist.quantity = Math.min(exist.quantity + gi.quantity, exist.stock ?? Infinity);
          } else merged.push(gi);
        });
        await setDoc(userRef, { items: merged.map(sanitizeItem) }, { merge: true });
        await setDoc(guestRef, { items: [] });
      }
    } catch (e) {
      console.error("Ошибка переноса корзины guest → user:", e);
    }
  }, []);

  useEffect(() => {
    if (currentUser) mergeGuestCart(currentUser.uid);
  }, [currentUser, mergeGuestCart]);

  // Listen for cart updates
  useEffect(() => {
    const userId = currentUser?.uid || "guest";
    const unsub = onSnapshot(
      doc(db, "carts", userId),
      snap => setCartItems(snap.exists() ? snap.data().items || [] : []),
      e => console.error("Ошибка чтения корзины:", e)
    );
    return () => unsub?.();
  }, [currentUser]);

  const addToCart = useCallback(
    product =>
      updateCartItems(prev => {
        const variant = product.pricing?.variants?.find(v => v.color === product.selectedColor && v.size === product.selectedSize);
        const stock = variant?.stock ?? product.stock ?? Infinity;
        const exist = prev.find(i => i.id === product.id && i.selectedSize === product.selectedSize && i.selectedColor === product.selectedColor);
        if (exist) {
          return prev.map(i =>
            i.id === product.id && i.selectedSize === product.selectedSize && i.selectedColor === product.selectedColor
              ? { ...i, quantity: Math.min(i.quantity + (product.quantity || 1), stock) }
              : i
          );
        }
        return [...prev, { ...product, quantity: Math.min(product.quantity || 1, stock), addedAt: new Date().toISOString(), stock }];
      }),
    [updateCartItems]
  );

  const removeFromCart = useCallback(
    (id, size, color) =>
      updateCartItems(prev => prev.filter(i => i.id !== id || i.selectedSize !== size || i.selectedColor !== color)),
    [updateCartItems]
  );

  const updateCartItem = useCallback(
    (id, size, color, newFields) =>
      updateCartItems(prev =>
        prev.map(i => {
          if (i.id === id && i.selectedSize === size && i.selectedColor === color) {
            const updated = { ...i, ...newFields };
            if (newFields.selectedColor || newFields.selectedSize) {
              const newColor = newFields.selectedColor || i.selectedColor;
              const newSize = newFields.selectedSize || i.selectedSize;
              if (i.pricing?.variants) {
                const variant = i.pricing.variants.find(v => v.color === newColor && v.size === newSize);
                updated.stock = variant?.stock ?? i.stock;
              }
            }
            updated.quantity = Math.min(updated.quantity, updated.stock ?? Infinity);
            return updated;
          }
          return i;
        })
      ),
    [updateCartItems]
  );

  const updateQuantity = useCallback(
    (id, size, color, qty) =>
      updateCartItems(prev =>
        prev.map(i =>
          i.id === id && i.selectedSize === size && i.selectedColor === color ? { ...i, quantity: Math.min(Math.max(1, qty), i.stock ?? Infinity) } : i
        )
      ),
    [updateCartItems]
  );

  const clearCart = useCallback(() => {
    updateFirebase([]);
    setCartItems([]);
  }, [updateFirebase]);

  const getTotalAmount = useCallback(() => cartItems.reduce((sum, i) => sum + getItemPrice(i) * i.quantity, 0), [cartItems]);
  const getTotalItemsCount = useCallback(() => cartItems.reduce((sum, i) => sum + i.quantity, 0), [cartItems]);

  const contextValue = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartItem,
      clearCart,
      getTotalAmount,
      getTotalItemsCount,
    }),
    [cartItems, addToCart, removeFromCart, updateQuantity, updateCartItem, clearCart, getTotalAmount, getTotalItemsCount]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export default CartContext;
