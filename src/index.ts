import express from "express";
import dotenv from "dotenv";
dotenv.config({ quiet: true });
import cors from "cors";
import prisma from "./config/db";
import { swaggerDocs } from "./swagger";
import authRoutes from "../src/routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import { globalErrorMiddleware } from "./middlewares/globalErrorMiddleware";
import { responseFormatter } from "./middlewares/responseFormatterMiddleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// sucess and error formatter middleware
app.use(responseFormatter);

app.get("/", (req, res) => {
  res.send("Blog API Project With PostgreSQL is running.");
});

// all routes are here
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

// global error handler middleware
app.use(globalErrorMiddleware);

swaggerDocs(app);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`👋 app is listening at http://localhost:${PORT}`);
});

// Graceful shutdown (good practice for Prisma)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
