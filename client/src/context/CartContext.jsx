import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Adicionar item ao carrinho
  const addToCart = (item) => {
    setCartItems((prev) => {
      // Verifica se o item já está no carrinho
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        // Se já existe, aumenta a quantidade
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      // Se não, adiciona com quantidade 1
      return [...prev, { ...item, quantity: 1 }];
    });
    alert(`${item.description} adicionado ao carrinho!`);
  };

  // Remover item
  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Limpar carrinho (após compra)
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total
  const total = cartItems.reduce((acc, item) => acc + (Number(item.unitPrice) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;