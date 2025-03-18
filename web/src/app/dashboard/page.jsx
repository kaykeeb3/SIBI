import { useEffect, useState } from "react";
import { Book, Clock, Settings, Calendar } from "lucide-react";
import { getDashboardData } from "../../services/dashboard-service";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const DashboardCard = ({ title, value, description, icon, color, loading }) => {
  const IconComponent = icon;

  const getBgColor = () => {
    switch (color) {
      case "text-yellow-600": return "bg-yellow-600/10";
      case "text-blue-600": return "bg-blue-600/10";
      case "text-green-600": return "bg-green-600/10";
      case "text-orange-600": return "bg-orange-600/10";
      default: return "bg-gray-600/10";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 border-t-4 border-l border-r border-b border-zinc-100 hover:scale-102 hover:border-t-primary relative overflow-hidden">
      {loading ? (
        <div className="animate-pulse flex items-center space-x-4 w-full">
          <div className="bg-zinc-200 w-1/2 h-6 rounded"></div>
          <div className="bg-zinc-200 w-1/4 h-12 rounded"></div>
        </div>
      ) : (
        <>
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-zinc-200"></div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-800 mb-1">{title}</h2>
              <p className="text-4xl font-bold text-zinc-900 my-3 tracking-tight">{value}</p>
              <p className="text-sm text-zinc-500 mt-2">{description}</p>
            </div>
            <div className={`${getBgColor()} p-3 rounded-lg ${color}`}>
              <IconComponent size={28} />
            </div>
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
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);

        // Dados do gráfico limitados a 4 categorias
        const currentData = [
          { category: "Livros", value: data.totalBooks },
          { category: "Empréstimos", value: data.totalLoans },
          { category: "Equipamentos", value: data.totalEquipments },
          { category: "Agendamentos", value: data.totalSchedules },
        ];

        setChartData(currentData);
      } catch (error) {
        console.error("Error loading dashboard data", error);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} loading={loading} />
        ))}
      </div>

      <div className="w-full bg-white min-h-80 mt-8 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-zinc-800">Atividade do Mês Atual</h2>

        {loading ? (
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-64 bg-zinc-200 rounded w-full"></div>
          </div>
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis
                  stroke="#4b5563"
                  padding={{ top: 10, bottom: 10 }}
                  axisLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  tick={{ fill: "#6b7280", fontSize: 12, fontWeight: "600" }}
                  tickLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                  interval={0}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar
                  dataKey="value"
                  name="Quantidade"
                  fill="#a855f7"
                  radius={[4, 4, 0, 0]}
                  barSize={80}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>

  );
}
