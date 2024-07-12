import React, { useState, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "ITEM";

const DraggableItem = ({ item, index, moveItem, copyItem, removeItem, toggleDisplay, isDisplayed }) => {
  const [, ref] = useDrag({
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
    <><li ref={(node) => ref(drop(node))} className="flex items-center justify-between p-2  bg-gray-200">
      <span>{item}</span> 
      <div >
        <button className="mx-1 cursor-move" onClick={() => {}}>⇅</button> {/* Drag button with symbol */}
        <button className="mx-1" onClick={() => copyItem(index)}>📋</button> {/* Copy button with symbol */}
        <input
          type="checkbox"
          checked={isDisplayed}
          onChange={() => toggleDisplay(index)}
          className="mx-1"
        />
        <button className="mx-1" onClick={() => removeItem(index)}>❌</button> {/* Remove button with symbol */}
      </div>
      </li>
      </>
   
  );
};

const SpinWheel = () => {
  const canvasRef = useRef(null);
  const [spinBtnDisabled, setSpinBtnDisabled] = useState(false);
  const [text, setText] = useState("Wheel Of Fortune");
  const [angle, setAngle] = useState(0);
  const [items, setItems] = useState(["Hiii", "how", "Hiii", "how", "Hiii", "how"]);
  const [newItem, setNewItem] = useState("");
  const [wheelItems, setWheelItems] = useState([...items].map(() => true)); // Initially all items are displayed

  const spinColors = [
    "#238707",
    "#A3A608",
    "#7D3C98",
    "#2E86C1",
    "#138D75",
    "#F1C40F",
    "#D35400",
    "#138D75",
    "#F1C40F",
    "#7D3C98",
  ];

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
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px PT Serif";
      ctx.fillText(item, 0, 0);
      ctx.restore();
    });
  };

  const handleSpin = () => {
    setSpinBtnDisabled(true);
    setText("Best Of Luck!");
    let randomDegree = Math.floor(Math.random() * 360);
    let count = 0;
    let resultValue = 101;

    const rotationInterval = setInterval(() => {
      setAngle((prevAngle) => {
        let newAngle = prevAngle + resultValue;
        if (newAngle >= 360) {
          count += 1;
          resultValue -= 5;
          newAngle = 0;
        }
        if (count > 15 && newAngle >= randomDegree && newAngle < randomDegree + resultValue) {
          generateValue(randomDegree);
          clearInterval(rotationInterval);
          return newAngle;
        }
        return newAngle;
      });
    }, 10);
  };

  const generateValue = (angleValue) => {
    const displayedItems = items.filter((_, index) => wheelItems[index]);
    const sliceAngle = (2 * Math.PI) / displayedItems.length;
    const itemIndex = Math.floor((angleValue % 360) / sliceAngle);
    setText(`Congratulations, You Have Won ${displayedItems[itemIndex]}!`);
    setSpinBtnDisabled(false);
  };

  useEffect(() => {
    drawWheel();
  }, [wheelItems, angle]);

  const handleAddItem = () => {
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setWheelItems([...wheelItems, true]); // Default to displaying the new item
    setNewItem("");

    drawWheel(); // Redraw the wheel with updated items
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

    drawWheel(); // Redraw the wheel with updated items
  };

  const copyItem = (index) => {
    const updatedItems = [...items, items[index]];
    setItems(updatedItems);

    const updatedWheelItems = [...wheelItems, wheelItems[index]];
    setWheelItems(updatedWheelItems);

    drawWheel(); // Redraw the wheel with updated items
  };

  const toggleDisplay = (index) => {
    const updatedWheelItems = [...wheelItems];
    updatedWheelItems[index] = !updatedWheelItems[index];
    setWheelItems(updatedWheelItems);

    drawWheel(); // Redraw the wheel with updated items
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
              id="spin_btn"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-24 h-24 rounded-full cursor-pointer border-0 bg-gray-900 text-white text-2xl font-semibold"
              onClick={handleSpin}
              disabled={spinBtnDisabled}
            >
              Spin
            </button>
            <div className="absolute top-[calc(50%-60px)] left-1/2 transform -translate-x-1/2 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[15px] border-b-gray-900"></div>
          </div>
        </div>
        <div className="flex-1 bg-white ">
          <div className="border-2 bg-white border-black rounded-2xl m-20 p-4 h-[480px] w-[500px]"> {/* Added flex-col for vertical alignment */}
          <h3 className="font-bold text-xl mb-4 text-lg ">INPUTS<span className="border border-black rounded mx-2 px-1  text-gray-600 border-gray-600 text-xs">{items.length}</span></h3>
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
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" stroke="gray" viewBox="0 0 20 20" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
</button>

</div>
<div className="font-bold mx-6">----------------------------------------------------------------</div>
<ul className="space-y-2 overflow-y-auto max-h-80">
              {items.map((item, index) => (
                <DraggableItem
                  key={index}
                  item={item}
                  index={index}
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
    </DndProvider>
  );
};

export default SpinWheel;
