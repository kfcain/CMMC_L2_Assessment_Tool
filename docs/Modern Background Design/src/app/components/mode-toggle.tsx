import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

interface ModeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ModeToggle({ isDark, onToggle }: ModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl transition-all duration-500 cursor-pointer group"
      style={{
        background: isDark
          ? "rgba(255, 255, 255, 0.07)"
          : "rgba(0, 0, 0, 0.05)",
        border: `1px solid ${
          isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
        }`,
        boxShadow: isDark
          ? "0 4px 24px rgba(120, 60, 200, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Track */}
      <div
        className="relative w-12 h-6 rounded-full transition-colors duration-500"
        style={{
          background: isDark
            ? "rgba(120, 60, 200, 0.4)"
            : "rgba(180, 140, 240, 0.3)",
        }}
      >
        {/* Thumb */}
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
          animate={{
            left: isDark ? "calc(100% - 22px)" : "2px",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            background: isDark
              ? "linear-gradient(135deg, #a855f7, #7c3aed)"
              : "linear-gradient(135deg, #c084fc, #a855f7)",
            boxShadow: isDark
              ? "0 2px 8px rgba(120, 60, 200, 0.5)"
              : "0 2px 8px rgba(168, 85, 247, 0.3)",
          }}
        >
          <motion.div
            animate={{ rotate: isDark ? 0 : 180, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isDark ? (
              <Moon size={12} className="text-white" />
            ) : (
              <Sun size={12} className="text-white" />
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Label */}
      <span
        className="text-xs tracking-widest uppercase transition-colors duration-500 select-none"
        style={{
          color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.4)",
          letterSpacing: "0.15em",
        }}
      >
        {isDark ? "Dark" : "Light"}
      </span>
    </button>
  );
}
