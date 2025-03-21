import { API_URL } from "../lib/api";

export async function createEquipment(equipmentData) {
  try {
    const response = await fetch(`${API_URL}/api/equipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipmentData),
    });

    if (!response.ok) {
      throw new Error("Erro ao cadastrar o equipamento");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listEquipments() {
  try {
    const response = await fetch(`${API_URL}/api/equipments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao listar os equipamentos");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateEquipment(id, equipmentData) {
  try {
    const response = await fetch(`${API_URL}/api/equipments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipmentData),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar o equipamento");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteEquipment(id) {
  try {
    const response = await fetch(`${API_URL}/api/equipments/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao excluir o equipamento");
    }

    return { message: "Equipamento excluído com sucesso" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
