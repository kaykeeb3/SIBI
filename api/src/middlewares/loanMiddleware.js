export const validateLoanInput = (req, res, next) => {
  const { name, courseSeries, startDate, returnDate, bookId } = req.body;

  if (!name || !courseSeries || !startDate || !returnDate || !bookId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Validação para nome (letras, espaços e pontos)
  if (!/^[a-zA-ZÀ-ú\s.]+$/.test(name)) {
    return res.status(400).json({
      error: "Name must contain only letters, spaces, and periods.",
    });
  }

  // Validação para courseSeries (letras com acento, números, espaços, hífen e º)
  if (!/^[a-zA-ZÀ-ú0-9\sº-]+$/.test(courseSeries)) {
    return res.status(400).json({
      error:
        "Course series must contain only letters, numbers, spaces, hyphens, and 'º'.",
    });
  }

  // Validação para UUID do bookId
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(bookId)) {
    return res.status(400).json({
      error: "Invalid Book ID format. It must be a valid UUID.",
    });
  }

  // Validação para datas
  const start = new Date(startDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      error: "Invalid date format.",
    });
  }

  if (start >= end) {
    return res.status(400).json({
      error: "Return date must be after the start date.",
    });
  }

  next();
};
