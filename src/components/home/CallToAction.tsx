
import React from "react";
import FallingElements from "../react-bits/FallingText";

const leftWords: string[] = ["Tasks", "Workflow", "Collaboration", "Productivity"];

const rightWords: string[] = ["Automation", "Planning", "Strategy", "Deadlines"];

const CallToAction: React.FC = () => {
  return (
    <div className="h-[30vh] bg-[#D5D2FD] border-b-2 border-black flex flex-col gap-10 justify-center items-center overflow-hidden relative">
      {/* Left Side Falling Elements */}
      <div className="absolute left-0 top-0 w-1/3 h-full">
        <FallingElements words={leftWords} side="left" />
      </div>

      {/* Right Side Falling Elements */}
      <div className="absolute right-0 top-0 w-1/3 h-full">
        <FallingElements words={rightWords} side="right" />
      </div>

      {/* Foreground Content */}
      <h1 className="text-4xl md:text-6xl text-[#3A0189] text-center relative z-10">
        Ready to streamline your workflow?
      </h1>
      <button className="px-6 py-2 border border-neutral-700 border-b-4 border-r-2 rounded-full bg-white text-[#AB10F3] text-2xl md:text-3xl font-medium relative z-50">
        Get started for free
      </button>
    </div>
  );
};

export default CallToAction;
