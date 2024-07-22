import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./components/CartContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENTID}>
      <CartProvider>
        <App />
      </CartProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);
