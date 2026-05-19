"use client";

import { motion } from "framer-motion";

export default function BeySpinner3D({
  size = 220,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative perspective-1000 ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="relative h-full w-full preserve-3d"
        animate={{ rotateX: [62, 68, 62], rotateY: [0, 8, 0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="bey-ring h-[100%] w-[100%] bey-core-spin" />
        <div className="bey-ring bey-ring-gold h-[78%] w-[78%] bey-core-spin-reverse" />
        <div className="bey-ring h-[56%] w-[56%] bey-core-spin" />

        <motion.div
          className="absolute left-1/2 top-1/2 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/30 bg-slate-950/90 preserve-3d bey-shadow-glow"
          animate={{ rotateZ: 360 }}
          transition={{ duration: 2.3, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-[16%] rounded-full border border-amber-300/30 bg-gradient-to-br from-sky-400/20 to-amber-300/20" />
          <div className="absolute inset-[34%] rounded-full bg-sky-300/80 blur-[1px]" />
        </motion.div>

        <div className="absolute left-1/2 top-1/2 h-[10%] w-[10%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-[0.5px]" />
      </motion.div>
    </div>
  );
}