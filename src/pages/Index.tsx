import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Zap, CreditCard, ChevronRight, Star } from "lucide-react";
import { useEffect, useState } from "react";
import AccountCard from "@/components/AccountCard";
import { fetchFeaturedAccounts } from "../services/account.service";
import heroBg from "@/assets/hero-bg.jpg";

interface Account {
  id: string;
  code: string;
  rank: string;
  region: string;
  skins_count: number;
  price: number;
  image_url: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as const,
    },
  }),
};

const Index = () => {
  const [featured, setFeatured] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchFeaturedAccounts();
        setFeatured(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />

        <div className="relative section-container py-24 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-accent/30 bg-accent/10 text-accent mb-6">
              <Zap size={12} /> Trusted Marketplace
            </span>
          </motion.div>

          <motion.h1
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-foreground"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            Buy & Sell
            <br />
            <span className="gradient-text">Valorant Accounts</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            Secure, premium marketplace for competitive gamers.
            Verified sellers, instant delivery, unbeatable prices.
          </motion.p>

          <motion.div
            className="mt-8 flex justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-heading font-bold text-sm bg-accent text-accent-foreground btn-glow transition-all duration-300 hover:scale-105"
            >
              Browse Accounts <ChevronRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      <section className="section-container py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Featured Accounts
          </h2>
          <p className="text-muted-foreground mt-3">
            Hand-picked premium accounts
          </p>
        </div>

        {loading && (
          <div className="text-center text-muted-foreground">
            Loading featured accounts...
          </div>
        )}

        {error && (
          <div className="text-center text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && featured.length === 0 && (
          <div className="text-center text-muted-foreground">
            No featured accounts available.
          </div>
        )}

        {!loading && !error && featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((acc, i) => (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AccountCard
                  id={acc.id}
                  code={acc.code}
                  rank={acc.rank}
                  region={acc.region}
                  price={acc.price}
                  skinsCount={acc.skins_count}
                  imageUrl={acc.image_url}
                />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="section-container py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield size={28} />,
              title: "Browse & Filter",
              desc: "Find accounts by rank, price, region, and skins.",
            },
            {
              icon: <CreditCard size={28} />,
              title: "Secure Purchase",
              desc: "Buy with confidence—verified sellers.",
            },
            {
              icon: <Zap size={28} />,
              title: "Instant Access",
              desc: "Receive login details immediately after payment.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto text-accent mb-4">
                {item.icon}
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;