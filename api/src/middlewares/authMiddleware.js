import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";
import { handleError } from "../utils/errorHandler.js";

export function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token missing" });

    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
      return res.status(401).json({ error: "Malformed token" });
    }

    jwt.verify(token, jwtConfig.secret, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      req.user = decoded;
      next();
    });
  } catch (error) {
    handleError(res, error);
  }
}
