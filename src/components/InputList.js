import React, { useState } from 'react';

const InputList = ({ items, setItems }) => {
  const [inputValue, setInputValue] = useState('');
 
  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      setItems([...items, { text: inputValue, color: randomColor }]);
      setInputValue('');
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-20 bg-red-500">
      <div className="flex flex-col items-center box-content h-90 w-80 py-20 border-4">
        <div className="flex mb-4 py-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="p-2 border rounded-l"
            placeholder="Input text here..."
          />
          <button onClick={handleAddItem} className="px-4 py-2 bg-green-500 text-white rounded-r">
            Add
          </button>
        </div>
        <div className="w-full max-w-md">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 border-b">
              <span>{item.text}</span>
              <button onClick={() => handleRemoveItem(index)} className="text-red-500">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InputList;
