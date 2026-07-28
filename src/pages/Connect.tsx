import { useState } from "react";
import logoIcon from "@/assets/icone_parceria.png";
import robotImg from "@/assets/sobre.webp";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const IconMessage = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconCode = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

interface LinkCard {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  href: string;
  external: boolean;
}

// ─── Card ─────────────────────────────────────────────────────────────────────

const Card = ({ card }: { card: LinkCard }) => {
  const [active, setActive] = useState(false);

  return (
    <a
      href={card.href}
      id={`connect-card-${card.id}`}
      target={card.external ? "_blank" : undefined}
      rel={card.external ? "noopener noreferrer" : undefined}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerLeave={() => setActive(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        padding: "0.95rem 1rem",
        background: active ? "#f7f7f7" : "#ffffff",
        border: "1px solid #ebebeb",
        borderRadius: "14px",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        transition: "background 0.12s ease, transform 0.16s ease",
        transform: active ? "scale(0.982)" : "scale(1)",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      } as React.CSSProperties}
    >
      <span style={{
        flexShrink: 0,
        width: 42,
        height: 42,
        borderRadius: 11,
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "hsl(25,95%,53%)",
      }}>
        {card.icon}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: "block",
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "#111",
          lineHeight: 1.35,
        }}>
          {card.label}
        </span>
        <span style={{
          display: "block",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.71rem",
          color: "#999",
          lineHeight: 1.4,
          marginTop: "1px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {card.sublabel}
        </span>
      </span>
      <span style={{ flexShrink: 0, color: "#d0d0d0", display: "flex", alignItems: "center" }}>
        <IconChevron />
      </span>
    </a>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Connect = () => {
  const cards: LinkCard[] = [
    {
      id: "instagram",
      icon: <IconInstagram />,
      label: "Instagram",
      sublabel: "Acompanhe nossos projetos e bastidores",
      href: "https://instagram.com/origemdev",
      external: true,
    },
    {
      id: "whatsapp",
      icon: <IconMessage />,
      label: "WhatsApp",
      sublabel: "Entre em contato com nossa equipe",
      href: "https://wa.me/5571983789492?text=Ol%C3%A1%21+Vim+pelo+link+da+Origem.dev+e+gostaria+de+saber+mais.+%F0%9F%91%8B",
      external: true,
    },
    {
      id: "projetos",
      icon: <IconCode />,
      label: "Projetos",
      sublabel: "Conheça nossas soluções digitais",
      href: "/projetos",
      external: false,
    },
    {
      id: "sobre",
      icon: <IconInfo />,
      label: "Sobre nós",
      sublabel: "Conheça nossa visão e propósito",
      href: "/#sobre",
      external: false,
    },
  ];

  return (
    <div
      id="connect-page"
      style={{
        minHeight: "100dvh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
      }}
    >
      <div style={{
        width: "100%",
        maxWidth: 420,
        padding: "0 1.5rem",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "inherit",
      }}>

        {/* Logo */}
        <div style={{ paddingTop: "2.75rem", paddingBottom: "2.5rem" }}>
          <img
            src={logoIcon}
            alt="Origem.dev"
            style={{
              height: 44,
              width: "auto",
              display: "block",
              filter: "brightness(0) saturate(100%) invert(52%) sepia(90%) saturate(1200%) hue-rotate(350deg) brightness(103%) contrast(101%)",
            }}
          />
        </div>

        {/* Hero + Divider wrapper — robot anchors to the divider's bottom edge */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>

          {/* Robot — decorative, anchored bottom-right, bleeds slightly */}
          <img
            src={robotImg}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              right: "-1.5rem",
              bottom: 0,
              height: 302,
              width: "auto",
              objectFit: "contain",
              objectPosition: "bottom right",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
            }}
          />

          {/* Hero text — left 60% so robot has room */}
          <div style={{ width: "60%", marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.45rem, 6vw, 1.85rem)",
              fontWeight: 700,
              lineHeight: 1.22,
              color: "#111111",
              margin: 0,
              letterSpacing: "-0.022em",
            }}>
              Software. Design.<br />
              Automação. IA.<br />
              <span style={{ color: "hsl(25,95%,53%)" }}>Tudo conectado.</span>
            </h1>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.875rem",
              color: "#aaa",
              marginTop: "1.1rem",
              marginBottom: 0,
              fontWeight: 400,
            }}>
              Origem.dev
            </p>
          </div>

          {/* Divider — sits flush at the bottom of this wrapper */}
          <div style={{ height: 1, background: "#f2f2f2" }} />

        </div>

        {/* Cards */}
        <nav aria-label="Links da Origem.dev" style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          {cards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </nav>

        {/* Footer */}
        <footer style={{ marginTop: "auto", paddingTop: "2.5rem", paddingBottom: "1.75rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", color: "#ddd", margin: 0 }}>
            © 2025 Origem.dev
          </p>
        </footer>

      </div>
    </div>
  );
};

export default Connect;
