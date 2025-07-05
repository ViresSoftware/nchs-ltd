"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

const STATS: Stat[] = [
  { value: 100, label: "clients", suffix: "+" },
  { value: 500, label: "million in assets", suffix: "+" },
  { value: 2, label: "billion in transactions", suffix: "+" },
];

/**
 * Simple count‑up hook that animates from 0 to the target value
 * over the specified duration (default 2 seconds).
 */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };

    frame.current = requestAnimationFrame(step);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, duration]);

  return count;
}

function AnimatedNumber({ target }: { target: number }) {
  const count = useCountUp(target);
  return <span>{count.toLocaleString()}</span>;
}

export default function Stats() {
  return (
    <section 
      id="stats"
      className="py-10 lg:py-20 px-4 bg-black relative bg-[url('/dot-grid-pattern.png')] bg-repeat"
      style={{ backgroundSize: '64px' }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-playfair mb-4">Company Stats</h2>
          <p className="text-sm">Our Results</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {STATS.map((stat) => (
            <Card key={stat.label} className="text-center bg-gray-900 text-white border-0">
              <CardHeader>
                <CardTitle className="text-4xl font-bold">
                  <AnimatedNumber target={stat.value} />
                  {stat.suffix}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground capitalize text-white">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}