import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="section-container py-20 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={login}
        className="w-full py-3 bg-accent text-white rounded"
      >
        Login
      </button>
    </div>
  );
};

export default AdminLogin;