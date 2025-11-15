// react stuff
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./assets/main.css";

// pages
import App from "./pages/App";
import Settings from "./pages/Settings";

// redux
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <RouterProvider router={router} />
  </ReduxProvider>
);
