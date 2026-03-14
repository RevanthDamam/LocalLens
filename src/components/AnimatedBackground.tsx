import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
        animate={{ x: [0, 80, 0], y: [0, 50, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
        animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.02]"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)), transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
