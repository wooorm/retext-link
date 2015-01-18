# retext-link [![Build Status](https://img.shields.io/travis/wooorm/retext-link.svg?style=flat)](https://travis-ci.org/wooorm/retext-link) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-link.svg?style=flat)](https://coveralls.io/r/wooorm/retext-link?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** link support.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install retext-link
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/retext-link
```

## Usage

```javascript
var Retext = require('retext');
var link = require('retext-link');
var visit = require('retext-visit');

var retext = new Retext()
    .use(visit)
    .use(link);

retext.parse(
    'Have you seen http://foo.com/blah_blah_(wikipedia)_(again)? ' +
    'It’s pretty cool. Send me an email at mailto:test+foo@bar.com',
    function (err, tree) {
        tree.visit(tree.LINK_NODE, function (node) {
            console.log('Link', node.toString());
            console.log('Relative?', node.isRelative());
            console.log('Info', node.data);
            console.log();
        });
        /**
         * Node 'http://foo.com/blah_blah_(wikipedia)_(again)'
         * Relative? false
         * Info {
         *   protocol: 'http:',
         *   host: 'foo.com',
         *   port: 80,
         *   hostname: 'foo.com',
         *   hash: '',
         *   search: '',
         *   query: '',
         *   pathname: '/blah_blah_(wikipedia)_(again)',
         *   href: 'http://foo.com/blah_blah_(wikipedia)_(again)'
         * }
         *
         * Node 'mailto:test+foo@bar.com'
         * Relative? true
         * Info {
         *   protocol: 'mailto:',
         *   host: 'bar.com',
         *   port: 80,
         *   hostname: 'bar.com',
         *   hash: '',
         *   search: '',
         *   query: '',
         *   pathname: '',
         *   href: 'mailto:test%2Bfoo@bar.com'
         * }
         */
    }
);
```

## API

**retext-link** automatically detects links in a document and classifies them as [`LinkNode`](https://github.com/wooorm/textom-link-node#textomlinknode)s.

## Performance

On a MacBook Air. **retext** works 9% faster on content with links, and 2% slower on content without links, when using **retext-link**.

```text
           retext w/o retext-link
  166 op/s » A paragraph (5 sentences, 100 words, 10 links)
  238 op/s » A paragraph (5 sentences, 100 words, no links)

           retext w/ retext-link
  152 op/s » A paragraph (5 sentences, 100 words, 10 links)
  244 op/s » A paragraph (5 sentences, 100 words, no links)
```

## License

MIT © [Titus Wormer](http://wooorm.com)
