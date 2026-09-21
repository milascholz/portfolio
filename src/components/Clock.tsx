"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "America/Toronto";

const formatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZone: TIME_ZONE,
});

export default function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="font-mono text-xs tabular-nums text-muted">
      {time ?? "--:--:--"}
      <span className="ml-1.5 text-muted/60">ET</span>
    </p>
  );
}
