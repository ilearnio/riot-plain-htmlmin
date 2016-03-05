# riot-plain-htmlmin
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A small package that extracts HTML from plain-JS [Riot](http://riotjs.com) tags, passes it through the Riot's HTML compiler and returns a new string with the HTML replaced.

This gives two benefits:
 1. Minifies HTML right inside of plain-JS tags
 2. Fixes all of the HTML [limitations](http://riotjs.com/api/#example) when working with `riot.tag()`, since your HTML starts to act like if it's a `.tag` file.


It will also keep the same line and column of the actual JS code (`function (opts) { ... }`) which might be helpful in some scenarios when needed to keep stack traces in sync with the source file.

## Example

Transpiles a file like this one

```js
import riot from 'riot'

riot.tag('my-tag', `
  <div>HTML ...</div>
`, function(opts) {
  // JS ...
})
```

into

```js
import riot from 'riot'

riot.tag('my-tag', `<div>HTML ...</div>`, function(opts) {
  // JS ...
})
```

## Usage
```js
import fs from 'fs'
import minify from 'riot-plain-htmlmin'

const src = fs.readFileSync('my-tag.js', 'utf-8') // the entire file

minify(src, { compact: true }) // <- The result
```

#### Parameters

Accepts 2 parameters:
 - _src_ – the source of an entire file
 - _options_ – RiotJS options object that passes to the compiler

## How it works

Under the hood it just uses Riot's `compileHTML` function. Basically, it just
replaces the HTML string with the compiled one

[npm-image]: https://img.shields.io/npm/v/riot-plain-htmlmin.svg
[npm-url]: https://npmjs.org/package/riot-plain-htmlmin
[travis-image]: https://img.shields.io/travis/ilearnio/riot-plain-htmlmin/master.svg
[travis-url]: https://travis-ci.org/ilearnio/riot-plain-htmlmin
