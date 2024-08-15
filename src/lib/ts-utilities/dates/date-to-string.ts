export function dateToString(date: Date) {
  const dateTime = new Date(date);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth();
  const day = dateTime.getDate();
  return new Date(year, month, day).toISOString();
}