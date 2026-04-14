import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/logo2_colorida.png";

const Footer = () => (
  <footer className="py-20 px-4 text-center">
    <div className="max-w-6xl mx-auto relative px-4">
      <div className="clay-card p-8 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10 bg-card">
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-auto object-contain"
        />
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
