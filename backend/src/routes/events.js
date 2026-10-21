import { Router } from "express";
import { config } from "../config.js";
import { calendarForSession } from "../google.js";
import { demoEvents } from "../demoStore.js";

const router = Router();
const APP_MARKER = "firstwish";

function validateEvent(body) {
  const { title, date, category } = body || {};
  if (typeof title !== "string" || !title.trim() || title.length > 120) {
    return "Add a title between 1 and 120 characters.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "") || Number.isNaN(Date.parse(`${date}T00:00:00`))) {
    return "Choose a valid date.";
  }
  if (!["Birthday", "Anniversary", "Special Day"].includes(category)) {
    return "Choose a valid category.";
  }
  return null;
}

function fromGoogleEvent(item) {
  const date = item.start?.date || item.start?.dateTime?.slice(0, 10);
  return {
    id: item.id,
    title: item.summary || "Untitled event",
    category: item.extendedProperties?.private?.firstwishCategory || "Special Day",
    date,
    htmlLink: item.htmlLink
  };
}

router.get("/", async (req, res, next) => {
  try {
    if (config.demoMode) return res.json({ events: demoEvents.list(), mode: "demo" });
    const calendar = calendarForSession(req.session);
    const response = await calendar.events.list({
      calendarId: "primary",
      maxResults: 250,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date().toISOString(),
      privateExtendedProperty: `${APP_MARKER}=true`
    });
    res.json({ events: (response.data.items || []).map(fromGoogleEvent), mode: "live" });
  } catch (error) { next(error); }
});

router.post("/", async (req, res, next) => {
  try {
    const invalid = validateEvent(req.body);
    if (invalid) return res.status(400).json({ error: invalid });
    const payload = {
      title: req.body.title.trim(),
      date: req.body.date,
      category: req.body.category
    };
    if (config.demoMode) {
      const saved = demoEvents.create(payload);
      return res.status(201).json({ event: saved, mode: "demo" });
    }

    const calendar = calendarForSession(req.session);
    // Google Calendar all-day events use an exclusive end date.
    // The 15-minute override is relative to midnight at the start of the event,
    // which corresponds to 11:45 PM on the previous evening in the calendar timezone.
    const endDate = addDays(payload.date, 1);
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: payload.title,
        description: `Created with FirstWish · ${payload.category}`,
        start: { date: payload.date },
        end: { date: endDate },
        recurrence: ["RRULE:FREQ=YEARLY"],
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 1440 },
            { method: "popup", minutes: 15 }
          ]
        },
        extendedProperties: {
          private: { firstwish: "true", firstwishCategory: payload.category }
        }
      }
    });
    res.status(201).json({ event: fromGoogleEvent(response.data), mode: "live" });
  } catch (error) { next(error); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (config.demoMode) {
      const removed = demoEvents.remove(req.params.id);
      return removed ? res.json({ ok: true }) : res.status(404).json({ error: "Event not found." });
    }
    const calendar = calendarForSession(req.session);
    await calendar.events.delete({ calendarId: "primary", eventId: req.params.id });
    res.json({ ok: true });
  } catch (error) { next(error); }
});

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export default router;