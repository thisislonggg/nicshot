import { Link } from "react-router-dom";
import { Shield, MessageCircle, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="font-heading text-xl font-bold text-foreground">
              Nicshot<span className="gradient-text">.vault</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Secure, premium marketplace for competitive gamers. Verified sellers, instant delivery.
            </p>
          </div>

          {/* Trust */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield size={16} className="text-accent" />
              Trust & Security
            </h3>
            <p className="text-sm text-muted-foreground">
              Verified sellers, secure transactions, and escrow protection for every purchase.
            </p>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-sm font-semibold text-foreground mb-3">Support</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/6282302450239?text=Hi%2C%20saya%20butuh%20bantuan%20dengan%20akun%20Valorant"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <MessageCircle size={14} />
                Chat via WhatsApp
              </a>
              <a
                href="mailto:support@nicshot.vault.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <Mail size={14} />
                Email Support
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Nicshot.vault. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
