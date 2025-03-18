import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NotebookText, Calendar, Laptop, Library, LogOut, ChartLine } from "lucide-react";
import { logoutUser, getUserProfile } from "../services/auth-service";

export function Header() {
  const location = useLocation();
  const [userData, setUserData] = useState({ name: "", profilePicture: "" });

  useEffect(() => {
    getUserProfile()
      .then((data) => {
        const firstName = data.user.name.split(" ")[0];
        setUserData({
          name: firstName,
          profilePicture: data.user.profilePicture || "",
        });
      })
      .catch(() => {
        logoutUser();
      });
  }, []);

  if (!localStorage.getItem("token")) {
    return null;
  }

  const navItems = [
    { to: "/", label: "Dashboard", icon: <ChartLine size={18} /> },
    { to: "/books", label: "Livros", icon: <NotebookText size={18} /> },
    { to: "/loans", label: "Empréstimos", icon: <Library size={18} /> },
    { to: "/equipments", label: "Equipamentos", icon: <Laptop size={18} /> },
    { to: "/schedules", label: "Agendamentos", icon: <Calendar size={18} /> },
  ];

  return (
    <header className="w-full py-3 border-b border-zinc-300 bg-white shadow-sm">
      <div className="mx-auto flex items-center justify-between px-6">
        <nav className="flex space-x-2">
          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200
                ${isActive
                    ? "bg-purple-50 text-purple-600 border-b border-purple-600"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-purple-600"}`}
              >
                <span className="mr-2">{icon}</span>
                <span className="hidden sm:inline text-xs">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-5">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full px-3 py-1 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">⌘ K</span>
          </div>

          <div className="flex items-center space-x-2">
            {userData.profilePicture && (
              <img
                src={userData.profilePicture}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}

            <div className="flex flex-col items-end text-left">
              <span className="text-xs font-medium text-zinc-800">
                {userData.name ? `Olá, ${userData.name}` : "Carregando..."}
              </span>
              <button
                onClick={logoutUser}
                className="flex items-center text-xs text-red-600 font-medium transition-transform duration-200 hover:text-red-700"
              >
                <LogOut size={10} className="mr-1" />
                sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
