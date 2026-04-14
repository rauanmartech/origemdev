import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Calendar, 
  LogOut, 
  Send, 
  User as UserIcon,
  Circle,
  Loader2,
  Paperclip,
  Menu,
  X,
  Bell,
  CheckCircle2, Palette, Image as ImageIcon, ChevronLeft, ChevronRight, Download, Maximize2
} from "lucide-react";
import { toast } from "sonner";

import { Camera } from "lucide-react";
import logoColorida from "@/assets/logo2_colorida.png";

// Vite dynamic import glob must be at top-level
const BRIEFING_MODULES = import.meta.glob('../briefings/**/*.tsx');

const ClientArea = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedLightbox, setSelectedLightbox] = useState<{ images: string[], index: number } | null>(null);
  const [BriefingComponent, setBriefingComponent] = useState<any>(null);
  const [loadingBriefing, setLoadingBriefing] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const chatImagesInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    if (user && activeTab === "chat") {
      markMessagesAsRead();
      const unsubscribe = subscribeToMessages();
      return unsubscribe;
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user && activeTab === "briefing") {
      loadBriefingComponent();
    }
  }, [user, activeTab]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setUser(user);
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    setProfile(profile);

    // Fetch admin ID once
    try {
      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle(); // Use maybeSingle to avoid error if none found
      
      if (adminProfile) setAdminId(adminProfile.id);
    } catch (e) {
      console.error("Error fetching admin profile:", e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const fetchMessages = async () => {
    if (!user) return;
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: true });
    
    if (!error) setMessages(data || []);
    setLoadingMessages(false);
  };

  const markMessagesAsRead = async () => {
    if (!user || messages.length === 0) return;
    
    const unreadMessages = messages.filter(m => m.receiver_id === user.id && !m.is_read);
    if (unreadMessages.length === 0) return;

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq('receiver_id', user.id)
      .eq('is_read', false);
      
    setMessages(prev => prev.map(m => 
      m.receiver_id === user.id ? { ...m, is_read: true } : m
    ));
  };
  
  const unreadCount = messages.filter(m => m.receiver_id === user.id && !m.is_read).length;
  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUpdatingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `user-avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Foto de perfil atualizada!");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao atualizar foto");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const loadBriefingComponent = async () => {
    if (!user?.email) return;
    
    setLoadingBriefing(true);
    const username = user.email.split('@')[0].toLowerCase();
    
    try {
      // Define specific paths to prioritize
      const path1 = `../briefings/${username}/index.tsx`;
      const path2 = `../briefings/${username}.tsx`;
      
      let matchKey = null;
      
      // Try exact matches first
      if (BRIEFING_MODULES[path1]) {
        matchKey = path1;
      } else if (BRIEFING_MODULES[path2]) {
        matchKey = path2;
      } else {
        // Fallback: search for any .tsx file in the user's folder
        matchKey = Object.keys(BRIEFING_MODULES).find(key => 
          key.toLowerCase().includes(`/briefings/${username}/`)
        );
      }

      if (matchKey) {
        const module: any = await BRIEFING_MODULES[matchKey]();
        setBriefingComponent(() => module.default);
      } else {
        setBriefingComponent(null);
      }
    } catch (e) {
      console.error("Erro ao carregar briefing:", e);
      setBriefingComponent(null);
    } finally {
      setLoadingBriefing(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel("chat-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload.new.sender_id === user.id || payload.new.receiver_id === user.id) {
            setMessages((prev) => {
              // Check if we already have this message (e.g. from optimistic update)
              if (prev.some(m => m.id === payload.new.id)) return prev;

              // If it's our own message, find and replace the optimistic one
              if (payload.new.sender_id === user.id) {
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
      console.log("Desinscrevendo do chat...");
      supabase.removeChannel(channel);
    };
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedImages.length + newFiles.length > 10) {
        toast.error("Máximo de 10 imagens permitidas");
        return;
      }
      setSelectedImages(prev => [...prev, ...newFiles]);
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadChatFiles = async () => {
    if (selectedImages.length === 0) return [];
    
    const urls: string[] = [];
    for (const file of selectedImages) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `chat/${fileName}`;

      const { data, error } = await supabase.storage
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
    if ((!newMessage.trim() && selectedImages.length === 0) || !user) return;

    const messageContent = newMessage;
    const currentImages = [...selectedImages];
    const targetAdminId = adminId;
    
    // Optimistic Logic
    const tempId = `temp-${Date.now()}`;
    const optimisticImages = currentImages.map(file => URL.createObjectURL(file));
    const optimisticMsg = {
      id: tempId,
      sender_id: user.id,
      receiver_id: targetAdminId,
      content: messageContent,
      image_urls: optimisticImages,
      created_at: new Date().toISOString(),
      isOptimistic: true
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage("");
    setSelectedImages([]);
    
    const targetId = targetAdminId || adminId;
    if (!targetId) {
      toast.error("Administrador não encontrado. Tente novamente em instantes.");
      setMessages(prev => prev.filter(m => m.id !== tempId));
      fetchMessages(); // Try to refresh
      return;
    }

    setIsUploadingImage(true);
    try {
      const imageUrls = await uploadChatFiles();

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          receiver_id: targetId, 
          content: messageContent,
          image_urls: imageUrls
        }
      ]);

      if (error) throw error;
    } catch (error) {
      console.error(error);
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

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "chat", label: "Chat com Admin", icon: MessageSquare },
    { id: "briefing", label: "Briefing", icon: FileText },
    { id: "planning", label: "Planejamento", icon: Calendar },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="clay-blob w-[600px] h-[600px] -top-96 -left-48 opacity-10 animate-float-slow" />
        <div className="clay-blob w-[500px] h-[500px] -bottom-48 -right-48 opacity-10 animate-float-medium" />
      </div>

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

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-border z-[70] transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={20} />
              )}
            </div>
            <span className="font-bold text-xl font-display">Painel Cliente</span>
          </div>

          <nav className="flex-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeTab === tab.id 
                  ? 'bg-primary/5 text-primary shadow-[var(--clay-shadow-sm)]' 
                  : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                <span className="font-semibold text-sm">{tab.label}</span>
                {unreadCount > 0 && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="mt-auto flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Sair da conta</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/50 backdrop-blur-md border-b border-border flex items-center justify-between px-6 md:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-bold text-xl md:text-2xl font-display capitalize">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button className="p-2.5 rounded-xl bg-white border border-border hover:bg-muted transition-colors relative">
              <Bell size={20} className="text-muted-foreground" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground">{profile?.full_name || 'Usuário'}</p>
                <p className="text-[10px] text-muted-foreground opacity-60">@{profile?.username || 'cliente'}</p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdatingAvatar}
                className="w-10 h-10 rounded-2xl bg-muted border border-border flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all group relative disabled:opacity-50"
              >
                {isUpdatingAvatar ? (
                  <Loader2 size={16} className="animate-spin text-primary" />
                ) : profile?.avatar_url ? (
                  <>
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={16} className="text-primary" />
                    </div>
                  </>
                ) : (
                  <UserIcon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className={`flex-1 overflow-y-auto ${activeTab === 'chat' ? 'p-0 md:p-10' : 'p-6 md:p-10'} custom-scrollbar`}>
          <AnimatePresence mode="wait">
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="clay-card p-10 bg-gradient-to-br from-primary to-[#FF8C69] text-white overflow-hidden relative">
                  <div className="relative z-10 space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold font-display">Olá, {profile?.full_name?.split(' ')[0] || 'Cliente'}!</h1>
                    <p className="text-white/80 max-w-md">Bem-vindo(a) de volta ao seu espaço exclusivo. Aqui você pode acompanhar o progresso do seu projeto e se comunicar com a gente.</p>
                    <div className="pt-4 flex gap-4">
                      <button onClick={() => setActiveTab('chat')} className="bg-white text-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-black/10 transition-transform hover:scale-105 active:scale-95">Abrir Chat</button>
                      <button onClick={() => setActiveTab('briefing')} className="bg-primary/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-2xl font-bold text-sm transition-transform hover:scale-105 active:scale-95">Ver Briefing</button>
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-20 rotate-12 pointer-events-none">
                    <FileText size={240} />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="clay-card p-6 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Circle size={24} className="fill-blue-500/20" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Status do Projeto</p>
                      <h3 className="text-2xl font-bold mt-1">Fase de Briefing</h3>
                    </div>
                  </div>
                  <div className="clay-card p-6 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Mensagens não lidas</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {unreadCount > 0 ? `${unreadCount} ${unreadCount === 1 ? 'Nova' : 'Novas'}` : 'Nenhuma'}
                      </h3>
                    </div>
                  </div>
                  <div className="clay-card p-6 flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Próxima Entrega</p>
                      <h3 className="text-2xl font-bold mt-1">A Definir</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHAT */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full md:h-[calc(100vh-180px)] flex flex-col md:clay-card p-0 overflow-hidden bg-white border-0 md:border border-border"
              >
                <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10 z-0 overflow-hidden">
                    <img src={logoColorida} alt="Watermark" className="w-[300px] md:w-[500px] object-contain" />
                  </div>
                  <div className="relative z-10 space-y-6 min-h-full">
                  {loadingMessages ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                      <Loader2 className="animate-spin" size={32} />
                      <p className="font-medium">Carregando conversa...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 text-center px-10">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                        <MessageSquare size={32} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{adminId ? "Inicie uma conversa" : "Suporte Indisponível"}</h4>
                        <p className="text-sm">
                          {adminId 
                            ? "Envie uma mensagem abaixo para falar diretamente com o suporte." 
                            : "No momento não há um administrador disponível para este chat."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[80%] space-y-2 ${msg.sender_id === user.id ? 'items-end' : 'items-start'}`}>
                          {msg.image_urls && msg.image_urls.length > 0 && (
                            <div 
                              onClick={() => setSelectedLightbox({ images: msg.image_urls, index: 0 })}
                              className="relative group cursor-pointer max-w-[240px]"
                            >
                              <img 
                                src={msg.image_urls[0]} 
                                alt="Chat" 
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
                              msg.sender_id === user.id 
                                ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' 
                                : 'bg-muted text-foreground rounded-bl-none'}`}
                            >
                              {msg.content}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1.5 px-1 opacity-50">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                  </div>
                </div>

                <div className="p-4 md:p-6 border-t border-border shrink-0 bg-white pb-safe space-y-4">
                  {selectedImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
                      {selectedImages.map((file, idx) => (
                        <div key={idx} className="relative flex-shrink-0 pt-2 pr-2">
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-border shadow-sm">
                            <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                          </div>
                          <button 
                            type="button"
                            onClick={() => removeSelectedImage(idx)}
                            className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-10"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <form onSubmit={sendMessage} className="flex gap-2 md:gap-4 items-end">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      ref={chatImagesInputRef}
                      onChange={handleImageSelect}
                      className="hidden" 
                    />
                    <button 
                      type="button" 
                      onClick={() => chatImagesInputRef.current?.click()}
                      className="p-2 md:p-3 text-muted-foreground hover:bg-muted rounded-xl transition-colors shrink-0"
                    >
                      <Paperclip size={20} />
                    </button>
                    <textarea 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Sua mensagem..." 
                      rows={1}
                      className="flex-1 bg-[#F8F9FA] border-none px-4 md:px-6 py-3 rounded-2xl text-sm outline-none focus:ring-2 ring-primary/20 transition-all shadow-inner resize-none max-h-32"
                    />
                    <button 
                      type="submit" 
                      disabled={(!newMessage.trim() && selectedImages.length === 0) || isUploadingImage}
                      className="bg-primary text-white p-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-primary/20"
                    >
                      {isUploadingImage ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* BRIEFING */}
            {activeTab === "briefing" && (
              <motion.div
                key="briefing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="clay-card p-6 md:p-12 min-h-full flex flex-col"
              >
                {loadingBriefing ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="font-semibold text-muted-foreground">Buscando seu briefing...</p>
                  </div>
                ) : BriefingComponent ? (
                  <BriefingComponent userId={user.id} />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center py-20">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                      <FileText size={40} />
                    </div>
                    <div className="max-w-md space-y-2">
                      <h3 className="text-2xl font-bold font-display">Briefing Personalizado</h3>
                      <p className="text-muted-foreground">Olá, <span className="text-foreground font-bold">{profile?.full_name || 'Cliente'}</span>! O formulário de briefing para o seu projeto ainda está sendo preparado pela nossa equipe.</p>
                      <p className="text-xs text-muted-foreground/60 pt-4">Você será notificado assim que estiver disponível para preenchimento.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* PLANNING */}
            {activeTab === "planning" && (
              <motion.div
                key="planning"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-full flex flex-col items-center justify-center gap-6 py-20"
              >
                <div className="clay-card max-w-md p-10 text-center space-y-6 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
                    <Calendar size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-display">Planejamento em Curso</h3>
                    <p className="text-muted-foreground leading-relaxed">Estamos estruturando as fases do seu projeto. Assim que o briefing for analisado, o cronograma aparecerá detalhado aqui.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('dashboard')} 
                    className="clay-btn-outline w-full"
                  >
                    Voltar ao Início
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
};

export default ClientArea;
