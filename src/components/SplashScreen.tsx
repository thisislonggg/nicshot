import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"enter" | "glow" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glow"), 800);
    const t2 = setTimeout(() => setPhase("exit"), 2200);
    const t3 = setTimeout(onComplete, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  const letters = "NICSHOT".split("");

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ background: "hsl(222 100% 6%)" }}
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={() => {
          if (phase === "exit") onComplete();
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(217 91% 60% / ${Math.random() * 0.4 + 0.1})`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Radial glow behind text */}
        <motion.div
          className="absolute"
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.15) 0%, transparent 70%)",
          }}
          animate={
            phase === "glow"
              ? { scale: [1, 1.5, 1.2], opacity: [0.3, 0.8, 0.5] }
              : { scale: 0.8, opacity: 0 }
          }
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Main text */}
        <div className="relative flex items-center gap-[2px] sm:gap-1">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-wider select-none"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: "hsl(0 0% 100%)",
                textShadow:
                  phase === "glow"
                    ? "0 0 40px hsl(217 91% 60% / 0.8), 0 0 80px hsl(217 91% 60% / 0.4), 0 0 120px hsl(217 91% 60% / 0.2)"
                    : "none",
              }}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
              }}
              transition={{
                delay: i * 0.08 + 0.2,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          className="absolute mt-32 sm:mt-36 text-sm sm:text-base tracking-[0.3em] uppercase"
          style={{
            fontFamily: "'Roboto', sans-serif",
            color: "hsl(217 91% 60% / 0.8)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={phase === "glow" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          vault
        </motion.p>

        {/* Bottom line sweep */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px]"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(217 91% 60%), transparent)",
          }}
          initial={{ width: "0%", left: "50%" }}
          animate={
            phase === "glow"
              ? { width: "80%", left: "10%" }
              : { width: "0%", left: "50%" }
          }
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
