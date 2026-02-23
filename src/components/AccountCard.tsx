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
  status?: string; // TAMBAHAN PROPERTI STATUS
}

const AccountCard = ({ id, code, rank, region, price, skinsCount, imageUrl, status }: AccountCardProps) => {
  const isSold = status === "sold";

  return (
    <Link to={`/account/${id}`} className={`block group ${isSold ? "pointer-events-none" : ""}`}>
      {/* Jika Sold, kita buat kartunya sedikit transparan (opacity-70) dan grayscale */}
      <div className={`glass-card-hover overflow-hidden rounded-xl border transition-all duration-300 bg-[#0A101E] relative ${
        isSold ? "border-red-500/20 opacity-80 grayscale-[0.4]" : "border-border/50 hover:border-accent"
      }`}>
        
        {/* VIBE GAME: OVERLAY SOLD OUT */}
        {isSold && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg rotate-[-15deg] font-heading font-black text-2xl tracking-widest shadow-[0_0_20px_rgba(239,68,68,0.4)] bg-[#0A101E]/80 backdrop-blur-md">
              SOLD OUT
            </div>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-48 bg-secondary overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={code} 
              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${!isSold && "group-hover:scale-105"}`} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-heading text-lg bg-[#0F172A]">
              {code}
            </div>
          )}

          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 shadow-lg flex items-center">
            <RankBadge rank={rank} showText={true} iconSize="sm" className="text-[11px]" />
          </div>

          <div className="absolute top-3 right-3 bg-accent/90 text-white backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest shadow-lg">
            {region}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-heading text-lg font-bold truncate drop-shadow-sm ${isSold ? "text-gray-400" : "text-foreground"}`}>
              {code}
            </h3>
            <span className="text-xs font-semibold text-muted-foreground bg-white/5 border border-white/5 px-2 py-1 rounded-md">
              {skinsCount} Skins
            </span>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className={`font-heading text-lg font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.3)] ${isSold ? "text-gray-500 line-through" : "text-[#3B82F6]"}`}>
              IDR {price.toLocaleString("id-ID")}
            </span>
            
            {!isSold && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <Eye size={16} /> View
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AccountCard;