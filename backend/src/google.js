import { google } from "googleapis";
import { config } from "./config.js";

export function createOAuthClient() {
  return new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleRedirectUri
  );
}

export function calendarForSession(session) {
  if (!session.googleTokens) {
    const error = new Error("Google account is not connected. Sign in with Google first.");
    error.status = 401;
    throw error;
  }
  const auth = createOAuthClient();
  auth.setCredentials(session.googleTokens);
  // Persist refreshed access tokens for subsequent requests.
  auth.on("tokens", (tokens) => {
    session.googleTokens = { ...session.googleTokens, ...tokens };
  });
  return google.calendar({ version: "v3", auth });
}

export const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/calendar.events"];