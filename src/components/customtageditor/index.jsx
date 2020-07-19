import React, { useState } from 'react';
import ReactModal from 'react-modal';
import './index.css';

export default function CustomTagEditor(props) {
    const [tag, setTag] = useState({ display: '', open: '', close: ''});

    function updateTag(tagParam) {
        setTag(Object.assign({}, tag, tagParam));
    }

    return (
        <ReactModal
            isOpen={props.showPopup}
            contentLabel='Add Custom Tag'
            onRequestClose={() => props.setShowPopup(false)}
            shouldCloseOnOverlayClick={true}
            className='modal'
        >
            <div className='modal-close' onClick={() => props.setShowPopup(false)}>x</div>
            <h1>Add Custom Tag</h1>
            <div className='modal-input'><label>Display Name</label><input type='text' onChange={e => updateTag({display : e.target.value, openDisplay: `[${e.target.value}]`, closeDisplay: `[/${e.target.value}]`})} /></div>
            <div className='modal-input'><label>Open Tag</label><input type='text' onChange={e => updateTag({open : e.target.value})} /></div>
            <div className='modal-input'><label>Close Tag</label><input type='text' onChange={e => updateTag({close : e.target.value})} /></div>
            <button onClick={() => { if (tag.display) { props.addTag(tag) }}}>Add</button>
        </ReactModal>
    )
}