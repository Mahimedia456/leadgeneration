import app from "./app.js";
import { env } from "./config/env.js";

const PORT = Number(env.port || 4000);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});