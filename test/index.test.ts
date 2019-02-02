import { hello } from '../src'
import { expect } from 'chai'

describe('index', () => {
  describe('hello function', () => {
    it('should return the string hello world', () => {
      expect(hello()).to.equal('hello world')
    })
  })
})
