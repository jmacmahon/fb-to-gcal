import { expect } from 'chai'
import sinon from 'sinon'
import { scrapeDate, scrapeFacebookEvent } from '../src/facebookScrape'

describe('Facebook event scraper', () => {
  it('should throw if there was no date wrapping span', () => {
    const qsStub: Document['querySelector'] = (selector: string) => {
      if (selector === '#title_subtitle span') {
        return null
      } else {
        return sinon.stub(HTMLElement)
      }
    }
    expect(() => scrapeFacebookEvent(qsStub)).to.throw(Error, 'Could not find date span')
  })
  describe('date scraper', () => {
    it('should throw if the date span did not contain two children', () => {
      const badCounts = [-1, 0, 1, 3, 4]
      badCounts.forEach(badCount => {
        const dateSpanStub = { childElementCount: badCount } as HTMLElement
        expect(() => scrapeDate(dateSpanStub, 2019)).to.throw(Error, 'Date span did not contain two children')
      })
    })

    it('should throw if the first child of the date span was not an object with innerText', () => {
      const badNodes = ['something', 2, null, true, {}]
      badNodes.forEach(badNode => {
        const dateSpanStub = {
          childElementCount: 2,
          childNodes: [badNode, { innerText: '' }]
        } as any as HTMLElement
        expect(() => scrapeDate(dateSpanStub, 2019)).to.throw(Error, 'Month field did not have an innerText')
      })
    })

    it('should throw if the first child of the date span did not contain a valid 3-character month', () => {
      const badMonthStrings = ['', 'February', '2', 'fish']
      badMonthStrings.forEach(badMonthString => {
        const dateSpanStub = {
          childElementCount: 2,
          childNodes: [{ innerText: badMonthString }]
        } as any as HTMLElement
        expect(() => scrapeDate(dateSpanStub, 2019)).to.throw(Error, `Month field was invalid: ${badMonthString}`)
      })
    })

    it('should throw if the second child of the date span was not an object with innerText', () => {
      const badNodes = ['something', 2, null, true, {}]
      badNodes.forEach(badNode => {
        const dateSpanStub = {
          childElementCount: 2,
          childNodes: [{ innerText: 'JAN' }, badNode]
        } as any as HTMLElement
        expect(() => scrapeDate(dateSpanStub, 2019)).to.throw(Error, 'Day of month field did not have an innerText')
      })
    })

    it('should throw if the second child of the date span did not contain a valid number', () => {
      const badDayOfMonthStrings = ['', 'fish']
      badDayOfMonthStrings.forEach(badDayOfMonthString => {
        const dateSpanStub = {
          childElementCount: 2,
          childNodes: [{ innerText: 'JAN' }, { innerText: badDayOfMonthString }]
        } as any as HTMLElement
        expect(() => scrapeDate(dateSpanStub, 2019)).to.throw(Error, `Day of month field was invalid: ${badDayOfMonthString}`)
      })
    })

    it('should parse dates correctly', () => {
      const testCases = [
        { actual: { year: 2019, month: 'JAN', day: '01' }, expected: { year: 2019, month: 1, day: 1 } },
        { actual: { year: 2004, month: 'MAY', day: '29' }, expected: { year: 2004, month: 5, day: 29 } },
        { actual: { year: 2010, month: 'AUG', day: '12' }, expected: { year: 2010, month: 8, day: 12 } },
        { actual: { year: 2032, month: 'DEC', day: '31' }, expected: { year: 2032, month: 12, day: 31 } }
      ]
      testCases.forEach(({ actual, expected }) => {
        const dateSpanStub = {
          childElementCount: 2,
          childNodes: [{ innerText: actual.month }, { innerText: actual.day }]
        } as any as HTMLElement
        expect(scrapeDate(dateSpanStub, actual.year)).to.deep.equal(expected)
      })
    })
  })
})
