import React from 'react';

export class Params {
    bold : boolean = false;
    color : string = '';
    font : string = '';
    italic : boolean = false;
    text : string = '';
    strike : boolean = false;
    underline : boolean = false;
}

class Style {
    bold : boolean = false;
    color : string = '';
    fontFamily : string = '';
    italic : boolean = false;
    strike : boolean = false;
    underline : boolean = false;

    constructor(tags : StyleTag[] = []) {
        for (var i = 0; i < tags.length; i++) {
            tags[i].updateStyle(this);
        }
    }
}

abstract class Tag {
    parent : Tag | null;
    children : Tag[];
    closeTags : string[];
    parentParagraph : Paragraph | null;
    selfClosing : boolean = false;
    constructor(parent: Tag | null, closeTags : string[], parentParagraph : Paragraph | null) {
        this.children = [];
        this.parent = parent;
        this.closeTags = closeTags;
        this.parentParagraph = parentParagraph;
    }

    abstract toReact() : any;
    abstract getNewTag(parent : Tag, params : Object) : Tag;
}

export abstract class StyleTag extends Tag {
    abstract getNewStyleTag(parent : Tag) : StyleTag;
    abstract updateStyle(style : Style) : any;
}

export class TextTag extends Tag {
    text : string;
    constructor(parent: Tag, text: string) {
        super(parent, [], parent.parentParagraph);
        this.text = text;
        this.selfClosing = true;
    }

    toReact() {
        return (<>{this.text}</>)
    }

    getNewTag(parent : Tag, params : Params) : Tag {
        return new TextTag(parent, params.text);
    }
}

export class BreakTag extends Tag {
    constructor(parent: Tag | null = null) {
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, [], parentParagraph);
        this.selfClosing = true;
    }

    toReact() {
        return (<br />);
    }

    getNewTag(parent : Tag, params : Params) : Tag {
        return new BreakTag(parent);
    }
}

export class BoldTag extends StyleTag {
    constructor(parent : Tag | null = null){
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, ['/b'], parentParagraph);
    }

    toReact() {
        return (<b>{this.children.map(child => child.toReact())}</b>);
    }
    
    getNewStyleTag(parent: Tag): StyleTag {
        return new BoldTag(parent);
    }

    getNewTag(parent : Tag, params : Object) : Tag {
        return new BoldTag(parent);
    }

    updateStyle(style: Style) {
        style.bold = true;
    }
}

export class ItalicTag extends StyleTag {
    constructor(parent : Tag | null = null){
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, ['/i'], parentParagraph);
    }

    toReact() {
        return (<i>{this.children.map(child => child.toReact())}</i>);
    }
    
    getNewStyleTag(parent: Tag): StyleTag {
        return new ItalicTag(parent);
    }

    getNewTag(parent : Tag, params : Object) : Tag {
        return new ItalicTag(parent);
    }

    updateStyle(style: Style) {
        style.italic = true;
    }
}

export class UnderlineTag extends StyleTag {
    constructor(parent : Tag | null = null){
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, ['/u'], parentParagraph);
    }

    toReact() {
        return (<u>{this.children.map(child => child.toReact())}</u>);
    }
    
    getNewStyleTag(parent: Tag): StyleTag {
        return new UnderlineTag(parent);
    }

    getNewTag(parent : Tag, params : Object) : Tag {
        return new UnderlineTag(parent);
    }

    updateStyle(style: Style) {
        style.underline = true;
    }
}

export class StrikeTag extends StyleTag {
    constructor(parent : Tag | null = null){
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, ['/s'], parentParagraph);
    }

    toReact() {
        return (<s>{this.children.map(child => child.toReact())}</s>);
    }
    
    getNewStyleTag(parent: Tag): StyleTag {
        return new StrikeTag(parent);
    }

    getNewTag(parent : Tag, params : Object) : Tag {
        return new StrikeTag(parent);
    }

    updateStyle(style: Style) {
        style.strike = true;
    }
}

export class ColorTag extends StyleTag {
    color : string;
    constructor(parent : Tag | null = null, params : Params = new Params()){
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, ['/color'], parentParagraph);
        this.color = params.color;
    }

    toReact() {
        if (this.parentParagraph?.style?.color === this.color) {
            return (<>{this.children.map(child => child.toReact())}</>);
        }
        return (<span style={{color: this.color}}>{this.children.map(child => child.toReact())}</span>);
    }
    
    getNewStyleTag(parent: Tag): StyleTag {
        const params = new Params();
        params.color = this.color
        return new ColorTag(parent, params);
    }

    getNewTag(parent : Tag, params : Params) : Tag {
        return new ColorTag(parent, params);
    }

    updateStyle(style: Style) {
        style.color = this.color;
    }
}

export class FontTag extends StyleTag {
    fontFamily : string;
    constructor(parent : Tag | null = null, params : Params = new Params()){
        let parentParagraph = null;
        if (parent instanceof Tag) {
            parentParagraph = parent.parentParagraph;
        }
        super(parent, ['/font'], parentParagraph);
        this.fontFamily = params.font;
    }

    toReact() {
        if (this.parentParagraph?.style?.fontFamily === this.fontFamily) {
            return (<>{this.children.map(child => child.toReact())}</>);
        }
        return (<span style={{fontFamily: this.fontFamily}}>{this.children.map(child => child.toReact())}</span>);
    }
    
    getNewStyleTag(parent: Tag): StyleTag {
        const params = new Params();
        params.font = this.fontFamily;
        return new FontTag(parent, params);
    }

    getNewTag(parent : Tag, params : Params) : Tag {
        return new FontTag(parent, params);
    }

    updateStyle(style: Style) {
        style.fontFamily = this.fontFamily;
    }
}

class ParagraphStyles {
    fontFamily : string = '';
    color : string = '';
}

export default class Paragraph extends Tag {
    start : Tag;
    style : Style;
    nextStyleTags : StyleTag[];
    constructor(styleTags : StyleTag[] = []) {
        super(null, ['/p'], null);
        this.start = this;
        this.style = new Style(styleTags);
        this.nextStyleTags = [...styleTags];
        this.parentParagraph = this;

        function addChild(p : Paragraph, child : Tag) {
            p.start.children.push(child);
            p.start = child;
        }

        for (var i = 0; i < styleTags.length; i++) {
            const newTag = styleTags[i].getNewStyleTag(this.start);
            addChild(this, newTag);
        }
    }

    getStyle() : Object {
        const s = new ParagraphStyles();

        if (this.style?.color) {
            s.color = this.style.color;
        }

        if (this.style?.fontFamily) {
            s.fontFamily = this.style.fontFamily;
        }

        return s;
    }

    getNewTag(parent : Tag, params : Object) : Tag {
        return new Paragraph();
    }

    toReact() {
        return (<p style={this.getStyle()}>{this.children.map(child => child.toReact())}</p>);
    }
}