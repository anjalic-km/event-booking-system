import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

// Format a plain date string e.g. "2024-12-25" → "25 Dec 2024"
export const getDateFormat = (date: string) => {
  return dayjs(date, "YYYY-MM-DD").format("DD MMM YYYY");
};

// Combine separate date ("2024-12-25") and time ("14:30") strings into one display value
// Used for the events table where date and time are stored as separate fields
export const getDateTimeFormat = (dateTime: string) => {
  // Handles both a combined "YYYY-MM-DD HH:mm" string (from the table renderer)
  // and an ISO timestamp from createdAt
  const parsed =
    dayjs(dateTime, "YYYY-MM-DD HH:mm", true).isValid()
      ? dayjs(dateTime, "YYYY-MM-DD HH:mm")
      : dayjs(dateTime);

  return parsed.isValid() ? parsed.format("DD MMM YYYY hh:mm A") : "—";
};