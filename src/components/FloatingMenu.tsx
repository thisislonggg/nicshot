import { useState } from "react";
import { MessageCircle, X, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 glass-card p-3 min-w-[200px] flex flex-col gap-1"
          >
            <a
              href="https://wa.me/6282302450239?text=Hi%2C%20saya%20butuh%20bantuan%20dengan%20akun%20Valorant"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-accent/10 transition-colors"
            >
              <Phone size={16} className="text-accent" />
              Chat via WhatsApp
            </a>
            <a
              href="mailto:support@nicshot.vault.com"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-accent/10 transition-colors"
            >
              <Mail size={16} className="text-accent" />
              Email Support
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg btn-glow transition-transform duration-200 hover:scale-110"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default FloatingMenu;
