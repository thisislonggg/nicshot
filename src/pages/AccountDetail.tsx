import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAccountById } from "../services/account.service";
import { RankBadge } from "@/components/ui/RankBadge";
import { SEO } from "@/components/SEO";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Home } from "lucide-react";
import { SkinBadge } from "@/components/ui/SkinBadge";

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
          title={`Account Not Found`}
          description="The Valorant account you are looking for does not exist or has been removed."
        />
        <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-medium mt-8">
          <Link to="/" className="flex items-center gap-1.5 hover:text-accent transition-colors">
            <Home size={14} /> Home
          </Link>
          <ChevronRight size={14} className="opacity-50" />
          <Link to="/marketplace" className="hover:text-accent transition-colors">
            Marketplace
          </Link>
        </nav>
      </div>
    );
  }

  return (
    <div className="section-container py-10">
      <SEO 
        title={`Akun ${account.code} - ${account.rank}`}
        description={`Valorant Account ${account.code} | Rank: ${account.rank} | ${account.skins_count} Skins | Full Agents. Beli sekarang seharga IDR ${account.price.toLocaleString("id-ID")} hanya di Nicshot.vault.`}
        image={account.image_url || undefined}
      />

      <nav className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-8">
        <Link to="/" className="flex items-center gap-1.5 hover:text-accent transition-colors">
          <Home size={14} /> Home
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <Link to="/marketplace" className="hover:text-accent transition-colors">
          Marketplace
        </Link>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-foreground">{account.code}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-4 h-fit self-start sticky top-24"
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
          <div className="inline-block px-4 py-2 rounded-lg bg-accent/20 mb-4 border border-accent/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
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
              <span className="font-semibold uppercase">{account.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Skins Count</span>
              <span className="font-semibold">{account.skins_count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-heading text-lg font-bold gradient-text">
                IDR {account.price.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="border-t border-border my-6" />

          {account.description && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                📝 Seller Notes
              </h3>
              <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap shadow-inner">
                {account.description}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-6 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
            <StatusBadge value={account.email_verified} label="Email Verified (No First Email)" />
            <StatusBadge value={account.premier_unlinked} label="Premier Unlinked" />
            <StatusBadge value={account.name_change} label="Name Change Ready" />
          </div>

          {/* SKINS INVENTORY BOX */}
          {account.skins?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  🔫 Premium Skins
                </h3>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                  {account.skins.length} Item
                </span>
              </div>
              
              <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar flex flex-wrap gap-2 content-start bg-black/10 p-3 rounded-xl border border-white/5 shadow-inner">
{account.skins.map((skin) => (
  <SkinBadge key={skin} skinName={skin} />
))}
              </div>
            </div>
          )}

          {/* AGENTS INVENTORY BOX */}
          {account.agents?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  🎭 Unlocked Agents
                </h3>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-md border border-accent/20">
                  {account.agents.length === 1 && account.agents[0].includes("All Unlocked") 
                    ? "All Agents" 
                    : `${account.agents.length} Agent`}
                </span>
              </div>
              
              <div className="max-h-[120px] overflow-y-auto pr-2 custom-scrollbar flex flex-wrap gap-2 content-start bg-black/10 p-3 rounded-xl border border-white/5 shadow-inner">
                {account.agents.map((agent) => (
                  <span
                    key={agent}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-[#1E293B] border border-white/10 text-gray-300 hover:text-white hover:border-accent/50 transition-colors cursor-default"
                  >
                    {agent}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BUY NOW BUTTON */}
          {account.status === "sold" ? (
            <div className="mt-8 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed">
              <XCircle size={18} /> Account Sold Out
            </div>
          ) : (
            <a
              href={`https://wa.me/6282302450239?text=Hi%2C%20saya%20ingin%20membeli%20akun%20${account.code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold text-sm bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
            >
              <Shield size={18} /> Buy Now Securely <ExternalLink size={16} className="ml-1" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AccountDetail;