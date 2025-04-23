import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/create-organization");
  };

  return (
    <div className="flex items-center justify-between px-6 md:px-14 py-4 bg-white text-black relative">
      <div
        className="text-3xl md:text-4xl cursor-pointer"
        onClick={() => navigate("/")}
      >
        taskila
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-3xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <HiX /> : <HiOutlineMenu />}
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-lg">
        {["about", "features", "pricing", "wall of love"].map((item, index) => (
          <div
            key={index}
            className="p-2 flex flex-row gap-1 items-center group cursor-pointer"
          >
            {item}{" "}
            <span className="transition-transform duration-300 ease-in-out group-hover:rotate-180">
              <IoIosArrowDown />
            </span>
          </div>
        ))}
      </div>

      {/* Authentication Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={handleGetStarted}
          className="px-6 py-2 border border-black rounded-full bg-white text-black font-medium transition-all hover:bg-gray-100"
        >
          Login / Sign Up
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white z-10 shadow-md flex flex-col items-center space-y-4 py-6 md:hidden">
          {["about", "features", "pricing", "wall of love"].map(
            (item, index) => (
              <div key={index} className="text-lg cursor-pointer">
                {item}
              </div>
            )
          )}
          <button
            onClick={handleGetStarted}
            className="px-6 py-2 border border-black rounded-full bg-white text-black font-medium"
          >
            Login / Sign Up
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
