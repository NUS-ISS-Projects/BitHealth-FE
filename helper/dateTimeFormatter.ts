export const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  const map = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  return `${day} ${map[month as keyof typeof map]} ${year}`;
};

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "pm" : "am";
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes.slice(0, 2)} ${ampm}`;
};

export function formatDateForDisplay(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateForSaving(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const formatLastVerified = (date: Date | string): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date; // Convert string to Date if needed

  const month = parsedDate.getMonth() + 1; // Months are zero-based (0 = January)
  const day = parsedDate.getDate();
  const year = parsedDate.getFullYear();
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();
  const seconds = parsedDate.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  return `${month}/${day}/${year}, ${formattedHours}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")} ${ampm}`;
};
