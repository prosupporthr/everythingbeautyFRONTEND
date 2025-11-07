import moment from "moment-timezone";

interface Business {
  days: number[];           // e.g. [1,2,4]
  openingTime: string;      // "09:00"
  closingTime: string;      // "17:00"
  timezone?: string;        // optional: default Africa/Lagos
}

export function isBusinessOpen(business: Business): boolean {
  const timezone = business.timezone || "Africa/Lagos";

  const now = moment().tz(timezone);

  const currentDay = now.isoWeekday(); // Monday = 1 ... Sunday = 7

  // ✅ Check if today is a working day
  if (!business.days.includes(currentDay)) {
    return false;
  }

  const opening = moment.tz(business.openingTime, "HH:mm", timezone);
  const closing = moment.tz(business.closingTime, "HH:mm", timezone);

  const currentTime = now;

  // ✅ Check if current time is between open and close
  return currentTime.isBetween(opening, closing, undefined, "[)");
}
