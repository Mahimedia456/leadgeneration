import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import routes from "./routes/index.js";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";

const app = express();

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "http://localhost:5173",
  "https://leadgeneration-amber.vercel.app",
  env.appUrl
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS not allowed for origin: ${origin}`));
    },
    credentials: true,
  })
);

/* ---------------- Middleware ---------------- */

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

/* ---------------- Rate Limit ---------------- */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many requests, try again later." },
});

/* ---------------- Health ---------------- */

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "LeadGen backend running",
  });
});

/* ---------------- Routes ---------------- */

app.use("/api/auth", authLimiter);
app.use("/api", routes);

/* ---------------- Error Handlers ---------------- */

app.use(notFound);
app.use(errorHandler);

export default app;