import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Projetos", href: "/#projetos" },
  { label: "Feedbacks", href: "/#feedbacks" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // IntersectionObserver for scroll spy
    if (location.pathname === "/") {
      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -70% 0px", // Focus on the middle-upper part of viewport
        threshold: 0,
      };

      const observerCallback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      };

      const observer = new IntersectionObserver(observerCallback, observerOptions);
      const sections = ["home", "projetos", "feedbacks", "sobre", "contato"];

      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });

      return () => {
        window.removeEventListener("scroll", onScroll);
        observer.disconnect();
      };
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const isOrcamentos = location.pathname === "/orcamentos";

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    const isHash = href.includes("#");
    if (!isHash) return;

    const [path, hash] = href.split("#");
    const isHomePage = location.pathname === "/" || location.pathname === "";

    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(hash);
      if (element) {
        const offset = 80; // Navbar height offset
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
      setOpen(false);
    }
    // If not on home page, let the default Link behavior or <a> tag handle it
    // But we'll use Link for better experience
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
        }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div
          className={`clay-card px-6 py-3 flex items-center justify-between border border-primary/5 ${scrolled ? "bg-card/90 backdrop-blur-md shadow-lg" : "bg-card/50 backdrop-blur-sm shadow-md"
            }`}
        >
          <Link to="/" className="relative flex items-center gap-2 hover:opacity-80 transition-opacity">
            {/* Invisible original image to maintain dimensions */}
            <img
              src={logo}
              alt="Logo"
              className="h-9 w-auto object-contain opacity-0"
            />
            {/* Colored overlay using CSS mask */}
            <div 
              className="absolute inset-0 bg-primary"
              style={{
                maskImage: `url(${logo})`,
                WebkitMaskImage: `url(${logo})`,
                maskSize: "contain",
                WebkitMaskSize: "contain",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
                maskPosition: "left center",
                WebkitMaskPosition: "left center"
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.map((item) => {
              const sectionId = item.href.replace("/#", "");
              const isActive = location.pathname === "/" && activeSection === sectionId;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`transition-all duration-300 font-medium text-sm lg:text-base px-4 py-2 rounded-xl ${isActive
                    ? "text-primary bg-background/50 shadow-[var(--clay-shadow-inset)] scale-[0.98]"
                    : "text-muted-foreground hover:text-primary hover:bg-card/30"
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/login"
              className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm lg:text-base mr-2"
            >
              Login
            </Link>
            <Link
              to="/orcamentos"
              className={`clay-btn text-xs lg:text-sm py-2 px-6 transition-all duration-300 ${isOrcamentos
                ? "shadow-[var(--clay-shadow-primary-active)] scale-[0.98] translate-y-0.5 opacity-90"
                : ""
                }`}
            >
              Receber Proposta
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden clay-icon p-2 border border-primary/5 active:scale-95 transition-transform"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
          </button>
        </div>

        {/* Mobile menu with Animation */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden clay-card mt-3 p-5 space-y-4 border border-primary/5 shadow-xl bg-card/95 backdrop-blur-lg"
            >
              <div className="flex flex-col gap-3">
                {navItems.map((item, idx) => {
                  const sectionId = item.href.replace("/#", "");
                  const isActive = location.pathname === "/" && activeSection === sectionId;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      key={item.href}
                    >
                      <Link
                        to={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`flex justify-between items-center transition-all font-medium py-3 px-4 rounded-xl ${isActive
                          ? "text-primary bg-background/60 shadow-[var(--clay-shadow-inset)]"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                          }`}
                      >
                        <span>{item.label}</span>
                        <div className={`w-2 h-2 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-primary/20"}`} />
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="text-muted-foreground hover:text-primary transition-colors font-medium text-sm py-2 px-4 block"
                  >
                    Login
                  </Link>
                  <Link
                    to="/orcamentos"
                    onClick={() => setOpen(false)}
                    className={`clay-btn text-sm py-3 px-5 block text-center transition-all duration-300 ${isOrcamentos
                      ? "shadow-[var(--clay-shadow-primary-active)] scale-[0.98] translate-y-0.5 opacity-90"
                      : ""
                      }`}
                  >
                    Receber Proposta
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;

