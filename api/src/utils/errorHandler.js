export function handleError(res, error, statusCode = 500) {
  console.error("Error:", error.message);
  res
    .status(statusCode)
    .json({ error: error.message || "Internal server error" });
}
