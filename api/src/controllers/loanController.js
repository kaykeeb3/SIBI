import { loanService } from "../services/loanService.js";
import { handleError } from "../utils/errorHandler.js";

export const loanController = {
  async getLoans(req, res) {
    try {
      const loans = await loanService.getAllLoans(req.query);
      res.status(200).json(loans);
    } catch (error) {
      handleError(res, error);
    }
  },

  async getLoanById(req, res) {
    try {
      const { id } = req.params;
      const loan = await loanService.getLoanById(id);
      res.status(200).json(loan);
    } catch (error) {
      handleError(res, error);
    }
  },

  async createLoan(req, res) {
    try {
      const newLoan = await loanService.createLoan(req.body);
      res.status(201).json(newLoan);
    } catch (error) {
      handleError(res, error);
    }
  },

  async updateLoan(req, res) {
    try {
      const { id } = req.params;
      const updatedLoan = await loanService.updateLoan(id, req.body);
      res.status(200).json(updatedLoan);
    } catch (error) {
      handleError(res, error);
    }
  },

  async deleteLoan(req, res) {
    try {
      const { id } = req.params;
      await loanService.deleteLoan(id);
      res.status(200).json({ message: "Loan successfully deleted" });
    } catch (error) {
      handleError(res, error);
    }
  },

  async markAsReturned(req, res) {
    try {
      const { id } = req.params;
      const updatedLoan = await loanService.markAsReturned(id);
      res.status(200).json(updatedLoan);
    } catch (error) {
      handleError(res, error);
    }
  },
};
