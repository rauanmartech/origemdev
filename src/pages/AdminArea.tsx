import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  Search, 
  LogOut, 
  Send, 
  User as UserIcon,
  ChevronRight,
  Loader2,
  Clock,
  ExternalLink,
  Menu,
  X as CloseIcon,
  ChevronLeft,
  Camera,
  Paperclip,
  Download,
  Maximize2,
  Image as ImageIcon,
  X,
  Plus,
  Heart,
  Palette,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import logoColorida from "@/assets/logo2_colorida.png";

const AdminArea = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [currentClient, setCurrentClient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("chat"); // chat, briefing, planning
  const [messages, setMessages] = useState<any[]>([]);
  const [briefing, setBriefing] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedLightbox, setSelectedLightbox] = useState<{ images: string[], index: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentCache, setContentCache] = useState<Record<string, { messages?: any[], briefing?: any, planning?: any[] }>>({});
  const chatImagesInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (selectedClient && activeTab === "chat") {
      setCurrentClient(selectedClient); // Helper state to ensure we always use current client in subscription
      fetchClientContent();
      const cleanup = subscribeToMessages(selectedClient.id);
      return () => {
        cleanup();
      };
    } else if (selectedClient) {
      fetchClientContent();
    }
  }, [selectedClient?.id, activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // FORCED BYPASS FOR ADMIN EMAIL
    if (user.email === 'rauanrocha.martech@gmail.com' || profile?.role === 'admin') {
      setAdminUser(user);
      fetchClients();
      return;
    }

    toast.error("Acesso restrito ao administrador");
    navigate("/cliente");
  };

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "client")
      .order("created_at", { ascending: false });
    
    if (error) {
      toast.error("Erro ao carregar clientes");
    } else {
      setClients(data || []);
      setLoading(false);
    }
  };

  const fetchClientContent = async () => {
    if (!selectedClient) return;
    
    const clientId = selectedClient.id;

    // Check Cache
    if (contentCache[clientId]) {
      if (activeTab === "chat" && contentCache[clientId].messages) {
        setMessages(contentCache[clientId].messages || []);
      }
      if (activeTab === "briefing" && contentCache[clientId].briefing) {
        setBriefing(contentCache[clientId].briefing || null);
        setLoadingContent(false);
        // We still fetch in background to refresh? Let's stay simple for now: return if cached
        // return; 
      }
    }

    setLoadingContent(true);
    try {
      if (activeTab === "chat") {
        const { data } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${clientId},receiver_id.eq.${clientId}`)
          .order("created_at", { ascending: true });
        
        const freshMessages = data || [];
        setMessages(freshMessages);
        setContentCache(prev => ({
          ...prev,
          [clientId]: { ...prev[clientId], messages: freshMessages }
        }));
      } else if (activeTab === "briefing") {
        let data = null;
        
        // Try dynamic table name based on username
        const tableName = `${selectedClient.username}_briefings`;
        
        try {
          const { data: dynamicData, error: dynamicError } = await supabase
            .from(tableName)
            .select("*")
            .eq("user_id", clientId)
            .order("created_at", { ascending: false })
            .maybeSingle();
          
          if (!dynamicError && dynamicData) {
            data = dynamicData;
          } else {
            // Fallback for Boyczuk if dynamic fails (compatibility)
            const { data: bData } = await supabase
              .from("boyczuk_briefings")
              .select("*")
              .eq("user_id", clientId)
              .order("created_at", { ascending: false })
              .maybeSingle();
            data = bData;
          }
        } catch (e) {
          console.log("Briefing fetch error:", e);
        }

        setBriefing(data || null);
        setContentCache(prev => ({
          ...prev,
          [clientId]: { ...prev[clientId], briefing: data || null }
        }));
      } else if (activeTab === "planning") {
        const { data, error } = await supabase
          .from("planning_items")
          .select("*")
          .eq("user_id", clientId)
          .order("due_date", { ascending: true });
        
        if (!error) {
          setContentCache(prev => ({
            ...prev,
            [clientId]: { ...prev[clientId], planning: data }
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching client content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  const subscribeToMessages = (clientId: string) => {
    const channelId = `chat-admin-${clientId}-${Date.now()}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.sender_id === clientId || payload.new.receiver_id === clientId) {
            setMessages((prev) => {
              // Check if we already have this message (real ID)
              if (prev.some(m => m.id === payload.new.id)) return prev;

              // If it's a message from current admin, try to find and replace the optimistic one
              if (payload.new.sender_id === adminUser.id) {
                // Manual findLastIndex for better compatibility
                let optimisticIdx = -1;
                for (let i = prev.length - 1; i >= 0; i--) {
                  if (prev[i].isOptimistic && prev[i].content === payload.new.content) {
                    optimisticIdx = i;
                    break;
                  }
                }
                
                if (optimisticIdx !== -1) {
                  const updatedMessages = [...prev];
                  updatedMessages[optimisticIdx] = payload.new;
                  return updatedMessages;
                }
              }

              return [...prev, payload.new];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadChatFiles = async () => {
    const urls = [];
    for (const file of selectedImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { error } = await supabase.storage
        .from('chat-media')
        .upload(filePath, file);

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from('chat-media')
          .getPublicUrl(filePath);
        urls.push(publicUrl);
      }
    }
    return urls;
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedImages.length === 0) || !adminUser || !selectedClient) return;

    const messageContent = newMessage;
    const currentImages = [...selectedImages];
    const clientId = selectedClient.id;
    
    // Optimistic Logic
    const tempId = `temp-${Date.now()}`;
    const optimisticImages = currentImages.map(file => URL.createObjectURL(file));
    const optimisticMsg = {
      id: tempId,
      sender_id: adminUser.id,
      receiver_id: clientId,
      content: messageContent,
      image_urls: optimisticImages,
      created_at: new Date().toISOString(),
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");
    setSelectedImages([]);

    setIsUploadingImage(true);
    try {
      const imageUrls = await uploadChatFiles();

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: adminUser.id,
          receiver_id: clientId,
          content: messageContent,
          image_urls: imageUrls
        }
      ]);

      if (error) throw error;
    } catch (error) {
      toast.error("Erro ao enviar mensagem");
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `imagem-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      toast.error("Erro ao baixar imagem");
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="font-semibold text-muted-foreground">Verificando credenciais...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8F9FA] flex overflow-hidden relative">
      {/* Sidebar Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar: Client List */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-border flex flex-col z-[70] transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Settings size={20} />
            </div>
            <h2 className="font-bold text-lg font-display uppercase tracking-tight">Admin Area</h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 hover:bg-muted rounded-lg">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              className="w-full bg-muted/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 ring-primary/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase px-2 mb-2 tracking-widest">Clientes Ativos</p>
          {clients.map(client => (
            <button
              key={client.id}
              onClick={() => {
                setSelectedClient(client);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${selectedClient?.id === client.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'hover:bg-muted text-foreground'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedClient?.id === client.id ? 'bg-white/20' : 'bg-muted'}`}>
                {client.avatar_url ? (
                  <img src={client.avatar_url} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <UserIcon size={18} className={selectedClient?.id === client.id ? 'text-white' : 'text-muted-foreground'} />
                )}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-sm font-bold truncate">{client.full_name || 'Sem nome'}</p>
                <p className={`text-[10px] truncate ${selectedClient?.id === client.id ? 'text-white/70' : 'text-muted-foreground opacity-60'}`}>
                  @{client.username || 'cliente'}
                </p>
              </div>
              <ChevronRight size={14} className={`ml-auto shrink-0 ${selectedClient?.id === client.id ? 'text-white' : 'text-muted-foreground opacity-30'}`} />
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-border flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => navigate("/os/dashboard")}
              className="flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all text-sm shadow-md hover:opacity-90"
              style={{ backgroundColor: 'hsl(25 95% 53%)', color: 'white' }}
              title="Acessar Origin OS"
            >
              <Briefcase size={18} /> OS
            </button>
            <button 
              onClick={() => navigate("/parcerias")}
              className="flex items-center justify-center gap-2 p-3 rounded-xl font-bold transition-all text-sm shadow-md hover:opacity-90 bg-primary text-white"
              title="Acessar Parcerias"
            >
              <Users size={18} /> Parcerias
            </button>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Voltar ao site
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {!selectedClient ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-6">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden absolute top-6 left-6 p-2 rounded-xl bg-white border border-border">
              <Menu size={20} />
            </button>
            <div className="clay-card p-8 md:p-12 max-w-sm space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                <Users size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-display">Gerenciamento Central</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Selecione um cliente na lista lateral para gerenciar briefing, responder chat ou visualizar planejamento.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Client Header */}
            <header className="h-20 bg-white border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 relative z-10">
              <div className="flex items-center gap-2 md:gap-4">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
                  <Menu size={20} />
                </button>
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-primary/5 items-center justify-center text-primary shrink-0">
                  <UserIcon size={20} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm md:text-lg font-display truncate">{selectedClient.full_name || 'Sem nome'}</h2>
                  <p className="text-[10px] text-muted-foreground truncate hidden md:block">ID: {selectedClient.id}</p>
                </div>
              </div>

              <div className="flex gap-1 md:gap-2">
                {["chat", "briefing", "planning"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {tab === 'chat' && 'Conversa'}
                    {tab === 'briefing' && 'Briefing'}
                    {tab === 'planning' && 'Cronograma'}
                  </button>
                ))}
              </div>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {/* CHAT TAB */}
                {activeTab === "chat" && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#FAFBFC] relative">
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0 overflow-hidden">
                        <img src={logoColorida} alt="Watermark" className="w-[300px] md:w-[500px] object-contain" />
                      </div>
                      <div className="relative z-10 space-y-6 min-h-full">
                        {messages.map((msg) => (
                        <div 
                          key={msg.id}
                          className={`flex flex-col ${msg.sender_id === adminUser.id ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`max-w-[80%] space-y-2 ${msg.sender_id === adminUser.id ? 'items-end' : 'items-start'}`}>
                            {msg.image_urls && msg.image_urls.length > 0 && (
                              <div 
                                onClick={() => setSelectedLightbox({ images: msg.image_urls, index: 0 })}
                                className="relative group cursor-pointer max-w-[240px]"
                              >
                                <img 
                                  src={msg.image_urls[0]} 
                                  alt="Chat" 
                                  loading="lazy"
                                  decoding="async"
                                  className="max-h-60 rounded-2xl border shadow-sm object-cover bg-muted w-full hover:brightness-90 transition-all" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Maximize2 className="text-white drop-shadow-md" size={32} />
                                </div>
                                {msg.image_urls.length > 1 && (
                                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/20 flex items-center gap-1">
                                    <ImageIcon size={10} />
                                    +{msg.image_urls.length - 1} fotos
                                  </div>
                                )}
                              </div>
                            )}

                            {msg.content && (
                              <div className={`p-4 rounded-3xl text-sm ${
                                msg.sender_id === adminUser.id 
                                  ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' 
                                  : 'bg-muted text-foreground rounded-bl-none'}`}
                              >
                                {msg.content}
                              </div>
                            )}
                          </div>
                          <span className={`text-[10px] text-muted-foreground mt-1 px-1 ${msg.sender_id === adminUser.id ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))}
                        <div ref={chatEndRef} />
                      </div>
                    </div>

                    <div className="p-4 md:p-8 bg-white border-t border-border">
                      {/* Image Selection Preview */}
                      <AnimatePresence>
                        {selectedImages.length > 0 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-wrap gap-2 mb-4 overflow-hidden"
                          >
                            {selectedImages.map((file, i) => (
                              <div key={i} className="relative w-20 h-20">
                                <PreviewImage file={file} />
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeSelectedImage(i);
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors z-[100] border-2 border-white"
                                >
                                  <X size={12} />
                                </button>
                               </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <form onSubmit={sendMessage} className="flex gap-2 md:gap-4 items-end">
                        <div className="flex-1 relative">
                          <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua resposta..." 
                            className="w-full bg-[#F8F9FA] border border-border pl-4 pr-12 py-4 rounded-3xl text-sm outline-none focus:ring-2 ring-primary/20 transition-all resize-none min-h-[56px]"
                          />
                          <button 
                            type="button"
                            onClick={() => chatImagesInputRef.current?.click()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Paperclip size={20} />
                          </button>
                          <input 
                            type="file" 
                            ref={chatImagesInputRef}
                            onChange={handleImageSelect}
                            multiple
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={(!newMessage.trim() && selectedImages.length === 0) || isUploadingImage}
                          className="bg-primary text-white p-4 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
                        >
                          {isUploadingImage ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {/* BRIEFING TAB */}
                {activeTab === "briefing" && (
                  <motion.div
                    key="briefing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full overflow-y-auto p-4 md:p-10 custom-scrollbar bg-white/50"
                  >
                    {!briefing ? (
                        <div className="clay-card p-12 text-center space-y-4 border-dashed border-2 bg-muted/20">
                          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                            <Clock size={32} className="animate-pulse" />
                          </div>
                          <div>
                            <p className="font-bold text-lg text-amber-700">Aguardando Resposta</p>
                            <p className="text-sm text-muted-foreground max-w-md mx-auto">O cliente "{selectedClient.full_name || selectedClient.username}" ainda não preencheu e enviou o questionário do projeto.</p>
                          </div>
                        </div>
                    ) : (
                      <div className="max-w-5xl mx-auto space-y-10 pb-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
                          <div className="space-y-4 text-center md:text-left">
                            <div className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-widest border border-primary/20">
                              Ficha de Briefing do Cliente
                            </div>
                            <div>
                              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                                {briefing.artist_name || briefing.store_name || briefing.project_name || 'Projeto ' + (selectedClient.full_name || selectedClient.username)}
                              </h2>
                              <p className="text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-2">
                                <Clock size={14} /> Enviado em {new Date(briefing.created_at).toLocaleDateString()} às {new Date(briefing.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="hidden md:block">
                             <div className="bg-white p-4 rounded-2xl shadow-sm border border-border flex items-center gap-3">
                               <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                 <FileText size={20} />
                               </div>
                               <div className="text-left">
                                 <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Status</p>
                                 <p className="text-xs font-bold text-green-600">Completo & Recebido</p>
                               </div>
                             </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(briefing)
                            .filter(([key, value]) => {
                              if (["id", "user_id", "created_at", "updated_at"].includes(key)) return false;
                              if (value === null || value === undefined) return false;
                              if (Array.isArray(value) && value.length === 0) return false;
                              if (typeof value === "string" && value.trim() === "") return false;
                              if (["artist_name", "store_name", "project_name"].includes(key)) return false;
                              return true;
                            })
                            .map(([key, value]) => (
                              <AdminSummaryItem 
                                key={key} 
                                label={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} 
                                value={value} 
                              />
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* PLANNING TAB */}
                {activeTab === "planning" && (
                  <motion.div
                    key="planning"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full overflow-y-auto p-4 md:p-10 custom-scrollbar"
                  >
                    <div className="max-w-4xl mx-auto space-y-10">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-8">
                         <div>
                           <h3 className="text-2xl font-bold font-display">Cronograma do Projeto</h3>
                           <p className="text-muted-foreground text-sm">Gerencie marcos e prazos para {selectedClient.full_name}</p>
                         </div>
                         <button className="clay-btn bg-primary text-white text-xs px-6 py-3 rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                           <Plus size={16} /> Novo Marco
                         </button>
                       </div>

                       {(!contentCache[selectedClient.id]?.planning || contentCache[selectedClient.id]?.planning?.length === 0) ? (
                         <div className="clay-card p-12 text-center space-y-4 border-dashed border-2 bg-muted/20">
                           <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                             <Clock size={32} />
                           </div>
                           <div>
                             <p className="font-bold">Nenhum marco definido</p>
                             <p className="text-xs text-muted-foreground">Comece a planejar as etapas do projeto hoje mesmo.</p>
                           </div>
                         </div>
                       ) : (
                         <div className="space-y-4">
                           {contentCache[selectedClient.id]?.planning?.map((item: any) => (
                             <div key={item.id} className="clay-card p-6 flex flex-col md:flex-row md:items-center gap-4 group hover:shadow-xl transition-all border border-border/40">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                 item.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                                 item.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600' :
                                 'bg-amber-500/10 text-amber-600'
                               }`}>
                                 {item.status === 'completed' ? <CheckCircle size={24} /> : <Clock size={24} />}
                               </div>
                               <div className="flex-1 space-y-1">
                                 <h4 className="font-bold text-sm">{item.title}</h4>
                                 <p className="text-[10px] text-muted-foreground line-clamp-1">{item.description}</p>
                               </div>
                               <div className="flex items-center gap-4">
                                 <div className="text-right">
                                   <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Prazo</p>
                                   <p className="text-xs font-medium">{new Date(item.due_date).toLocaleDateString()}</p>
                                 </div>
                                 <div className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                                   item.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                                   item.status === 'in_progress' ? 'bg-blue-500/10 text-blue-600' :
                                   'bg-amber-500/10 text-amber-600'
                                 }`}>
                                   {item.status === 'completed' ? 'Concluído' :
                                    item.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                                 </div>
                               </div>
                             </div>
                           ))}
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </main>

      {/* Lightbox Viewer */}
      <AnimatePresence>
        {selectedLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedLightbox(null)}
          >
            {/* Controls */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedLightbox.images[selectedLightbox.index]);
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                title="Baixar imagem"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLightbox(null);
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            {selectedLightbox.images.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLightbox(prev => prev ? ({
                      ...prev,
                      index: (prev.index - 1 + prev.images.length) % prev.images.length
                    }) : null);
                  }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-10"
                >
                  <ChevronLeft size={32} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLightbox(prev => prev ? ({
                      ...prev,
                      index: (prev.index + 1) % prev.images.length
                    }) : null);
                  }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-10"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image Container */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-full max-h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedLightbox.images[selectedLightbox.index]} 
                alt="Enlarged" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" 
              />
              
              {selectedLightbox.images.length > 1 && (
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                  {selectedLightbox.index + 1} / {selectedLightbox.images.length}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
      `}</style>
    </div>
  );
};

const PreviewImage = ({ file }: { file: File }) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return <div className="w-full h-full bg-muted/20 animate-pulse rounded-xl" />;

  return (
    <img 
      src={url} 
      className="w-full h-full object-cover rounded-xl border border-border" 
      alt="Preview"
      loading="lazy"
      decoding="async"
    />
  );
};

const AdminSummaryItem = React.memo(({ label, value }: { label: string, value: any }) => {
  const downloadAll = async (urls: string[]) => {
    toast.info(`Iniciando download de ${urls.length} arquivos...`);
    for (const url of urls) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        const name = url.split('/').pop()?.split('?')[0] || `arquivo-${Date.now()}`;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        await new Promise(r => setTimeout(r, 200)); // Delay to avoid browser blocking
      } catch (e) {
        console.error("Erro no download:", e);
      }
    }
  };

  const renderValue = () => {
    if (Array.isArray(value)) {
      // Check if it's an array of URLs (images/files)
      if (value.length > 0 && typeof value[0] === 'string' && (value[0].startsWith('http') || value[0].includes('supabase.co/storage'))) {
         return (
           <div className="mt-3 space-y-2">
             <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-[1.5rem] border border-primary/10">
               <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                 <ImageIcon size={24} />
               </div>
               <div>
                 <p className="text-sm font-bold">{value.length} arquivos anexados</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight opacity-60">Galeria de Mídia</p>
               </div>
             </div>
             <div className="flex gap-2">
               <button 
                 onClick={() => downloadAll(value)}
                 className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
               >
                 <Download size={14} /> Baixar Tudo
               </button>
             </div>
           </div>
         );
      }
      return value.join(", ");
    }
    
    if (typeof value === 'string') {
      if (value.startsWith('http') || value.includes('supabase.co/storage')) {
        // Individual image/file attachment
        if (value.match(/\.(jpeg|jpg|gif|png|webp|pdf|zip)$/i) || value.includes('storage/v1/object/public')) {
          return (
            <div className="mt-3 flex items-center gap-3 p-4 bg-amber-500/5 rounded-[1.5rem] border border-amber-500/10">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">Anexo Individual</p>
                <div className="flex gap-3 mt-1">
                  <button 
                    onClick={() => downloadAll([value])}
                    className="text-amber-600 text-[10px] font-bold uppercase tracking-tighter hover:underline flex items-center gap-1"
                  >
                    <Download size={10} /> Baixar
                  </button>
                  <a href={value} target="_blank" rel="noreferrer" className="text-muted-foreground text-[10px] font-bold uppercase tracking-tighter hover:text-primary flex items-center gap-1">
                    <ExternalLink size={10} /> Abrir
                  </a>
                </div>
              </div>
            </div>
          );
        }
        return (
          <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 mt-2 text-sm font-bold">
            Ver link externo <ExternalLink size={14} />
          </a>
        );
      }
    }
    
    return value || <span className="text-muted-foreground/40 italic">Não informado</span>;
  };

  return (
    <div className="bg-white/50 p-6 rounded-[2rem] border border-border/40 hover:bg-white hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full group">
      <p className="text-[10px] uppercase font-bold text-muted-foreground opacity-60 tracking-widest mb-1 group-hover:text-primary transition-colors">{label}</p>
      <div className="text-sm font-medium leading-relaxed text-foreground/90 flex-1">
        {renderValue()}
      </div>
    </div>
  );
});

export default AdminArea;
