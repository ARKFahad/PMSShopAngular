import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export interface CartItem {
  id?: string;
  productId: string;
  quantity: number;
  price: number;
  productName: string;
  productPackSize?: string;
  productStockQuantity: number;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber?: string;
  balance?: number;
  accountId?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  currentCustomer: Customer | null;
  cartId: string | null;
  isCartInvalid: boolean;
  add: (product: any, quantity?: number) => void;
  increase: (productId: string, productStockQuantity: number, quantity?: number) => void;
  onChangeQuantity: (productId: string, newQty: number, productStockQuantity: number) => void;
  reduce: (productId: string, productStockQuantity: number, quantity?: number) => void;
  remove: (productId: string) => void;
  setCurrentCustomer: (customer: Customer | null) => void;
  getCustomerCart: (customerId: string) => void;
  clearCartItemsOnly: () => void;
  reset: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentCustomer, setCurrentCustomerState] = useState<Customer | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isCartInvalid, setIsCartInvalid] = useState<boolean>(true);

  const calculateTotal = (items: CartItem[]): CartItem[] => {
    return items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    }));
  };

  const setCurrentCustomer = useCallback((customer: Customer | null) => {
    setCurrentCustomerState(customer);
    if (customer) {
      setIsCartInvalid(false);
    } else {
      setIsCartInvalid(true);
    }
  }, []);

  const getCustomerCart = useCallback((customerId: string) => {
    setCartItems([]);
    setCartId('fdfdfdf');
  }, []);

  const add = useCallback(
    (product: any, quantity: number = 1) => {
      if (!cartId) {
        return;
      }
      setCartItems((prevItems) => {
        const foundIndex = prevItems.findIndex((a) => a.productId === product.productId);
        if (foundIndex > -1) {
          const item = prevItems[foundIndex];
          if (item.quantity >= product.quantity) {
            toast.error('Stock Exceeded !!!');
            return prevItems;
          } else {
            const updated = [...prevItems];
            updated[foundIndex] = {
              ...item,
              quantity: item.quantity + quantity,
              total: (item.quantity + quantity) * item.price,
            };
            return updated;
          }
        } else {
          toast.info('Product Added to Cart');
          const newItem: CartItem = {
            productId: product.productId,
            quantity: quantity ?? 1,
            price: product.mrp,
            productName: product.productName,
            productPackSize: product.productPackSize,
            productStockQuantity: product.quantity,
            total: (quantity ?? 1) * product.mrp,
          };
          return [...prevItems, newItem];
        }
      });
    },
    [cartId]
  );

  const increase = useCallback(
    (productId: string, productStockQuantity: number, quantity: number = 1) => {
      if (!cartId) return;
      setCartItems((prevItems) => {
        const index = prevItems.findIndex((a) => a.productId === productId);
        if (index > -1) {
          const item = prevItems[index];
          if (item.quantity >= productStockQuantity) {
            toast.error('Stock Exceeded !!!');
            return prevItems;
          } else {
            const updated = [...prevItems];
            updated[index] = {
              ...item,
              quantity: item.quantity + quantity,
              total: (item.quantity + quantity) * item.price,
            };
            return updated;
          }
        }
        return prevItems;
      });
    },
    [cartId]
  );

  const onChangeQuantity = useCallback(
    (productId: string, newQty: number, productStockQuantity: number) => {
      if (!cartId) return;
      setCartItems((prevItems) => {
        const index = prevItems.findIndex((a) => a.productId === productId);
        if (index > -1) {
          const item = prevItems[index];
          let qty = newQty;
          if (qty > productStockQuantity) {
            toast.error('Stock Exceeded !!!');
            qty = productStockQuantity;
          }
          if (qty <= 0) qty = 1;
          const updated = [...prevItems];
          updated[index] = {
            ...item,
            quantity: qty,
            total: qty * item.price,
          };
          return updated;
        }
        return prevItems;
      });
    },
    [cartId]
  );

  const reduce = useCallback(
    (productId: string, productStockQuantity: number, quantity: number = 1) => {
      if (!cartId) return;
      setCartItems((prevItems) => {
        const index = prevItems.findIndex((a) => a.productId === productId);
        if (index > -1) {
          const item = prevItems[index];
          if (item.quantity > 1) {
            const updated = [...prevItems];
            updated[index] = {
              ...item,
              quantity: item.quantity - quantity,
              total: (item.quantity - quantity) * item.price,
            };
            return updated;
          } else {
            return prevItems.filter((a) => a.productId !== productId);
          }
        }
        return prevItems;
      });
    },
    [cartId]
  );

  const remove = useCallback(
    (productId: string) => {
      if (!cartId) return;
      setCartItems((prevItems) => prevItems.filter((a) => a.productId !== productId));
    },
    [cartId]
  );

  const clearCartItemsOnly = useCallback(() => {
    setCartItems([]);
  }, []);

  const reset = useCallback(() => {
    setCartItems([]);
    setCurrentCustomerState(null);
    setCartId(null);
    setIsCartInvalid(true);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        currentCustomer,
        cartId,
        isCartInvalid,
        add,
        increase,
        onChangeQuantity,
        reduce,
        remove,
        setCurrentCustomer,
        getCustomerCart,
        clearCartItemsOnly,
        reset,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
