import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { LogIn, User, Lock, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      console.log("DEBUG LOGIN - User Email:", user?.email);
      console.log("DEBUG LOGIN - Profile role fetching:", profile);

      toast.success("Bem-vindo(a) de volta!");
      
      // FORCED BYPASS FOR ADMIN EMAIL
      if (user?.email === 'rauanrocha.martech@gmail.com' || profile?.role === 'admin') {
        console.log("DEBUG LOGIN - Redirecting to ADMIN (Hardcoded or DB)");
        navigate("/admin");
      } else {
        console.log("DEBUG LOGIN - Redirecting to CLIENT");
        navigate("/cliente");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-20">
      <Navbar />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="clay-blob w-96 h-96 -top-20 -left-20 animate-float-slow opacity-40" />
        <div className="clay-blob w-80 h-80 -bottom-20 -right-20 animate-float-medium opacity-30" />
      </div>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card max-w-md w-full p-8 md:p-10 space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-display">Portal de Acesso</h1>
            <p className="text-muted-foreground">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">E-mail</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="clay-input w-full pl-12 h-14"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="clay-input w-full pl-12 h-14"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="clay-btn w-full flex items-center justify-center gap-3 h-14 text-lg"
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> Verificando...</>
              ) : (
                <><LogIn size={20} /> Entrar</>
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={14} /> Voltar para o site
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
