import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap } from "lucide-react";

const PromoBanner = () => {
  const [visible, setVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const target = new Date();
    target.setHours(target.getHours() + 24);

    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!visible) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative overflow-hidden bg-accent/10 border-b border-accent/20"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 animate-shimmer" style={{ backgroundSize: "200% 100%" }} />
        <div className="section-container py-2.5 flex items-center justify-center gap-4 relative">
          <Zap size={14} className="text-accent animate-pulse" />
          <p className="text-xs sm:text-sm font-body text-foreground">
            <span className="font-semibold text-accent">FLASH SALE</span>
            {" — "}Banyak diskon hingga 20%
          </p>
          <div className="flex items-center gap-1 font-heading text-xs font-bold">
            <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent">{pad(timeLeft.hours)}</span>
            <span className="text-accent">:</span>
            <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent">{pad(timeLeft.minutes)}</span>
            <span className="text-accent">:</span>
            <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent">{pad(timeLeft.seconds)}</span>
          </div>
          <button onClick={() => setVisible(false)} className="absolute right-4 text-muted-foreground hover:text-foreground">
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoBanner;
