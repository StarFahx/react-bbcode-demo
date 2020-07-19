import React from 'react';
import './index.css';

export default function Header() {
    return(
        <ul className='Bar'>
            <li><span className='text'>BBCode Demo</span></li>
            <li className='right'><a href='https://github.com/StarFahx/react-bbcode-demo/' className='text'>Source Code</a></li>
        </ul>
    );
}