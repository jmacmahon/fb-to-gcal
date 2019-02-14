import { hasInnerText, JustDate, validMonths } from './index'

export function scrapeDate (dateSpan: Element, year: number): JustDate {
  if (dateSpan.childElementCount !== 2) {
    throw new Error('Date span did not contain two children')
  }
  const dateSpanChildren = Array.from(dateSpan.childNodes)
  const monthSpan = dateSpanChildren[0]
  console.log(monthSpan)
  if (!hasInnerText(monthSpan)) {
    throw new Error('Month field did not have an innerText')
  }
  if (!validMonths.includes(monthSpan.innerText.toUpperCase())) {
    throw new Error(`Month field was invalid: ${monthSpan.innerText}`)
  }
  const month = validMonths.indexOf(monthSpan.innerText) + 1
  const dayOfMonthSpan = dateSpanChildren[1]
  if (!hasInnerText(dayOfMonthSpan)) {
    throw new Error('Day of month field did not have an innerText')
  }
  const parsedDayOfMonth = parseInt(dayOfMonthSpan.innerText, 10)
  if (isNaN(parsedDayOfMonth)) {
    throw new Error(`Day of month field was invalid: ${dayOfMonthSpan.innerText}`)
  }
  return { year, month, day: parsedDayOfMonth }
}
