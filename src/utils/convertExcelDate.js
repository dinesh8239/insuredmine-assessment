// Converts Excel serial date to JS Date
const excelDateToJSDate = (serial) => {
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);

  // Excel dates have no timezone, return as UTC
  return new Date(Date.UTC(
    dateInfo.getUTCFullYear(),
    dateInfo.getUTCMonth(),
    dateInfo.getUTCDate()
  ));
};

// Parses value as either Excel serial number or ISO/Date string
const parseExcelDate = (value) => {
  if (typeof value === "number") {
    return excelDateToJSDate(value);
  }

  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};

module.exports = {
  excelDateToJSDate,
  parseExcelDate
};
