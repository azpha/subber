import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./assets/main.css";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>
);
