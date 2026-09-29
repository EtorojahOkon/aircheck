export { cn } from "cn";

export function formatSessionDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes}${ampm}`;

    if (isToday) return `Today at ${timeStr}`;
    if (isYesterday) return `Yesterday at ${timeStr}`;

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function calculateElapsedTime(createdAt: string): string {
  const diff = Math.max(
    0,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000),
  );
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${h > 0 ? h.toString().padStart(2, "0") + ":" : ""}${m
    .toString()
    .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
