// Mock data for demo - will be replaced with Supabase later
export interface Account {
  id: number;
  code: string;
  rank: string;
  region: string;
  price: number;
  skins_count: number;
  description: string;
  skins: string[];
  agents: string[];
  battlepass: string[];
  email_verified: boolean;
  premier_unlinked: boolean;
  name_change: boolean;
  status: string;
  image_url?: string;
}

export const mockAccounts: Account[] = [
  {
    id: 1,
    code: "NC-RAD-001",
    rank: "Radiant",
    region: "AP",
    price: 4500000,
    skins_count: 120,
    description: "Full collection Radiant account with premium skins.",
    skins: ["Reaver Vandal", "Prime Phantom", "Glitchpop Classic", "Sovereign Ghost"],
    agents: ["Jett", "Reyna", "Chamber", "Raze", "Omen"],
    battlepass: ["EP1 Act1", "EP2 Act2", "EP3 Act3"],
    email_verified: true,
    premier_unlinked: true,
    name_change: true,
    status: "available",
  },
  {
    id: 2,
    code: "NC-IMM-042",
    rank: "Immortal",
    region: "NA",
    price: 2800000,
    skins_count: 85,
    description: "Immortal 3 peak, stacked inventory.",
    skins: ["Ion Phantom", "Elderflame Vandal", "BlastX Spectre"],
    agents: ["Sage", "Omen", "Killjoy", "Sova"],
    battlepass: ["EP2 Act1", "EP4 Act2"],
    email_verified: true,
    premier_unlinked: false,
    name_change: true,
    status: "available",
  },
  {
    id: 3,
    code: "NC-DIA-088",
    rank: "Diamond",
    region: "EU",
    price: 1200000,
    skins_count: 45,
    description: "Diamond 2 with clean match history.",
    skins: ["Spectrum Phantom", "RGX Vandal"],
    agents: ["Phoenix", "Breach", "Skye"],
    battlepass: ["EP3 Act1"],
    email_verified: true,
    premier_unlinked: true,
    name_change: false,
    status: "available",
  },
  {
    id: 4,
    code: "NC-PLT-105",
    rank: "Platinum",
    region: "AP",
    price: 750000,
    skins_count: 30,
    description: "Platinum 3 account, budget-friendly.",
    skins: ["Oni Phantom", "Ruination Spectre"],
    agents: ["Viper", "Astra", "Brimstone"],
    battlepass: [],
    email_verified: false,
    premier_unlinked: true,
    name_change: true,
    status: "available",
  },
  {
    id: 5,
    code: "NC-GLD-200",
    rank: "Gold",
    region: "KR",
    price: 450000,
    skins_count: 15,
    description: "Gold 3 starter account.",
    skins: ["Forsaken Vandal"],
    agents: ["Yoru", "Neon"],
    battlepass: ["EP5 Act1"],
    email_verified: true,
    premier_unlinked: true,
    name_change: true,
    status: "available",
  },
  {
    id: 6,
    code: "NC-IMM-077",
    rank: "Immortal",
    region: "BR",
    price: 3200000,
    skins_count: 95,
    description: "Immortal 2 with rare skins collection.",
    skins: ["Champions Vandal", "Sentinels of Light Vandal", "Protocol Phantom"],
    agents: ["Jett", "Reyna", "Phoenix", "Raze", "Neon", "Yoru"],
    battlepass: ["EP1 Act2", "EP2 Act3", "EP4 Act1"],
    email_verified: true,
    premier_unlinked: true,
    name_change: true,
    status: "available",
  },
];
