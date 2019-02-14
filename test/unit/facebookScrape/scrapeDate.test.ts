import { expect } from 'chai'
import { JSDOM } from 'jsdom'
import { JustDate } from '../../../src/facebookScrape'
import { DateStringValidator, scrapeDate, validateDate } from '../../../src/facebookScrape/scrapeDate'

describe('date scraper', () => {
  describe('scrapeDate', () => {
    const stubAriaLabelValidator = () => undefined

    const getDocument = (body: string): Document => {
      const html = `
      <!doctype html>
      <html lang="en">

      <head>
        <meta charset="utf-8">
        <title></title>
      </head>

      <body>
      ${body}
      </body>

      </html>`
      const dom = new JSDOM(html)
      return dom.window.document
    }
    it('should reject documents with no span[aria-label] elements', () => {
      const testCases = [
        getDocument(''),
        getDocument('<span></span>'),
        getDocument('<div aria-label="something"></span>')
      ]
      testCases.forEach(doc => {
        expect(() => scrapeDate(doc, stubAriaLabelValidator)).to.throw(Error, 'no span[aria-label] element')
      })
    })

    it('should pass the aria-label field to the date parser', () => {
      const testCases = [
        { doc: getDocument('<span aria-label="something"></span>'), expectedAriaLabels: ['something'] },
        { doc: getDocument('<span aria-label="something"></span><span aria-label="something else"></span>'), expectedAriaLabels: ['something', 'something else'] },
        { doc: getDocument('<span aria-label="something"></span><span></span><span aria-label="something else"></span>'), expectedAriaLabels: ['something', 'something else'] }
      ]
      testCases.forEach(({ doc, expectedAriaLabels }) => {
        const capturedAriaLabels: string[] = []
        const fakeValidator: DateStringValidator = (ariaLabel) => {
          capturedAriaLabels.push(ariaLabel)
          return undefined
        }
        try {
          scrapeDate(doc, fakeValidator)
        } catch (error) {
          // pass
        }
        expect(capturedAriaLabels).to.deep.equal(expectedAriaLabels)
      })
    })

    it('should return the first non-undefined result from the validator', () => {
      const doc = getDocument('<span aria-label="foo"></span><span aria-label="bar"></span><span aria-label="baz"></span>')
      const firstDate: JustDate = { year: 2019, month: 2, day: 14 }
      const returnValues = [undefined, firstDate, { year: 2018, month: 11, day: 9 }]
      const fakeValidator: DateStringValidator = () => {
        return returnValues.shift()
      }
      expect(scrapeDate(doc, fakeValidator)).to.deep.equal(firstDate)
    })

    it('should throw if the validator returned undefined for each aria-label', () => {
      const doc = getDocument('<span aria-label="foo"></span><span aria-label="bar"></span><span aria-label="baz"></span>')
      const fakeValidator: DateStringValidator = () => undefined
      expect(() => scrapeDate(doc, fakeValidator)).to.throw(Error, 'no span[aria-label] contained a valid date')
    })
  })

  describe('validateDate', () => {
    it('should reject invalid dates', () => {
      const invalidDates = ['', 'foo', 'Saturday, 43 January 2000', 'Monday, 9 February 2019']
      invalidDates.forEach(invalidDate => expect(validateDate(invalidDate)).to.equal(undefined))
    })

    it('should parse valid dates', () => {
      const testCases = [
        { dateString: 'Saturday, 9 February 2019', expectedDate: { year: 2019, month: 2, day: 9 } },
        { dateString: 'Thursday, 28 February 2019', expectedDate: { year: 2019, month: 2, day: 28 } },
        { dateString: 'Saturday, 9 February 2019', expectedDate: { year: 2019, month: 2, day: 9 } }
      ]
      testCases.forEach(({ dateString, expectedDate }) => {
        expect(validateDate(dateString)).to.deep.equal(expectedDate)
      })
    })
  })
})
