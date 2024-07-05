import React, { useState } from 'react';
import InputList from './InputList'; // Assuming InputList is defined in InputList.js

const PickerWheel = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const spinWheel = () => {
    if (spinning) return;

    setSpinning(true);

    setTimeout(() => {
      const selectedIndex = Math.floor(Math.random() * items.length);
      setSelectedItem(items[selectedIndex]);
      setSpinning(false);
    }, 2000); // Adjust spinning duration as needed
  };

  return (
    <div className="mx-20">
      <div className="flex flex-col items-center justify-center">
        <div className="wheel-container relative w-96 h-96 border-4 border-black rounded-full overflow-hidden">
          <div className="wheel flex w-full h-full">
            {items.map((item, index) => (
              <div
                key={index}
                className={`wheel-item w-full h-full border border-black flex items-center justify-center`}
                style={{ backgroundColor: item.color }}
              >
                {item.text}
              </div>
            ))}
          </div>
          <div className="pointer absolute inset-0 flex items-center justify-center">
            <div className={`pointer-arrow border-l-10 border-r-10 border-transparent border-t-20 ${spinning ? 'border-blue-500 animate-spin' : 'border-red-500'}`}></div>
          </div>
          <button
            onClick={spinWheel}
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={spinning}
          >
            SPIN
          </button>
        </div>
        {selectedItem && (
          <div className="mt-4 text-2xl">{`Selected: ${selectedItem.text}`}</div>
        )}
      </div>
    </div>
  );
};

export default PickerWheel;
