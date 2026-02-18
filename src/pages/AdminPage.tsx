import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogOut, PlusCircle } from "lucide-react";

const ranks = [
  "Radiant",
  "Immortal",
  "Diamond",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Iron",
];

const regions = ["AP", "NA", "EU", "KR", "BR", "LATAM"];

const AdminPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    rank: "",
    region: "",
    skins_count: 0,
    price: 0,
    description: "",
    skins: "",
    agents: "",
    is_featured: false,
    email_verified: false,
    premier_unlinked: false,
    name_change: false,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate("/admin-login");
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

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

    const { error } = await supabase.storage
      .from("account-images")
      .upload(fileName, imageFile);

    if (error) throw error;

    const { data } = supabase.storage
      .from("account-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const imageUrl = await uploadImage();

      const { error } = await supabase.from("accounts").insert([
        {
          ...form,
          skins: form.skins.split(",").map((s) => s.trim()).filter(Boolean),
          agents: form.agents.split(",").map((a) => a.trim()).filter(Boolean),
          image_url: imageUrl,
          status: "available",
        },
      ]);

      if (error) throw error;

      alert("Account added successfully");

      setForm({
        code: "",
        rank: "",
        region: "",
        skins_count: 0,
        price: 0,
        description: "",
        skins: "",
        agents: "",
        is_featured: false,
        email_verified: false,
        premier_unlinked: false,
        name_change: false,
      });

      setImageFile(null);
      setImagePreview(null);

    } catch (err: any) {
      alert(err.message);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="section-container py-6 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-border"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="section-container py-10 max-w-4xl">
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-8">
            <PlusCircle className="text-accent" size={24} />
            <h2 className="font-heading text-xl font-semibold">
              Add New Account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Account Image
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  className="w-48 h-28 object-cover rounded-lg border mb-3"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageChange(e.target.files[0])
                }
                className="text-sm"
              />
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <p>Code:
                <input
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                  className="input-style"
                  required
                />
              </p>

              <p>Rank:
                <select
                  value={form.rank}
                  onChange={(e) =>
                    setForm({ ...form, rank: e.target.value })
                  }
                  className="input-style"
                  required
                >
                  <option value="">Select Rank</option>
                  {ranks.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </p>

              <p>Region:
                <select
                  value={form.region}
                  onChange={(e) =>
                    setForm({ ...form, region: e.target.value })
                  }
                  className="input-style"
                  required
                >
                  <option value="">Select Region</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </p>

              <p>Total Skin:
                <input
                  type="number"
                  value={form.skins_count}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      skins_count: Number(e.target.value),
                    })
                  }
                  className="input-style"
                />
              </p>

              <p>Harga:
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  className="input-style"
                  required
                />
              </p>
            </div>

            <p>Description:
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input-style h-28 resize-none"
              />
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p>List Skin:
                <textarea
                  value={form.skins}
                  onChange={(e) =>
                    setForm({ ...form, skins: e.target.value })
                  }
                  className="input-style h-24 resize-none"
                />
              </p>

              <p>List Agent:
                <textarea
                  value={form.agents}
                  onChange={(e) =>
                    setForm({ ...form, agents: e.target.value })
                  }
                  className="input-style h-24 resize-none"
                />
              </p>
            </div>

            {/* STATUS CHECKLIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.email_verified}
                  onChange={(e) =>
                    setForm({ ...form, email_verified: e.target.checked })
                  }
                />
                Email Verified
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.premier_unlinked}
                  onChange={(e) =>
                    setForm({ ...form, premier_unlinked: e.target.checked })
                  }
                />
                Premier Unlinked
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.name_change}
                  onChange={(e) =>
                    setForm({ ...form, name_change: e.target.checked })
                  }
                />
                Name Change Ready
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({ ...form, is_featured: e.target.checked })
                }
              />
              <span className="text-sm text-muted-foreground">
                Mark as Featured Account
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-lg font-heading font-bold text-sm bg-accent text-accent-foreground btn-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
            >
              {submitting ? "Adding Account..." : "Add Account"}
            </button>

          </form>
        </div>
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