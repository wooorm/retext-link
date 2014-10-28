'use strict';

/**
 * Dependencies.
 */

var nlcstToString;

nlcstToString = require('nlcst-to-string');

/**
 * Constants.
 */

var EXPRESSION_SLASH;

EXPRESSION_SLASH = /^\/{1,3}$/;

/**
 * Merge punctuation marks and words into a source node.
 *
 * @param {CSTNode} child
 * @param {number} index
 * @param {CSTNode} parent
 * @return {undefined|number} - Either void, or the next index to iterate
 *   over.
 */

function mergeLinkExceptions(child, index, parent) {
    var siblings,
        nodes,
        start,
        end,
        currentIndex,
        value,
        type;

    siblings = parent.children;
    nodes = [child];

    if (
        (
            child.type !== 'PunctuationNode' &&
            child.type !== 'SymbolNode'
        ) ||
        nlcstToString(child) !== '.'
    ) {
        return;
    }

    currentIndex = end = start = index;

    /**
     * Find preceding word/punctuation.
     * Stop before slashes, break after `www`.
     */

    while (siblings[start - 1]) {
        type = siblings[start - 1].type;

        if (
            type !== 'WordNode' &&
            type !== 'PunctuationNode' &&
            type !== 'SymbolNode'
        ) {
            break;
        }

        if (
            (
                type === 'PunctuationNode' ||
                type === 'SymbolNode'
            ) &&
            EXPRESSION_SLASH.test(nlcstToString(siblings[start - 1]))
        ) {
            break;
        }

        start--;

        nodes.unshift(siblings[start]);

        if (
            type === 'WordNode' &&
            nlcstToString(siblings[start]) === 'www'
        ) {
            break;
        }
    }

    /**
     * Find following word/punctuation.
     */

    while (siblings[end + 1]) {
        type = siblings[end + 1].type;

        if (
            type !== 'WordNode' &&
            type !== 'PunctuationNode' &&
            type !== 'SymbolNode'
        ) {
            break;
        }

        end++;

        nodes.push(siblings[end]);
    }

    /**
     * This full stop doesnt look like a link:
     * it's either not followed, or not preceded,
     * by words or punctuation.
     */

    if (currentIndex === start || currentIndex === end) {
        return;
    }

    /**
     * 1-3 slashes.
     */

    if (
        start > 0 &&
        siblings[start - 1].type === 'PunctuationNode' &&
        EXPRESSION_SLASH.test(nlcstToString(siblings[start - 1]))
    ) {
        start--;

        nodes.unshift(siblings[start]);
    }

    /**
     * URL protocol and colon.
     */

    if (
        start > 2 &&
        siblings[start - 1].type === 'PunctuationNode' &&
        nlcstToString(siblings[start - 1]) === ':' &&
        siblings[start - 2].type === 'WordNode'
    ) {
        nodes.unshift(siblings[start - 2], siblings[start - 1]);
        start -= 2;
    }

    /**
     * Remove the last node if it's punctuation,
     * unless it's `/` or `)`.
     */

    value = nlcstToString(siblings[end]);

    if (
        siblings[end].type === 'PunctuationNode' &&
        value !== '/' && value !== ')'
    ) {
        end--;

        nodes.pop();
    }

    /**
     * Remove the nodes and insert a SourceNode.
     */

    siblings.splice(start, end - start + 1, {
        'type': 'SourceNode',
        'data': {
            'dataType': 'link'
        },
        'value': nlcstToString({
            'children': nodes
        })
    });

    index++;

    /**
     * Ignore the following full-stop: it's not part
     * of a link.
     */

    if (value === '.') {
        index++;
    }

    return index;
}

/**
 * Define `link`.
 *
 * @param {Retext} retext
 */

function link(retext) {
    retext.parser.tokenizeSentenceModifiers.unshift(mergeLinkExceptions);
}

/**
 * Expose `link`.
 */

module.exports = link;
