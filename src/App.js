import React, { useState } from 'react';
import Header from './components/header';
import BBEditor from './components/bbeditor';
import ChapterDisplay from './components/chapterdisplay';

function App() {
  const [text, setText] = useState('');
  return (
    <div>
      <Header />
      <BBEditor setDisplayText={setText} displayShown={text} />
      {
        text ? <ChapterDisplay title='Preview' body={text} /> : <></>
      }
    </div>
  );
}

export default App;
