import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Modal from "./Modal"; // Import the modal component

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem, copyItem, removeItem, toggleDisplay, isDisplayed }) => {
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li ref={(node) => drop(drag(node))} className="flex items-center justify-between p-2 bg-gray-200">
      <span>{item}</span>
      <div>
        <button className="mx-1 cursor-move">⇅</button>
        <button className="mx-1" onClick={() => copyItem(index)}>📋</button>
        <input
          type="checkbox"
          checked={isDisplayed}
          onChange={() => toggleDisplay(index)}
          className="mx-1"
        />
        <button className="mx-1" onClick={() => removeItem(index)}>❌</button>
      </div>
    </li>
  );
};

const SpinWheel = () => {
  const canvasRef = useRef(null);
  const [spinBtnDisabled, setSpinBtnDisabled] = useState(false);
  const [text, setText] = useState("Wheel Of Fortune");
  const [angle, setAngle] = useState(0);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [wheelItems, setWheelItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rotating, setRotating] = useState(false);
  const rotationRef = useRef(0);

  const spinColors = [
    "#285E08",
    "#EBC107",
    "#EBE696",
    "#B0BD4D"
  ];

  useEffect(() => {
    // Load items from local storage if they exist
    const storedItems = JSON.parse(localStorage.getItem("spinWheelItems"));
    if (storedItems && storedItems.items.length > 0 && storedItems.wheelItems.length > 0) {
      setItems(storedItems.items);
      setWheelItems(storedItems.wheelItems);
    }
  }, []);

  useEffect(() => {
    // Save items to local storage whenever items or wheelItems change
    localStorage.setItem("spinWheelItems", JSON.stringify({ items, wheelItems }));
  }, [items, wheelItems]);

  useEffect(() => {
    // Draw the wheel on canvas
    const drawWheel = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const displayedItems = items.filter((_, index) => wheelItems[index]);
      const sliceAngle = (2 * Math.PI) / displayedItems.length;

      displayedItems.forEach((item, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        // Set fill color based on index
        ctx.fillStyle = spinColors[i % spinColors.length];
        ctx.fill();

        const textRadius = radius * 0.75;
        const textAngle = startAngle + sliceAngle / 2;
        const textX = centerX + textRadius * Math.cos(textAngle);
        const textY = centerY + textRadius * Math.sin(textAngle);

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(textAngle - Math.PI / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Set text color based on fill color
        ctx.fillStyle = ["#285E08"].includes(spinColors[i % spinColors.length]) ? "#fff" : "#000";

        ctx.font = "bold 16px PT Serif";
        ctx.fillText(item, 0, 0);
        ctx.restore();
      });
    };

    drawWheel();
  }, [items, wheelItems, angle]);

  const spinWheel = () => {
    if (rotating || items.length === 0) return;
    setRotating(true);
    setText("Best Of Luck!");
  
    const randomAngle = 360 * 10 + Math.floor(Math.random() * 360);
    const totalRotation = rotationRef.current + randomAngle;
  
    const wheel = canvasRef.current;
    wheel.style.transition = "transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)";
    wheel.style.transform = `rotate(${totalRotation}deg)`;
  
    setTimeout(() => {
      setRotating(false);
      const displayedItems = items.filter((_, index) => wheelItems[index]);
      const sliceAngle = 360 / displayedItems.length;
  
      const arrowOffsetAngle = 90;
      const adjustedRotation = (totalRotation + arrowOffsetAngle) % 360;
      const selectedItemIndex = Math.floor(adjustedRotation / sliceAngle);
      const finalIndex = displayedItems.length - 1 - selectedItemIndex;
  
      setText(displayedItems[finalIndex]);
      setSelectedItem(displayedItems[finalIndex]);
      setShowModal(true);
      setSpinBtnDisabled(false);
      rotationRef.current = totalRotation;
    }, 4000);
  };

  const handleAddItem = () => {
    if (newItem.trim() === "") return;
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setWheelItems([...wheelItems, true]);
    setNewItem("");
  };

  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = items[dragIndex];
    const updatedItems = [...items];
    updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);
    setItems(updatedItems);

    const updatedWheelItems = [...wheelItems];
    updatedWheelItems.splice(dragIndex, 1);
    updatedWheelItems.splice(hoverIndex, 0, wheelItems[dragIndex]);
    setWheelItems(updatedWheelItems);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    const updatedWheelItems = [...wheelItems];
    updatedWheelItems.splice(index, 1);
    setWheelItems(updatedWheelItems);
  };

  const copyItem = (index) => {
    const updatedItems = [...items, items[index]];
    setItems(updatedItems);

    const updatedWheelItems = [...wheelItems, wheelItems[index]];
    setWheelItems(updatedWheelItems);
  };

  const toggleDisplay = (index) => {
    const updatedWheelItems = [...wheelItems];
    updatedWheelItems[index] = !updatedWheelItems[index];
    setWheelItems(updatedWheelItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full flex">
        <div className="flex-1 bg-white flex items-center justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              style={{ transform: `rotate(${angle}deg)` }}
            ></canvas>
            <button
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer w-20 h-20 flex justify-center items-center"
              onClick={spinWheel}
              style={{ width: "80px", height: "100px" }} // Adjust width and height as needed
            >
              <svg
                width="35"  // Adjust SVG dimensions accordingly
                height="56"
                viewBox="0 0 30 42"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M15 3 Q16.5 6.8 25 18 A12.8 12.8 0 1 1 5 18 Q13.5 6.8 15 3z"
                  fill="#3d3d3d"
                />
                <text
                  x="15"
                  y="26"
                  fill="#fff"
                  fontSize="7"
                  fontWeight="700"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  SPIN
                </text>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white">
           <div className="border-2 bg-white border-black rounded-2xl m-20 p-4 h-[460px] w-[500px]">
             <h3 className="font-bold text-xl mb-4 text-lg">
               INPUTS
               <span className="border border-black rounded mx-2 px-1 text-gray-600 border-gray-600 text-xs">
                {items.length}
              </span>
             </h3>
             <div className="input-wrapper relative w-full">               
              <input
                type="text"
                name="items"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="border focus:outline-none p-2 mb-2 w-full bg-gray-300 text-black font-bold pr-10 pl-2"
                placeholder="Input text here..."
              />
              <button onClick={handleAddItem} className="absolute inset-y-0 right-0 px-3 mb-2 mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  stroke="gray"
                  viewBox="0 0 20 20"
                  fill="none"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            <ul className="overflow-y-auto max-h-80">
              {items.map((item, index) => (
                <DraggableItem
                  key={index}
                  index={index}
                  item={item}
                  moveItem={moveItem}
                  copyItem={copyItem}
                  removeItem={removeItem}
                  toggleDisplay={toggleDisplay}
                  isDisplayed={wheelItems[index]}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
            {showModal && <Modal text={text} closeModal={() => setShowModal(false)} />}
    </DndProvider>
  );
};

export default SpinWheel;
