import app from "./app.js";
import { env } from "./config/env.js";
import { verifyMailer } from "./lib/mailer.js";

app.listen(env.port, async () => {
  console.log(`Server running on http://localhost:${env.port}`);

  try {
    await verifyMailer();
    console.log("SMTP connection verified successfully");
  } catch (error) {
    console.error("SMTP verification failed:", error.message);
  }
});