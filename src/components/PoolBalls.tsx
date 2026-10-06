"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import { BASE_PATH } from "@/lib/base-path";

const BALL_COUNT = 15;
const BALL_RADIUS = 15;
const CURSOR_RADIUS = 18;

type BallState = { x: number; y: number; angle: number };

export default function PoolBalls({
  obstacleContainerRef,
  layoutVersion,
}: {
  obstacleContainerRef: React.RefObject<HTMLElement | null>;
  layoutVersion: unknown;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const worldWallsRef = useRef<Matter.Body[]>([]);
  const worldObstaclesRef = useRef<Matter.Body[]>([]);
  const cursorBodyRef = useRef<Matter.Body | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const [positions, setPositions] = useState<BallState[]>(() =>
    Array.from({ length: BALL_COUNT }, () => ({ x: -100, y: -100, angle: 0 }))
  );

  // Set up the engine, balls, mouse control, and render loop once.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    engineRef.current = engine;

    const rect = container.getBoundingClientRect();
    const width = Math.max(rect.width, 1);
    const height = Math.max(rect.height, 1);

    const balls = Array.from({ length: BALL_COUNT }, (_, i) => {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 24 + col * (BALL_RADIUS * 2 + 10);
      const y = 24 + row * (BALL_RADIUS * 2 + 10);
      return Matter.Bodies.circle(x, y, BALL_RADIUS, {
        restitution: 0.75,
        friction: 0.02,
        frictionAir: 0.025,
        density: 0.0025,
        label: "ball",
      });
    });
    Matter.Composite.add(engine.world, balls);

    const cursorBody = Matter.Bodies.circle(-9999, -9999, CURSOR_RADIUS, {
      isStatic: true,
      label: "cursor",
    });
    cursorBodyRef.current = cursorBody;
    Matter.Composite.add(engine.world, cursorBody);

    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.15, damping: 0.15, render: { visible: false } },
    });
    mouseConstraintRef.current = mouseConstraint;
    Matter.Composite.add(engine.world, mouseConstraint);

    function handlePointerMove(e: PointerEvent) {
      const r = container!.getBoundingClientRect();
      Matter.Body.setPosition(cursorBody, {
        x: e.clientX - r.left,
        y: e.clientY - r.top,
      });
    }
    function releaseDrag() {
      mouseConstraint.mouse.button = -1;
      mouseConstraint.constraint.bodyB = null;
    }
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", () => {
      Matter.Body.setPosition(cursorBody, { x: -9999, y: -9999 });
    });
    window.addEventListener("pointerup", releaseDrag);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    let rafId: number;
    function sync() {
      setPositions(balls.map((b) => ({ x: b.position.x, y: b.position.y, angle: b.angle })));
      rafId = requestAnimationFrame(sync);
    }
    sync();

    function layout() {
      const r = container!.getBoundingClientRect();
      const w = Math.max(r.width, 1);
      const h = Math.max(r.height, 1);
      const t = 60;
      Matter.Composite.remove(engine.world, worldWallsRef.current);
      const walls = [
        Matter.Bodies.rectangle(w / 2, -t / 2, w + t * 2, t, { isStatic: true }),
        Matter.Bodies.rectangle(w / 2, h + t / 2, w + t * 2, t, { isStatic: true }),
        Matter.Bodies.rectangle(-t / 2, h / 2, t, h + t * 2, { isStatic: true }),
        Matter.Bodies.rectangle(w + t / 2, h / 2, t, h + t * 2, { isStatic: true }),
      ];
      worldWallsRef.current = walls;
      Matter.Composite.add(engine.world, walls);
    }
    layout();
    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      Matter.Runner.stop(runner);
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      container.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", releaseDrag);
    };
  }, []);

  // Keep static obstacle colliders in sync with the text elements they should
  // not be passed through by, recomputed whenever the sidebar's layout shifts.
  useEffect(() => {
    const container = containerRef.current;
    const obstacleRoot = obstacleContainerRef.current;
    const engine = engineRef.current;
    if (!container || !obstacleRoot || !engine) return;

    function update() {
      const containerRect = container!.getBoundingClientRect();
      Matter.Composite.remove(engine!.world, worldObstaclesRef.current);
      const nodes = obstacleRoot!.querySelectorAll<HTMLElement>("[data-pool-obstacle]");
      const bodies: Matter.Body[] = [];
      nodes.forEach((node) => {
        const r = node.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        const cx = r.left - containerRect.left + r.width / 2;
        const cy = r.top - containerRect.top + r.height / 2;
        bodies.push(
          Matter.Bodies.rectangle(cx, cy, r.width, r.height, { isStatic: true })
        );
      });
      worldObstaclesRef.current = bodies;
      Matter.Composite.add(engine!.world, bodies);
    }

    update();
    const t = setTimeout(update, 150);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(obstacleRoot);
    window.addEventListener("resize", update);

    return () => {
      clearTimeout(t);
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutVersion]);

  return (
    <div ref={containerRef} className="absolute inset-0 touch-none" style={{ zIndex: 0 }}>
      {positions.map((p, i) => (
        <img
          key={i}
          src={`${BASE_PATH}/images/pool/ball-${i + 1}.png`}
          alt=""
          draggable={false}
          className="absolute h-[30px] w-[30px] select-none"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${p.x - BALL_RADIUS}px, ${p.y - BALL_RADIUS}px) rotate(${p.angle}rad)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
