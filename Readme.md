# retext-link [![Build Status](https://travis-ci.org/wooorm/retext-link.svg?branch=master)](https://travis-ci.org/wooorm/retext-link) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-link.svg)](https://coveralls.io/r/wooorm/retext-link?branch=master)

[![browser support](https://ci.testling.com/wooorm/retext-link.png) ](https://ci.testling.com/wooorm/retext-link)

See [Browser Support](#browser-support) for more information (a.k.a. don’t worry about those grey icons above).

---

**[retext](https://github.com/wooorm/retext "Retext")** link support.

## Installation

NPM:
```sh
$ npm install retext-link
```

Component.js:
```sh
$ component install wooorm/retext-link
```

## Usage

```js
var Retext = require('retext'),
    link = require('retext-link'),
    visit = require('retext-visit');

new Retext()
    .use(visit)
    .use(link)
    .parse(
        'Have you seen http://foo.com/blah_blah_(wikipedia)_(again)? ' +
        'Its pretty cool. Send me an email at test+foo@bar.com'
    )
    .visit(function (node) {
        if (node.data.dataType === 'link') {
            console.log([node.toString(), node.type]);
        }
    });
/*
 * >> ['http://foo.com/blah_blah_(wikipedia)_(again)', 'SourceNode']
 * >> ['test+foo@bar.com', 'SourceNode']
 */

```

## API

None, the plugin automatically detects links inside text and stores them in a SourceNode, whereas without retext-link parsers would tokenize `'http://www.test.com'` as something like: WordNode, PunctuationNode, PunctuationNode, WordNode, PunctuationNode, WordNode, PunctuationNode, WordNode.

## License

  MIT
