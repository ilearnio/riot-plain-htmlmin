# riot-plain-htmlmin
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A small package that minifies HTML right inside of plain-JS [Riot](http://riotjs.com) tags.

## Example

Trinspiles a file like this one

```
import riot from 'riot'

riot.tag('my-tag', `
  <div>HTML ...</div>
`, function(opts) {
  // JS ...
})
```

into

```
import riot from 'riot'

riot.tag('my-tag', `<div>HTML ...</div>`, function(opts) {
  // JS ...
})
```

## Usage
```
import fs from 'fs'
import minify from 'riot-plain-htmlmin'

const src = fs.readFileSync('my-tag.js', 'utf-8') // the entire file

minify(src, { compact: true }) // <- The result
```

#### Parameters

Accepts 2 parameters:
 - _src_ – the source of a file
 - _options_ – RiotJS options object that passes to the compiler

## How it works

Under the hood it just uses Riot's `compileHTML` function. Basically, it just
replaces the HTML string with the compiled one

[npm-image]: https://img.shields.io/npm/v/riot-plain-htmlmin.svg
[npm-url]: https://npmjs.org/package/riot-plain-htmlmin
[travis-image]: https://img.shields.io/travis/ilearnio/riot-plain-htmlmin/master.svg
[travis-url]: https://travis-ci.org/ilearnio/riot-plain-htmlmin
