import React from "react";

const Spinner = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-16">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    </div>
  );
};

export default Spinner;
