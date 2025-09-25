export function formatDuration(seconds: number): string {
  // Handle invalid or missing data explicitly
  if (seconds == null || Number.isNaN(seconds)) {
    console.warn("formatDuration: Invalid duration value received:", seconds);
    return "--:--";
  }

  // Zero or negative duration is valid (some episodes might be 0 seconds)
  if (seconds <= 0) {
    return "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}
