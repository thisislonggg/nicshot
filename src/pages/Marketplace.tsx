import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import AccountCard from "@/components/AccountCard";
import { mockAccounts } from "@/data/mockAccounts";

const ranks = ["Radiant", "Immortal", "Diamond", "Platinum", "Gold", "Silver", "Bronze", "Iron"];
const regions = ["AP", "NA", "EU", "KR", "BR", "LATAM"];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "skins_desc", label: "Most Skins" },
];

const Marketplace = () => {
  const [search, setSearch] = useState("");
  const [selectedRanks, setSelectedRanks] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = mockAccounts.filter((a) => a.status === "available");

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.code.toLowerCase().includes(s) ||
          a.skins.some((sk) => sk.toLowerCase().includes(s))
      );
    }
    if (selectedRanks.length) {
      result = result.filter((a) => selectedRanks.includes(a.rank));
    }
    if (selectedRegion) {
      result = result.filter((a) => a.region === selectedRegion);
    }

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
    }

    return result;
  }, [search, selectedRanks, selectedRegion, sortBy]);

  const toggleRank = (rank: string) => {
    setSelectedRanks((prev) =>
      prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank]
    );
  };

  return (
    <div className="section-container py-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8"
      >
        Marketplace
      </motion.h1>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, skins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
            showFilters
              ? "bg-accent/10 border-accent/30 text-accent"
              : "bg-card border-border text-foreground hover:border-accent/30"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value} className="bg-card">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="glass-card p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rank */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 font-heading">Rank</h3>
              <div className="flex flex-wrap gap-2">
                {ranks.map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleRank(r)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      selectedRanks.includes(r)
                        ? "bg-accent/20 border-accent/50 text-accent"
                        : "bg-card border-border text-muted-foreground hover:border-accent/30"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 font-heading">Region</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRegion("")}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    !selectedRegion
                      ? "bg-accent/20 border-accent/50 text-accent"
                      : "bg-card border-border text-muted-foreground hover:border-accent/30"
                  }`}
                >
                  All
                </button>
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                      selectedRegion === r
                        ? "bg-accent/20 border-accent/50 text-accent"
                        : "bg-card border-border text-muted-foreground hover:border-accent/30"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Count */}
      <p className="text-sm text-muted-foreground mb-6">
        {filtered.length} account{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground font-heading text-lg">No accounts found</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
