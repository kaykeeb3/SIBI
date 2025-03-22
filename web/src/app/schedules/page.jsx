import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronsLeft, ChevronsRight, RotateCcw } from "lucide-react";
import { listEquipments } from "../../services/equipment-service";

import { createSchedule, listSchedules, updateSchedule, returnSchedule, deleteSchedule } from "../../services/schedule-service";

export function Schedules() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);
  const [returnConfirmOpen, setReturnConfirmOpen] = useState(false);
  const [scheduleToReturn, setScheduleToReturn] = useState(null);
  const [formData, setFormData] = useState({
    borrowerName: "",
    quantity: 1,
    startDate: "",
    returnDate: "",
    dayOfWeek: "",
    equipmentId: "",
    type: "Reserva"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    status: "",
    type: ""
  });

  const daysOfWeek = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado"
  ];

  const scheduleTypes = [
    "Reserva",
    "Empréstimo",
    "Aula"
  ];

  useEffect(() => {
    fetchSchedules();
    fetchEquipments();
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = activeFilters.search === "" ||
      (schedule.borrowerName && schedule.borrowerName.toLowerCase().includes(activeFilters.search.toLowerCase())) ||
      (schedule.id && schedule.id.toString().includes(activeFilters.search)) ||
      (schedule.equipment && schedule.equipment.name && schedule.equipment.name.toLowerCase().includes(activeFilters.search.toLowerCase()));

    // Verifica se o agendamento está atrasado
    const isOverdue = !schedule.returned && new Date(schedule.returnDate) < new Date();

    const matchesStatus = activeFilters.status === "" ||
      (activeFilters.status === "ativo" && !schedule.returned && !isOverdue) ||
      (activeFilters.status === "devolvido" && schedule.returned) ||
      (activeFilters.status === "atrasado" && isOverdue);

    // Verificação para o filtro de tipo
    const matchesType = activeFilters.type === "" ||
      (schedule.type && schedule.type.toLowerCase() === activeFilters.type.toLowerCase());

    return matchesSearch && matchesStatus && matchesType;
  });

  useEffect(() => {
    const filteredCount = filteredSchedules.length;
    const newTotalPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage));
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredSchedules.length, itemsPerPage, currentPage]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await listSchedules();
      setSchedules(data || []);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar os agendamentos. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const data = await listEquipments();
      setEquipments(data || []);
    } catch (err) {
      console.error("Erro ao carregar os equipamentos:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Definir automaticamente o dia da semana com base na data selecionada
    if (name === "startDate") {
      const date = new Date(value);
      const dayOfWeek = getDayOfWeek(date);
      setFormData({
        ...formData,
        [name]: value,
        dayOfWeek: dayOfWeek
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getDayOfWeek = (date) => {
    return daysOfWeek[date.getDay()];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR'); // Retorna no formato "DD/MM/AAAA"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formatando os dados para o que o back-end espera
    const scheduleData = {
      borrowerName: formData.borrowerName,
      quantity: parseInt(formData.quantity),
      startDate: new Date(formData.startDate).toISOString(),
      returnDate: new Date(formData.returnDate).toISOString(),
      dayOfWeek: formData.dayOfWeek,
      equipmentId: formData.equipmentId,
      type: formData.type
    };

    try {
      if (isEditMode && currentScheduleId) {
        await updateSchedule(currentScheduleId, scheduleData);
      } else {
        await createSchedule(scheduleData);
      }

      resetForm();
      fetchSchedules();
    } catch (err) {
      console.error(isEditMode ? "Erro ao atualizar agendamento:" : "Erro ao cadastrar agendamento:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      borrowerName: "",
      quantity: 1,
      startDate: "",
      returnDate: "",
      dayOfWeek: "",
      equipmentId: "",
      type: "Reserva"
    });
    setIsOpen(false);
    setIsEditMode(false);
    setCurrentScheduleId(null);
  };

  const handleEdit = (schedule) => {
    setFormData({
      borrowerName: schedule.borrowerName || "",
      quantity: schedule.quantity || 1,
      startDate: schedule.startDate ? new Date(schedule.startDate).toISOString().slice(0, 16) : "",
      returnDate: schedule.returnDate ? new Date(schedule.returnDate).toISOString().slice(0, 16) : "",
      dayOfWeek: schedule.dayOfWeek || "",
      equipmentId: schedule.equipmentId || "",
      type: schedule.type || "Reserva"
    });
    setCurrentScheduleId(schedule.id);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleDeleteClick = (schedule) => {
    setScheduleToDelete(schedule);
    setDeleteConfirmOpen(true);
  };

  const handleReturnClick = (schedule) => {
    setScheduleToReturn(schedule);
    setReturnConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!scheduleToDelete) return;

    try {
      await deleteSchedule(scheduleToDelete.id);
      fetchSchedules();
    } catch (err) {
      console.error("Erro ao excluir agendamento:", err);
    } finally {
      setDeleteConfirmOpen(false);
      setScheduleToDelete(null);
    }
  };

  const confirmReturn = async () => {
    if (!scheduleToReturn) return;

    try {
      // Removido o segundo parâmetro incorreto da função
      await returnSchedule(scheduleToReturn.id);
      fetchSchedules();
    } catch (err) {
      console.error("Erro ao registrar devolução:", err);
    } finally {
      setReturnConfirmOpen(false);
      setScheduleToReturn(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setCurrentPage(1);

    setActiveFilters({
      search: "",
      status: "",
      type: ""
    });
  };

  const applyFilters = () => {
    setActiveFilters({
      search: searchTerm,
      status: statusFilter,
      type: typeFilter
    });
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedSchedules = filteredSchedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Função para verificar se um agendamento está atrasado
  const isScheduleOverdue = (schedule) => {
    if (schedule.returned) return false;
    const returnDate = new Date(schedule.returnDate);
    const currentDate = new Date();
    return returnDate < currentDate;
  };

  // Função para obter o status do agendamento
  const getScheduleStatus = (schedule) => {
    if (schedule.returned) {
      return {
        text: "Devolvido",
        className: "bg-green-100 text-green-800"
      };
    } else if (isScheduleOverdue(schedule)) {
      return {
        text: "Atrasado",
        className: "bg-red-100 text-red-800"
      };
    } else {
      return {
        text: "Ativo",
        className: "bg-yellow-100 text-yellow-800"
      };
    }
  };

  // Função para obter o nome do equipamento
  const getEquipmentName = (equipmentId) => {
    const equipment = equipments.find(e => e.id === equipmentId);
    return equipment ? equipment.name : "Não encontrado";
  };

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Agendamentos</h1>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 ease-in-out"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Novo Agendamento</span>
        </button>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-start gap-5 flex-wrap">
          <div className="w-[300px]">
            <label className="block text-gray-600 text-sm font-normal mb-2">Pesquisa</label>
            <input
              type="text"
              placeholder="Pesquise pelo nome ou equipamento"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="w-[200px]">
            <label className="block text-gray-600 text-sm font-normal mb-2">Tipo</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={typeFilter}
              onChange={handleTypeFilter}
            >
              <option value="">Todos os tipos</option>
              {scheduleTypes.map((type, index) => (
                <option key={index} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </div>

          <div className="w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-600 text-sm font-normal">Status</label>
              <button
                className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center"
                type="button"
                onClick={clearFilters}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Limpar filtros
              </button>
            </div>
            <div className="relative">
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <option value="">Todos os status</option>
                <option value="ativo">Agendamentos ativos</option>
                <option value="atrasado">Agendamentos atrasados</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 ease-in-out"
            onClick={applyFilters}
          >
            Filtrar
          </button>
        </div>
      </div>

      <div className="w-full mt-8">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-gray-500">Carregando agendamentos...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-red-500">{error}</div>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-lg">
            <div className="text-gray-500">Nenhum agendamento encontrado com os filtros aplicados.</div>
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-zinc-800 text-white">
              <tr className="border border-zinc-400">
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Nome</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Tipo</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Equipamento</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Quantidade</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Início</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Término</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Dia</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedSchedules.map((schedule) => {
                const status = getScheduleStatus(schedule);

                return (
                  <tr key={schedule.id} className={schedule.returned ? "bg-gray-50" : ""}>
                    <td className="py-4 px-4 text-xs text-gray-800 font-mono">{schedule.id}</td>
                    <td className="py-4 px-4 text-xs text-gray-800 font-medium">{schedule.borrowerName}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{schedule.type}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">
                      {getEquipmentName(schedule.equipmentId)}
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-800">{schedule.quantity}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{formatDate(schedule.startDate)}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{formatDate(schedule.returnDate)}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{schedule.dayOfWeek}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex gap-1">
                      {!schedule.returned && (
                        <>
                          <button
                            className="p-1 text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(schedule)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="p-1 text-green-500 hover:text-green-700"
                            onClick={() => handleReturnClick(schedule)}
                          >
                            <RotateCcw size={16} />
                          </button>
                        </>
                      )}
                      <button
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(schedule)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {filteredSchedules.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-2 py-3">
            <div className="text-sm text-gray-600">
              Mostrando {Math.min(filteredSchedules.length, (currentPage - 1) * itemsPerPage + 1)} a {Math.min(filteredSchedules.length, currentPage * itemsPerPage)} de {filteredSchedules.length} agendamentos
            </div>
            <div className="flex items-center gap-4">
              <button
                className="px-2 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft size={18} />
              </button>
              <span className="text-gray-700 font-normal">Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
              <button
                className="px-2 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[650px] animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {isEditMode ? "Editar Agendamento" : "Novo Agendamento"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Nome do Solicitante <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="borrowerName"
                    placeholder="Ex: João da Silva"
                    value={formData.borrowerName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Tipo <span className="text-red-500">*</span></label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    {scheduleTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Equipamento <span className="text-red-500">*</span></label>
                  <select
                    name="equipmentId"
                    value={formData.equipmentId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecione um equipamento</option>
                    {equipments.map((equipment) => (
                      <option key={equipment.id} value={equipment.id} disabled={equipment.availableQuantity <= 0}>
                        {equipment.name} {equipment.availableQuantity <= 0 ? "(Indisponível)" : `(${equipment.availableQuantity} disponíveis)`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Quantidade <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Data e Hora de Início <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Data e Hora de Término <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    name="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm font-normal mb-2">Dia da Semana</label>
                <input
                  type="text"
                  name="dayOfWeek"
                  value={formData.dayOfWeek}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-gray-100"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Este campo é preenchido automaticamente com base na data selecionada.</p>
              </div>

              <div className="flex items-center justify-end mt-8 gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800 hover:underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
                >
                  {isEditMode ? "Salvar Alterações" : "Criar Agendamento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && scheduleToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Tem certeza que deseja excluir o agendamento de <span className="font-medium">"{scheduleToDelete.borrowerName}"</span>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setScheduleToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:underline"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {returnConfirmOpen && scheduleToReturn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Devolução</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Confirmar a devolução do equipamento agendado por <span className="font-medium">"{scheduleToReturn.borrowerName}"</span>?
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setReturnConfirmOpen(false);
                  setScheduleToReturn(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 hover:underline"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmReturn}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
              >
                Confirmar Devolução
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}