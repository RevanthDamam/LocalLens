import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";

export function LoadingScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex flex-col items-center gap-6"
          >
            <motion.div
              className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6"
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -6, 0],
                boxShadow: [
                  "0 4px 20px -4px hsl(var(--primary) / 0.2)",
                  "0 8px 30px -8px hsl(var(--primary) / 0.3)",
                  "0 4px 20px -4px hsl(var(--primary) / 0.2)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <MapPin className="h-14 w-14 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-display text-3xl font-bold text-foreground"
            >
              LocalLens
            </motion.h1>
            <motion.div className="h-1.5 w-40 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
