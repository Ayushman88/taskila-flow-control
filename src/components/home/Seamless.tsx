import React from "react";

const Seamless: React.FC = () => {
  return (
    <div className="bg-white max-h-screen">
      {/* Header Section */}
      <div className="bg-[#D5D2FD] rounded-t-[100px] p-20 flex flex-col justify-center items-center">
        <h1 className="text-6xl text-black z-20 text-center">
          Experience the power of <br />
          <span className="bg-white border border-black p-0 px-2 rounded-full z-0">
            Seamless
          </span>{" "}
          Functionality
        </h1>
        {/* Features Section */}
        <div className="flex flex-row justify-between p-5 gap-14 mt-10">
          {/* Feature 1 */}
          <div className="flex flex-col text-white bg-[#0F253E] h-[40vh] p-8 rounded-xl shadow-lg w-1/3">
            <h1 className="text-3xl font-semibold">
              Effortless Task Management
            </h1>
            <p className="mt-2 text-gray-300">
              Organize, assign, and track your tasks seamlessly. Stay on top of
              deadlines with an intuitive interface that keeps everything
              structured.
            </p>
            <p className="mt-2 text-gray-300">
              Get detailed insights into your workflow, ensuring no task is left
              behind.
            </p>
            <p className="mt-2 text-gray-300">
              Assign priorities and categorize tasks for better efficiency.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col text-white bg-[#0F253E] h-[40vh] p-8 rounded-xl shadow-lg w-1/3">
            <h1 className="text-3xl font-semibold">Real-Time Collaboration</h1>
            <p className="mt-2 text-gray-300">
              Work together efficiently with instant updates and shared
              workflows. Improve team productivity with seamless communication.
            </p>
            <p className="mt-2 text-gray-300">
              Get notified in real-time when tasks are updated or completed.
            </p>
            <p className="mt-2 text-gray-300">
              Tag team members and streamline project discussions effortlessly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col text-white bg-[#0F253E] h-[40vh] p-8 rounded-xl shadow-lg w-1/3">
            <h1 className="text-3xl font-semibold">
              Automated AI-powered Workflows
            </h1>
            <p className="mt-2 text-gray-300">
              Automate repetitive tasks and optimize workflows. Reduce manual
              work and focus on what truly matters.
            </p>
            <p className="mt-2 text-gray-300">
              Leverage AI-driven suggestions to optimize task assignments.
            </p>
            <p className="mt-2 text-gray-300">
              Smart analytics help predict bottlenecks and suggest solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seamless;
