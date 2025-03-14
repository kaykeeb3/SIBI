import { authService } from "../services/authService.js";
import { handleError } from "../utils/errorHandler.js";

export const authController = {
  async register(req, res) {
    try {
      const user = await authService.registerUser(req.body);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
      handleError(res, error, 400);
    }
  },

  async login(req, res) {
    try {
      const { token, user } = await authService.authenticateUser(req.body);
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      handleError(res, error, 401);
    }
  },

  async profile(req, res) {
    try {
      const user = await authService.getUserProfile(req.user.userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      res.status(200).json({ message: "Profile retrieved successfully", user });
    } catch (error) {
      handleError(res, error);
    }
  },
};
