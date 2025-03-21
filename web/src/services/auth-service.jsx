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

export async function registerUser(name, email, password, profilePicture) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, profilePicture }),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar. Verifique os dados informados.");
    }

    const data = await response.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.user.name);

    return data;
  } catch (error) {
    console.error("Erro no cadastro:", error.message);
    throw error;
  }
}

export async function getUserProfile() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
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

    if (response.status === 401) {
      redirectToLogin();
      throw new Error("Token inválido ou expirado.");
    }

    if (!response.ok) {
      throw new Error("Erro ao buscar perfil.");
    }

    return await response.json(); // Garantir que o perfil com a URL da imagem seja retornado
  } catch (error) {
    console.error("Erro ao obter perfil:", error.message);
    redirectToLogin();
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  window.location.href = "/auth/login";
}

function redirectToLogin() {
  logoutUser();
}
