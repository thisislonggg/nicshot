import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PromoBanner from "./PromoBanner";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/marketplace", label: "Marketplace" },
  ];

  return (
    <>
      <PromoBanner />
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="section-container flex items-center justify-between h-16">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Nicshot<span className="gradient-text">.vault</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`font-body text-sm font-medium transition-colors duration-200 ${
                  location.pathname === l.to ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
            >
              <div className="section-container py-4 flex flex-col gap-4">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className={`font-body text-sm font-medium ${
                      location.pathname === l.to ? "text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
