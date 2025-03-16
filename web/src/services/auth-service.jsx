import { API_URL } from "../lib/api";

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Erro ao fazer login. Verifique suas credenciais.");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.user.name);

    return data;
  } catch (error) {
    console.error("Erro no login:", error.message);
    throw error;
  }
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar perfil.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao obter perfil:", error.message);
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
}
