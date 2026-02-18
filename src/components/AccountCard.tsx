import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

export interface AccountCardProps {
  id: string;
  code: string;
  rank: string;
  region: string;
  price: number;
  skinsCount: number;
  imageUrl?: string;
}

const rankColors: Record<string, string> = {
  radiant: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  immortal: "bg-red-500/20 text-red-300 border-red-500/30",
  diamond: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  platinum: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  gold: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
  bronze: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  iron: "bg-stone-500/20 text-stone-300 border-stone-500/30",
};

const AccountCard = ({ id, code, rank, region, price, skinsCount, imageUrl }: AccountCardProps) => {
  const rankKey = rank.toLowerCase().replace(/\s+/g, "");
  const rankClass = rankColors[rankKey] || "bg-muted text-muted-foreground";

  return (
    <Link to={`/account/${id}`} className="block group">
      <div className="glass-card-hover overflow-hidden">
        {/* Image */}
        <div className="relative h-40 bg-secondary overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={code} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading text-lg">
              {code}
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${rankClass}`}>
              {rank}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-background/60 backdrop-blur-sm text-foreground border border-border/50">
              {region}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-heading text-sm font-semibold text-foreground truncate">{code}</h3>
          <p className="text-xs text-muted-foreground mt-1">{skinsCount} Skins</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-heading text-lg font-bold gradient-text">
              IDR {price.toLocaleString()}
            </span>
            <span className="flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye size={14} /> View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;
