import { useState } from "react";
import { Link } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      setTimeout(() => {
        setMessage("Um link para redefinição de senha foi enviado para seu email.");
        setLoading(false);
      }, 1500);
    } catch {
      setError("Não foi possível processar sua solicitação. Tente novamente mais tarde.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-center mb-8">
          <span className="text-3xl font-normal ml-2">biblioteca<strong className="font-bold">.digital</strong></span>
        </div>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Informe seu email cadastrado para receber um link de redefinição de senha.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-6">
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

          <button
            type="submit"
            className="w-full bg-purple-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Enviar link"
            )}
          </button>

          {error && (
            <div className="mt-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mt-4 text-green-600 text-sm">
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/auth/login" className="text-purple-500 text-xs underline">
              Voltar para o login
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