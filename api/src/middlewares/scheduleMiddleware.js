export const validateScheduleInput = (req, res, next) => {
  const {
    borrowerName,
    equipmentId,
    quantity,
    startDate,
    returnDate,
    dayOfWeek,
    type,
  } = req.body;

  if (
    !borrowerName ||
    !equipmentId ||
    !quantity ||
    !startDate ||
    !returnDate ||
    !dayOfWeek
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Validação para borrowerName (somente letras, espaços e pontos)
  if (!/^[a-zA-ZÀ-ú\s.]+$/.test(borrowerName)) {
    return res.status(400).json({
      error: "Borrower name must contain only letters, spaces, and periods.",
    });
  }

  // Validação para equipmentId (UUID)
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  if (!uuidRegex.test(equipmentId)) {
    return res
      .status(400)
      .json({ error: "Invalid Equipment ID format. It must be a valid UUID." });
  }

  // Validação para quantity (deve ser um número inteiro positivo)
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive integer." });
  }

  // Validação para dayOfWeek (dias válidos em português e inglês)
  const validDays = [
    // English days
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    // Portuguese days
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  if (!validDays.includes(dayOfWeek)) {
    return res.status(400).json({
      error:
        "Dia da semana inválido. Use formato como 'segunda-feira', 'terça-feira', etc.",
    });
  }

  // Validação para type (opcional, mas se informado deve ser um string válida)
  if (type && typeof type !== "string") {
    return res.status(400).json({ error: "Type must be a valid string." });
  }

  // Validação para datas
  const start = new Date(startDate);
  const end = new Date(returnDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({ error: "Invalid date format." });
  }

  if (start >= end) {
    return res
      .status(400)
      .json({ error: "Return date must be after the start date." });
  }

  next();
};
