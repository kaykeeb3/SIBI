import { bookService } from "../services/bookService.js";
import { handleError } from "../utils/errorHandler.js";

export const bookController = {
  async getBooks(req, res) {
    try {
      const books = await bookService.getAllBooks(req.query);
      res.status(200).json(books);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getBookById(req, res) {
    try {
      const { id } = req.params;
      const book = await bookService.getBookById(id);
      res.status(200).json(book);
    } catch (error) {
      handleError(res, error);
    }
  },

  async createBook(req, res) {
    try {
      const newBook = await bookService.createBook(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      handleError(res, error);
    }
  },

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const updatedBook = await bookService.updateBook(id, req.body);
      res.status(200).json(updatedBook);
    } catch (error) {
      handleError(res, error);
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      await bookService.deleteBook(id);
      res.status(200).json({ message: "Book successfully deleted" });
    } catch (error) {
      handleError(res, error);
    }
  },

  async countAvailableBooks(req, res) {
    try {
      const count = await bookService.countAvailableBooks();
      res.status(200).json({ availableBooks: count });
    } catch (error) {
      handleError(res, error);
    }
  },
};
