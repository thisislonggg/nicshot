import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAccountById } from "../services/account.service";
import { RankBadge } from "@/components/ui/RankBadge";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";

interface Account {
  status: string;
  id: string;
  code: string;
  rank: string;
  region: string;
  skins_count: number;
  price: number;
  description: string;
  email_verified: boolean;
  premier_unlinked: boolean;
  name_change: boolean;
  image_url: string | null;
  skins: string[];
  agents: string[];
}

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadAccount = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchAccountById(id);
        if (!data) {
          navigate("/not-found");
          return;
        }

        setAccount(data as Account);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, [id, navigate]);

  const StatusBadge = ({ value, label }: { value: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {value ? (
        <CheckCircle size={16} className="text-accent" />
      ) : (
        <XCircle size={16} className="text-destructive" />
      )}
      <span className={value ? "text-accent" : "text-destructive"}>
        {label}
      </span>
    </div>
  );

if (loading) {
  return (
    <div className="section-container py-10">
      {/* Back Link Skeleton */}
      <Skeleton className="h-5 w-32 mb-8 bg-white/5" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="glass-card p-4 h-fit self-start bg-[#0A101E]">
          <Skeleton className="w-full aspect-[4/3] rounded-lg bg-white/5" />
        </div>

        {/* Details Skeleton */}
        <div className="glass-card p-8 bg-[#0A101E]">
          <Skeleton className="h-10 w-32 rounded-lg bg-white/10 mb-6" />

          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg bg-white/5" />
            <Skeleton className="h-6 w-full bg-white/5" />
            <Skeleton className="h-6 w-full bg-white/5" />
            <Skeleton className="h-8 w-1/2 bg-white/10 mt-2" />
          </div>

          <Skeleton className="h-px w-full my-6 bg-white/10" />

          <Skeleton className="h-16 w-full bg-white/5 mb-6" />

          <div className="space-y-3 mb-6">
            <Skeleton className="h-5 w-1/3 bg-white/5" />
            <Skeleton className="h-5 w-1/3 bg-white/5" />
            <Skeleton className="h-5 w-1/3 bg-white/5" />
          </div>

          {/* Tombol Buy Now Skeleton */}
          <Skeleton className="h-14 w-full rounded-lg bg-blue-500/20 mt-8" />
        </div>
      </div>
    </div>
  );
}

  if (error || !account) {
    return (
      <div className="section-container py-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {error || "Account Not Found"}
        </h1>
        <SEO 
        title={`Akun ${account.code} - ${account.rank}`}
        description={`Valorant Account ${account.code} | Rank: ${account.rank} | ${account.skins_count} Skins | Full Agents. Beli sekarang seharga IDR ${account.price.toLocaleString("id-ID")} hanya di Nicshot.vault.`}
        image={account.image_url || undefined}
      />
<nav className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-8">
  {/* Link ke Home */}
  <Link to="/" className="flex items-center gap-1.5 hover:text-accent transition-colors">
    <Home size={14} />
    Home
  </Link>
  
  <ChevronRight size={14} className="opacity-50" />
  
  {/* Link ke Marketplace */}
  <Link to="/marketplace" className="hover:text-accent transition-colors">
    Marketplace
  </Link>
  
  <ChevronRight size={14} className="opacity-50" />
  
  {/* Posisi Saat Ini (Teks statis, bukan link) */}
  <span className="text-foreground">
    {account.code}
  </span>
</nav>
      </div>
    );
  }

  return (
    <div className="section-container py-10">
<nav className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-8">
  {/* Link ke Home */}
  <Link to="/" className="flex items-center gap-1.5 hover:text-accent transition-colors">
    <Home size={14} />
    Home
  </Link>
  
  <ChevronRight size={14} className="opacity-50" />
  
  {/* Link ke Marketplace */}
  <Link to="/marketplace" className="hover:text-accent transition-colors">
    Marketplace
  </Link>
  
  <ChevronRight size={14} className="opacity-50" />
  
  {/* Posisi Saat Ini (Teks statis, bukan link) */}
  <span className="text-foreground">
    {account.code}
  </span>
</nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  className="glass-card p-4 h-fit self-start"
>
  <img
    src={account.image_url ?? ""}
    alt={account.code}
    className="block w-full h-auto rounded-lg"
  />
</motion.div>


        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8"
        >
          <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 mb-4">
            <h1 className="font-heading text-xl font-bold text-accent">
              {account.code}
            </h1>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center bg-[#0F172A] p-3 rounded-lg border border-white/5">
  <span className="text-gray-400 uppercase tracking-wider text-xs font-bold">Current Rank</span>
  <RankBadge rank={account.rank} iconSize="md" />
</div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Region</span>
              <span className="font-semibold">{account.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Skins Count</span>
              <span className="font-semibold">{account.skins_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-heading text-lg font-bold gradient-text">
                IDR {account.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="border-t border-border my-5" />

          <p className="text-sm text-muted-foreground mb-4">
            {account.description}
          </p>

          <div className="space-y-2 mb-5">
            <StatusBadge value={account.email_verified} label="Email Verified" />
            <StatusBadge value={account.premier_unlinked} label="Premier Unlinked" />
            <StatusBadge value={account.name_change} label="Name Change Ready" />
          </div>

          {account.skins?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">
                Skins
              </h3>
              <div className="flex flex-wrap gap-2">
                {account.skins.map((skin) => (
                  <span
                    key={skin}
                    className="px-2 py-1 text-xs rounded-md bg-accent/10 border border-accent/20 text-accent"
                  >
                    {skin}
                  </span>
                ))}
              </div>
            </div>
          )}

          {account.agents?.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-2">
                Agents
              </h3>
              <div className="flex flex-wrap gap-2">
                {account.agents.map((agent) => (
                  <span
                    key={agent}
                    className="px-2 py-1 text-xs rounded-md bg-secondary border border-border"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>
          )}

{/* GANTI TOMBOL BUY NOW LAMA DENGAN INI */}
{account.status === "sold" ? (
  <div className="mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-heading font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed">
    <XCircle size={16} /> Account Sold Out
  </div>
) : (
  <a
    href={`https://wa.me/6282302450239?text=Hi%2C%20saya%20ingin%20membeli%20akun%20${account.code}`}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-heading font-bold text-sm bg-accent text-accent-foreground btn-glow transition-all duration-300 hover:scale-[1.02]"
  >
    <Shield size={16} /> Buy Now <ExternalLink size={14} />
  </a>
)}
        </motion.div>
      </div>
    </div>
  );
};

export default AccountDetail;