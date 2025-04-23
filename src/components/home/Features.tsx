import React from "react";

const TaskilaLayout = () => {
  return (
    <div className="bg-white min-h-screen p-10 flex flex-col gap-20">
      {/* Section 1 */}
      <div className="flex flex-row items-center gap-10">
        {/* Text */}
        <div className="w-1/2">
          <h1 className="text-5xl font-bold text-black">
            Transform your <br /> business with Taskila
          </h1>
          <p className="mt-4 text-gray-600">
            Taskila helps teams manage projects efficiently, offering seamless
            collaboration and smart automation.
          </p>
          <p className="mt-2 text-gray-500">
            From startups to enterprises, Taskila streamlines task management,
            helping teams stay on top of their work.
          </p>
          <p className="mt-2 text-gray-500">
            Say goodbye to missed deadlines and disorganized workflows with
            Taskila’s intuitive interface.
          </p>
        </div>
        {/* Image Placeholder - Merging Right Corner */}
        <div className="w-1/2 h-[40vh] bg-gray-300 rounded-l-[40px] -mr-20"></div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-row-reverse items-center gap-10">
        {/* Text */}
        <div className="w-1/2">
          <h1 className="text-5xl font-bold text-black">
            Boost Productivity <br /> with Real-Time Collaboration
          </h1>
          <p className="mt-4 text-gray-600">
            Keep track of your work, meet deadlines, and increase productivity
            with real-time updates.
          </p>
          <p className="mt-2 text-gray-500">
            Assign tasks, set priorities, and ensure transparency across your
            team with instant notifications.
          </p>
          <p className="mt-2 text-gray-500">
            Experience seamless communication with built-in chat and commenting
            features.
          </p>
        </div>
        {/* Image Placeholder - Merging Left Corner */}
        <div className="w-1/2 h-[40vh] bg-gray-300 rounded-r-[40px] -ml-20"></div>
      </div>

      {/* Section 3 */}
      <div className="flex flex-row items-center gap-10">
        {/* Text */}
        <div className="w-1/2">
          <h1 className="text-5xl font-bold text-black">
            AI-Powered Automation <br /> for Smarter Workflows
          </h1>
          <p className="mt-4 text-gray-600">
            Automate workflows, assign tasks, and enhance team efficiency like
            never before.
          </p>
          <p className="mt-2 text-gray-500">
            Reduce manual work with AI-driven task suggestions and smart
            reminders.
          </p>
          <p className="mt-2 text-gray-500">
            Let Taskila analyze your workload and recommend optimizations to
            boost efficiency.
          </p>
        </div>
        {/* Image Placeholder - Merging Right Corner */}
        <div className="w-1/2 h-[40vh] bg-gray-300 rounded-l-[40px] -mr-20"></div>
      </div>
    </div>
  );
};

export default TaskilaLayout;
