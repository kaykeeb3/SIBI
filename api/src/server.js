import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import schedule from "./routes/scheduleRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/api", bookRoutes);
app.use("/api", loanRoutes);
app.use("/api", equipmentRoutes);
app.use("/api", schedule);

app.use((err, req, res, next) => {
  console.error("Internal server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
