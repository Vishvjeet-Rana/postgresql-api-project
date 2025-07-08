import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import prisma from "./config/db.js";
import { swaggerDocs } from "./swagger.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Blog API With PostgreSQL Project is running.");
});

// all routes are here
app.use("/api/auth", authRoutes);

swaggerDocs(app);
const PORT = 3000;
app.listen(PORT, (req, res) => {
  console.log(`👋 app is listening at http://localhost:${PORT}`);
});

// Graceful shutdown (good practice for Prisma)
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
