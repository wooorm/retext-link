# retext-link [![Build Status](https://travis-ci.org/wooorm/retext-link.svg?branch=master)](https://travis-ci.org/wooorm/retext-link) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-link.svg)](https://coveralls.io/r/wooorm/retext-link?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** link support.

## Installation

npm:
```sh
$ npm install retext-link
```

Component:
```sh
$ component install wooorm/retext-link
```

## Usage

```js
var Retext = require('retext'),
    link = require('retext-link'),
    visit = require('retext-visit'),
    inspect = require('retext-inspect'),
    retext;

retext = new Retext()
    .use(visit)
    .use(inspect)
    .use(link);

retext.parse(
    'Have you seen http://foo.com/blah_blah_(wikipedia)_(again)? ' +
    'Its pretty cool. Send me an email at mailto:test+foo@bar.com',
    function (err, tree) {
        tree.visit(tree.LINK_NODE, function (node) {
            console.log('Node', node);
            console.log('Relative?', node.isRelative());
            console.log('Info', node.data);
            console.log();
        });
        /**
         * Node LinkNode: 'http://foo.com/blah_blah_(wikipedia)_(again)'
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
         *   path: '/blah_blah_(wikipedia)_(again)',
         *   href: 'http://foo.com/blah_blah_(wikipedia)_(again)'
         * }
         *
         * Node LinkNode: 'mailto:test+foo@bar.com'
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
         *   path: null,
         *   href: 'mailto:test%2Bfoo@bar.com'
         * }
         */
    }
);
```

## API

**retext-link** automatically detects links inside text and stores them in a `LinkNode`, whereas without **retext-link** parsers would tokenize `'http://www.test.com'` as something like: WordNode, PunctuationNode, PunctuationNode, WordNode, PunctuationNode, WordNode, PunctuationNode, WordNode.

The API for LinkNode’s is described in **[textom-link-node](https://github.com/wooorm/textom-link-node#api)**.

## License

MIT © Titus Wormer
