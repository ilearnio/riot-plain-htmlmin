'use strict'

const compileHTML = require('riot-compiler').html

function minify (str, options) {
  const loc = locateRiotHTMLString(str)

  if (loc) {
    const html = str.substring(loc.start, loc.end)

    str = str.substring(0, loc.start) +
      compileHTML(html, options) +
      str.substr(loc.end)
  }

  return str
}

function locateString (str, str_quote) {
  const start_index = str.indexOf(str_quote)
  const start_char = str[start_index]

  let _str = str
  let end_index = start_index + 1
  let end_index2 = start_index + 1
  while (true) {
    _str = _str.substr(end_index2)

    let end_index3 = _str.indexOf(start_char)
    if (end_index3 !== -1) {
      end_index2 = end_index3 + 1
      end_index += end_index3 + 1
    }

    // Calculate the amount of escaping "\" chars before the
    // closing char
    let esc_char_count = 0
    for (let i = end_index3 - 1; i >= 0; i--) {
      if (_str[i] !== '\\') break
      esc_char_count++
    }

    if (esc_char_count % 2 === 1) {
      // The current closing char is escaped with \
      continue
    }

    break
  }

  return {
    start: start_index,
    end: end_index
  }
}

function locateRiotHTMLString (str) {
  const matches = str
    .match(/^[\s\S]*riot\.tag2?\s*\(\s*['"`]\S+?['"`]\s*,\s*['"`]/m)

  if (matches) {
    const start_index = matches[0].length
    const str_quote = str.substring(start_index - 1)
    const found = locateString(str.substr(start_index - 1), str_quote)
    if (found) {
      const end_index = start_index + found.end - 2
      return {
        start: start_index,
        end: end_index
      }
    }
  }

  return false
}

module.exports = minify
module.exports._locateRiotHTMLString = locateRiotHTMLString
