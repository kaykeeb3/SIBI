import { API_URL } from "../lib/api";


const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro ao buscar dados de: ${url}`);
  return response.json();
};

export const getDashboardData = async () => {
  try {
    const [booksData, loansData, equipmentsData, schedulesData] = await Promise.all([
      fetchData(`${API_URL}/api/books`),
      fetchData(`${API_URL}/api/loans`),
      fetchData(`${API_URL}/api/equipments`),
      fetchData(`${API_URL}/api/schedules`),
    ]);

    return {
      totalBooks: booksData.length,
      totalLoans: loansData.length,
      totalEquipments: equipmentsData.length,
      totalSchedules: schedulesData.length,
    };
  } catch {
    throw new Error("Erro ao buscar dados do dashboard");
  }
};
