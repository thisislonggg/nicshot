import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import AccountCard from "@/components/AccountCard";
import { fetchAccounts } from "../services/account.service";
import { RankBadge } from "@/components/ui/RankBadge";

interface Account {
  id: string;
  code: string;
  rank: string;
  region: string;
  skins_count: number;
  price: number;
  status: string;
  image_url: string | null;
  skins: string[];
}

const ranks = ["Radiant", "Immortal", "Ascendant", "Diamond", "Platinum", "Gold", "Silver", "Bronze", "Iron"];
const regions = ["AP", "NA", "EU", "KR", "BR", "LATAM"];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "skins_desc", label: "Most Skins" },
];

const Marketplace = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  
  // Mobile Filter Toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAccounts();
        setAccounts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...accounts];

    // 1. Search Code / Skin
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.code.toLowerCase().includes(s) ||
          a.skins?.some((sk) => sk.toLowerCase().includes(s))
      );
    }

    // 2. Rank Filter
    if (selectedRanks.length) {
      result = result.filter((a) => {
        const baseRank = a.rank.split(" ")[0]; // "Diamond 3" -> "Diamond"
        return selectedRanks.includes(baseRank);
      });
    }

    // 3. Region Filter
    if (selectedRegion) {
      result = result.filter((a) => a.region === selectedRegion);
    }

    // 4. Price Filter
    if (minPrice) result = result.filter((a) => a.price >= Number(minPrice));
    if (maxPrice) result = result.filter((a) => a.price <= Number(maxPrice));

    // 5. Sorting
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "skins_desc":
        result.sort((a, b) => b.skins_count - a.skins_count);
        break;
      case "newest":
      default:
        // Already sorted by newest from DB
        break;
    }

    return result;
  }, [accounts, search, selectedRanks, selectedRegion, minPrice, maxPrice, sortBy]);

  const toggleRank = (rank: string) => {
    setSelectedRanks((prev) =>
      prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank]
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedRanks([]);
    setSelectedRegion("");
    setMinPrice("");
    setMaxPrice("");
  };

  const activeFilterCount = selectedRanks.length + (selectedRegion ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  return (
    <div className="section-container py-10">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Marketplace
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Find your dream Valorant account. 100% Safe & Secure.
          </p>
        </motion.div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-[#1E293B] border border-border rounded-xl font-bold text-sm text-white"
        >
          <SlidersHorizontal size={16} />
          {showMobileFilters ? "Hide Filters" : `Show Filters ${activeFilterCount > 0 ? `(${activeFilterCount})` : ""}`}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ================= SIDEBAR FILTER ================= */}
        <AnimatePresence>
          {(showMobileFilters || typeof window !== "undefined" && window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full lg:w-[300px] shrink-0 glass-card p-5 lg:sticky lg:top-24 rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-accent" /> Filters
                </h2>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Search Input */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Search Skin / Code</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="e.g. Kuronomi, JNV..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 rounded-lg bg-[#0A101E] border border-border text-sm focus:border-accent outline-none transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Price Range */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Price Range (IDR)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A101E] border border-border text-sm focus:border-accent outline-none"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A101E] border border-border text-sm focus:border-accent outline-none"
                  />
                </div>
              </div>

              {/* 3. Rank Filter (Using RankBadge) */}
              <div className="mb-6">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Rank</label>
                <div className="flex flex-col gap-2">
                  {ranks.map((r) => {
                    const isSelected = selectedRanks.includes(r);
                    return (
                      <button
                        key={r}
                        onClick={() => toggleRank(r)}
                        className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                          isSelected 
                            ? "bg-accent/10 border-accent text-white" 
                            : "bg-[#0A101E] border-border hover:border-white/20 text-gray-400"
                        }`}
                      >
                        <RankBadge rank={r} showText={true} iconSize="sm" className="text-sm" />
                        {isSelected && <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Region Filter */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Region</label>
                <div className="grid grid-cols-3 gap-2">
                  {regions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRegion(selectedRegion === r ? "" : r)}
                      className={`py-2 rounded-md text-xs font-bold border transition-all ${
                        selectedRegion === r
                          ? "bg-accent/20 border-accent text-white"
                          : "bg-[#0A101E] border-border text-muted-foreground hover:border-white/20"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ================= MAIN CONTENT (GRID) ================= */}
        <main className="flex-1 w-full">
          {/* Toolbar Paling Atas Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-card/40 p-3 rounded-xl border border-white/5">
            <p className="text-sm text-muted-foreground font-medium pl-2">
              Showing <span className="text-white font-bold">{filtered.length}</span> accounts
            </p>
            
            <div className="relative min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-lg bg-[#0F172A] border border-border text-sm font-medium text-white focus:border-accent outline-none cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Loading & Error States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              Loading premium accounts...
            </div>
          )}

          {error && (
            <div className="text-center py-20 text-destructive bg-destructive/10 rounded-xl border border-destructive/20">
              <p className="font-bold">Error fetching data</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Grid Cards */}
          {!loading && !error && (
            <>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filtered.map((acc, i) => (
                    <motion.div
                      key={acc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
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
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex flex-col items-center justify-center py-32 text-center glass-card border-dashed border-2 border-white/10"
                >
                  <Search size={48} className="text-muted-foreground/30 mb-4" />
                  <p className="text-white font-heading text-xl font-bold mb-2">No accounts found</p>
                  <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    We couldn't find any account matching your current filters. Try adjusting the price or rank.
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2 bg-[#1E293B] hover:bg-accent text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Marketplace;