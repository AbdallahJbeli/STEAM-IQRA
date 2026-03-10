import express from "express";
import cors from "cors";
import { pool } from "./config/database";
import authRoutes from "./routes/auth.routes";
import { AuthService } from "./services/auth.service";



const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);

pool.connect()
    .then(() => {
        console.log("Connected to PostegreSQL");
        // ensure admin account exists (may log activation link)
        AuthService.initAdmin().catch((err) => console.error("Admin init error:", err));
    })
    .catch((err) => console.error("DB connection error:", err));

app.get("/", (req, res) => {
    res.json({ message: "Auth Service Running" });
});

export default app;