import moment = require('moment')
import { JustDate } from './index'

export type DateStringValidator = (dateString: string) => JustDate | undefined

export function scrapeDate (doc: Document, validator = validateDate): JustDate {
  const withAriaLabel = Array.from(doc.querySelectorAll('span[aria-label]'))
  if (withAriaLabel.length === 0) {
    throw new Error('no span[aria-label] element')
  }
  const ariaLabels = withAriaLabel.map(span => span.getAttribute('aria-label')!)
  for (const ariaLabel of ariaLabels) {
    const validated = validator(ariaLabel)
    if (validated !== undefined) {
      return validated
    }
  }
  throw new Error('no span[aria-label] contained a valid date')
}

export const validateDate: DateStringValidator = (dateString) => {
  const parsed = moment(dateString, 'dddd, D MMMM YYYY')
  if (!parsed.isValid()) {
    return undefined
  } else {
    return { year: parsed.year(), month: parsed.month() + 1, day: parsed.date() }
  }
}
