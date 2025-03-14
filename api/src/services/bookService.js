import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const bookService = {
  async countAvailableBooks() {
    try {
      const books = await prisma.book.findMany({
        where: { quantity: { gt: 0 } },
      });
      return books.reduce((sum, book) => sum + book.quantity, 0);
    } catch (error) {
      throw new Error("Failed to count available books.");
    }
  },

  async createBook(data) {
    const { title, author, genre, quantity } = data;

    if (!title || !author || !genre || quantity === undefined || quantity < 0) {
      throw new Error("Invalid book data. All fields are required.");
    }

    try {
      return await prisma.book.create({ data });
    } catch (error) {
      throw new Error("Failed to create book.");
    }
  },

  async getAllBooks() {
    return await prisma.book.findMany();
  },

  async getBookById(id) {
    if (!id) throw new Error("Invalid book ID.");

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) throw new Error("Book not found.");

    return book;
  },

  async updateBook(id, data) {
    if (!id) throw new Error("Invalid book ID.");

    try {
      return await prisma.book.update({ where: { id }, data });
    } catch (error) {
      throw new Error("Failed to update book.");
    }
  },

  async deleteBook(id) {
    if (!id) throw new Error("Invalid book ID.");

    try {
      return await prisma.book.delete({ where: { id } });
    } catch (error) {
      throw new Error("Failed to delete book.");
    }
  },
};
