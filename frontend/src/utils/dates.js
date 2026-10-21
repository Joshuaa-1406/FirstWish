export function getNextOccurrence(dateString, now = new Date()) {
  if (!dateString) return null;
  const [, month, day] = dateString.split("-").map(Number);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), month - 1, day);
  if (next < today) next = new Date(now.getFullYear() + 1, month - 1, day);
  return next;
}

export function daysUntil(dateString, now = new Date()) {
  const next = getNextOccurrence(dateString, now);
  if (!next) return 0;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((next - today) / 86400000);
}

export function formatDate(dateString) {
  if (!dateString) return "Date not set";
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-US", {
    month: "short", day: "numeric"
  });
}

export function formatCountdown(target) {
  if (!target) return { days: "00", hours: "00", minutes: "00", seconds: "00" };
  const diff = Math.max(0, target.getTime() - Date.now());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return Object.fromEntries(Object.entries({ days, hours, minutes, seconds }).map(([k, v]) => [k, String(v).padStart(2, "0")]));
}