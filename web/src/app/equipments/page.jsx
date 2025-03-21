import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronsLeft, ChevronsRight } from "lucide-react";
import { createEquipment, listEquipments, updateEquipment, deleteEquipment } from "../../services/equipment-service";

export function Equipments() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEquipmentId, setCurrentEquipmentId] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    type: "",
    availableOnly: false
  });

  useEffect(() => {
    fetchEquipments();
  }, []);

  const filteredEquipments = equipments.filter((equipment) => {
    const matchesSearch = activeFilters.search === "" ||
      (equipment.name && equipment.name.toLowerCase().includes(activeFilters.search.toLowerCase())) ||
      (equipment.id && equipment.id.toString().includes(activeFilters.search)) ||
      (equipment.type && equipment.type.toLowerCase().includes(activeFilters.search.toLowerCase()));

    const matchesType = activeFilters.type === "" || (equipment.type && equipment.type === activeFilters.type);

    const matchesAvailability = !activeFilters.availableOnly || (equipment.quantity && equipment.quantity > 0);

    return matchesSearch && matchesType && matchesAvailability;
  });

  useEffect(() => {
    const filteredCount = filteredEquipments.length;
    const newTotalPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage));
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredEquipments.length, itemsPerPage, currentPage]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const data = await listEquipments();
      setEquipments(data || []);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar os equipamentos. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formatando os dados conforme esperado pela API
    const equipmentData = {
      name: formData.name,
      type: formData.type,
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      if (isEditMode && currentEquipmentId) {
        await updateEquipment(currentEquipmentId, equipmentData);
      } else {
        await createEquipment(equipmentData);
      }

      resetForm();
      fetchEquipments();
    } catch (err) {
      console.error(isEditMode ? "Erro ao atualizar equipamento:" : "Erro ao cadastrar equipamento:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      quantity: "",
    });
    setIsOpen(false);
    setIsEditMode(false);
    setCurrentEquipmentId(null);
  };

  const handleEdit = (equipment) => {
    setFormData({
      name: equipment.name || "",
      type: equipment.type || "",
      quantity: equipment.quantity ? equipment.quantity.toString() : "",
    });
    setCurrentEquipmentId(equipment.id);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleDeleteClick = (equipment) => {
    setEquipmentToDelete(equipment);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!equipmentToDelete) return;

    try {
      await deleteEquipment(equipmentToDelete.id);
      fetchEquipments();
    } catch (err) {
      console.error("Erro ao excluir equipamento:", err);
    } finally {
      setDeleteConfirmOpen(false);
      setEquipmentToDelete(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setShowAvailableOnly(false);
    setCurrentPage(1);

    setActiveFilters({
      search: "",
      type: "",
      availableOnly: false
    });
  };

  const applyFilters = () => {
    setActiveFilters({
      search: searchTerm,
      type: typeFilter,
      availableOnly: showAvailableOnly
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

  const paginatedEquipments = filteredEquipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Equipamentos</h1>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 ease-in-out"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Novo Equipamento</span>
        </button>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-start gap-5">
          <div className="w-[420px]">
            <label className="block text-gray-600 text-sm font-normal mb-2">Pesquisa</label>
            <input
              type="text"
              placeholder="Pesquise pelo nome, ID ou tipo."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="w-[250px]">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-600 text-sm font-normal">Filtro por Tipo</label>
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
                value={typeFilter}
                onChange={handleTypeFilter}
              >
                <option value="">Selecione um tipo</option>
                <option value="Computador">Computador</option>
                <option value="Impressora">Impressora</option>
                <option value="Monitor">Monitor</option>
                <option value="Scanner">Scanner</option>
                <option value="Projetor">Projetor</option>
                <option value="Servidor">Servidor</option>
                <option value="Roteador">Roteador</option>
                <option value="Switch">Switch</option>
                <option value="Tablet">Tablet</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Notebook">Notebook</option>
                <option value="Webcam">Webcam</option>
                <option value="Eletrodomésticos">Eletrodomésticos</option>
                <option value="Outro">Outro</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-start">
          <label className="inline-flex items-center cursor-pointer mr-4">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={() => {
                setShowAvailableOnly(!showAvailableOnly);
              }}
              className="form-checkbox text-purple-600 transition duration-150 ease-in-out"
            />
            <span className="text-gray-600 text-sm font-normal ml-1">Exibir apenas equipamentos com disponibilidade ativa.</span>
          </label>
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
            <div className="text-gray-500">Carregando equipamentos...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-red-500">{error}</div>
          </div>
        ) : filteredEquipments.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-lg">
            <div className="text-gray-500">Nenhum equipamento encontrado com os filtros aplicados.</div>
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-zinc-800 text-white">
              <tr className="border border-zinc-400">
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Nome</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Tipo</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Quantidade</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedEquipments.map((equipment) => (
                <tr key={equipment.id}>
                  <td className="py-4 px-4 text-xs text-gray-800 font-mono">{equipment.id}</td>
                  <td className="py-4 px-4 text-xs text-gray-800 font-medium">{equipment.name}</td>
                  <td className="py-4 px-4 text-xs text-gray-800">{equipment.type}</td>
                  <td className="py-4 px-4 text-xs text-gray-800">
                    {equipment.quantity}
                  </td>
                  <td className="py-4 px-4 flex gap-1">
                    <button
                      className="p-1 text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(equipment)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(equipment)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredEquipments.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-2 py-3">
            <div className="text-sm text-gray-600">
              Mostrando {Math.min(filteredEquipments.length, (currentPage - 1) * itemsPerPage + 1)} a {Math.min(filteredEquipments.length, currentPage * itemsPerPage)} de {filteredEquipments.length} equipamentos
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
              {isEditMode ? "Editar Equipamento" : "Cadastrar Equipamento"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Nome <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ex: Micro-ondas"
                    value={formData.name}
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
                    <option value="">Selecione um tipo</option>
                    <option value="Computador">Computador</option>
                    <option value="Impressora">Impressora</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Scanner">Scanner</option>
                    <option value="Projetor">Projetor</option>
                    <option value="Servidor">Servidor</option>
                    <option value="Roteador">Roteador</option>
                    <option value="Switch">Switch</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Smartphone">Smartphone</option>
                    <option value="Notebook">Notebook</option>
                    <option value="Webcam">Webcam</option>
                    <option value="Eletrodomésticos">Eletrodomésticos</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Quantidade <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Ex: 1"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end mt-8 gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm font-medium text-gray-700 hover:text-gray-800 hover:underline"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
                >
                  {isEditMode ? "Salvar Alterações" : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && equipmentToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6 text-xs">
              Tem certeza que deseja excluir o equipamento <span className="font-medium">"{equipmentToDelete.name}"</span>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setEquipmentToDelete(null);
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
    </div>
  );
}