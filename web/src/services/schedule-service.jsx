import { API_URL } from "../lib/api";

export async function createSchedule(scheduleData) {
  try {
    const response = await fetch(`${API_URL}/api/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar o agendamento");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listSchedules() {
  try {
    const response = await fetch(`${API_URL}/api/schedules`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar os agendamentos");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateSchedule(id, scheduleData) {
  try {
    const response = await fetch(`${API_URL}/api/schedules/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar o agendamento");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function returnSchedule(id) {
  try {
    const response = await fetch(`${API_URL}/api/schedules/${id}/returned`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ returned: true }),
    });

    if (!response.ok) {
      throw new Error("Erro ao registrar a devolução do agendamento");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteSchedule(id) {
  try {
    const response = await fetch(`${API_URL}/api/schedules/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o agendamento");
    }

    return { message: "Agendamento excluído com sucesso" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
