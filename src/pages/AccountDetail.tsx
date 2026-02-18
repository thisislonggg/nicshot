import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { mockAccounts } from "@/data/mockAccounts";

const AccountDetail = () => {
  const { id } = useParams();
  const account = mockAccounts.find((a) => a.id === Number(id));

  if (!account) {
    return (
      <div className="section-container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Account Not Found</h1>
        <Link to="/marketplace" className="mt-4 inline-flex items-center gap-2 text-accent text-sm">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const StatusBadge = ({ value, label }: { value: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {value ? (
        <CheckCircle size={16} className="text-accent" />
      ) : (
        <XCircle size={16} className="text-destructive" />
      )}
      <span className={value ? "text-accent" : "text-destructive"}>{label}</span>
    </div>
  );

  return (
    <div className="section-container py-10">
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="aspect-video bg-secondary flex items-center justify-center">
            {account.image_url ? (
              <img src={account.image_url} alt={account.code} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-foreground">{account.code}</p>
                <p className="text-sm text-muted-foreground mt-2">Account Gallery</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right - Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          {/* Code badge */}
          <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 mb-4">
            <h1 className="font-heading text-xl font-bold text-accent">{account.code}</h1>
          </div>

          <h2 className="font-heading text-sm font-semibold text-foreground mt-4 mb-3">Account Specs</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rank</span>
              <span className="font-semibold text-foreground">{account.rank}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Region</span>
              <span className="font-semibold text-foreground">{account.region}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Skins Count</span>
              <span className="font-semibold text-foreground">{account.skins_count}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price</span>
              <span className="font-heading text-lg font-bold gradient-text">
                IDR {account.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t border-border my-5" />

          <p className="text-sm text-muted-foreground mb-4">{account.description}</p>

          {/* Status */}
          <div className="space-y-2 mb-5">
            <StatusBadge value={account.email_verified} label="Email Verified" />
            <StatusBadge value={account.premier_unlinked} label="Premier Unlinked" />
            <StatusBadge value={account.name_change} label="Name Change Ready" />
          </div>

          {/* Skins */}
          {account.skins.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-foreground mb-2 font-heading uppercase tracking-wider">Skins</h3>
              <div className="flex flex-wrap gap-2">
                {account.skins.map((s) => (
                  <span key={s} className="px-2 py-1 text-xs rounded-md bg-accent/10 border border-accent/20 text-accent">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Agents */}
          {account.agents.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold text-foreground mb-2 font-heading uppercase tracking-wider">Agents</h3>
              <div className="flex flex-wrap gap-2">
                {account.agents.map((a) => (
                  <span key={a} className="px-2 py-1 text-xs rounded-md bg-secondary border border-border text-foreground">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Buy Button */}
          <a
            href={`https://wa.me/6282302450239?text=Hi%2C%20saya%20ingin%20membeli%20akun%20${account.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-heading font-bold text-sm bg-accent text-accent-foreground btn-glow transition-all duration-300 hover:scale-[1.02]"
          >
            <Shield size={16} /> Buy Now <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountDetail;
