import { API_URL } from "../lib/api";

export async function createLoan(loanData) {
  try {
    const response = await fetch(`${API_URL}/api/loans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar o empréstimo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listLoans() {
  try {
    const response = await fetch(`${API_URL}/api/loans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar os empréstimos");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateLoan(id, loanData) {
  try {
    const response = await fetch(`${API_URL}/api/loans/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar o empréstimo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function returnLoan(id) {
  try {
    const response = await fetch(`${API_URL}/api/loans/${id}/return`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ returned: true }),
    });

    if (!response.ok) {
      throw new Error("Erro ao registrar a devolução do empréstimo");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteLoan(id) {
  try {
    const response = await fetch(`${API_URL}/api/loans/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o empréstimo");
    }

    return { message: "Empréstimo excluído com sucesso" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
