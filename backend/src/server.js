import express from "express";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(session({
  name: "firstwish.sid",
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "firstwish-api", mode: config.demoMode ? "demo" : "live" }));
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  const status = error.status || 500;
  res.status(status).json({
    error: status === 500 ? "Something went wrong. Check the API server logs." : error.message
  });
});

app.listen(config.port, () => {
  console.log(`FirstWish API listening on ${config.backendUrl}`);
  console.log(`Mode: ${config.demoMode ? "DEMO (no Google credentials needed)" : "LIVE Google Calendar"}`);
});