import React from 'react';
import parseText from '../../parser';
import './index.css';

export default function ChapterDisplay(props) {
    return(
        <div className='chapter-display'>
            <h1>{props.title}</h1>
                <hr />
                {parseText(props.body)}
        </div>
    )
}