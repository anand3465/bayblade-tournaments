"use client";

/**
 * Reusable presentation component used to keep shared UI styling consistent across the app.
 */

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AnimatedCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Renders the animated card UI component.
 */
export default function AnimatedCard({
  children,
  className = "",
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
    >
      {children}
    </motion.div>
  );
}
