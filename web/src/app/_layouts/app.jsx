import { Outlet } from "react-router-dom";
import { Header } from "../../components/header";

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 w-full">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
