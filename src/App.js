
import React, { useState } from 'react';
import PickerWheel from './components/PickerWheel';
import InputList from './components/InputList';

function App() {
  const [items, setItems] = useState([]);

  return (
    <div className="flex gap-20 py-20 mx-20 items-center container my-12">
      <div><PickerWheel items={items} /></div>
      <div><InputList items={items} setItems={setItems} /></div>
    </div>
  );
}

export default App;
