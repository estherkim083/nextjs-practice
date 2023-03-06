import { createContext, useReducer } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initalState = {
  cart: Cookies.get("cart")
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.name === newItem.name
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(
            (item) => (item.name === existItem.name ? newItem : item) // new quantity
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    case "CART_REMOVE_ITEM":
      const cartItemsRemaining = state.cart.cartItems.filter(
        (item) => item.name !== action.payload.name
      );
      Cookies.set("cart", JSON.stringify({ cartItems: cartItemsRemaining }));
      return { ...state, cart: { cartItems: cartItemsRemaining } };
    case "CART_RESET":
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case "CART_CLEAR_ITEMS":
      return {
        ...state,
        cart: { ...state.cart, cartItems: [] },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initalState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
