import { useEffect, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { formatCountdown, getNextOccurrence } from "../utils/dates.js";

export default function Countdown({ event }) {
  const [tick, setTick] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const target = event ? getNextOccurrence(event.date) : null;
  const time = formatCountdown(target);
  // tick is intentionally read to trigger a one-second re-render.
  void tick;
  return (
    <section className="hero-card glass">
      <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
      <div className="hero-content">
        <div className="eyebrow"><Sparkles size={14} /> YOUR PEOPLE, YOUR MOMENTS</div>
        <h1>Make their day.<br /><span>Before anyone else.</span></h1>
        <p className="hero-copy">The little dates mean everything. Keep them close, and show up right on time.</p>
        <div className="countdown-label">{event ? `COUNTING DOWN TO ${event.title.toUpperCase()}` : "YOUR NEXT REASON TO CELEBRATE"}</div>
        <div className="countdown" aria-label="Countdown to next event">
          {[["days", "DAYS"], ["hours", "HRS"], ["minutes", "MIN"], ["seconds", "SEC"]].map(([key, label], index) => (
            <div className="time-unit" key={key}><strong>{time[key]}</strong><span>{label}</span></div>
          ))}
        </div>
        <a className="text-link" href="#events">See your moments <ArrowUpRight size={15} /></a>
      </div>
      <div className="hero-sticker"><span>✳</span><small>MAKE IT<br />PERSONAL</small></div>
      <div className="hero-foot"><span className="live-dot" /> A little reminder. A lifelong memory.</div>
    </section>
  );
}