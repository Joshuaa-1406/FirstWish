import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  backendUrl: process.env.BACKEND_URL || "http://localhost:4000",
  demoMode: (process.env.DEMO_MODE || "true").toLowerCase() === "true",
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:4000/api/auth/google/callback",
  sessionSecret: process.env.SESSION_SECRET || "local-development-only-change-me"
};

export function assertLiveConfig() {
  const missing = ["googleClientId", "googleClientSecret"].filter((key) => !config[key]);
  if (missing.length) throw new Error(`Missing Google OAuth configuration: ${missing.join(", ")}`);
}