import { useState } from "react";
import { CalendarDays, Plus, Sparkles } from "lucide-react";

const categories = [
  { value: "Birthday", emoji: "🎂" },
  { value: "Anniversary", emoji: "💜" },
  { value: "Special Day", emoji: "✨" }
];

export default function EventForm({ onCreate, busy }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Birthday");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!title.trim() || !date) {
      setError("Add a name and choose a date to continue.");
      return;
    }
    try {
      await onCreate({ title: title.trim(), date, category });
      setTitle("");
      setDate("");
      setCategory("Birthday");
    } catch (err) { setError(err.message); }
  }

  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div><div className="eyebrow muted"><span className="heading-dot" /> SAVE A DATE</div><h2>Make it a moment.</h2></div>
        <span className="heading-icon"><Plus size={18} /></span>
      </div>
      <form onSubmit={submit} className="event-form">
        <label className="field-label" htmlFor="event-title">Person's name / event title</label>
        <input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="e.g. Rahul's Birthday 🎂" />
        <label className="field-label" htmlFor="event-date">The special date</label>
        <div className="date-input-wrap"><CalendarDays size={17} /><input id="event-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <label className="field-label">Pick a feeling</label>
        <div className="category-picker">
          {categories.map((item) => <button type="button" key={item.value} className={`category-option ${category === item.value ? "selected" : ""}`} onClick={() => setCategory(item.value)}><span>{item.emoji}</span>{item.value}</button>)}
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="primary-button full-button" type="submit" disabled={busy}>{busy ? <span className="spinner" /> : <><Sparkles size={17} /> Lock in Calendar <span className="button-arrow">↗</span></>}</button>
        <p className="form-note"><span>✦</span> One date. Every year. Never forgotten.</p>
      </form>
    </section>
  );
}