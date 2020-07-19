import React, { useState, createRef } from 'react';
import './index.css'
import CustomTagEditor from '../customtageditor';

export default function BBEditor(props) {
    const [text, setText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [customTags, setCustomTags] = useState([
        {
            display: 'CG',
            openDisplay: '[CG]',
            closeDisplay: '[/CG]',
            open: '[font="Courier New"][color=#626262][b]CG: ',
            close: '[/b][/color][/font]'
        }
    ]);
    const ref = createRef();

    function addTag(tag) {
        var start = ref.current.selectionStart;
        var end = ref.current.selectionEnd;
        var sel = text.substring(start, end);
        var finText = text.substring(0, start) + tag.openDisplay + sel + tag.closeDisplay + text.substring(end);
        setText(finText);
        ref.current.focus();
        ref.current.setSelectionRange(end + 3, end + 3);
    }

    function addCustomTag(tag) {
        const newTags = [...customTags];
        newTags.push(tag);
        setCustomTags(newTags);
        setShowPopup(false);
    }

    function addTextTag(tag, params) {
        const tagObj = {
            openDisplay: '[' + tag + (params ? '=""]' : ']'),
            closeDisplay: '[/' + tag + ']'
        }
        addTag(tagObj);
    }

    function changeCustomTags(text) {
        for (var i = 0; i < customTags.length; i++) {
            const tag = customTags[i];
            text = text
                .replaceAll(tag.openDisplay, tag.open)
                .replaceAll(tag.closeDisplay, tag.close);
        }
        return text;
    }

    return (
        <div className='bbeditor-container'>
            <ul>
                <li><div className='bbeditor-iconbutton' onClick={() => addTextTag('b')}><b>b</b></div></li>
                <li><div className='bbeditor-iconbutton' onClick={() => addTextTag('i')}><i>i</i></div></li>
                <li><div className='bbeditor-iconbutton' onClick={() => addTextTag('u')}><u>u</u></div></li>
                <li><div className='bbeditor-iconbutton' onClick={() => addTextTag('s')}><s>s</s></div></li>
                <li><div className='bbeditor-iconbutton double' onClick={() => addTextTag('color', true)}>color</div></li>
                <li><div className='bbeditor-iconbutton double last' onClick={() => addTextTag('font', true)}>font</div></li>

                <li className='right'><div className='bbeditor-iconbutton last' onClick={() => setShowPopup(true)}>+</div></li>
                {
                    customTags.map(tag => <li className='right'><div className='bbeditor-iconbutton double' onClick={() => addTag(tag)}>{tag.display}</div></li>)
                }
            </ul>
            <CustomTagEditor showPopup={showPopup} setShowPopup={setShowPopup} addTag={tag => addCustomTag(tag)} />
            <textarea ref={ref} value={text} onChange={event => setText(event.target.value)}/>
            { 
                props.displayShown || text ?
                <div className='bbeditor-buttons'>
                    <button className='bbeditor-preview' onClick={() => props.setDisplayText(changeCustomTags(text))}>{text.length ? 'Preview' : 'Reset'}</button>
                </div> :
                <></>
            }
        </div>
    );
}