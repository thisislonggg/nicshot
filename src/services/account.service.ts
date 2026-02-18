import { supabase } from "@/lib/supabase";

/* ============================= */
/*            TYPES              */
/* ============================= */

export interface Account {
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
  status: string;
  is_featured: boolean;
  created_at: string;
}

export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "skins_desc";

export interface AccountFilters {
  search?: string;
  ranks?: string[];
  region?: string;
  sortBy?: SortOption;
  page?: number;
  limit?: number;
}

/* ============================= */
/*        BASE QUERIES           */
/* ============================= */

export async function fetchAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchFeaturedAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw error;
  return data ?? [];
}

export async function fetchAccountByCode(code: string): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("code", code)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAccountById(id: string): Promise<Account> {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

/* ============================= */
/*   ADVANCED FILTER + PAGING    */
/* ============================= */

export async function fetchAccountsWithFilters(
  filters: AccountFilters
): Promise<{ data: Account[]; count: number }> {
  const {
    search,
    ranks,
    region,
    sortBy = "newest",
    page = 1,
    limit = 12,
  } = filters;

  let query = supabase
    .from("accounts")
    .select("*", { count: "exact" })
    .eq("status", "available");

  /* ---------- SEARCH ---------- */
  if (search) {
    query = query.or(
      `code.ilike.%${search}%,skins.cs.{${search}}`
    );
  }

  /* ---------- RANK FILTER ---------- */
  if (ranks && ranks.length > 0) {
    query = query.in("rank", ranks);
  }

  /* ---------- REGION FILTER ---------- */
  if (region) {
    query = query.eq("region", region);
  }

  /* ---------- SORTING ---------- */
  switch (sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "skins_desc":
      query = query.order("skins_count", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  /* ---------- PAGINATION ---------- */
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
}