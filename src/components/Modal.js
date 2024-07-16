import React from "react";

const Modal = ({ text, closeModal }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded w-[550px] h-[300px] flex flex-col justify-between relative">
        <div className="mt-[100px]">
          <h1 className="text-2xl text-center font-bold">{text}</h1>
          <h2 className="text-2xl text-center mt-2">Selected</h2>
        </div>
        {/* Button inside the modal */}
      </div>
      {/* Button outside the modal */}
      <button className="bg-yellow-500 text-xl font-bold text-white px-4 py-2 rounded w-[160px] absolute bottom-[130px]" onClick={closeModal}>
        Done
      </button>
    </div>
  );
};

export default Modal;
