import { isDict } from './dict'

export type Event = {
  name: string
  date: Date
}

export function scrapeFacebookEvent (querySelector: Document['querySelector']): Event {
  const dateSpan = querySelector('#title_subtitle span')
  if (dateSpan === null) {
    throw new Error('Could not find date span')
  }
  return { name: '', date: new Date(0) }
}

export type JustDate = { year: number, month: number, day: number }

export function scrapeDate (dateSpan: HTMLElement, year: number): JustDate {
  if (dateSpan.childElementCount !== 2) {
    throw new Error('Date span did not contain two children')
  }
  const dateSpanChildren = Array.from(dateSpan.childNodes)
  const monthSpan = dateSpanChildren[0]
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

const validMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function hasInnerText (raw: unknown): raw is { innerText: string } {
  return isDict(raw) && typeof raw.innerText === 'string'
}
