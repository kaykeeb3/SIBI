import { AppLayout } from "../app/_layouts/app";
import { Login } from "../app/auth/login";
import { Signup } from "../app/auth/signup";
import { Dashboard } from "../app/dashboard/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

export function Routes() {
  const routes = [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "auth/login",
          element: <Login />,
        },
        {
          path: "auth/register",
          element: <Signup />,
        },
      ],
    },
  ];

  return <RouterProvider router={createBrowserRouter(routes)} />;
}
