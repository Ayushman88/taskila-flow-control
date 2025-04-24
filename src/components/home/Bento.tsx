
import React from "react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

export function Bento() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 px-4 md:px-0 w-full max-w-6xl mx-auto">
      {/* Left Box */}
      <div className="col-span-1 bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-2">Boost Efficiency</h3>
        <p className="text-muted-foreground mb-4">Increase team productivity</p>
        <div className="text-4xl font-bold text-primary">
          <CountUp 
            start={0} 
            end={87} 
            decimals={0}
            delay={0}
            className="text-4xl font-bold text-primary" 
            suffix="%" 
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">Average productivity increase</p>
      </div>
      
      {/* Middle Box */}
      <div className="col-span-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-2">Time Saved</h3>
        <p className="text-muted-foreground mb-4">Reclaim valuable hours</p>
        <div className="flex items-end gap-1">
          <CountUp 
            start={0} 
            end={12} 
            decimals={0}
            delay={0}
            className="text-4xl font-bold text-blue-500"
          />
          <span className="text-xl font-semibold text-blue-500 mb-1">hours/week</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Average time saved per team member</p>
      </div>
      
      {/* Right Box */}
      <div className="col-span-1 bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-2">Customer Satisfaction</h3>
        <p className="text-muted-foreground mb-4">Happy clients, better business</p>
        <div className="text-4xl font-bold text-green-600">
          <CountUp 
            start={0} 
            end={94} 
            decimals={0}
            delay={0}
            className="text-4xl font-bold text-green-600"
            suffix="%" 
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">Client satisfaction rate</p>
      </div>
    </div>
  );
}
