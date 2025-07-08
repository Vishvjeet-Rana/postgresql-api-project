import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Blog API With PostgreSQL Project is running.");
});

// swaggerDocs(app);
const PORT = 3000;
app.listen(PORT, (req, res) => {
  console.log(`👋 app is listening at http://localhost:${PORT}`);
});
