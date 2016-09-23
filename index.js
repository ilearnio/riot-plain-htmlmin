'use strict'

const compileHTML = require('riot-compiler').html

function minify (str, options) {
  const loc = locateRiotHTMLString(str)
  if (loc) {
    const html = str.substring(loc.start, loc.end)

    const prependStr = str.substring(0, loc.start)

    // Keep the same line and column of the function. This
    // might be helpful in some scenarios when needed to
    // keep stack traces in sync with the source file
    let appendStr = str.substr(loc.end)
    const htmlLines = html.split('\n')
    const addLinesNum = htmlLines.length - 1
    if (addLinesNum !== 0) {
      // add spaces to keep same column
      const column = htmlLines[htmlLines.length - 1].length + 1
      appendStr = appendStr[0] + ' '.repeat(column) + appendStr.slice(1)

      // keep line breaks
      const breaks = '\n'.repeat(addLinesNum)
      appendStr = appendStr[0] + breaks + appendStr.slice(1)
    }

    str = prependStr + compileHTML(html, options) + appendStr
  }

  return str
}

function locateString (str, strQuote) {
  const startIndex = str.indexOf(strQuote)
  const startChar = str[startIndex]

  let _str = str
  let endIndex = startIndex + 1
  let endIndex2 = startIndex + 1
  while (true) {
    _str = _str.substr(endIndex2)

    let endIndex3 = _str.indexOf(startChar)
    if (endIndex3 !== -1) {
      endIndex2 = endIndex3 + 1
      endIndex += endIndex3 + 1
    }

    // Calculate the amount of escaping "\" chars before the
    // closing char
    let escCharCount = 0
    for (let i = endIndex3 - 1; i >= 0; i--) {
      if (_str[i] !== '\\') break
      escCharCount++
    }

    if (escCharCount % 2 === 1) {
      // The current closing char is escaped with \
      continue
    }

    break
  }

  return {
    start: startIndex,
    end: endIndex
  }
}

function locateRiotHTMLString (str) {
  const matches = str
    .match(/^[\s\S]*?riot\.tag2?\s*\(\s*['"`]\S+?['"`]\s*,\s*['"`]/m)

  if (matches) {
    const startIndex = matches[0].length
    const strQuote = str.substring(startIndex - 1)
    const found = locateString(str.substr(startIndex - 1), strQuote)
    if (found) {
      const endIndex = startIndex + found.end - 2
      return {
        start: startIndex,
        end: endIndex
      }
    }
  }

  return false
}

module.exports = minify
module.exports._locateRiotHTMLString = locateRiotHTMLString
