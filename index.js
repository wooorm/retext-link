'use strict';

/**
 * Define `link`.
 */

function link() {}

/**
 * Constants.
 */

var EXPRESSION_SLASH;

EXPRESSION_SLASH = /^\/{1,3}$/;

/**
 * Stringify an NLCST node.
 *
 * @param {CSTNode}
 * @return {string}
 */

function cstToString(token) {
    var value,
        index,
        children;

    /* istanbul ignore if */
    if (token.value) {
        return token.value;
    }

    children = token.children;

    /* Shortcut: This is pretty common, and a small performance win. */
    if (children.length === 1 && children[0].type === 'TextNode') {
        return children[0].value;
    }

    value = [];
    index = -1;

    while (children[++index]) {
        value[index] = cstToString(children[index]);
    }

    return value.join('');
}

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
        cstToString(child) !== '.'
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
            EXPRESSION_SLASH.test(cstToString(siblings[start - 1]))
        ) {
            break;
        }

        start--;

        nodes.unshift(siblings[start]);

        if (
            type === 'WordNode' &&
            cstToString(siblings[start]) === 'www'
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
        EXPRESSION_SLASH.test(cstToString(siblings[start - 1]))
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
        cstToString(siblings[start - 1]) === ':' &&
        siblings[start - 2].type === 'WordNode'
    ) {
        nodes.unshift(siblings[start - 2], siblings[start - 1]);
        start -= 2;
    }

    /**
     * Remove the last node if it's punctuation,
     * unless it's `/` or `)`.
     */

    value = cstToString(siblings[end]);

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
        'type' : 'SourceNode',
        'data' : {
            'dataType' : 'link'
        },
        'value' : cstToString({
            'children' : nodes
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
 * Define `attach`.
 *
 * @param {Retext} retext
 */

function attach(retext) {
    retext.parser.tokenizeSentenceModifiers.unshift(mergeLinkExceptions);
}

/**
 * Expose `attach`.
 */

link.attach = attach;

/**
 * Expose `link`.
 */

module.exports = link;
