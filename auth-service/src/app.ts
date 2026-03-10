import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
    res.json({ message: "Auth Service Running" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


export default app;