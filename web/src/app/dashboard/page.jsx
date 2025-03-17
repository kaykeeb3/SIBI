import { useEffect, useState } from "react";
import { Book, Clock, Settings, Calendar } from "lucide-react";
import { getDashboardData } from "../../services/dashboard-service";

const DashboardCard = ({ title, value, description, icon, color, loading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300">
      {loading ? (
        <div className="animate-pulse flex items-center space-x-4 w-full">
          <div className="bg-zinc-200 w-1/2 h-6 rounded"></div>
          <div className="bg-zinc-200 w-1/4 h-12 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-zinc-800 mb-2">{title}</h2>
            <p className="text-3xl font-bold text-zinc-900">{value}</p>
            <p className="text-sm text-zinc-600 mt-2">{description}</p>
          </div>
          <div className={`text-3xl ${color}`}>
            <IconComponent />
          </div>
        </>
      )}
    </div>
  );
};

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBooks: 0,
    totalLoans: 0,
    totalEquipments: 0,
    totalSchedules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error("Erro ao carregar os dados do dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    { title: "Livros", value: dashboardData.totalBooks, description: "Total de livros disponíveis", icon: Book, color: "text-primary" },
    { title: "Empréstimos", value: dashboardData.totalLoans, description: "Empréstimos em andamento", icon: Clock, color: "text-blue-600" },
    { title: "Equipamentos", value: dashboardData.totalEquipments, description: "Total de equipamentos disponíveis", icon: Settings, color: "text-green-600" },
    { title: "Agendamentos", value: dashboardData.totalSchedules, description: "Agendamentos em andamento", icon: Calendar, color: "text-orange-600" },
  ];

  return (
    <div className="w-full min-h-screen p-8 bg-zinc-100">
      <h1 className="text-3xl font-semibold mb-8 text-zinc-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} loading={loading} />
        ))}
      </div>

      <div className="w-full bg-white min-h-80 mt-8">...</div>
    </div>
  );
}