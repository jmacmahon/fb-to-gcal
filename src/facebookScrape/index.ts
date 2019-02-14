import { isDict } from '../dict'
import { scrapeDate } from './scrapeDate'

export type JustDate = { year: number, month: number, day: number }

export type FBEvent = {
  name: string
  date: JustDate
}

export function scrapeFacebookEvent (doc: Document): FBEvent {
  const date = scrapeDate(doc)
  return { name: '', date }
}
