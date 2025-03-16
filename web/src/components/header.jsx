import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotebookText, Calendar, Laptop, Library, LogOut, ChartLine } from "lucide-react";
import { logoutUser, getUserProfile } from "../services/auth-service";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      getUserProfile()
        .then((data) => {
          const firstName = data.user.name.split(" ")[0];
          setUserName(firstName);
        })
        .catch((error) => {
          console.error("Erro ao obter perfil:", error.message);
        });
    }
  }, [token]);

  if (!token) {
    return null;
  }

  const navItems = [
    { to: "/", label: "Dashboard", icon: <ChartLine size={18} /> },
    { to: "/livros", label: "Livros", icon: <NotebookText size={18} /> },
    { to: "/emprestimos", label: "Empréstimos", icon: <Library size={18} /> },
    { to: "/equipamentos", label: "Equipamentos", icon: <Laptop size={18} /> },
    { to: "/agendamentos", label: "Agendamentos", icon: <Calendar size={18} /> },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/auth/login");
  };

  return (
    <header className="w-full py-3 border-b border-zinc-300 bg-white shadow-sm">
      <div className="mx-auto flex items-center justify-between px-6">
        <nav className="flex space-x-1">
          {navItems.map(({ to, label, icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={label}
                to={to}
                className={`flex items-center text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200
                ${isActive
                    ? "bg-blue-50 text-blue-700 border-b border-blue-600"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-blue-600"}`}
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
              className="w-full px-3 py-1 text-sm border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">⌘ K</span>
          </div>

          <div className="flex flex-col items-end text-right">
            <span
              className={`text-sm font-medium text-zinc-800 transition-opacity duration-500 ${userName ? "opacity-100" : "opacity-0"}`}
            >
              {userName ? `Olá, ${userName}` : (
                <span className="inline-block w-20 h-4 bg-zinc-300 rounded animate-pulse"></span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-xs text-red-600 font-medium transition-transform duration-200 hover:text-red-700 hover:scale-105 active:scale-95"
            >
              <LogOut size={12} className="mr-1" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
