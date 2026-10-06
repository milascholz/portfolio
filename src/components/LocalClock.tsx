"use client";

import { useEffect, useState } from "react";

export default function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function tick() {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="shrink-0 tabular-nums text-sm text-foreground/45">
      {time ?? "--:--:--"}
    </span>
  );
}
