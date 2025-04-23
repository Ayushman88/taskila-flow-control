
"use client";
import React from "react";
import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";

interface FallingElementsProps {
  words?: string[];
  trigger?: "auto" | "scroll";
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  side?: "left" | "right";
}

const FallingElements: React.FC<FallingElementsProps> = ({
  words = [],
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.2,
  fontSize = "2rem",
  side = "left", // "left" or "right"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [effectStarted, setEffectStarted] = useState(false);

  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current!,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(
      width / 2,
      height + 25,
      width,
      50,
      boundaryOptions
    );
    const leftWall = Bodies.rectangle(
      -25,
      height / 2,
      50,
      height,
      boundaryOptions
    );
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height,
      boundaryOptions
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -25,
      width,
      50,
      boundaryOptions
    );

    interface ElementWithBody {
      word: string;
      body: Matter.Body;
    }

    const elements: ElementWithBody[] = words.map((word, index) => {
      const x =
        side === "left"
          ? (Math.random() * width) / 3
          : width - (Math.random() * width) / 3;
      const y = Math.random() * height * 0.5;

      const body = Bodies.rectangle(x, y, 100, 40, {
        render: { fillStyle: "transparent" },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      return { word, body };
    });

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...elements.map((el) => el.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const updateLoop = () => {
      elements.forEach(({ body, word }) => {
        const { x, y } = body.position;
        const w = body.bounds.max.x - body.bounds.min.x;
        const h = body.bounds.max.y - body.bounds.min.y;
        const elem = document.getElementById(`word-${word}`);
        if (elem) {
          elem.style.left = `${x - w / 2}px`;
          elem.style.top = `${y - h / 2}px`;
          elem.style.transform = `rotate(${body.angle}rad)`;
        }
      });
      Matter.Engine.update(engine);
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas);
      }
      World.clear(engine.world);
      Engine.clear(engine);
    };
  }, [
    effectStarted,
    gravity,
    wireframes,
    backgroundColor,
    mouseConstraintStiffness,
    words,
    side,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-pointer overflow-hidden"
    >
      {words.map((word, index) => (
        <div
          key={index}
          id={`word-${word}`}
          className="absolute px-6 py-2 border border-neutral-700 border-b-4 border-r-2 rounded-full bg-white text-[#AB10F3] text-2xl md:text-3xl font-medium"
          style={{
            fontSize,
            left: "50%",
            top: "10%",
          }}
        >
          {word}
        </div>
      ))}
      <div
        className="absolute top-0 left-0 w-full h-full"
        ref={canvasContainerRef}
      />
    </div>
  );
};

export default FallingElements;
