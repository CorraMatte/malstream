import moment from "moment";

export const formatDateUTCtoYearMonthDay = (date) => moment.utc(date).local().format("YYYY/MM/DD");
export const formatDateUTCtoYearMonthDayTime = (date) => moment.utc(date).local().format("HH:mm:ss, DD/MM/YYYY");
