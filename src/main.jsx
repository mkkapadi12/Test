import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Store/store";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <TooltipProvider>
      <App />
    </TooltipProvider>
    <Toaster position="bottom-right" />
  </Provider>,
);
