import React from 'react';

const Number = ({ number, color, index }) => {
  const style = {
    '--clr': color,
    transform: `rotate(calc(45deg * ${index}))`,
    clipPath: 'polygon(0 0, 56% 0, 100% 100%, 0 56%)',
  };

  return (
    <div className={`number absolute w-1/2 h-1/2 ${color}`} style={style}>
      <span className="relative transform rotate-45 text-white text-4xl font-bold">{number}</span>
      <span className="absolute font-medium text-xs">{'$'}</span>
    </div>
  );
};

export default Number;
