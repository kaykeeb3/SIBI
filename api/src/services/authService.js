import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authService = {
  async registerUser({ name, email, password, profilePicture }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: { name, email, password: hashedPassword, profilePicture },
      select: { id: true, name: true, email: true, profilePicture: true },
    });
  },

  async authenticateUser({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    };
  },

  async getUserProfile(userId) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, profilePicture: true },
    });
  },
};
