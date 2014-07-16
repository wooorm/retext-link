'use strict';

function astToString(node) {
    if ('value' in node) {
        return node.value;
    }

    if (node.children.length === 1) {
        return astToString(node.children[0]);
    }

    var values = [],
        children = node.children,
        iterator = -1;

    while (children[++iterator]) {
        values.push(astToString(children[iterator]));
    }

    return values.join('');
}

var EXPRESSION_SLASH = /^\/{1,3}$/;

function mergeLinkExceptions(child, index, parent) {
    var siblings = parent.children,
        nodes = [child],
        start, end, currentIndex, value, type;

    if (
        child.type !== 'PunctuationNode' ||
        astToString(child) !== '.'
    ) {
        return;
    }

    currentIndex = end = start = index;

    while (siblings[start - 1]) {
        type = siblings[start - 1].type;

        if (type !== 'WordNode' && type !== 'PunctuationNode') {
            break;
        }

        if (
            type === 'PunctuationNode' &&
            EXPRESSION_SLASH.test(astToString(siblings[start - 1]))
        ) {
            break;
        }

        nodes.unshift(siblings[--start]);

        if (
            type === 'WordNode' &&
            astToString(siblings[start]) === 'www'
        ) {
            break;
        }
    }

    while (siblings[end + 1]) {
        type = siblings[end + 1].type;

        if (type !== 'WordNode' && type !== 'PunctuationNode') {
            break;
        }

        nodes.push(siblings[++end]);
    }

    if (currentIndex === start || currentIndex === end) {
        return;
    }

    /* 1-3 slashes */
    if (
        start > 0 &&
        siblings[start - 1].type === 'PunctuationNode' &&
        EXPRESSION_SLASH.test(astToString(siblings[start - 1]))
    ) {
        nodes.unshift(siblings[--start]);
    }

    /* URL protocol and colon. */
    if (
        start > 2 &&
        siblings[start - 1].type === 'PunctuationNode' &&
        astToString(siblings[start - 1]) === ':' &&
        siblings[start - 2].type === 'WordNode'
    ) {
        nodes.unshift(siblings[start - 2], siblings[start - 1]);
        start -= 2;
    }

    value = astToString(siblings[end]);

    if (
        siblings[end].type === 'PunctuationNode' &&
        value !== '/' && value !== ')'
    ) {
        end--;
        nodes.pop();
    }

    siblings.splice(start, end - start + 1, {
        'type' : 'SourceNode',
        'data' : {
            'dataType' : 'link'
        },
        'value' : astToString({
            'children' : nodes
        })
    });

    index++;

    if (value === '.') {
        return index++;
    }

    return index;
}

function attach(retext) {
    var parser = retext.parser;

    parser.tokenizeSentenceModifiers = [
            mergeLinkExceptions
        ].concat(parser.tokenizeSentenceModifiers);
}

function link() {}

exports = module.exports = link;

link.attach = attach;
