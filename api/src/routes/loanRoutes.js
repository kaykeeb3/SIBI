import express from "express";
import { loanController } from "../controllers/loanController.js";
import { validateLoanInput } from "../middlewares/loanMiddleware.js";

const router = express.Router();

router.get("/loans", loanController.getLoans);
router.get("/loans/:id", loanController.getLoanById);
router.post("/loans", validateLoanInput, loanController.createLoan);
router.put("/loans/:id", validateLoanInput, loanController.updateLoan);
router.delete("/loans/:id", loanController.deleteLoan);
router.put("/loans/:id/return", loanController.markAsReturned);

export default router;
