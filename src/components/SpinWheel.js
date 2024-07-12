import React, { useState } from 'react';

function TodoList() {
  const [todoItems, setTodoItems] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [spinning, setSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleInputChange = (event) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodoItems([...todoItems, newTodo]);
      setNewTodo('');
    }
  };

  const startSpin = () => {
    if (todoItems.length === 0) {
      alert('Add items to the list first.');
      return;
    }

    setSpinning(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * todoItems.length);
      setSelectedItem(todoItems[randomIndex]);
      setSpinning(false);
    }, 3000); // Simulating a 3-second spin
  };

  return (
    <div className="w-full my-20">
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        
        {/* Left side - Spin wheel */}
        <div className="w-96 h-96 border-4 border-blue-500 rounded-full relative flex justify-center items-center">
          {/* Spinning wheel with items */}
          {todoItems.map((item, index) => (
            <div
              key={item}
              className={`absolute ${selectedItem === item ? 'bg-yellow-300' : ''}`}
              style={{
                transform: `rotate(${index * (360 / todoItems.length)}deg) translate(0, -40%)`,
                transformOrigin: 'center center',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <div className="bg-green-300 py-2 px-4 rounded-md shadow-md">
                {item}
              </div>
            </div>
          ))}

          {/* Spin button */}
          <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center ${spinning ? 'animate-spin' : ''}`}>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600" onClick={startSpin}>
              {spinning ? 'Spinning...' : 'Spin'}
            </button>
          </div>
        </div>
        
        {/* Right side - Todo List */}
        <div className="flex bg-white justify-center items-center w-1/2 h-full p-8">
          <div className="w-96 h-96 bg-gray-200 rounded-lg shadow-md">
            <div className="md:flex mb-4">
              <input
                type="text"
                className="border-2 border-gray-300 p-2 w-full"
                value={newTodo}
                onChange={handleInputChange}
                placeholder="Enter your todo"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
                onClick={handleAddTodo}
              >
                +
              </button>
            </div>
            <div>
              <ul>
                {todoItems.map((todo, index) => (
                  <li key={index} className="p-4">
                    {todo}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default TodoList;
