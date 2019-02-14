import { isDict } from '../dict'
import { scrapeDate } from './scrapeDate'

export type JustDate = { year: number, month: number, day: number }

export type FBEvent = {
  name: string
  date: JustDate
}

export function scrapeFacebookEvent (querySelector: Document['querySelector']): FBEvent {
  const dateSpan = querySelector('#title_subtitle span')
  if (dateSpan === null) {
    throw new Error('Could not find date span')
  }
  const date = scrapeDate(dateSpan, 2019)
  return { name: '', date }
}

export const validMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export function hasInnerText (raw: unknown): raw is { innerText: string } {
  return isDict(raw) && typeof raw.innerText === 'string'
}
