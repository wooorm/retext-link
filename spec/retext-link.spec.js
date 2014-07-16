'use strict';

var link, Retext, AST, assert, retext, correctURLs,
    incorrectURLs, visit;

link = require('..');
AST = require('retext-ast');
visit = require('retext-visit');
Retext = require('retext');
assert = require('assert');

retext = new Retext()
    .use(visit)
    .use(AST)
    .use(link);

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

describe('link()', function () {
    it('should be of type `function`', function () {
        assert(typeof link === 'function');
    });

    it('should classify links (e.g., `www.example.com`) as a source node',
        function () {
            var tree = retext.parse('Check out www.example.com!'),
                link = tree.head.head.tail.prev;

            assert(link.toAST() === JSON.stringify({
                'type' : 'SourceNode',
                'value' : 'www.example.com',
                'data' : {
                    'dataType' : 'link'
                }
            }));
        }
    );
});

function validateURL(valueBefore, valueAfter, index, url) {
    it('should classify `' + url + '` as a source node', function () {
        var sourceNode = retext.parse(
            valueBefore + url + valueAfter
        ).head.head[index];

        assert(sourceNode.type === sourceNode.SOURCE_NODE);
        assert(sourceNode.data.dataType === 'link');
        assert(sourceNode.toString() === url);
    });
}

function validateIncorrectURL(valueBefore, valueAfter, index, url) {
    it('should NOT classify `' + url + '` as a source node', function () {
        var tree = retext.parse(valueBefore + url + valueAfter),
            sourceNode = tree.head.head[index];

        /* istanbul ignore if: Although not needed yet, this might help
         * future debugging. */
        if (sourceNode.type === sourceNode.SOURCE_NODE) {
            assert(sourceNode.toString() !== url);

            tree.visitType(tree.SOURCE_NODE, function (node) {
                console.log('    - A URL was, however, detected: ' + node);
            });
        } else {
            assert(sourceNode.type !== sourceNode.SOURCE_NODE);
            assert(sourceNode.data.dataType !== 'link');
        }
    });
}

describe('Correct urls', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', ' it’s awesome!', 4, correctURL);
    });
});

describe('Incorrect urls', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check out ', ' its invalid', 4, incorrectURL);
    });
});

describe('Correct urls suffixed by a full-stop', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', '.', 4, correctURL);
    });
});

describe('Incorrect urls suffixed by a full-stop', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check the invalid URL ', '.', 4, incorrectURL);
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

describe('Correct urls suffixed multiple full-stops', function () {
    correctURLs.forEach(function (correctURL) {
        validateURL('Check out ', '...', 4, correctURL);
    });
});

describe('Incorrect urls suffixed multiple full-stops', function () {
    incorrectURLs.forEach(function (incorrectURL) {
        validateIncorrectURL('Check out ', '...', 4, incorrectURL);
    });
});
