import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const TRAIL_LEN = 8;

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    let raf = 0;
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setTrail((prev) => {
          const next = [{ x: e.clientX, y: e.clientY }, ...prev];
          return next.slice(0, TRAIL_LEN);
        });
      });
    };
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovered(
        target.closest("a, button, [role='button'], input, textarea, select, .cursor-hover") !== null
      );
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  const size = hovered ? 32 : 10;
  const half = size / 2;

  return (
    <>
      {/* Trail dots */}
      {trail.map((p, i) => (
        <motion.div
          key={i}
          className="pointer-events-none fixed left-0 top-0 z-[9997] rounded-full bg-primary/30"
          style={{
            width: 6,
            height: 6,
            x: p.x - 3,
            y: p.y - 3,
          }}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0.15 - (i / TRAIL_LEN) * 0.12 }}
          transition={{ duration: 0.15 }}
        />
      ))}
      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border-2 border-primary/50"
        animate={{
          x: pos.x - half - 4,
          y: pos.y - half - 4,
          width: size + 8,
          height: size + 8,
          scale: hovered ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-primary"
        animate={{
          x: pos.x - half,
          y: pos.y - half,
          width: size,
          height: size,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  );
}
