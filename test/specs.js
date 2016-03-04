/* eslint-env mocha */
'use strict'

const expect = require('chai').expect

const minify = require('..')
const locateRiotHTMLString = minify.locateRiotHTMLString

describe('riot-plain-minify', () => {
  it('should locate Riot HTML string', () => {
    const str = `
      import riot from 'riot'

      riot.tag('tag', \`\n \\\` { some } <div></div>\n\`, \`{}\`)
    `
    const loc = locateRiotHTMLString(str)

    expect(str.substring(loc.start, loc.end))
      .to.equal('\n \\` { some } <div></div>\n')
  })

  it('should minify HTML', () => {
    const str = `
    riot.tag('tag', \`
    <div>
      foo
    </div> <i></i>\`, function(opts) {
      var bar = 'baz'
    })
    `
    const new_str = minify(str, { compact: true })

    expect(new_str).to.equal(`
    riot.tag('tag', \`<div> foo </div><i></i>\`, function(opts) {
      var bar = 'baz'
    })
    `)
  })

  it('should support ES6/7 function style', () => {
    const str = `
      riot.tag('tag', \` <i></i> \`, async (opts) => {
        var bar = 'baz'
      })
    `
    const new_str = minify(str, { compact: true })

    expect(new_str).to.equal(`
      riot.tag('tag', \`<i></i>\`, async (opts) => {
        var bar = 'baz'
      })
    `)

    const str2 = "riot.tag('tag', \` <i></i> \`, _ => _.foo)"
    const new_str2 = minify(str2, { compact: true })

    expect(new_str2).to.equal("riot.tag('tag', \`<i></i>\`, _ => _.foo)")
  })

  it('should support ES5 strings for HTML', () => {
    const str = "riot.tag('tag', ' <i></i> ')"
    const new_str = minify(str, { compact: true })

    expect(new_str).to.equal("riot.tag('tag', '<i></i>')")
  })

  // TODO: should support concatenated strings
  // it('should support concatenated strings', () => {
  //   const str = "riot.tag('tag', ' <i></i> ' +\n\" <b></b> \" + ` <a></a> `)"
  //   const new_str = minify(str, { compact: true })

  //   expect(new_str).to.equal("riot.tag('tag', '<i></i><b></b><a></a>')")
  // })
})
