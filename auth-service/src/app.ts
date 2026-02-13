import express from "express";
import cors from "cors";
import { pool } from "./config/database";
import authRoutes from "./routes/auth.routes";



const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

pool.connect()
    .then(() => console.log("Connected to PostegreSQL"))
    .catch((err) => console.error("DB connection error:", err));

app.get("/", (req, res) => {
    res.json({ message: "Auth Service Running" });
});

export default app;