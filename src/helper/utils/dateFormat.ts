import moment from "moment"

export function dateFormat(date: string) {
  return moment(date).format("ddd, MMMM Do YYYY")
} 

export function dateChatFormat(date: string) {
  return moment(date).format(" DD/MMM/YY, h:mm A")
} 


export function dateFormatHeader(date: string) {
  return moment(date).format("Do, MM yy")
} 


export function dateFormatMonthAndYear(date: string) {
  return moment(date).format("MMMM yy")
} 

export function dateTimeFormat(date: string) {
  return moment(date).format("Do MMM YYYY h:mm A")
} 

export function dateFormatDashboad(date: string) {
  return moment(date).format("ddd, MM/DD/YY")
}

export function dateFormatMonthDay(date: string) {
  return moment(date).format("MMM Do")
}

export function dateFormatMonth(date: string) {
  return moment(date).format("MMM")
}

export function dateFormatDay(date: string) {
  return moment(date).format("Do")
}

export const timeFormat = (isoString: string) =>
  moment(isoString).format("h:mm A")


export const formatTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${minute
      .toString()
      .padStart(2, "0")} ${suffix}`;
};
