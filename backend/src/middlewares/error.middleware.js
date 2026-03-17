export function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(error, req, res, next) {
  console.error(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  return res.status(statusCode).json({ message });
}