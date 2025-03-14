import { Navigate } from "react-router-dom";

// Componente de proteção de rota
export function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Se não houver token, redireciona para a tela de login
    return <Navigate to="/auth/login" replace />;
  }

  return children; // Se o usuário estiver logado, permite o acesso às rotas
}
