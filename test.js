'use strict';

/**
 * Dependencies.
 */

var link,
    ast,
    visit,
    inspect,
    Retext,
    assert;

link = require('./');
ast = require('retext-ast');
visit = require('retext-visit');
inspect = require('retext-inspect');
Retext = require('retext');
assert = require('assert');

/**
 * Retext.
 */

var retext;

retext = new Retext()
    .use(visit)
    .use(ast)
    .use(inspect)
    .use(link);

/**
 * Tests.
 */

describe('link()', function () {
    it('should be of type `function`', function () {
        assert(typeof link === 'function');
    });

    it('should classify `http://www.example.com` as a LinkNode',
        function (done) {
            retext.parse('Check out http://www.example.com!',
                function (err, tree) {
                    var node;

                    node = tree.head.head.tail.prev;

                    assert(node.type === 'LinkNode');
                    assert(node.toString() === 'http://www.example.com');

                    assert(node.data.protocol === 'http:');
                    assert(node.data.host === 'www.example.com');
                    assert(node.data.port === 80);
                    assert(node.data.hostname === 'www.example.com');
                    assert(node.data.hash === '');
                    assert(node.data.search === '');
                    assert(node.data.query === '');
                    assert(node.data.pathname === '/');
                    assert(node.data.path === '/');
                    assert(node.data.href === 'http://www.example.com/');

                    done(err);
                }
            );
        }
    );
});
