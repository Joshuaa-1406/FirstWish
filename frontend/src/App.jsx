import { useCallback, useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarHeart, Check, Github, Heart, Menu, ShieldCheck, Sparkles, Wifi } from "lucide-react";
import { api } from "./api/client.js";
import Countdown from "./components/Countdown.jsx";
import EventForm from "./components/EventForm.jsx";
import EventCard from "./components/EventCard.jsx";
import Toast from "./components/Toast.jsx";
import { daysUntil } from "./utils/dates.js";

export default function App() {
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState({ demoMode: true, connected: true });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("All moments");

  const notify = useCallback((title, message) => {
    setToast({ title, message });
    window.setTimeout(() => setToast(null), 4500);
  }, []);

  const load = useCallback(async () => {
    try {
      const [statusData, eventData] = await Promise.all([api.status(), api.listEvents()]);
      setStatus(statusData);
      setEvents(eventData.events || []);
    } catch (error) {
      notify("Can't reach the API", "Start the backend server, then refresh this page.");
    } finally { setLoading(false); }
  }, [notify]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "success") notify("Google Calendar connected", "You're ready to save moments for the years ahead.");
    if (params.get("auth") === "cancelled") notify("Sign-in cancelled", "You can connect Google Calendar whenever you're ready.");
    if (params.has("auth") || params.has("demo")) {
      window.history.replaceState({}, "", window.location.pathname);
      load();
    }
  }, [load, notify]);

  const sortedEvents = useMemo(() => [...events].sort((a, b) => daysUntil(a.date) - daysUntil(b.date), [events]));
  const visibleEvents = useMemo(() => filter === "All moments" ? sortedEvents : sortedEvents.filter((event) => event.category === filter), [filter, sortedEvents]);

  async function createEvent(event) {
    setBusy(true);
    try {
      const result = await api.createEvent(event);
      setEvents((current) => [...current, result.event].sort((a, b) => daysUntil(a.date) - daysUntil(b.date)));
      confetti({ particleCount: 105, spread: 75, origin: { y: 0.72 }, colors: ["#ff7b8a", "#b9a2ff", "#f8d58b", "#ffffff"] });
      notify("Synced for life!", "You'll be the first to wish them.");
    } finally { setBusy(false); }
  }

  async function deleteEvent(id) {
    try {
      await api.deleteEvent(id);
      setEvents((current) => current.filter((event) => event.id !== id));
      notify("Date removed", "You can add it again whenever you like.");
    } catch (error) { notify("Couldn't remove date", error.message); }
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" /><div className="ambient ambient-b" />
      <header className="topbar">
        <a href="#" className="brand"><span className="brand-mark"><CalendarHeart size={21} /></span><span>firstwish<span className="brand-period">.</span></span></a>
        <nav className="nav-links"><a href="#events">Your moments</a><a href="#how">How it works</a></nav>
        <div className="topbar-actions">
          <span className={`mode-pill ${status.demoMode ? "demo" : "connected"}`}><span />{status.demoMode ? "DEMO MODE" : status.connected ? "GOOGLE CONNECTED" : "NOT CONNECTED"}</span>
          <button className="google-button" onClick={api.connectGoogle}><span className="google-g">G</span>{status.demoMode ? "Try Google sync" : status.connected ? "Calendar connected" : "Connect Calendar"}<ArrowUpRight size={14} /></button>
        </div>
        <button className="mobile-menu" aria-label="Open navigation" onClick={() => document.querySelector(".nav-links")?.classList.toggle("mobile-open")}><Menu /></button>
      </header>

      <main>
        <div className="welcome-line"><span className="welcome-icon"><Sparkles size={14} /></span> A LITTLE LOVE, RIGHT ON TIME <span className="welcome-line-fill" /></div>
        <div className="dashboard-grid">
          <div className="dashboard-main">
            <Countdown event={sortedEvents[0]} />
            <section className="events-section" id="events">
              <div className="section-heading events-heading"><div><div className="eyebrow muted"><span className="heading-dot" /> YOUR CALENDAR, WITH HEART</div><h2>Moments worth remembering<span className="heading-period">.</span></h2><p className="section-subtitle">Every important date, all in one lovely place.</p></div><div className="events-count"><strong>{events.length.toString().padStart(2, "0")}</strong><span>saved dates</span></div></div>
              <div className="filter-row">{["All moments", "Birthday", "Anniversary", "Special Day"].map((item) => <button key={item} className={`filter-chip ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
              {loading ? <div className="empty-state"><span className="spinner dark-spinner" /> Loading your moments…</div> : visibleEvents.length ? <div className="event-grid">{visibleEvents.map((event, index) => <EventCard key={event.id} event={event} index={index} onDelete={deleteEvent} />)}</div> : <div className="empty-state"><span className="empty-heart">♡</span><strong>No dates here just yet.</strong><span>Add a special date and make someone's day.</span></div>}
            </section>
          </div>
          <aside className="dashboard-side">
            <EventForm onCreate={createEvent} busy={busy} />
            <section className="promise-card">
              <div className="promise-icon"><ShieldCheck size={20} /></div><div className="eyebrow muted">THE FIRSTWISH PROMISE</div><h3>We remember.<br /><span>You show up.</span></h3>
              <div className="promise-row"><span className="promise-check"><Check size={13} /></span><span>Yearly repeat. Set once, forever.</span></div>
              <div className="promise-row"><span className="promise-check"><Check size={13} /></span><span>24-hour heads-up to plan something.</span></div>
              <div className="promise-row"><span className="promise-check"><Check size={13} /></span><span>11:45 PM eve alert for the midnight wish.</span></div>
              <div className="promise-footer"><span>MADE WITH <Heart size={11} fill="currentColor" /> FOR YOUR PEOPLE</span><span>01 / 03</span></div>
            </section>
            <section className="sync-card"><div className="sync-card-icon"><Wifi size={17} /></div><div><strong>{status.demoMode ? "Preview mode is on" : "Google Calendar sync"}</strong><p>{status.demoMode ? "Explore the full experience with sample data. No account needed." : "Events are saved to your primary Google Calendar."}</p></div><button aria-label="Connect Google Calendar" onClick={api.connectGoogle}><ArrowUpRight size={16} /></button></section>
          </aside>
        </div>

        <section className="how-section" id="how"><div className="eyebrow muted"><span className="heading-dot" /> EASY AS ONE, TWO, THREE</div><h2>Thoughtful, not complicated.</h2><div className="how-grid"><div className="how-item"><span>01</span><div><h3>Add your person</h3><p>A name, a date, and what you're celebrating. That's all.</p></div></div><div className="how-item"><span>02</span><div><h3>Lock it in</h3><p>Save it to Google Calendar with yearly recurrence and reminders.</p></div></div><div className="how-item"><span>03</span><div><h3>Be the first</h3><p>Get a heads-up the day before and a final nudge at 11:45 PM.</p></div></div></div></section>
      </main>

      <footer className="footer"><a href="#" className="brand footer-brand"><span className="brand-mark"><CalendarHeart size={18} /></span><span>firstwish<span className="brand-period">.</span></span></a><span>Remember the date. Make the moment.</span><span className="footer-right">MADE FOR THE PEOPLE WHO MATTER <Heart size={11} fill="currentColor" /></span></footer>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}