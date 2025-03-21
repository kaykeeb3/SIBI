import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronsLeft, ChevronsRight, RotateCcw } from "lucide-react";
import { createLoan, listLoans, updateLoan, returnLoan, deleteLoan } from "../../services/loan-service";
import { listBooks } from "../../services/book-service";

export function Loans() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLoanId, setCurrentLoanId] = useState(null);
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [returnConfirmOpen, setReturnConfirmOpen] = useState(false);
  const [loanToReturn, setLoanToReturn] = useState(null);
  const [formData, setFormData] = useState({
    borrowerName: "",
    name: "",
    courseSeries: "",
    startDate: "",
    returnDate: "",
    bookId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState(""); // Adicionando o filtro de turma
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    status: "",
    course: "", // Adicionando o filtro de turma aos filtros ativos
  });

  // Lista predefinida de turmas
  const predefinedCourses = [
    "1º Ano - Administração",
    "1º Ano - Informática",
    "1º Ano - Redes",
    "1º Ano - Segurança do Trabalho",
    "2º Ano - Administração",
    "2º Ano - Informática",
    "2º Ano - Redes",
    "2º Ano - Segurança do Trabalho",
    "3º Ano - Administração",
    "3º Ano - Informática",
    "3º Ano - Redes",
    "3º Ano - Segurança do Trabalho"
  ];

  useEffect(() => {
    fetchLoans();
    fetchBooks();
  }, []);

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = activeFilters.search === "" ||
      (loan.borrowerName && loan.borrowerName.toLowerCase().includes(activeFilters.search.toLowerCase())) ||
      (loan.name && loan.name.toLowerCase().includes(activeFilters.search.toLowerCase())) ||
      (loan.id && loan.id.toString().includes(activeFilters.search)) ||
      (loan.book && loan.book.title && loan.book.title.toLowerCase().includes(activeFilters.search.toLowerCase()));

    // Verifica se o empréstimo está atrasado
    const isOverdue = !loan.returned && new Date(loan.returnDate) < new Date();

    const matchesStatus = activeFilters.status === "" ||
      (activeFilters.status === "ativo" && !loan.returned && !isOverdue) ||
      (activeFilters.status === "devolvido" && loan.returned) ||
      (activeFilters.status === "atrasado" && isOverdue);

    // Adicionar verificação específica para o filtro de turma
    const matchesCourse = activeFilters.course === "" ||
      (loan.courseSeries && loan.courseSeries.toLowerCase().includes(activeFilters.course.toLowerCase()));

    return matchesSearch && matchesStatus && matchesCourse;
  });

  useEffect(() => {
    const filteredCount = filteredLoans.length;
    const newTotalPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage));
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredLoans.length, itemsPerPage, currentPage]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await listLoans();
      setLoans(data || []);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar os empréstimos. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await listBooks();
      setBooks(data || []);
    } catch (err) {
      console.error("Erro ao carregar os livros:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Formato exato para o POST/PUT conforme especificado
    const loanData = {
      borrowerName: formData.borrowerName,
      name: formData.name,
      courseSeries: formData.courseSeries,
      startDate: new Date(formData.startDate).toISOString(),
      returnDate: new Date(formData.returnDate).toISOString(),
      bookId: formData.bookId,
    };

    try {
      if (isEditMode && currentLoanId) {
        await updateLoan(currentLoanId, loanData);
      } else {
        await createLoan(loanData);
      }

      resetForm();
      fetchLoans();
    } catch (err) {
      console.error(isEditMode ? "Erro ao atualizar empréstimo:" : "Erro ao cadastrar empréstimo:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      borrowerName: "",
      name: "",
      courseSeries: "",
      startDate: "",
      returnDate: "",
      bookId: "",
    });
    setIsOpen(false);
    setIsEditMode(false);
    setCurrentLoanId(null);
  };

  const handleEdit = (loan) => {
    setFormData({
      borrowerName: loan.borrowerName || "",
      name: loan.name || "",
      courseSeries: loan.courseSeries || "",
      startDate: loan.startDate ? new Date(loan.startDate).toISOString().slice(0, 16) : "",
      returnDate: loan.returnDate ? new Date(loan.returnDate).toISOString().slice(0, 16) : "",
      bookId: loan.bookId || "",
    });
    setCurrentLoanId(loan.id);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleDeleteClick = (loan) => {
    setLoanToDelete(loan);
    setDeleteConfirmOpen(true);
  };

  const handleReturnClick = (loan) => {
    setLoanToReturn(loan);
    setReturnConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!loanToDelete) return;

    try {
      await deleteLoan(loanToDelete.id);
      fetchLoans();
    } catch (err) {
      console.error("Erro ao excluir empréstimo:", err);
    } finally {
      setDeleteConfirmOpen(false);
      setLoanToDelete(null);
    }
  };

  const confirmReturn = async () => {
    if (!loanToReturn) return;

    try {
      // Formato exato para o PUT RETURN conforme especificado
      await returnLoan(loanToReturn.id, { returned: true });
      fetchLoans();
    } catch (err) {
      console.error("Erro ao registrar devolução:", err);
    } finally {
      setReturnConfirmOpen(false);
      setLoanToReturn(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Adicionando o handler para o filtro de turma
  const handleCourseFilter = (e) => {
    setCourseFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCourseFilter(""); // Limpar também o filtro de turma
    setCurrentPage(1);

    setActiveFilters({
      search: "",
      status: "",
      course: "", // Limpar o filtro de turma ativo
    });
  };

  const applyFilters = () => {
    setActiveFilters({
      search: searchTerm,
      status: statusFilter,
      course: courseFilter, // Adicionar o filtro de turma aos filtros ativos
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

  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para verificar se um empréstimo está atrasado
  const isLoanOverdue = (loan) => {
    if (loan.returned) return false;
    const returnDate = new Date(loan.returnDate);
    const currentDate = new Date();
    return returnDate < currentDate;
  };

  // Função para obter o status do empréstimo
  const getLoanStatus = (loan) => {
    if (loan.returned) {
      return {
        text: "Devolvido",
        className: "bg-green-100 text-green-800"
      };
    } else if (isLoanOverdue(loan)) {
      return {
        text: "Atrasado",
        className: "bg-red-100 text-red-800"
      };
    } else {
      return {
        text: "Emprestado",
        className: "bg-yellow-100 text-yellow-800"
      };
    }
  };

  // Função para obter turmas únicas para o filtro
  const getUniqueCourses = () => {
    // Combinar turmas predefinidas com as do sistema
    const coursesFromLoans = loans
      .map(loan => loan.courseSeries)
      .filter(course => course !== undefined && course !== null && course !== "");

    // Combinar turmas predefinidas com as existentes nos empréstimos
    const allCourses = [...new Set([...predefinedCourses, ...coursesFromLoans])];
    return allCourses.sort();
  };

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Empréstimos</h1>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 ease-in-out"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Novo Empréstimo</span>
        </button>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-start gap-5 flex-wrap">
          <div className="w-[300px]">
            <label className="block text-gray-600 text-sm font-normal mb-2">Pesquisa</label>
            <input
              type="text"
              placeholder="Pesquise pelo nome do aluno ou título do livro"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="w-[200px]">
            <label className="block text-gray-600 text-sm font-normal mb-2">Turma</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={courseFilter}
              onChange={handleCourseFilter}
            >
              <option value="">Todas as turmas</option>
              {getUniqueCourses().map((course, index) => (
                <option key={index} value={course}>{course}</option>
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
                <option value="ativo">Empréstimos ativos</option>
                <option value="atrasado">Empréstimos atrasados</option>
                <option value="devolvido">Empréstimos devolvidos</option>
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
            <div className="text-gray-500">Carregando empréstimos...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-red-500">{error}</div>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-lg">
            <div className="text-gray-500">Nenhum empréstimo encontrado com os filtros aplicados.</div>
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-zinc-800 text-white">
              <tr className="border border-zinc-400">
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Aluno</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Responsável</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Turma</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Livro</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Data Empréstimo</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Data Devolução</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLoans.map((loan) => {
                const status = getLoanStatus(loan);

                return (
                  <tr key={loan.id} className={loan.returned ? "bg-gray-50" : ""}>
                    <td className="py-4 px-4 text-xs text-gray-800 font-mono">{loan.id}</td>
                    <td className="py-4 px-4 text-xs text-gray-800 font-medium">{loan.borrowerName}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{loan.name}</td>
                    <td className="px-4 py-4 text-xs text-gray-800">{loan.courseSeries || loan.course || "-"}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{loan.bookId}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{formatDate(loan.startDate)}</td>
                    <td className="py-4 px-4 text-xs text-gray-800">{formatDate(loan.returnDate)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status.className}`}
                      >
                        {status.text}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex gap-1">
                      {!loan.returned && (
                        <>
                          <button
                            className="p-1 text-blue-500 hover:text-blue-700"
                            onClick={() => handleEdit(loan)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="p-1 text-green-500 hover:text-green-700"
                            onClick={() => handleReturnClick(loan)}
                          >
                            <RotateCcw size={16} />
                          </button>
                        </>
                      )}
                      <button
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteClick(loan)}
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

        {filteredLoans.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-2 py-3">
            <div className="text-sm text-gray-600">
              Mostrando {Math.min(filteredLoans.length, (currentPage - 1) * itemsPerPage + 1)} a {Math.min(filteredLoans.length, currentPage * itemsPerPage)} de {filteredLoans.length} empréstimos
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
              {isEditMode ? "Editar Empréstimo" : "Cadastrar Empréstimo"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Nome do Aluno <span className="text-red-500">*</span></label>
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
                  <label className="block text-gray-600 text-sm font-normal mb-2">Responsável <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ex: Maria Oliveira"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Turma <span className="text-red-500">*</span></label>
                  <select
                    name="courseSeries"
                    value={formData.courseSeries}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecione uma turma</option>
                    {predefinedCourses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Livro <span className="text-red-500">*</span></label>
                  <select
                    name="bookId"
                    value={formData.bookId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecione um livro</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id} disabled={book.quantity <= 0}>
                        {book.title} {book.quantity <= 0 ? "(Indisponível)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Data do Empréstimo <span className="text-red-500">*</span></label>
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
                  <label className="block text-gray-600 text-sm font-normal mb-2">Data de Devolução <span className="text-red-500">*</span></label>
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

      {deleteConfirmOpen && loanToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6 text-xs">
              Tem certeza que deseja excluir o empréstimo para <span className="font-medium">"{loanToDelete.borrowerName}"</span>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setLoanToDelete(null);
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

      {returnConfirmOpen && loanToReturn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Devolução</h3>
            <p className="text-gray-600 mb-6 text-xs">
              Confirmar a devolução do livro emprestado para <span className="font-medium">"{loanToReturn.borrowerName}"</span>?
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setReturnConfirmOpen(false);
                  setLoanToReturn(null);
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