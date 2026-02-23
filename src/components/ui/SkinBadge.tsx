import React, { useEffect, useState } from "react";

interface SkinBadgeProps {
  skinName: string;
}

// Singleton Promise: Fetch data skin dari API hanya 1x saja untuk performa maksimal
let skinsDataPromise: Promise<any[]> | null = null;

export const SkinBadge: React.FC<SkinBadgeProps> = ({ skinName }) => {
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jalankan fetch hanya jika belum pernah dipanggil sebelumnya
    if (!skinsDataPromise) {
      skinsDataPromise = fetch("https://valorant-api.com/v1/weapons/skins")
        .then((res) => res.json())
        .then((data) => data.data)
        .catch((err) => {
          console.error("Gagal mengambil data skin:", err);
          return [];
        });
    }

    skinsDataPromise.then((skins) => {
      const searchName = skinName.toLowerCase().trim();

      // FUNGSI PENCARI URL GAMBAR (PRIORITAS CHROMAS & LEVELS)
      // Ini memastikan gambar kualitas HD yang diambil, bukan placeholder rusak
      const getSkinImage = (skinObj: any): string | null => {
        if (!skinObj) return null;
        
        // 1. Prioritaskan Chromas (Varian warna standar seringkali ada di sini)
        if (skinObj.chromas && skinObj.chromas.length > 0 && skinObj.chromas[0].displayIcon) {
          return skinObj.chromas[0].displayIcon;
        }
        
        // 2. Prioritaskan Levels (Biasanya untuk Melee/Pisau Premium)
        if (skinObj.levels && skinObj.levels.length > 0 && skinObj.levels[0].displayIcon) {
          return skinObj.levels[0].displayIcon;
        }
        
        // 3. Fallback terakhir ke root displayIcon
        if (skinObj.displayIcon) {
          return skinObj.displayIcon;
        }
        
        return null;
      };

      // 1. Cari nama persis sama DAN yang memiliki gambar
      let foundSkin = skins.find(
        (s: any) => s.displayName.toLowerCase() === searchName && getSkinImage(s) !== null
      );

      // 2. Jika tidak ada, cari nama yang mengandung kata tersebut DAN memiliki gambar
      if (!foundSkin) {
        foundSkin = skins.find(
          (s: any) => s.displayName.toLowerCase().includes(searchName) && getSkinImage(s) !== null
        );
      }

      // 3. Fallback terakhir (jika memang benar-benar tidak ada gambarnya di database Riot)
      if (!foundSkin) {
        foundSkin = skins.find((s: any) => s.displayName.toLowerCase().includes(searchName));
      }

      // Set URL gambar
      setIconUrl(getSkinImage(foundSkin));
      setLoading(false);
    });
  }, [skinName]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0F172A] border border-white/10 hover:border-accent/50 transition-colors group">
      {/* Gambar Senjata */}
      {loading ? (
        <div className="w-12 h-4 bg-white/10 animate-pulse rounded" />
      ) : iconUrl ? (
        <img
          src={iconUrl}
          alt={skinName}
          className="w-12 h-auto max-h-6 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            // Sembunyikan jika link gambar tiba-tiba rusak dari API Riot
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        // Tanda tanya merah jika gambar benar-benar tidak ditemukan di API Riot
        <div className="w-5 h-5 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[10px] text-red-400 font-bold">
          ?
        </div>
      )}

      {/* Teks Nama Skin */}
      <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
        {skinName}
      </span>
    </div>
  );
};