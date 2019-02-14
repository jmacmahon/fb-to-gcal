import { expect } from 'chai'
import { readFileSync } from 'fs'
import { JSDOM } from 'jsdom'
import { join } from 'path'
import { scrapeFacebookEvent } from '../../../src/facebookScrape'
import { expected as fbExpected } from './facebook/expected'

describe('golden master', () => {
  it.only('should extract the date from facebook.html', async () => {
    const rawHtml = readFileSync(join(__dirname, 'facebook/test.html'))
    const dom = new JSDOM(rawHtml)
    const querySelector = dom.window.document.querySelector.bind(dom.window.document)
    const event = scrapeFacebookEvent(querySelector)
    const expectedEvent = fbExpected
    expect(JSON.stringify(event)).to.deep.equal(JSON.stringify(expectedEvent))
  })
})
