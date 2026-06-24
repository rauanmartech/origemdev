import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Swords,
  Handshake,
} from "lucide-react";
import logo from "../assets/logo.png";
import KitDeGuerra from "./parcerias/KitDeGuerra";
import PropostaParceria from "./parcerias/PropostaParceria";

// ─── Tab Registry ─────────────────────────────────────────────────────────────
// Add future tabs here — no other changes needed in the layout.

const TABS = [
  {
    id: "kit-de-guerra",
    label: "Kit de Guerra",
    icon: Swords,
    component: KitDeGuerra,
  },
  {
    id: "proposta",
    label: "Proposta de Parceria",
    icon: Handshake,
    component: PropostaParceria,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Parcerias() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab from URL hash, fallback to first tab
  const hashId = location.hash.replace("#", "") as TabId;
  const initialTab = TABS.find((t) => t.id === hashId)?.id ?? TABS[0].id;
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    navigate(`/parcerias#${tabId}`, { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ActiveComponent = TABS.find((t) => t.id === activeTab)!.component;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* ── Floating blobs ── */}
      <div className="clay-blob w-[500px] h-[500px] top-0 -left-40 opacity-30 animate-float-slow" />
      <div className="clay-blob w-[350px] h-[350px] top-40 -right-28 opacity-20 animate-float-medium" />

      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/60 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>

          <img src={logo} alt="OrigemDev" className="h-8 w-auto object-contain" />
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-20">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="clay-badge inline-flex items-center gap-1.5 mb-3">
            <Swords className="w-3.5 h-3.5" />
            Área de Parcerias
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Programa de Parcerias Comerciais
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Indique clientes, gere oportunidades e receba comissões por cada projeto fechado.
          </p>
        </motion.div>

        {/* ── Tab Nav ── */}
        <div className="clay-card p-1.5 inline-flex gap-1 mb-8 flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[var(--clay-shadow-primary)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src={logo} alt="OrigemDev" className="h-7 w-auto object-contain opacity-80" />
          <p className="text-muted-foreground text-sm text-center">
            © {new Date().getFullYear()} OrigemDev — Todos os direitos reservados
          </p>
          <p className="text-primary text-xs font-semibold italic">
            "Crescemos juntos quando geramos resultados juntos."
          </p>
        </div>
      </footer>
    </div>
  );
}
