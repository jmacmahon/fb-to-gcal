import { expect } from 'chai'
import sinon from 'sinon'
import { scrapeFacebookEvent } from '../../../src/facebookScrape'

describe('facebook scraper', () => {
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
})
