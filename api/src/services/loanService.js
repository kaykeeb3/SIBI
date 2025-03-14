import { PrismaClient } from "@prisma/client";
import moment from "moment";

const prisma = new PrismaClient();

export const loanService = {
  async getAllLoans(query) {
    const { name, courseSeries } = query;

    const whereClause = {
      returned: false,
      ...(name && { borrowerName: { contains: name, mode: "insensitive" } }),
      ...(courseSeries && {
        course: { contains: courseSeries, mode: "insensitive" },
      }),
    };

    return await prisma.loan.findMany({ where: whereClause });
  },

  async getLoanById(id) {
    if (!id) throw new Error("Invalid loan ID.");

    const loan = await prisma.loan.findUnique({ where: { id } });
    if (!loan) throw new Error("Loan not found.");

    return loan;
  },

  async createLoan(data) {
    const { borrowerName, courseSeries, startDate, returnDate, bookId } = data;

    if (
      !borrowerName ||
      !courseSeries ||
      !startDate ||
      !returnDate ||
      !bookId
    ) {
      throw new Error("Invalid loan data. All fields are required.");
    }

    try {
      const book = await prisma.book.findUnique({ where: { id: bookId } });

      if (!book) throw new Error("Book not found.");
      if (book.quantity <= 0) throw new Error("No available copies.");

      await prisma.book.update({
        where: { id: bookId },
        data: { quantity: { decrement: 1 } },
      });

      return await prisma.loan.create({
        data: {
          borrowerName,
          course: courseSeries,
          startDate: moment(startDate).toDate(),
          returnDate: moment(returnDate).toDate(),
          bookId,
          returned: false,
        },
      });
    } catch (error) {
      throw new Error("Failed to create loan.");
    }
  },

  async updateLoan(id, data) {
    if (!id) throw new Error("Invalid loan ID.");

    return await prisma.loan.update({ where: { id }, data });
  },

  async markAsReturned(id) {
    const loan = await prisma.loan.findUnique({ where: { id } });

    if (!loan || loan.returned)
      throw new Error("Loan not found or already returned.");

    await prisma.book.update({
      where: { id: loan.bookId },
      data: { quantity: { increment: 1 } },
    });

    return await prisma.loan.update({
      where: { id },
      data: { returned: true },
    });
  },

  async deleteLoan(id) {
    if (!id) throw new Error("Invalid loan ID.");

    return await prisma.loan.delete({ where: { id } });
  },
};
