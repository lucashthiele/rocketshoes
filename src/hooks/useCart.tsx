import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { Product, Stock } from "../types";

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem("@RocketShoes:cart");
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }
    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const filteredProduct = await api.get("/products").then((response) => {
        return response.data.filter(
          (product: Product) => product.id === productId
        );
      });

      const existingProduct = cart.filter(
        (product: Product) => product.id === filteredProduct[0].id
      );

      if (!existingProduct[0]) {
        setCart([
          ...cart,
          {
            ...filteredProduct[0],
            amount: 1,
          },
        ]);
      } else {
        setCart(
          cart.map((product: Product) =>
            product.id !== existingProduct[0].id
              ? product
              : {
                  ...product,
                  amount: product.amount + 1,
                }
          )
        );
      }
    } catch {
      // TODO
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const filteredCart = cart.filter((product) => product.id !== productId);
      setCart(filteredCart);
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
