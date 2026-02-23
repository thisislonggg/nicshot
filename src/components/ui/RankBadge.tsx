import React, { useEffect, useState } from "react";

export interface RankBadgeProps {
  rank: string;
  showText?: boolean;
  iconSize?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Index tier tertinggi untuk masing-masing rank di API Valorant
const rankTierIndices: Record<string, number> = {
  Radiant: 27,
  Immortal: 26,
  Ascendant: 23,
  Diamond: 20,
  Platinum: 17,
  Gold: 14,
  Silver: 11,
  Bronze: 8,
  Iron: 5,
  Unranked: 0,
};

// Efek teks berwarna dan bercahaya sesuai rank
const rankColors: Record<string, string> = {
  Radiant: "text-[#fff2a6] drop-shadow-[0_0_8px_rgba(255,242,166,0.6)]",
  Immortal: "text-[#ff3e55] drop-shadow-[0_0_8px_rgba(255,62,85,0.6)]",
  Ascendant: "text-[#21b777] drop-shadow-[0_0_8px_rgba(33,183,119,0.6)]",
  Diamond: "text-[#b489c4] drop-shadow-[0_0_8px_rgba(180,137,196,0.6)]",
  Platinum: "text-[#3aa4af] drop-shadow-[0_0_8px_rgba(58,164,175,0.6)]",
  Gold: "text-[#e9c762] drop-shadow-[0_0_8px_rgba(233,199,98,0.6)]",
  Silver: "text-[#b2b2b2] drop-shadow-[0_0_8px_rgba(178,178,178,0.6)]",
  Bronze: "text-[#956a42] drop-shadow-[0_0_8px_rgba(149,106,66,0.6)]",
  Iron: "text-[#5a5a5a] drop-shadow-[0_0_8px_rgba(90,90,90,0.6)]",
  Unranked: "text-gray-400",
};

// Singleton Promise: Memastikan API hanya di-hit 1 kali berapapun komponen ini dirender
let latestUuidPromise: Promise<string> | null = null;

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  showText = true,
  iconSize = "md",
  className = "",
}) => {
  const [uuid, setUuid] = useState<string | null>(null);

  // Parsing rank (Misal format "Diamond 3", kita ambil "Diamond"-nya saja)
  const baseRank = rank.split(" ")[0];
  const tierIndex = rankTierIndices[baseRank] ?? 0;
  const colorClass = rankColors[baseRank] || rankColors["Unranked"];

  useEffect(() => {
    // Jika promise belum ada, jalankan fetch ke API Valorant
    if (!latestUuidPromise) {
      latestUuidPromise = fetch("https://valorant-api.com/v1/competitivetiers")
        .then((res) => res.json())
        .then((data) => {
          // Ambil UUID dari array data paling terakhir (Season/Episode yang paling update)
          return data.data[data.data.length - 1].uuid;
        })
        .catch((err) => {
          console.error("Gagal mengambil UUID Valorant API:", err);
          return "03621f52-3424-cedf-24ce-ba9f-652614a9"; // UUID cadangan
        });
    }

    // Tunggu sampai promise selesai, lalu simpan ke state
    latestUuidPromise.then((latestUuid) => {
      setUuid(latestUuid);
    });
  }, []);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  // Tampilkan efek loading berputar (Skeleton) jika gambar belum siap
  if (!uuid) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`animate-pulse bg-white/10 rounded-full ${sizeClasses[iconSize]}`} />
      </div>
    );
  }

  // CATATAN: Rank Unranked (0) tidak punya versi 'largeicon', jadi kita pakai 'icon' standar
  const imageType = tierIndex === 0 ? "icon.png" : "largeicon.png";
  const iconUrl = `https://media.valorant-api.com/competitivetiers/${uuid}/${tierIndex}/${imageType}`;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={iconUrl}
        alt={`${baseRank} Rank`}
        className={`${sizeClasses[iconSize]} drop-shadow-xl object-contain`}
        onError={(e) => {
          // Jika masih gagal render, sembunyikan gambar agar UI tidak rusak
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
      {showText && (
        <span className={`font-heading font-bold tracking-widest uppercase ${colorClass}`}>
          {rank}
        </span>
      )}
    </div>
  );
};