import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/auth-service";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await loginUser(email, password);
      localStorage.setItem("token", userData.token);
      localStorage.setItem("name", userData.user.name);

      navigate("/");
      window.dispatchEvent(new Event("storage"));
    } catch {
      setError("Verifique suas credenciais e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-center mb-8">
          <span className="text-3xl font-normal ml-2">biblioteca<strong className="font-bold">.digital</strong></span>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-normal mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 text-sm font-normal mb-2">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Login"
            )}
          </button>

          {error && (
            <div className="mt-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="mt-4 text-center text-xs">
            <span className="text-gray-600">Não tem conta?</span>
            <Link to="/auth/register" className="text-purple-500 text-xs underline ml-1">
              Cadastre-se
            </Link>
          </div>
        </form>
      </div>

      <div className="text-gray-500 text-xs">
        Copyright © <a href="#" className="text-zinc-500 underline">biblioteca.digital</a> 2025.
      </div>
    </div>
  );
}