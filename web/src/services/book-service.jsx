import { API_URL } from "../lib/api";

export async function createBook(bookData) {
  try {
    const response = await fetch(`${API_URL}/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar o livro");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listBooks() {
  try {
    const response = await fetch(`${API_URL}/api/books`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar os livros");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateBook(id, bookData) {
  try {
    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar o livro");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteBook(id) {
  try {
    const response = await fetch(`${API_URL}/api/books/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o livro");
    }

    return { message: "Livro excluído com sucesso" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
