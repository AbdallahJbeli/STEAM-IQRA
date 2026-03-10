import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { AuthService } from "./services/auth.service";

const PORT = process.env.PORT || 4001;

app.listen(PORT, async () => {
  console.log(`Auth Service running on port ${PORT}`);
  await AuthService.seedAdmin().catch((err) =>
    console.error("Admin seed error:", err)
  );
});