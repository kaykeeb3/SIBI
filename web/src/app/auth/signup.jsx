import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth-service";

export function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      await registerUser(
        formData.name,
        formData.email,
        formData.password,
        formData.profilePicture
      );

      navigate("/auth/login");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-center mb-8">
          <span className="text-3xl font-normal ml-2">
            biblioteca<strong className="font-bold">.digital</strong>
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-600 text-sm font-normal mb-2">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600 text-sm font-normal mb-2">
              E-mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="profilePicture" className="block text-gray-600 text-sm font-normal mb-2">
              Foto de Perfil (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="https://exemplo.com/imagem.jpg"
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
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-purple-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>

          <div className="mt-4 text-left">
            <Link to="/auth/login" className="text-purple-500 text-xs underline">
              Faça login
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
