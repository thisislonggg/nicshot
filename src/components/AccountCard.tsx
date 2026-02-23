import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { RankBadge } from "@/components/ui/RankBadge";

export interface AccountCardProps {
  id: string;
  code: string;
  rank: string;
  region: string;
  price: number;
  skinsCount: number;
  imageUrl?: string;
}

const AccountCard = ({ id, code, rank, region, price, skinsCount, imageUrl }: AccountCardProps) => {
  return (
    <Link to={`/account/${id}`} className="block group">
      <div className="glass-card-hover overflow-hidden rounded-xl border border-border/50 hover:border-accent transition-all duration-300 bg-[#0A101E]">
        {/* Image Section */}
        <div className="relative h-48 bg-secondary overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={code} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading text-lg bg-[#0F172A]">
              {code}
            </div>
          )}

          {/* VIBE GAME: Rank Icon Badge (Kiri Atas) */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg flex items-center">
            <RankBadge 
              rank={rank} 
              showText={true} 
              iconSize="sm" 
              className="text-[11px]" // Mengecilkan sedikit ukuran teks agar pas di dalam kartu
            />
          </div>

          {/* VIBE GAME: Region Badge (Kanan Atas) */}
          <div className="absolute top-3 right-3 bg-accent/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg">
            {region}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-heading text-lg font-bold text-foreground truncate drop-shadow-sm">
              {code}
            </h3>
            <span className="text-xs font-semibold text-muted-foreground bg-white/5 border border-white/5 px-2 py-1 rounded-md">
              {skinsCount} Skins
            </span>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="font-heading text-lg font-bold text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]">
              IDR {price.toLocaleString("id-ID")}
            </span>
            
            {/* Animasi View: Muncul dan geser dari kanan saat di-hover */}
            <span className="flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <Eye size={16} /> View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;