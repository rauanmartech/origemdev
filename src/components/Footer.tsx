import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => (
  <footer className="py-20 px-4 text-center">
    <div className="max-w-6xl mx-auto relative px-4">
      <div className="clay-card p-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 bg-card">
        <div className="relative inline-block">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-auto object-contain opacity-0"
          />
          <div 
            className="absolute inset-0 bg-primary"
            style={{
              maskImage: `url(${logo})`,
              WebkitMaskImage: `url(${logo})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center"
            }}
          />
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-[10px] text-muted-foreground hover:text-primary transition-colors opacity-40 hover:opacity-100">
            Login
          </Link>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} — Feito com dedicação e muito café ☕
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
