import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PurpleBackground } from "./components/purple-background";
import { ModeToggle } from "./components/mode-toggle";
import { Download, Palette, Monitor, Smartphone } from "lucide-react";

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Animated Background */}
      <PurpleBackground isDark={isDark} />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          {/* Logo / Title */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: isDark
                  ? "linear-gradient(135deg, rgba(120, 60, 200, 0.6), rgba(80, 30, 170, 0.4))"
                  : "linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(139, 92, 246, 0.25))",
                backdropFilter: "blur(10px)",
                border: `1px solid ${isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(168, 85, 247, 0.2)"}`,
              }}
            >
              <Palette
                size={16}
                style={{
                  color: isDark ? "rgba(216, 180, 254, 0.9)" : "rgba(126, 58, 237, 0.7)",
                }}
              />
            </div>
            <span
              className="text-sm tracking-widest uppercase hidden sm:inline-block select-none"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.35)",
                letterSpacing: "0.2em",
              }}
            >
              Ambient
            </span>
          </motion.div>

          {/* Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <ModeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {showInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center max-w-2xl"
              >
                <motion.h1
                  className="mb-4"
                  style={{
                    color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(15, 10, 30, 0.85)",
                    transition: "color 0.5s ease",
                  }}
                >
                  Purple Ambient
                </motion.h1>

                <motion.p
                  className="mb-8 max-w-md mx-auto"
                  style={{
                    color: isDark ? "rgba(255, 255, 255, 0.35)" : "rgba(0, 0, 0, 0.35)",
                    transition: "color 0.5s ease",
                    lineHeight: "1.7",
                  }}
                >
                  A clean, sophisticated background with flowing purple gradients.
                  Toggle between dark and light modes for your presentation or website.
                </motion.p>

                {/* Feature pills */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                  {[
                    { icon: Monitor, label: "Desktop" },
                    { icon: Smartphone, label: "Responsive" },
                    { icon: Palette, label: "Dual Mode" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{
                        background: isDark
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(0, 0, 0, 0.03)",
                        border: `1px solid ${
                          isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"
                        }`,
                        backdropFilter: "blur(10px)",
                        transition: "background 0.5s ease, border-color 0.5s ease",
                      }}
                    >
                      <item.icon
                        size={14}
                        style={{
                          color: isDark
                            ? "rgba(168, 85, 247, 0.7)"
                            : "rgba(126, 58, 237, 0.6)",
                        }}
                      />
                      <span
                        className="text-xs tracking-wider"
                        style={{
                          color: isDark
                            ? "rgba(255, 255, 255, 0.4)"
                            : "rgba(0, 0, 0, 0.4)",
                          transition: "color 0.5s ease",
                        }}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowInfo(false)}
                    className="px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300"
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, rgba(120, 60, 200, 0.5), rgba(80, 30, 170, 0.4))"
                        : "linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(139, 92, 246, 0.25))",
                      border: `1px solid ${
                        isDark ? "rgba(168, 85, 247, 0.3)" : "rgba(168, 85, 247, 0.2)"
                      }`,
                      color: isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(80, 30, 140, 0.8)",
                      backdropFilter: "blur(10px)",
                      boxShadow: isDark
                        ? "0 4px 20px rgba(120, 60, 200, 0.2)"
                        : "0 4px 20px rgba(168, 85, 247, 0.1)",
                    }}
                  >
                    <span className="text-sm tracking-wide">View Background Only</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsDark(!isDark)}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full cursor-pointer transition-all duration-300"
                    style={{
                      background: isDark
                        ? "rgba(255, 255, 255, 0.06)"
                        : "rgba(0, 0, 0, 0.04)",
                      border: `1px solid ${
                        isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
                      }`,
                      color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.45)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <span className="text-sm tracking-wide">Switch Mode</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimal restore button when info is hidden */}
          <AnimatePresence>
            {!showInfo && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => setShowInfo(true)}
                className="px-5 py-2 rounded-full cursor-pointer"
                style={{
                  background: isDark
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.03)",
                  border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"
                  }`,
                  backdropFilter: "blur(10px)",
                  color: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.25)",
                  transition: "background 0.5s, border-color 0.5s, color 0.5s",
                }}
              >
                <span className="text-xs tracking-widest uppercase">Show Info</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex items-center justify-center pb-6"
        >
          <span
            className="text-xs tracking-wider select-none"
            style={{
              color: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)",
              transition: "color 0.5s ease",
            }}
          >
            Inspired by Obsidian & Apple
          </span>
        </motion.div>
      </div>
    </div>
  );
}
