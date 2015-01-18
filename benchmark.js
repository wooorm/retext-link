'use strict';

var Retext,
    link;

/*
 * Dependencies.
 */

Retext = require('retext');
link = require('./');

/*
 * Dependencies.
 */

var retext,
    retextWithLink;

retext = new Retext();
retextWithLink = new Retext().use(link);

/*
 * Fixtures.
 *
 * Source:
 *   http://www.gutenberg.org/cache/epub/11024/pg11024.html
 */

var paragraph,
    linkParagraph;

/*
 * A paragraph, 5 sentences, filled with 10 links.
 */

linkParagraph = 'Thou art a churlish knight to so ' +
    'affront a http://example.com he could not sit ' +
    'upon http://userid:password@example.com/ his ' +
    'horse any longer . ' +

    'For methinks http://j.mp something hath befallen ' +
    'my lord and that he then, foo.com/blah_blah/ ' +
    'after a while, he cried out in great voice. ' +

    'For that 142.42.1.1:8080/ light in the sky lieth ' +
    'in the south a.b-c.de then Queen Helen fell down ' +
    'in a swoon, and lay. ' +

    'Touch me not, مثال.إختبار for I am not ' +
    'mortal, but Fay so the Lady of the Lake vanished ' +
    'away, उदाहरण.परीक्षा ' +
    'everything behind. ' +

    'Where she had http://⌘.ws stood was clear, and ' +
    'she was http://✪df.ws/123 gone since Sir Kay ' +
    'does not choose to assume my quarrel.';

/*
 * A paragraph, 5 sentences, without links.
 */

paragraph = 'Thou art a churlish knight to so affront ' +
    'a lady he could not sit upon his horse any ' +
    'longer. ' +

    'For methinks something hath befallen my lord ' +
    'and that he then, after a while, he cried out ' +
    'in great voice. ' +

    'For that light in the sky lieth in the south ' +
    'then Queen Helen fell down in a swoon, and ' +
    'lay. ' +

    'Touch me not, for I am not mortal, but Fay ' +
    'so the Lady of the Lake vanished away, ' +
    'everything behind. ' +

    'Where she had stood was clear, and she was ' +
    'gone since Sir Kay does not choose to assume my ' +
    'quarrel.';

/*
 * Benchmark.
 */

suite('retext w/o retext-link', function () {
    bench('A paragraph (5 sentences, 100 words, 10 links)', function (done) {
        retext.parse(linkParagraph, done);
    });

    bench('A paragraph (5 sentences, 100 words, no links)', function (done) {
        retext.parse(paragraph, done);
    });
});

suite('retext w/ retext-link', function () {
    bench('A paragraph (5 sentences, 100 words, 10 links)', function (done) {
        retextWithLink.parse(linkParagraph, done);
    });

    bench('A paragraph (5 sentences, 100 words, no links)', function (done) {
        retextWithLink.parse(paragraph, done);
    });
});
