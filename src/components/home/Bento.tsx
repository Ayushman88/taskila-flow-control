
"use client";
import React from "react";
import CountUp from "react-countup";

interface StatCounterProps {
  end: number;
}

const StatCounter: React.FC<StatCounterProps> = ({ end }) => {
  return (
    <CountUp
      start={0}
      end={end}
      duration={2.5}
      className="text-7xl font-semibold"
    />
  );
};

export const Bento: React.FC = () => {
  return (
    <div className="min-h-screen p-10 pt-20 flex flex-col gap-10 bg-white dark:bg-slate-900 dark:text-white">
      {/* Top Section */}
      <div className="flex flex-row gap-4">
        {/* Left Side */}
        <div className="flex flex-col gap-4 w-2/3">
          {/* Heading and Text */}
          <div className="flex flex-col">
            <h1 className="text-7xl text-black leading-tight">
              Transform your <br /> business with Taskila
            </h1>
            <p className="text-gray-600 mt-2 text-lg leading-relaxed">
              Taskila is your all-in-one task management solution, designed to
              help teams collaborate effortlessly. Whether you're managing
              projects, tracking progress, or organizing daily tasks, Taskila
              provides a seamless experience to keep everything in one place.
              <br />
              From assigning tasks to setting deadlines and automating
              workflows, our platform ensures efficiency and productivity. Stay
              on top of your work with real-time updates, intuitive dashboards,
              and a user-friendly interface.
            </p>
          </div>

          {/* Yellow Stats Box */}
          <div className="bg-[#FBE26C] text-black w-full h-[20vh] flex items-center justify-center rounded-[40px] border border-black">
            <div className="flex justify-around w-full text-center">
              <div>
                <StatCounter end={12000} />
                <p className="text-xl">Tasks Completed</p>
              </div>
              <div>
                <StatCounter end={120} />
                <p className="text-xl">Teams Onboarded</p>
              </div>
              <div>
                <StatCounter end={2000} />
                <p className="text-xl">Total Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Dark Blue Card */}
        <div className="w-1/3 relative p-5  h-[60vh] flex flex-col gap-5 items-center justify-center bg-[#0F253E] rounded-[40px] border border-black">
          <p className="absolute top-10 text-white text-7xl text-center">
            Streamline your work
          </p>
          <img
            src="/streamline-work.png"
            alt="Streamline Work"
            className="absolute bottom-0 w-[90vw] object-screen"
          />
        </div>
      </div>

      {/* Bottom Section - Purple Card */}
      <div className="bg-[#49439E] relative max-w-8xl h-[30vh] flex items-center justify-between p-8 rounded-lg border border-black">
        {/* Left Section - Text Content */}
        <div className="text-white w-6/12">
          <h2 className="text-3xl font-bold text-white">
            Taskila: Collabrative Workspace
          </h2>
          <p className="mt-4 text-lg text-gray-200 leading-relaxed">
            Taskila is designed to streamline your workflow with effortless task
            management, automation, and real-time collaboration. Whether you're
            handling a small project or managing an entire team, Taskila helps
            you stay productive and organized.
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="w-1/3">
          <img
            src="/hshska 1.png"
            alt="Sales Dashboard"
            className="rounded-lg absolute bottom-0 right-0"
          />
        </div>
      </div>
    </div>
  );
};

export default Bento;
