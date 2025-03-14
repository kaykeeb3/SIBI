// Middleware for validating equipment data
export function validateEquipment(req, res, next) {
  const { name, type, quantity } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "The 'name' field is required and must be a non-empty string.",
    });
  }

  if (!type || typeof type !== "string" || type.trim() === "") {
    return res.status(400).json({
      error: "The 'type' field is required and must be a non-empty string.",
    });
  }

  if (
    !quantity ||
    typeof quantity !== "number" ||
    quantity < 0 ||
    !Number.isInteger(quantity)
  ) {
    return res.status(400).json({
      error: "The 'quantity' field is required and must be a positive integer.",
    });
  }

  next();
}
