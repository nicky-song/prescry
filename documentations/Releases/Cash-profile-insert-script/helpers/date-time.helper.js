
export const UTCDateString = (dateString) => {
  const utcDate = new Date(dateString);

  const yearText = utcDate.getUTCFullYear();

  const month = utcDate.getUTCMonth() + 1;
  const monthText = month > 9 ? month : '0' + month;

  const day = utcDate.getUTCDate();
  const dayText = day > 9 ? day : '0' + day;

  return `${yearText}-${monthText}-${dayText}`;
};