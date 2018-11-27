// tslint:disable-next-line:no-implicit-dependencies
import { expect } from 'chai'
import {
  optsFromGroupedShortcode,
  optsFromShortcode,
} from '../../src/utils/shortener'
describe('shortener', () => {
  it('creates opts from specific shortcode', () => {
    const opts = optsFromShortcode('omg')
    expect(opts.codeStr).to.equal('omg')
    expect(opts.codeInt).to.equal(207914)
    expect(opts.codeActual).to.equal('omg')
  })

  it('creates opts from grouped shortcode', () => {
    const opts = optsFromGroupedShortcode(
      {
        id: 1,
        prefix: 'omg',
      },
      'wow',
    )
    expect(opts.codeStr).to.equal('1wow00000')
    expect(opts.codeInt).to.equal(540059925217280)
    expect(opts.codeActual).to.equal('omg/wow')
  })
})
