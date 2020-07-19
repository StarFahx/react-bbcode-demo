import React from 'react';
import Paragraph, { BoldTag, ItalicTag, StyleTag, TextTag, ColorTag, FontTag, StrikeTag, UnderlineTag, BreakTag } from './tags/paragraph';
const SPACE_RE = /^\s*$/;
const BRACKET_RE = /\[|\]/g;
const TOKEN_RE = /(\[\/?.+?\])/;

function parseParams(token) {
    const params = {};

    function addParam(name, value) {
      if (name) {
        const n = name.trim();
        // ignore on* events attribute
        if (n.length && n.toLowerCase().indexOf('on') !== 0) {
          params[n.replace(BRACKET_RE, '')] = value.replace(BRACKET_RE, '');
        }
      }
    }

    if (token) {
      let key = [];
      let target = key;
      let value = [];
      let terminate = ' ';
      let skipNext = false;

      Array.from(token).forEach(c => {
        if (skipNext) {
          skipNext = false;
        } else if (target === key && c === '=') {
          target = value;
        } else if (target === key && c === ':') {
          target = value;
        } else if (!value.length && c === '"') {
          terminate = c;
        } else if (c !== terminate) {
          target.push(c);
        } else {
          addParam(key.join(''), value.join(''));

          if (!SPACE_RE.test(terminate)) {
            skipNext = true;
          }

          target = key = [];
          value = [];
          terminate = ' ';
        }
      });

      addParam(key.join(''), value.join(''));
    }

    return params;
}

const tags = {
    'b': new BoldTag(),
    'i': new ItalicTag(),
    's': new StrikeTag(),
    'u': new UnderlineTag(),
    'color' : new ColorTag(),
    'font': new FontTag(),
    'br': new BreakTag(),
}

export default function parseText(bbcode) {
    bbcode = bbcode.replace(/\n\n(\n*)/g, '[/p]$1');
    bbcode = bbcode.replace(/\n/g, '[br]');

    const tokens = bbcode.split(TOKEN_RE);
    const base = [];
    let current = new Paragraph();
    base.push(current);
    let currentParagraph = current;

    for (var i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (!token.length) {
            continue;
        }

        if (token.match(TOKEN_RE)) {
            const params = parseParams(token);
            const tokenName = Object.keys(params)[0];
            const next = currentParagraph.nextStyleTags;

            // token is a close tag
            if (current.closeTags.indexOf(tokenName) >= 0) {
                if (current !== currentParagraph) {
                    if (next[currentParagraph.nextStyleTags.length - 1].closeTags.indexOf(tokenName) >= 0) {
                      next.pop();
                    }

                    current = current.parent;
                } else {
                    const newParagraph = new Paragraph(next);
                    base.push(newParagraph);
                    currentParagraph = newParagraph;
                    current = newParagraph.start;
                }
            } else if (currentParagraph.closeTags.indexOf(tokenName) >= 0) {
                const newParagraph = new Paragraph(next);
                base.push(newParagraph);
                currentParagraph = newParagraph;
                current = newParagraph.start;
            } else if (tokenName in tags) {
                const newTag = tags[tokenName].getNewTag(current, params);
                currentParagraph.style = newTag.style;
                current.children.push(newTag);
                if (newTag instanceof StyleTag) {
                  next.push(newTag);
                }
                if (!newTag.selfClosing) {
                  current = newTag;
                }
            }
            else {
                // console.log(current, tokenName);
                current.children.push(new TextTag(current, token));
            }
        }
        else {
            current.children.push(new TextTag(current, token));
        }
    }
    return base.map(p => p.toReact());
}