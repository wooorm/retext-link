'use strict';

/**
 * Dependencies.
 */

var link,
    ast,
    visit,
    Retext,
    assert;

link = require('./');
ast = require('retext-ast');
visit = require('retext-visit');
Retext = require('retext');
assert = require('assert');

/**
 * Retext.
 */

var retext;

retext = new Retext()
    .use(visit)
    .use(ast)
    .use(link);

/**
 * Fixtures.
 */

var correctURLs,
    incorrectURLs;

correctURLs = [
    'http://foo.com/blah_blah',
    'http://foo.com/blah_blah/',
    'http://foo.com/blah_blah_(wikipedia)',
    'http://foo.com/blah_blah_(wikipedia)_(again)',
    'http://www.example.com/wpstyle/?p=364',
    'https://www.example.com/foo/?bar=baz&inga=42&quux',
    'http://✪df.ws/123',
    'http://userid:password@example.com:8080',
    'http://userid:password@example.com:8080/',
    'http://userid@example.com',
    'http://userid@example.com/',
    'http://userid@example.com:8080',
    'http://userid@example.com:8080/',
    'http://userid:password@example.com',
    'http://userid:password@example.com/',
    'http://142.42.1.1/',
    'http://142.42.1.1:8080/',
    'http://➡.ws/䨹',
    'http://⌘.ws',
    'http://⌘.ws/',
    'http://foo.com/blah_(wikipedia)#cite-1',
    'http://foo.com/blah_(wikipedia)_blah#cite-1',
    'http://foo.com/unicode_(✪)_in_parens',
    'http://foo.com/(something)?after=parens',
    'http://☺.damowmow.com/',
    'http://code.google.com/events/#&product=browser',
    'http://j.mp',
    'ftp://foo.bar/baz',
    'http://foo.bar/?q=Test%20URL-encoded%20stuff',
    'http://مثال.إختبار',
    'http://例子.测试',
    'http://उदाहरण.परीक्षा',
    'http://-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com',
    'http://1337.net',
    'http://a.b-c.de',
    'http://223.255.255.254',

    /* Although not technically URL's, used a lot: */
    'foo.com/blah_blah',
    'foo.com/blah_blah/',
    'foo.com/blah_blah_(wikipedia)',
    'foo.com/blah_blah_(wikipedia)_(again)',
    'example.com/wpstyle/?p=364',
    'example.com/foo/?bar=baz&inga=42&quux',
    '✪df.ws/123',
    'userid:password@example.com:8080',
    'userid:password@example.com:8080/',
    'userid@example.com',
    'userid@example.com/',
    'userid@example.com:8080',
    'userid@example.com:8080/',
    'userid:password@example.com',
    'userid:password@example.com/',
    '142.42.1.1/',
    '142.42.1.1:8080/',
    '➡.ws/䨹',
    '⌘.ws',
    '⌘.ws/',
    'foo.com/blah_(wikipedia)#cite-1',
    'foo.com/blah_(wikipedia)_blah#cite-1',
    'foo.com/unicode_(✪)_in_parens',
    'foo.com/(something)?after=parens',
    '☺.damowmow.com/',
    'code.google.com/events/#&product=browser',
    'j.mp',
    'foo.bar/?q=Test%20URL-encoded%20stuff',
    'مثال.إختبار',
    '例子.测试',
    'उदाहरण.परीक्षा',
    '-.~_!$&\'()*+,;=:%40:80%2f::::::@example.com',
    '1337.net',
    'a.b-c.de',
    '223.255.255.254'
];

incorrectURLs = [
    '://',
    'http://',
    'http://.',
    'http://..',
    'http://../',
    'http://?',
    'http://??',
    'http://??/',
    'http://#',
    'http://##',
    'http://##/',
    '//',
    '//a',
    '///a',
    '///',
    'http:///a',
    'rdar://1234',
    'h://test',
    'http://3628126748'

    /* Although technically incorrect, I dont really care about these edge
     * cases:
     *
     * 'ftps://foo.bar/',
     * 'http://-error-.invalid/',
     * 'http://a.b--c.de/',
     * 'http://-a.b.co',
     * 'http://a.b-.co',
     * 'http://0.0.0.0',
     * 'http://10.1.1.0',
     * 'http://10.1.1.255',
     * 'http://224.1.1.1',
     * 'http://1.1.1.1.1',
     * 'http://123.123.123',
     * 'http://.www.foo.bar/',
     * 'http://www.foo.bar./',
     * 'http://.www.foo.bar./',
     * 'http://10.1.1.1',
     * 'http://10.1.1.254'
     */
];

/**
 * Tests.
 */

describe('link()', function () {
    it('should be of type `function`', function () {
        assert(typeof link === 'function');
    });

    it('should classify links (e.g., `www.example.com`) as a source node',
        function (done) {
            retext.parse('Check out www.example.com!', function (err, tree) {
                var node;

                node = tree.head.head.tail.prev;

                assert(node.toAST() === JSON.stringify({
                    'type' : 'SourceNode',
                    'value' : 'www.example.com',
                    'data' : {
                        'dataType' : 'link'
                    }
                }));

                done(err);
            });
        }
    );
});

/**
 * Validate a URL.
 *
 * @param {string} valueBefore
 * @param {string} valueAfter
 * @param {number} index - the location of the URL.
 * @param {string} url
 */

function validateURL(valueBefore, valueAfter, index, url) {
    it('should classify `' + url + '` as a source node', function (done) {
        retext.parse(valueBefore + url + valueAfter, function (err, tree) {
            var node;

            node = tree.head.head[index];

            assert(node.type === node.SOURCE_NODE);
            assert(node.data.dataType === 'link');
            assert(node.toString() === url);

            done(err);
        });
    });
}

/**
 * Validate a value is NOT classified as a URL.
 * Logs helpful messages.
 *
 * @param {string} valueBefore
 * @param {string} valueAfter
 * @param {number} index - the location of the non-URL.
 * @param {string} url
 */

function validateIncorrectURL(valueBefore, valueAfter, index, url) {
    it('should NOT classify `' + url + '` as a source node', function (done) {
        retext.parse(valueBefore + url + valueAfter, function (err, tree) {
            var node;

            node = tree.head.head[index];

            /**
             * Shouldn't be needed, but helpful for
             * future debugging.
             */

            /* istanbul ignore next */
            tree.visit(tree.SOURCE_NODE, function (node) {
                console.log(
                    '    - A URL was, however, detected: ' + node
                );
            });

            assert(node.type !== node.SOURCE_NODE);
            assert(node.data.dataType !== 'link');

            done(err);
        });
    });
}

describe('Correct urls', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', ' it\'s awesome!', 4, correctURL);
    });
});

describe('Incorrect urls', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check out ', ' it\'s invalid', 4, incorrectURL);
    });
});

describe('Correct urls suffixed by a full-stop', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', '.', 4, correctURL);
    });
});

describe('Incorrect urls suffixed by a full-stop', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check the invalid URL ', '.', 8, incorrectURL);
    });
});

describe('Correct urls suffixed by a comma', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', ', or that.', 4, correctURL);
    });
});

describe('Incorrect urls suffixed by a comma', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check out ', ', its invalid.', 4, incorrectURL);
    });
});

describe('Correct urls suffixed by multiple full-stops', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', '...', 4, correctURL);
    });
});

describe('Incorrect urls suffixed by multiple full-stops', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check out ', '...', 4, incorrectURL);
    });
});
