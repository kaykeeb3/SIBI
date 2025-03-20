import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ChevronsLeft, ChevronsRight } from "lucide-react";
import { createBook, listBooks, updateBook, deleteBook } from "../../services/book-service";

export function Books() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    number: "",
    author: "",
    genre: "",
    quantity: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  // Removed unused filtersApplied variable
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    genre: "",
    availableOnly: false
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = activeFilters.search === "" ||
      (book.title && book.title.toLowerCase().includes(activeFilters.search.toLowerCase())) ||
      (book.id && book.id.toString().includes(activeFilters.search)) ||
      (book.author && book.author.toLowerCase().includes(activeFilters.search.toLowerCase())) ||
      (book.genre && book.genre.toLowerCase().includes(activeFilters.search.toLowerCase()));

    const matchesGenre = activeFilters.genre === "" || (book.genre && book.genre === activeFilters.genre);

    const matchesAvailability = !activeFilters.availableOnly || (book.quantity && book.quantity > 0);

    return matchesSearch && matchesGenre && matchesAvailability;
  });

  useEffect(() => {
    const filteredCount = filteredBooks.length;
    const newTotalPages = Math.max(1, Math.ceil(filteredCount / itemsPerPage));
    setTotalPages(newTotalPages);

    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredBooks.length, itemsPerPage, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const data = await listBooks();
      setBooks(data || []);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar os livros. Por favor, tente novamente.");
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

    const bookData = {
      title: formData.title,
      number: parseInt(formData.number, 10),
      author: formData.author,
      genre: formData.genre, // Agora está em português
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      if (isEditMode && currentBookId) {
        await updateBook(currentBookId, bookData);
      } else {
        await createBook(bookData);
      }

      resetForm();
      fetchBooks();
    } catch (err) {
      console.error(isEditMode ? "Erro ao atualizar livro:" : "Erro ao cadastrar livro:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      number: "",
      author: "",
      genre: "",
      quantity: "",
    });
    setIsOpen(false);
    setIsEditMode(false);
    setCurrentBookId(null);
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title || "",
      number: book.number ? book.number.toString() : "",
      author: book.author || "",
      genre: book.genre || "",
      quantity: book.quantity ? book.quantity.toString() : "",
    });
    setCurrentBookId(book.id);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      await deleteBook(bookToDelete.id);
      fetchBooks();
    } catch (err) {
      console.error("Erro ao excluir livro:", err);
    } finally {
      setDeleteConfirmOpen(false);
      setBookToDelete(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreFilter = (e) => {
    setGenreFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setGenreFilter("");
    setShowAvailableOnly(false);
    setCurrentPage(1);

    // Também limpa os filtros ativos
    setActiveFilters({
      search: "",
      genre: "",
      availableOnly: false
    });
    // Removed setFiltersApplied call here
  };

  const applyFilters = () => {
    setActiveFilters({
      search: searchTerm,
      genre: genreFilter,
      availableOnly: showAvailableOnly
    });
    setCurrentPage(1);
    // Removed setFiltersApplied call here
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

  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Livros</h1>
        <button
          onClick={() => {
            resetForm();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 ease-in-out"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Novo Livro</span>
        </button>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-start gap-5">
          <div className="w-[420px]">
            <label className="block text-gray-600 text-sm font-normal mb-2">Pesquisa</label>
            <input
              type="text"
              placeholder="Pesquise pelo nome, ID, autor ou gênero."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="w-[250px]">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-600 text-sm font-normal">Filtro por Gênero</label>
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
                value={genreFilter}
                onChange={handleGenreFilter}
              >
                <option value="">Selecione um gênero</option>
                <option value="Ficção">Ficção</option>
                <option value="Não-ficção">Não-ficção</option>
                <option value="Fantasia">Fantasia</option>
                <option value="Ficção Científica">Ficção Científica</option>
                <option value="Distopia">Distopia</option>
                <option value="Ação">Ação</option>
                <option value="Aventura">Aventura</option>
                <option value="Romance">Romance</option>
                <option value="Mistério">Mistério</option>
                <option value="Suspense">Suspense</option>
                <option value="Terror">Terror</option>
                <option value="Ficção Histórica">Ficção Histórica</option>
                <option value="Biografia">Biografia</option>
                <option value="Memórias">Memórias</option>
                <option value="Autoajuda">Autoajuda</option>
                <option value="Filosofia">Filosofia</option>
                <option value="Poesia">Poesia</option>
                <option value="Drama">Drama</option>
                <option value="Jovem Adulto">Jovem Adulto (YA)</option>
                <option value="Infantil">Infantil</option>
                <option value="Clássico">Clássico</option>
                <option value="Crime">Crime</option>
                <option value="Comédia">Comédia</option>
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
            <span className="text-gray-600 text-sm font-normal ml-1">Exibir apenas livros com disponibilidade ativa.</span>
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
            <div className="text-gray-500">Carregando livros...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-40">
            <div className="text-red-500">{error}</div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-lg">
            <div className="text-gray-500">Nenhum livro encontrado com os filtros aplicados.</div>
          </div>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-zinc-800 text-white">
              <tr className="border border-zinc-400">
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Título</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Número</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Autor</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Gênero</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Quantidade</th>
                <th className="py-3 px-4 text-left font-medium text-xs uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBooks.map((book) => (
                <tr key={book.id}>
                  <td className="py-4 px-4 text-xs text-gray-800 font-mono">{book.id}</td>
                  <td className="py-4 px-4 text-xs text-gray-800 font-medium">{book.title}</td>
                  <td className="py-4 px-4 text-xs text-gray-800">{book.number}</td>
                  <td className="py-4 px-4 text-xs text-gray-800">{book.author}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 text-xs font-medium">{book.genre}</span>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-800">
                    {book.quantity}
                  </td>
                  <td className="py-4 px-4 flex gap-1">
                    <button
                      className="p-1 text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(book)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-1 text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteClick(book)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredBooks.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-2 py-3">
            <div className="text-sm text-gray-600">
              Mostrando {Math.min(filteredBooks.length, (currentPage - 1) * itemsPerPage + 1)} a {Math.min(filteredBooks.length, currentPage * itemsPerPage)} de {filteredBooks.length} livros
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
              {isEditMode ? "Editar Livro" : "Cadastrar Livro"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Título <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Ex: O Senhor dos Anéis"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Número <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="number"
                    placeholder="Ex: 12345"
                    value={formData.number}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Autor <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="author"
                    placeholder="Ex: J.R.R. Tolkien"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-normal mb-2">Gênero <span className="text-red-500">*</span></label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecione um gênero</option>
                    <option value="Ficção">Ficção</option>
                    <option value="Não-ficção">Não-ficção</option>
                    <option value="Fantasia">Fantasia</option>
                    <option value="Ficção Científica">Ficção Científica</option>
                    <option value="Distopia">Distopia</option>
                    <option value="Ação">Ação</option>
                    <option value="Aventura">Aventura</option>
                    <option value="Romance">Romance</option>
                    <option value="Mistério">Mistério</option>
                    <option value="Suspense">Suspense</option>
                    <option value="Terror">Terror</option>
                    <option value="Ficção Histórica">Ficção Histórica</option>
                    <option value="Biografia">Biografia</option>
                    <option value="Memórias">Memórias</option>
                    <option value="Autoajuda">Autoajuda</option>
                    <option value="Filosofia">Filosofia</option>
                    <option value="Poesia">Poesia</option>
                    <option value="Drama">Drama</option>
                    <option value="Jovem Adulto">Jovem Adulto (YA)</option>
                    <option value="Infantil">Infantil</option>
                    <option value="Clássico">Clássico</option>
                    <option value="Crime">Crime</option>
                    <option value="Comédia">Comédia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-normal mb-2">Quantidade <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Ex: 3"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-[50%] px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
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

      {deleteConfirmOpen && bookToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[450px] animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
            <p className="text-gray-600 mb-6 text-xs">
              Tem certeza que deseja excluir o livro <span className="font-medium">"{bookToDelete.title}"</span>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setBookToDelete(null);
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