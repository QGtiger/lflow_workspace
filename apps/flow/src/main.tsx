import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { initRoutes } from "./utils/pagerouter";

import "./main.css";

const routes = initRoutes();
console.log(routes);
const router = createBrowserRouter(routes);
createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
