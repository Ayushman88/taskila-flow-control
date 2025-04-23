import React from "react";

interface ButtonProps {
  label: string;
}

const Button: React.FC<ButtonProps> = ({ label }) => {
  return (
    <button
      className="px-10 py-1 border border-black border-b-4 border-r-2 rounded-full bg-white text-black font-medium shadow-md transition-all duration-200 text-lg
      hover:bg-gray-100 active:scale-95 active:shadow-sm focus:ring-2 focus:ring-black"
    >
      {label}
    </button>
  );
};

export default Button;
