import { Router } from "express";
import { config, assertLiveConfig } from "../config.js";
import { createOAuthClient, GOOGLE_SCOPES } from "../google.js";

const router = Router();

router.get("/google", (req, res, next) => {
  try {
    if (config.demoMode) return res.redirect(`${config.frontendUrl}/?demo=1`);
    assertLiveConfig();
    const oauth = createOAuthClient();
    const url = oauth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_SCOPES,
      state: req.sessionID
    });
    res.redirect(url);
  } catch (error) { next(error); }
});

router.get("/google/callback", async (req, res, next) => {
  try {
    if (req.query.error) return res.redirect(`${config.frontendUrl}/?auth=cancelled`);
    if (req.query.state !== req.sessionID) {
      return res.status(400).send("OAuth state validation failed. Please restart sign-in.");
    }
    const oauth = createOAuthClient();
    const { tokens } = await oauth.getToken(String(req.query.code || ""));
    req.session.googleTokens = tokens;
    res.redirect(`${config.frontendUrl}/?auth=success`);
  } catch (error) { next(error); }
});

router.get("/status", (req, res) => {
  res.json({
    demoMode: config.demoMode,
    connected: config.demoMode || Boolean(req.session.googleTokens),
    email: req.session.googleEmail || null
  });
});

router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("firstwish.sid");
    res.json({ ok: true });
  });
});

export default router;