export const validateBookInput = (req, res, next) => {
  const { title, number, author, genre, quantity } = req.body;

  if (!title || !author || !genre || quantity === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!Number.isInteger(number) || number <= 0) {
    return res
      .status(400)
      .json({ error: "Book number must be a positive integer" });
  }

  if (!/^[a-zA-Z0-9\s.]+$/.test(author)) {
    return res.status(400).json({
      error:
        "Author's name must contain only letters, numbers, spaces, and periods.",
    });
  }

  if (typeof genre !== "string") {
    return res.status(400).json({ error: "Genre must be a string" });
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive integer" });
  }

  next();
};
