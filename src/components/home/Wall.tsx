import React from "react";

type TestimonialType = {
  id: number;
  type: "text" | "video";
  text: string;
  name: string;
  src?: string;
};

const testimonials: TestimonialType[] = [
  {
    id: 1,
    type: "text",
    text: "Taskila has completely transformed how we manage projects. Our team productivity has doubled!",
    name: "Alice Johnson, Project Manager",
  },
  {
    id: 2,
    type: "text",
    text: "A must-have tool for any startup! Task automation and AI-driven insights are game changers.",
    name: "James Carter, Startup Founder",
  },
  {
    id: 3,
    type: "video",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Taskila made project management effortless! The intuitive dashboard helps us track everything seamlessly.",
    name: "Sophia Martinez, Product Lead",
  },
  {
    id: 4,
    type: "text",
    text: "The AI-powered task suggestions have saved us countless hours of manual work. Highly recommended!",
    name: "Daniel Kim, Operations Manager",
  },
  {
    id: 5,
    type: "video",
    src: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    text: "Best decision our team ever made! Taskila has streamlined our workflow and improved collaboration.",
    name: "Michael Brown, Marketing Director",
  },
  {
    id: 6,
    type: "text",
    text: "Super intuitive and user-friendly. We onboarded our entire team within minutes!",
    name: "Emily Davis, HR Manager",
  },
  {
    id: 7,
    type: "text",
    text: "Task automation has saved us so much time. We can now focus on scaling our business instead of managing tasks manually.",
    name: "Olivia Wilson, CEO",
  },
  {
    id: 8,
    type: "video",
    src: "https://www.youtube.com/embed/LXb3EKWsInQ",
    text: "Seamless workflow and team coordination. We love how easy it is to assign tasks and track progress!",
    name: "Noah Smith, Software Engineer",
  },
  {
    id: 9,
    type: "text",
    text: "We've doubled our productivity with Taskila. It's a must-have for any team that values efficiency.",
    name: "Liam Johnson, Business Analyst",
  },
  {
    id: 10,
    type: "video",
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    text: "Taskila is a game-changer! We love how simple yet powerful it is.",
    name: "Sophia Patel, Customer Success Manager",
  },
];

const Wall: React.FC = () => {
  return (
    <div className="bg-white min-h-screen p-6 md:p-10 flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-bold text-black text-center mb-10">
        Wall of Love
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-gray-100 p-6 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-between ${
              testimonial.type === "video" ? "row-span-2" : ""
            }`}
          >
            {testimonial.type === "text" ? (
              <>
                <p className="text-lg text-gray-800 italic text-center mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-right text-gray-600 font-semibold">
                  - {testimonial.name}
                </p>
              </>
            ) : (
              <>
                <div className="w-full aspect-video rounded-lg overflow-hidden shadow-md mb-4">
                  <iframe
                    className="w-full h-full"
                    src={testimonial.src}
                    title={`Testimonial from ${testimonial.name}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-lg text-gray-800 italic text-center mb-4">
                  "{testimonial.text}"
                </p>
                <p className="text-right text-gray-600 font-semibold">
                  - {testimonial.name}
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Join Us Button */}
      <button className="mt-12 px-8 py-4 bg-black text-white text-lg rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105">
        Join us Now!
      </button>
    </div>
  );
};

export default Wall;
