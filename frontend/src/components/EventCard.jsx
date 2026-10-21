import { motion } from "framer-motion";
import { CalendarDays, Clock3, Trash2 } from "lucide-react";
import { daysUntil, formatDate } from "../utils/dates.js";

const categoryEmoji = { Birthday: "🎂", Anniversary: "💜", "Special Day": "✨" };

export default function EventCard({ event, index, onDelete }) {
  const days = daysUntil(event.date);
  return (
    <motion.article className="event-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.055, duration: 0.35 }} whileHover={{ y: -4 }}>
      <div className={`event-emoji emoji-${event.category === "Birthday" ? "pink" : event.category === "Anniversary" ? "purple" : "orange"}`}>{categoryEmoji[event.category] || "✨"}</div>
      <button className="delete-button" title="Remove event" aria-label={`Remove ${event.title}`} onClick={() => onDelete(event.id)}><Trash2 size={15} /></button>
      <div className="event-category">{event.category || "Special Day"}</div>
      <h3>{event.title}</h3>
      <div className="event-date"><CalendarDays size={14} /> {formatDate(event.date)}</div>
      <div className="event-card-bottom">
        <div><strong>{days === 0 ? "Today!" : days}</strong><span>{days === 0 ? "it's the day" : days === 1 ? "day to go" : "days to go"}</span></div>
        <span className="eve-badge"><Clock3 size={12} /> 11:45 PM EVE ALERT</span>
      </div>
    </motion.article>
  );
}