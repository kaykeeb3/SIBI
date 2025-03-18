import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../app/_layouts/app";
import { Login } from "../app/auth/login";
import { Signup } from "../app/auth/signup";
import { Dashboard } from "../app/dashboard/page";
import { ProtectedRoute } from "../components/protected-route";
import { Books } from "../app/books/page";
import { ForgotPassword } from "../app/auth/forgot-password";

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
      path: "/auth/forgot-password",
      element: (
        <ProtectedRoute requireAuth={false}>
          <ForgotPassword />
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
        {
          path: "/books",
          element: <Books />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
