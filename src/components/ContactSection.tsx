import { motion } from "framer-motion";
import { Send, Mail, MapPin, MessageSquare, Instagram, Phone } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const phoneNumber = "5571983789492";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Olá, meu nome é ${formState.name} (${formState.email}).\n\nMensagem: ${formState.message}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contato" className="py-16 md:py-24 px-4 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="clay-badge text-sm mb-4 inline-block">Contato</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Vamos conversar?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Tem um projeto em mente? Adoraria ouvir sobre ele.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-5 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="md:col-span-3 clay-card p-8 relative overflow-visible group">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="clay-card absolute -top-6 -right-6 w-16 h-16 rounded-2xl flex items-center justify-center z-20 bg-card/90 backdrop-blur-sm shadow-md"
            >
              <MessageSquare className="w-8 h-8 text-primary" />
            </motion.div>

            <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nome</label>
                <input
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="clay-input w-full"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="clay-input w-full"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mensagem</label>
                <textarea
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="clay-input w-full resize-none"
                  placeholder="Conte-me sobre seu projeto..."
                />
              </div>
              <button type="submit" className="clay-btn flex items-center gap-2 w-full justify-center group/btn">
                <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-6">
            <a
              href="mailto:rauanrocha.martech@gmail.com"
              className="block group"
            >
              <div className="clay-card p-6 flex items-start gap-4 relative overflow-visible transition-transform duration-300 group-hover:scale-[1.02]">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="clay-card absolute -bottom-4 -right-4 w-12 h-12 rounded-xl flex items-center justify-center z-20 bg-card/90 backdrop-blur-sm shadow-sm"
                >
                  <Mail className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="clay-icon shrink-0 relative z-10">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="relative z-10 text-wrap break-all">
                  <h4 className="font-display font-semibold text-foreground mb-1">Email</h4>
                  <p className="text-muted-foreground text-sm">rauanrocha.martech@gmail.com</p>
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/5571983789492"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="clay-card p-6 flex items-start gap-4 relative overflow-visible transition-transform duration-300 group-hover:scale-[1.02]">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="clay-card absolute -top-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center z-20 bg-card/90 backdrop-blur-sm shadow-sm"
                >
                  <Phone className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="clay-icon shrink-0 relative z-10">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="relative z-10">
                  <h4 className="font-display font-semibold text-foreground mb-1">Telefone</h4>
                  <p className="text-muted-foreground text-sm">(71) 98378-9492</p>
                </div>
              </div>
            </a>

            <a
              href="https://instagram.com/origemdev"
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="clay-card p-6 flex items-start gap-4 relative overflow-visible transition-transform duration-300 group-hover:scale-[1.02]">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="clay-card absolute -bottom-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center z-20 bg-card/90 backdrop-blur-sm shadow-sm"
                >
                  <Instagram className="w-6 h-6 text-primary" />
                </motion.div>
                <div className="clay-icon shrink-0 relative z-10">
                  <Instagram className="w-5 h-5 text-primary" />
                </div>
                <div className="relative z-10">
                  <h4 className="font-display font-semibold text-foreground mb-1">Instagram</h4>
                  <p className="text-muted-foreground text-sm">@origemdev</p>
                </div>
              </div>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
