import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useCallback } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import Layout from "./components/Layout";
import Marketplace from "./pages/Marketplace";
import AccountDetail from "./pages/AccountDetail";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        <BrowserRouter>
          <Routes>
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
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
