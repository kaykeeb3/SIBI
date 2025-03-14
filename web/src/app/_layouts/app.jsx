import { Outlet } from "react-router-dom";
import { Header } from "../../components/header";
import { ProtectedRoute } from "../../components/protected-route";

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full">
        <div className="w-full h-full">
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        </div>
      </main>
    </div>
  );
}
