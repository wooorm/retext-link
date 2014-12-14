# retext-link [![Build Status](https://img.shields.io/travis/wooorm/retext-link.svg?style=flat)](https://travis-ci.org/wooorm/retext-link) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-link.svg?style=flat)](https://coveralls.io/r/wooorm/retext-link?branch=master)

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
var Retext = require('retext');
var link = require('retext-link');
var visit = require('retext-visit');

var retext = new Retext()
    .use(visit)
    .use(link);

retext.parse(
    'Have you seen http://foo.com/blah_blah_(wikipedia)_(again)? ' +
    'Its pretty cool. Send me an email at mailto:test+foo@bar.com',
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
         *   path: '/blah_blah_(wikipedia)_(again)',
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
         *   path: null,
         *   href: 'mailto:test%2Bfoo@bar.com'
         * }
         */
    }
);
```

## API

**retext-link** automatically detects links in text and wraps them in `LinkNode`s.

`LinkNode`s API is described in **[textom-link-node](https://github.com/wooorm/textom-link-node#api)**.

## License

MIT © [Titus Wormer](http://wooorm.com)
