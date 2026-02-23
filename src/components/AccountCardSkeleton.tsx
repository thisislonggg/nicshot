import { Skeleton } from "@/components/ui/skeleton";

const AccountCardSkeleton = () => {
  return (
    <div className="glass-card overflow-hidden rounded-xl border border-border/50 bg-[#0A101E]">
      {/* Image Skeleton (Kotak atas) */}
      <Skeleton className="h-48 w-full rounded-none bg-white/5" />

      {/* Info Section Skeleton (Bawah) */}
      <div className="p-5 space-y-4">
        {/* Judul & Badge */}
        <div className="flex justify-between items-start">
          <Skeleton className="h-7 w-24 bg-white/10" />
          <Skeleton className="h-6 w-16 bg-white/5 rounded-md" />
        </div>
        
        {/* Harga & Tombol */}
        <div className="flex justify-between items-center mt-4">
          <Skeleton className="h-6 w-32 bg-white/10" />
          <Skeleton className="h-5 w-16 bg-white/5" />
        </div>
      </div>
    </div>
  );
};

export default AccountCardSkeleton;