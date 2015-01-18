'use strict';

/*
 * Dependencies.
 */

var nlcstLinkModifier,
    textomLinkNode;

nlcstLinkModifier = require('nlcst-link-modifier');
textomLinkNode = require('textom-link-node');

/**
 * Define `link`.
 *
 * @param {Retext} retext
 */
function link(retext) {
    nlcstLinkModifier(retext.parser);
    textomLinkNode(retext.TextOM);
}

/*
 * Expose `link`.
 */

module.exports = link;
