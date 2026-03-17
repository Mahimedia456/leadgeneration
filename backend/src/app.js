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

app.use(
  cors({
    origin: [env.appUrl],
    credentials: true,
  })
);

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many requests, try again later." },
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    message: "LeadGen backend running",
  });
});

app.use("/api/auth", authLimiter);
app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;