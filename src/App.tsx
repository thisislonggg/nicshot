import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import AccountDetail from "./pages/AccountDetail";
import NotFound from "./pages/NotFound";

import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>

          {/* Marketplace Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/account/:id" element={<AccountDetail />} />
          </Route>

          {/* Admin (NO Layout) */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPage />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;