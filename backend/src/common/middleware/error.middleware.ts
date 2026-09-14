import { Request, Response, NextFunction } from "express";
import logger from "../../config/logger";
// Middleware global de gestion des erreurs
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - ${message}`, {
      stack: err.stack,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  res.status(statusCode).json({
    status: "error",
    message,
  });
};
