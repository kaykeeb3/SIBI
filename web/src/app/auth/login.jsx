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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 transition-all duration-300">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {error && (
          <p className="text-red-500 bg-red-100 border border-red-300 text-sm text-center py-2 px-4 rounded-md mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Digite seu e-mail"
              className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Digite sua senha"
              className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              Não tem uma conta?{" "}
              <Link to="/auth/register" className="text-blue-500 hover:text-blue-700 transition-all duration-300">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
