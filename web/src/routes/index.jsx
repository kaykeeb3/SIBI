import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../app/_layouts/app";
import { Login } from "../app/auth/login";
import { Signup } from "../app/auth/signup";
import { Dashboard } from "../app/dashboard/page";
import { ProtectedRoute } from "../components/protected-route";

export function Routes() {
  const routes = createBrowserRouter([
    {
      path: "/auth/login",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/auth/register",
      element: (
        <ProtectedRoute requireAuth={false}>
          <Signup />
        </ProtectedRoute>
      ),
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
