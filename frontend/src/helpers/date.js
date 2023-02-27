export const checkIfDateBetweenFromTo = (dateFrom, dateTo, dateCheck) =>
  dateCheck.getTime() <= dateTo.getTime() && dateCheck.getTime() >= dateFrom.getTime()

export const getXDaysBefore = (currentDate = new Date(), beforeDays = 5) => {
  const d = new Date(currentDate)
  d.setDate(d.getDate() - beforeDays)
  return d
}
