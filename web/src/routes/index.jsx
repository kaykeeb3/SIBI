import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "../app/_layouts/app";
import { Login } from "../app/auth/login";
import { Signup } from "../app/auth/signup";
import { Dashboard } from "../app/dashboard/page";
import { ProtectedRoute } from "../components/protected-route";
import { Books } from "../app/books/page";
import { Loans } from "../app/loans/page";
import { Equipments } from "../app/equipments/page";
import { Schedules } from "../app/schedules/page";

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
        {
          path: "/books",
          element: <Books />,
        }, {
          path: "/loans",
          element: <Loans />,
        }, {
          path: "/equipments",
          element: <Equipments />,
        }, {
          path: "/schedules",
          element: <Schedules />,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}
