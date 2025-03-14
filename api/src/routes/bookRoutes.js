import express from "express";
import { validateBookInput } from "../middlewares/bookMiddleware.js";
import { bookController } from "../controllers/bookController.js";

const router = express.Router();

router.get("/books", bookController.getBooks);
router.get("/books/:id", bookController.getBookById);
router.post("/books", validateBookInput, bookController.createBook);
router.put("/books/:id", validateBookInput, bookController.updateBook);
router.delete("/books/:id", bookController.deleteBook);
router.get("/books/available", bookController.countAvailableBooks);

export default router;
