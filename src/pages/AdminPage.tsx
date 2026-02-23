import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle, Trash2, Edit, RefreshCw, Wallet, Package, Gamepad2, Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Account,
  fetchAllAdminAccounts,
  deleteAccount,
  updateAccountStatus,
} from "@/services/account.service";

const ranks = [
  "Radiant", "Immortal", "Ascendant", "Diamond", "Platinum", "Gold", "Silver", "Bronze", "Iron",
];
const regions = ["AP", "NA", "EU", "KR", "BR", "LATAM"];

const allAgents = [
  "Astra", "Breach", "Brimstone", "Chamber", "Clove", "Cypher", "Deadlock",
  "Fade", "Gekko", "Harbor", "Iso", "Jett", "KAY/O", "Killjoy", "Neon",
  "Omen", "Phoenix", "Raze", "Reyna", "Sage", "Skye", "Sova", "Tejo",
  "Veto", "Viper", "Vyse", "Waylay", "Yoru"
];

const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");

  // State Manage Accounts
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fetchingAccounts, setFetchingAccounts] = useState(false);

  // State Add/Edit Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- AGENT STATE ---
  const [agentMode, setAgentMode] = useState<"full" | "missing" | "manual">("full");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [missingAgents, setMissingAgents] = useState<string[]>([]);

  // --- SKIN STATE (BARU) ---
  const [availableSkins, setAvailableSkins] = useState<string[]>([]);
  const [selectedSkins, setSelectedSkins] = useState<string[]>([]);
  const [skinSearch, setSkinSearch] = useState("");
  const [showSkinDropdown, setShowSkinDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initialForm = {
    code: "",
    rank: "",
    region: "",
    skins_count: 0,
    price: 0,
    description: "",
    is_featured: false,
    email_verified: false,
    premier_unlinked: false,
    name_change: false,
  };

  const [form, setForm] = useState(initialForm);

  // Load Auth & Accounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/admin-login");
        return;
      }
      setLoading(false);
      loadAccounts();
    };
    checkAuth();
  }, [navigate]);

  // Load Daftar Nama Skin dari Valorant API (Satu kali saat masuk halaman Admin)
  useEffect(() => {
    fetch("https://valorant-api.com/v1/weapons/skins")
      .then((res) => res.json())
      .then((data) => {
        // Ambil nama skin, hapus yang bertuliskan "Standard" atau "Random"
        const skins = data.data
          .map((s: any) => s.displayName)
          .filter((name: string) => !name.toLowerCase().includes("standard") && !name.toLowerCase().includes("random"));
        
        // Buang nama yang duplikat (menggunakan Set)
        const uniqueSkins = Array.from(new Set(skins)) as string[];
        setAvailableSkins(uniqueSkins);
      })
      .catch((err) => console.error("Gagal memuat daftar skin:", err));
  }, []);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSkinDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadAccounts = async () => {
    setFetchingAccounts(true);
    try {
      const data = await fetchAllAdminAccounts();
      setAccounts(data);
    } catch (err: any) {
      alert("Failed to load accounts: " + err.message);
    } finally {
      setFetchingAccounts(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-login");
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("account-images").upload(fileName, imageFile);
    if (error) throw error;
    const { data } = supabase.storage.from("account-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const toggleAgent = (agent: string, currentList: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentList.includes(agent)) {
      setList(currentList.filter((a) => a !== agent));
    } else {
      setList([...currentList, agent]);
    }
  };

  const toggleSkin = (skin: string) => {
    if (selectedSkins.includes(skin)) {
      setSelectedSkins(selectedSkins.filter((s) => s !== skin));
    } else {
      setSelectedSkins([...selectedSkins, skin]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = imagePreview; 
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      let finalAgentsArray: string[] = [];
      if (agentMode === "full") {
        finalAgentsArray = ["All Unlocked"];
      } else if (agentMode === "missing") {
        finalAgentsArray = [`All Unlocked - ${missingAgents.join(", ")}`];
      } else {
        finalAgentsArray = selectedAgents;
      }

      const payload = {
        ...form,
        skins: selectedSkins, // <- Sekarang langsung mengirim array dari state
        agents: finalAgentsArray,
        image_url: imageUrl,
      };

      if (editingId) {
        // UPDATE
        const { error } = await supabase.from("accounts").update(payload).eq("id", editingId);
        if (error) throw error;
        alert("Account updated successfully");
      } else {
        // INSERT
        const { error } = await supabase.from("accounts").insert([{ ...payload, status: "available" }]);
        if (error) throw error;
        alert("Account added successfully");
      }

      resetForm();
      loadAccounts();
      setActiveTab("manage");
    } catch (err: any) {
      alert(err.message);
    }

    setSubmitting(false);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setAgentMode("full");
    setSelectedAgents([]);
    setMissingAgents([]);
    setSelectedSkins([]); // Reset skins
    setSkinSearch("");
  };

  const handleEdit = (acc: Account) => {
    setForm({
      code: acc.code,
      rank: acc.rank,
      region: acc.region,
      skins_count: acc.skins_count,
      price: acc.price,
      description: acc.description || "",
      is_featured: acc.is_featured,
      email_verified: acc.email_verified,
      premier_unlinked: acc.premier_unlinked,
      name_change: acc.name_change,
    });
    setEditingId(acc.id);
    setImagePreview(acc.image_url);
    setSelectedSkins(acc.skins || []); // Load skin yang sudah ada

    if (acc.agents && acc.agents.length === 1 && acc.agents[0] === "All Unlocked") {
      setAgentMode("full");
      setMissingAgents([]);
      setSelectedAgents([]);
    } else if (acc.agents && acc.agents.length === 1 && acc.agents[0].startsWith("All Unlocked - ")) {
      setAgentMode("missing");
      const missing = acc.agents[0].replace("All Unlocked - ", "").split(", ");
      setMissingAgents(missing);
      setSelectedAgents([]);
    } else {
      setAgentMode("manual");
      setSelectedAgents(acc.agents || []);
      setMissingAgents([]);
    }

    setActiveTab("add");
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Are you sure you want to delete account ${code}?`)) return;
    try {
      await deleteAccount(id);
      alert("Account deleted.");
      loadAccounts();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "available" ? "sold" : "available";
    try {
      await updateAccountStatus(id, newStatus);
      loadAccounts();
    } catch (err: any) {
      alert("Update status failed: " + err.message);
    }
  };

  const totalAccounts = accounts.length;
  const stockAvailable = accounts.filter((acc) => acc.status === "available").length;
  const totalRevenue = accounts
    .filter((acc) => acc.status === "sold")
    .reduce((sum, acc) => sum + acc.price, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  // Filter skin untuk dropdown pencarian
  const filteredSkins = availableSkins.filter(skin => 
    skin.toLowerCase().includes(skinSearch.toLowerCase()) && !selectedSkins.includes(skin)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="section-container py-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="section-container py-10 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="manage">Manage Accounts</TabsTrigger>
            <TabsTrigger value="add">
              {editingId ? "Edit Account" : "Add New Account"}
            </TabsTrigger>
          </TabsList>

          {/* ================================================= */}
          {/* MANAGE TAB                                        */}
          {/* ================================================= */}
          <TabsContent value="manage">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 border-l-4 border-l-blue-500 bg-[#0A101E]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Total Accounts</h3>
                    <p className="text-3xl font-heading font-bold text-white mt-2">{totalAccounts}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Gamepad2 size={24} /></div>
                </div>
              </div>

              <div className="glass-card p-6 border-l-4 border-l-green-500 bg-[#0A101E]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Stock Available</h3>
                    <p className="text-3xl font-heading font-bold text-white mt-2">{stockAvailable}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><Package size={24} /></div>
                </div>
              </div>

              <div className="glass-card p-6 border-l-4 border-l-accent bg-[#0A101E]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Gross Revenue</h3>
                    <p className="text-2xl lg:text-3xl font-heading font-bold text-[#3B82F6] mt-2 truncate" title={`IDR ${totalRevenue.toLocaleString("id-ID")}`}>
                      Rp {totalRevenue > 1000000 ? `${(totalRevenue / 1000000).toFixed(1)}M` : totalRevenue.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg text-accent"><Wallet size={24} /></div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl font-semibold">Account Database</h2>
                <button onClick={loadAccounts} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                  <RefreshCw size={14} className={fetchingAccounts ? "animate-spin" : ""} /> Refresh
                </button>
              </div>

              <div className="rounded-md border border-border overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Code</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Price (IDR)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fetchingAccounts ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading accounts...</TableCell></TableRow>
                    ) : accounts.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No accounts found.</TableCell></TableRow>
                    ) : (
                      accounts.map((acc) => (
                        <TableRow key={acc.id}>
                          <TableCell className="font-medium text-white">{acc.code}</TableCell>
                          <TableCell className="text-muted-foreground">{acc.rank}</TableCell>
                          <TableCell className="font-semibold text-accent">{acc.price.toLocaleString("id-ID")}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleToggleStatus(acc.id, acc.status)}
                              className={`px-3 py-1 text-[10px] rounded-full font-bold tracking-wider transition-colors ${
                                acc.status === "available" ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                              }`}
                            >
                              {acc.status.toUpperCase()}
                            </button>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <button onClick={() => handleEdit(acc)} className="inline-flex p-2 rounded bg-[#1E293B] text-blue-400 hover:bg-blue-500/20 transition-colors"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(acc.id, acc.code)} className="inline-flex p-2 rounded bg-[#1E293B] text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ================================================= */}
          {/* ADD / EDIT TAB                                    */}
          {/* ================================================= */}
          <TabsContent value="add">
            <div className="glass-card p-8 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  {editingId ? <Edit className="text-accent" size={24} /> : <PlusCircle className="text-accent" size={24} />}
                  <h2 className="font-heading text-xl font-semibold">
                    {editingId ? `Edit Account: ${form.code}` : "Add New Account"}
                  </h2>
                </div>
                {editingId && (
                  <button onClick={resetForm} className="text-sm text-red-400 hover:underline">Cancel Edit</button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Account Image</label>
                  {imagePreview && <img src={imagePreview} className="w-48 h-28 object-cover rounded-lg border border-border mb-3" alt="Preview" />}
                  <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageChange(e.target.files[0])} className="text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <p>Code: <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="input-style mt-1" required disabled={!!editingId} /></p>
                  <p>Rank: 
                    <select value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} className="input-style mt-1" required>
                      <option value="">Select Rank</option>
                      {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </p>
                  <p>Region: 
                    <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="input-style mt-1" required>
                      <option value="">Select Region</option>
                      {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </p>
                  <p>Total Skin: <input type="number" value={form.skins_count} onChange={(e) => setForm({ ...form, skins_count: Number(e.target.value) })} className="input-style mt-1" /></p>
                  <p className="md:col-span-2">Harga: <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-style mt-1" required /></p>
                </div>

                <p>Description: <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-style h-24 resize-none mt-1" /></p>

                {/* AREA MANAJEMEN SKIN (BARU) */}
                <div className="space-y-4 p-5 rounded-xl border border-border bg-[#0A101E]/50" ref={dropdownRef}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Skins Management</h3>
                    <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">
                      {selectedSkins.length} Selected
                    </span>
                  </div>

                  {/* Badges Skin yang Terpilih */}
                  {selectedSkins.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-3 bg-black/20 rounded-lg border border-white/5">
                      {selectedSkins.map((skin) => (
                        <span key={skin} className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-accent/20 border border-accent/30 text-accent">
                          {skin}
                          <button type="button" onClick={() => toggleSkin(skin)} className="hover:text-white transition-colors">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Input Search Dropdown */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Cari & tambah nama skin (misal: Kuronomi, Reaver...)"
                      value={skinSearch}
                      onChange={(e) => {
                        setSkinSearch(e.target.value);
                        setShowSkinDropdown(true);
                      }}
                      onFocus={() => setShowSkinDropdown(true)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm outline-none focus:border-accent transition-colors"
                    />
                    
                    {/* Dropdown Box */}
                    {showSkinDropdown && skinSearch && (
                      <div className="absolute z-10 w-full mt-2 max-h-56 overflow-y-auto bg-[#0F172A] border border-border rounded-xl shadow-2xl custom-scrollbar py-2">
                        {filteredSkins.length > 0 ? (
                          filteredSkins.slice(0, 30).map((skin) => (
                            <div
                              key={skin}
                              onClick={() => {
                                toggleSkin(skin);
                                setSkinSearch(""); // Bersihkan pencarian setelah klik
                                // Biarkan dropdown tetap ada sebentar jika user ingin tambah lagi
                              }}
                              className="px-4 py-2.5 text-sm text-gray-300 hover:bg-accent hover:text-white cursor-pointer transition-colors"
                            >
                              {skin}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                            Tidak ada skin yang cocok. <br/> (Ejaan harus benar)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* AREA AGENT KHUSUS */}
                <div className="space-y-4 p-5 rounded-xl border border-border bg-[#0A101E]/50">
                  <h3 className="font-semibold text-sm">Agents Management</h3>
                  <select value={agentMode} onChange={(e) => setAgentMode(e.target.value as any)} className="input-style">
                    <option value="full">All Agents Unlocked</option>
                    <option value="missing">Missing Few Agents (Pilih yang BELUM punya)</option>
                    <option value="manual">Select Manually (Pilih yang SUDAH punya)</option>
                  </select>

                  {agentMode === "missing" && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">Klik agent yang <b>TIDAK ADA</b>:</p>
                      <div className="flex flex-wrap gap-2">
                        {allAgents.map((agent) => (
                          <button type="button" key={agent} onClick={() => toggleAgent(agent, missingAgents, setMissingAgents)} className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${missingAgents.includes(agent) ? "bg-red-500/20 border-red-500 text-red-400" : "bg-transparent border-border text-muted-foreground hover:border-white/20"}`}>
                            {agent}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {agentMode === "manual" && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-3">Klik agent yang <b>SUDAH TERBUKA</b>:</p>
                      <div className="flex flex-wrap gap-2">
                        {allAgents.map((agent) => (
                          <button type="button" key={agent} onClick={() => toggleAgent(agent, selectedAgents, setSelectedAgents)} className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${selectedAgents.includes(agent) ? "bg-accent/20 border-accent text-accent" : "bg-transparent border-border text-muted-foreground hover:border-white/20"}`}>
                            {agent}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.email_verified} onChange={(e) => setForm({ ...form, email_verified: e.target.checked })} className="w-4 h-4 rounded" /> Email Verified
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.premier_unlinked} onChange={(e) => setForm({ ...form, premier_unlinked: e.target.checked })} className="w-4 h-4 rounded" /> Premier Unlinked
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.name_change} onChange={(e) => setForm({ ...form, name_change: e.target.checked })} className="w-4 h-4 rounded" /> Name Change Ready
                  </label>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium">Mark as Featured Account (Show on Homepage)</span>
                </div>

                <button type="submit" disabled={submitting} className="w-full py-4 rounded-lg font-heading font-bold text-sm bg-accent text-accent-foreground btn-glow transition-all hover:scale-[1.02] disabled:opacity-50 mt-4">
                  {submitting ? "Saving Account..." : editingId ? "Update Account" : "Add Account"}
                </button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <style>{`
        .input-style {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--card));
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-style:focus {
          border-color: hsl(var(--accent));
          box-shadow: 0 0 0 2px hsl(var(--accent) / 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminPage;