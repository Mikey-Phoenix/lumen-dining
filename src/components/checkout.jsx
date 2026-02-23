import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkedOut, setCheckedOut] = useState(false);

  return (
    <CheckoutContext.Provider value={{ checkedOut, setCheckedOut }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}