// In-memory demo data resets when the API server restarts. No Google account is required.
const events = [
  {
    id: "demo-rahul",
    title: "Rahul's Birthday 🎂",
    category: "Birthday",
    date: nextDate(11, 2),
    demo: true
  },
  {
    id: "demo-parents",
    title: "Mum & Dad Anniversary 💜",
    category: "Anniversary",
    date: nextDate(3, 18),
    demo: true
  }
];

function nextDate(month, day) {
  const now = new Date();
  let year = now.getFullYear();
  const date = new Date(year, month - 1, day);
  if (date < new Date(now.getFullYear(), now.getMonth(), now.getDate())) year += 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
export const demoEvents = {
  list: () => [...events].sort((a, b) => a.date.localeCompare(b.date)),
  create: (event) => {
    const saved = { ...event, id: `demo-${Date.now()}`, demo: true };
    events.push(saved);
    return saved;
  },
  remove: (id) => {
    const index = events.findIndex((event) => event.id === id);
    if (index < 0) return false;
    events.splice(index, 1);
    return true;
  }
};