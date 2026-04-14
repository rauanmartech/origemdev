import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  CheckCircle2,
  Loader2,
  Palette,
  Users,
  Briefcase,
  Heart,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  Send,
  X,
  FileText
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Schema definition based on the brief
const briefingSchema = z.object({
  // 1. Contexto Geral
  artist_name: z.string().min(2, "Nome é obrigatório"),
  art_description: z.string().min(10, "Descreva sua arte um pouco mais"),
  main_objective: z.array(z.string()).min(1, "Selecione ao menos um objetivo"),
  main_objective_other: z.string().optional(),
  target_feeling: z.string().min(5, "Campo obrigatório"),
  references_links: z.string().optional(),

  // 2. Público-Alvo
  target_audience: z.string().min(5, "Campo obrigatório"),
  audience_experience: z.string().optional(),
  average_price: z.string().optional(),
  audience_type: z.string().optional(),

  // 3. Identidade Visual
  visual_identity_status: z.string().optional(),
  colors: z.array(z.string()),
  colors_other: z.string().optional(),
  aesthetic_description: z.string().min(5, "Campo obrigatório"),

  // 4. Portfólio
  work_count: z.string().optional(),
  organization_preference: z.string().optional(),
  work_details: z.array(z.string()).optional(),

  // 5. Venda de Obras
  sell_directly: z.string().optional(),
  sell_method: z.string().optional(),
  artwork_info_needed: z.array(z.string()).optional(),
  artwork_info_other: z.string().optional(),

  // 6. Clube de Cartas
  club_description: z.string().optional(),
  club_status: z.string().optional(),
  club_expectations: z.array(z.string()).optional(),
  club_platform: z.string().optional(),

  // 7. Comunicação e Tom
  communication_style: z.array(z.string()),
  representative_quote: z.string().optional(),
  negative_expectations: z.string().optional(),

  // 8. Funcionalidades
  required_functionalities: z.array(z.string()),
  functionalities_other: z.string().optional(),

  // 9. Referências Visuais
  favorite_references: z.string().optional(),
  reference_details: z.string().optional(),

  // 11. Expectativas Finais
  expectations_final: z.string().min(10, "Campo obrigatório"),
  deadline: z.string().optional(),
});

type BriefingData = z.infer<typeof briefingSchema>;

const STEPS = [
  { id: "context", title: "Contexto", icon: Heart },
  { id: "audience", title: "Público & Estética", icon: Users },
  { id: "portfolio", title: "Portfólio & Vendas", icon: Briefcase },
  { id: "club", title: "Clube & Tom", icon: MessageSquare },
  { id: "final", title: "Finalização", icon: Settings },
];

const BoyczukBriefing = ({ userId }: { userId?: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  const form = useForm<BriefingData>({
    resolver: zodResolver(briefingSchema),
    defaultValues: {
      main_objective: [],
      colors: [],
      work_details: [],
      artwork_info_needed: [],
      club_expectations: [],
      communication_style: [],
      required_functionalities: [],
    }
  });

  React.useEffect(() => {
    if (userId) checkExistingBriefing();
  }, [userId]);

  const checkExistingBriefing = async () => {
    try {
      const { data, error } = await supabase
        .from("boyczuk_briefings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setSubmittedData(data);
      }
    } catch (e) {
      console.error("Erro ao checar briefing existente:", e);
    } finally {
      setIsLoadingCheck(false);
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["artist_name", "art_description", "main_objective", "target_feeling"];
      case 1: return ["target_audience", "audience_experience", "audience_type", "colors", "aesthetic_description"];
      case 2: return ["organization_preference", "sell_directly", "artwork_info_needed"];
      case 3: return ["club_expectations", "communication_style"];
      case 4: return ["required_functionalities", "expectations_final"];
      default: return [];
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => ({ ...prev, [category]: [...(prev[category] || []), ...newFiles] }));
    }
  };

  const removeFile = (category: string, index: number) => {
    setFiles(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const FilePreview = ({ category }: { category: string }) => {
    const categoryFiles = files[category] || [];
    if (categoryFiles.length === 0) return null;

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {categoryFiles.map((file, idx) => (
          <div key={`${file.name}-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-border shadow-sm bg-muted/30">
            <img 
              src={URL.createObjectURL(file)} 
              alt="preview" 
              className="w-full h-full object-cover transition-transform group-hover:scale-105" 
            />
            <button
              type="button"
              onClick={() => removeFile(category, idx)}
              className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const uploadFiles = async () => {
    const urls: { [key: string]: string[] } = {};
    for (const category in files) {
      urls[category] = [];
      for (const file of files[category]) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${category}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(category.includes('work') || category.includes('portfolio') ? 'boyczuk-portfolio' : 'boyczuk-assets')
          .upload(filePath, file);

        if (!uploadError) {
          const { data } = supabase.storage
            .from(category.includes('work') || category.includes('portfolio') ? 'boyczuk-portfolio' : 'boyczuk-assets')
            .getPublicUrl(filePath);
          urls[category].push(data.publicUrl);
        }
      }
    }
    return urls;
  };

  const onSubmit = async (data: BriefingData) => {
    setIsSubmitting(true);
    try {
      const fileUrls = await uploadFiles();

      const { error } = await supabase.from("boyczuk_briefings").insert([
        {
          ...data,
          user_id: userId,
          logo_url: fileUrls['logo']?.[0],
          artist_photo_url: fileUrls['photo']?.[0],
          visual_references_urls: fileUrls['references'],
          artwork_images_urls: fileUrls['artwork'],
          club_materials_urls: fileUrls['club'],
        }
      ]);

      if (error) throw error;

      toast.success("Briefing enviado com sucesso!");
      setCurrentStep(STEPS.length); // Success state
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao enviar briefing. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCheck) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium text-muted-foreground">Validando status do briefing...</p>
      </div>
    );
  }

  if (submittedData) {
    return <BriefingSummary data={submittedData} />;
  }

  if (currentStep === STEPS.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full p-12 text-center flex flex-col items-center space-y-6 mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold font-display">Obra Capturada!</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Seu briefing foi salvo na sua área do cliente. Boyczuk analisará cada detalhe em breve.
        </p>
        <button 
          onClick={() => checkExistingBriefing()} 
          className="clay-btn-outline px-8 mt-4"
        >
          Visualizar Resumo
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="clay-badge mb-2">Briefing Criativo</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
          Boyczuk <span className="text-primary italic font-serif">Visual Art</span>
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg">
          Vamos construir a base para o desenvolvimento do seu novo portal pessoal.
        </p>
      </header>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          {STEPS.map((step, idx) => (
            <div
              key={step.id}
              className={`flex flex-col items-center gap-2 transition-all duration-300 ${idx <= currentStep ? 'text-primary' : 'text-muted-foreground opacity-50'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${idx <= currentStep ? 'bg-primary/10 border-2 border-primary/20' : 'bg-muted border-2 border-transparent'}`}>
                <step.icon size={18} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2 rounded-full bg-muted shadow-inner" />
      </div>

      <div className="relative min-h-[600px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                    A Base do Projeto
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold block ml-1 flex justify-between">
                        Nome Artístico / Marca
                        <span className="text-[10px] text-muted-foreground font-normal">mín. 2 letras</span>
                      </label>
                      <input {...form.register("artist_name")} className="clay-input w-full" placeholder="Ex: Lucas Boyczuk" />
                      {form.formState.errors.artist_name && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.artist_name.message}</p>}
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-semibold block ml-1">Objetivo principal do site</label>
                      <div className="grid grid-cols-1 gap-2">
                        {["Expor portfólio", "Vender obras", "Fortalecer marca pessoal", "Divulgar o clube de cartas"].map(obj => (
                          <label key={obj} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors border border-transparent hover:border-primary/20 bg-muted/20">
                            <input
                              type="checkbox"
                              value={obj}
                              {...form.register("main_objective")}
                              className="w-4 h-4 rounded text-primary border-primary/30"
                            />
                            <span className="text-sm">{obj}</span>
                          </label>
                        ))}
                      </div>
                      {form.formState.errors.main_objective && <p className="text-red-500 text-[10px] mt-1 font-bold uppercase">{form.formState.errors.main_objective.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    Resuma sua arte em poucas palavras
                    <span className="text-[10px] text-muted-foreground font-normal">mín. 10 caracteres</span>
                  </label>
                  <textarea {...form.register("art_description")} className="clay-input w-full h-32" placeholder="Fale sobre seu estilo, técnica e o que te move..." />
                  {form.formState.errors.art_description && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.art_description.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    Qual sensação você quer passar com sua marca?
                    <span className="text-[10px] text-muted-foreground font-normal">mín. 5 letras</span>
                  </label>
                  <input {...form.register("target_feeling")} className="clay-input w-full" placeholder="Ex: Mistério, Aconchego, Impacto..." />
                  {form.formState.errors.target_feeling && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.target_feeling.message}</p>}
                </div>

                <div className="pt-8 flex justify-end">
                  <button type="button" onClick={nextStep} className="clay-btn px-10 flex items-center gap-2">
                    Próximo <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                  <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                  Público e Identidade
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Quem é seu público alvo?</label>
                    <textarea {...form.register("target_audience")} className="clay-input w-full h-[150px]" placeholder="Descreva quem admira ou compra sua arte." />
                    {form.formState.errors.target_audience && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.target_audience.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block ml-1">Experiência de compra</label>
                      <select {...form.register("audience_experience")} className="clay-input w-full">
                        <option value="Já compra">Já compra arte</option>
                        <option value="Está começando">Está começando</option>
                        <option value="Misto">Ambos</option>
                      </select>
                      {form.formState.errors.audience_experience && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.audience_experience.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block ml-1">Perfil do público</label>
                      <select {...form.register("audience_type")} className="clay-input w-full">
                        <option value="Emocional">Emocional / Sensível</option>
                        <option value="Estético">Estético / Visual</option>
                        <option value="Colecionador">Colecionador</option>
                        <option value="Casual">Casual</option>
                      </select>
                      {form.formState.errors.audience_type && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.audience_type.message}</p>}
                    </div>
                  </div>
                </div>

                <hr className="border-border/50" />

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">Cores que mais combinam com sua marca</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Preto", "Branco", "Tons Neutros", "Tons Terrosos", "Vibrantes", "Pastel"].map(color => (
                      <label key={color} className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 hover:bg-primary/5 cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                        <input type="checkbox" value={color} {...form.register("colors")} className="w-4 h-4" />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.colors && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.colors.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    Descreva a estética que você imagina
                    <span className="text-[10px] text-muted-foreground font-normal">mín. 5 letras</span>
                  </label>
                  <textarea {...form.register("aesthetic_description")} className="clay-input w-full h-32" placeholder="Ex: Colagens orgânicas, cores terrosas, texturas vintage..." />
                  {form.formState.errors.aesthetic_description && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.aesthetic_description.message}</p>}
                </div>

                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <button type="button" onClick={nextStep} className="clay-btn px-10 flex items-center gap-2">
                    Próximo <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                  <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">3</span>
                  Vitrine e Estrutura Comercial
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Organização do Portfólio</label>
                    <select {...form.register("organization_preference")} className="clay-input w-full">
                      <option value="Coleções">Coleções</option>
                      <option value="Estilo">Estilo</option>
                      <option value="Cronológico">Cronológico</option>
                      <option value="Livre">Livre</option>
                    </select>
                    {form.formState.errors.organization_preference && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.organization_preference.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Venda Direta?</label>
                    <select {...form.register("sell_directly")} className="clay-input w-full">
                      <option value="Sim">Sim, desejo checkout</option>
                      <option value="Não">Não</option>
                      <option value="Sob consulta">Apenas sob consulta</option>
                    </select>
                    {form.formState.errors.sell_directly && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.sell_directly.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 inline-flex items-center gap-2">
                    <ImageIcon size={16} /> Exemplos de Obras (Alta Qualidade)
                  </label>
                  <label className="block w-full h-32 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all">
                    <Upload className="text-primary mb-2" />
                    <span className="text-sm font-medium">Clique para subir imagens</span>
                    <span className="text-xs text-muted-foreground mt-1">{files['artwork']?.length || 0} arquivos selecionados</span>
                    <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, 'artwork')} accept="image/*" />
                  </label>
                  <FilePreview category="artwork" />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">Informações necessárias por obra</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Preço", "Dimensões", "Técnica", "Disponibilidade"].map(info => (
                      <label key={info} className="flex items-center gap-2 text-sm p-3 rounded-xl bg-card border border-border/50">
                        <input type="checkbox" value={info} {...form.register("artwork_info_needed")} />
                        {info}
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.artwork_info_needed && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.artwork_info_needed.message}</p>}
                </div>

                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <button type="button" onClick={nextStep} className="clay-btn px-10 flex items-center gap-2">
                    Próximo <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                  <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">4</span>
                  Clube de Cartas e Linguagem
                </h3>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">O que é o Clube de Cartas? (Breve descrição)</label>
                  <textarea {...form.register("club_description")} className="clay-input w-full h-[100px]" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">O que deseja no site para o Clube?</label>
                    <div className="space-y-2 mt-2">
                      {["Página Explicativa", "Área de Assinatura", "Área de Membros", "Captação de leads"].map(item => (
                        <label key={item} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-muted/10 rounded-lg">
                          <input type="checkbox" value={item} {...form.register("club_expectations")} />
                          <span className="text-sm">{item}</span>
                        </label>
                      ))}
                    </div>
                    {form.formState.errors.club_expectations && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.club_expectations.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Identidade da Comunicação</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Intimista", "Conceitual", "Direta", "Poética", "Comercial"].map(tone => (
                        <label key={tone} className="flex items-center gap-2 text-xs p-2 rounded-lg border border-border/40 hover:bg-primary/5 cursor-pointer">
                          <input type="checkbox" value={tone} {...form.register("communication_style")} />
                          {tone}
                        </label>
                      ))}
                    </div>
                    {form.formState.errors.communication_style && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.communication_style.message}</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 inline-flex items-center gap-2">
                    <Palette size={16} /> Logo e Materiais do Clube
                  </label>
                  <label className="block w-full h-32 border-2 border-dashed border-primary/20 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-all">
                    <Upload className="text-primary mb-2" />
                    <span className="text-sm font-medium">Clique para subir materiais</span>
                    <span className="text-xs text-muted-foreground mt-1">{files['club']?.length || 0} arquivos selecionados</span>
                    <input type="file" multiple className="hidden" onChange={(e) => handleFileUpload(e, 'club')} />
                  </label>
                  <FilePreview category="club" />
                </div>

                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <button type="button" onClick={nextStep} className="clay-btn px-10 flex items-center gap-2">
                    Próximo <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-10"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                  <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                  Expectativas Finais
                </h3>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    O que define o sucesso desse projeto para você?
                    <span className="text-[10px] text-muted-foreground font-normal">mín. 10 caracteres</span>
                  </label>
                  <textarea {...form.register("expectations_final")} className="clay-input w-full h-40" placeholder="Compartilhe sua visão de sucesso e qualquer detalhe final..." />
                  {form.formState.errors.expectations_final && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.expectations_final.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Funcionalidades Extras</label>
                    <div className="grid grid-cols-1 gap-2">
                      {["Blog", "Newsletter", "Integração Instagram", "Área de Membros", "Loja Completa"].map(func => (
                        <label key={func} className="flex items-center gap-2 text-sm p-1 cursor-pointer">
                          <input type="checkbox" value={func} {...form.register("required_functionalities")} />
                          {func}
                        </label>
                      ))}
                    </div>
                    {form.formState.errors.required_functionalities && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.required_functionalities.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Prazo ou Data Importante</label>
                    <input type="date" {...form.register("deadline")} className="clay-input w-full" />
                  </div>
                </div>

                <div className="bg-primary/10 p-6 rounded-2xl flex items-start gap-4">
                  <div className="bg-primary text-white p-2 rounded-full mt-1 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm font-display">Revisão Final</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                      Ao clicar em Enviar, todos os materiais e respostas serão encapsulados e enviados para o servidor.
                    </p>
                  </div>
                </div>

                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="clay-btn px-12 flex items-center gap-3 bg-foreground hover:bg-foreground/90 text-white"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                    ) : (
                      <><Send size={18} /> Enviar Briefing</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

const BriefingSummary = ({ data }: { data: any }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-4xl mx-auto space-y-10 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/50 pb-8">
        <div className="space-y-2">
          <div className="clay-badge bg-green-500/10 text-green-600 border-green-500/20">Briefing Respondido</div>
          <h2 className="text-4xl font-bold font-display">{data.artist_name}</h2>
          <p className="text-muted-foreground">Enviado em {new Date(data.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <SummaryCard title="Conceito e Arte" icon={<Heart size={18} />}>
            <SummaryItem label="Definição da Arte" value={data.art_description} />
            <SummaryItem label="Objetivos" value={data.main_objective?.join(", ")} />
            <SummaryItem label="Sensação Desejada" value={data.target_feeling} />
          </SummaryCard>

          <SummaryCard title="Público e Persona" icon={<Users size={18} />}>
            <SummaryItem label="Público Alvo" value={data.target_audience} />
            <SummaryItem label="Perfil do Público" value={data.audience_type} />
            <SummaryItem label="Experiência de Compra" value={data.audience_experience} />
          </SummaryCard>
        </section>

        <section className="space-y-6">
          <SummaryCard title="Identidade Visual" icon={<Palette size={18} />}>
            <SummaryItem label="Cores Preferidas" value={data.colors?.join(", ")} />
            <SummaryItem label="Estética Definida" value={data.aesthetic_description} />
          </SummaryCard>

          <SummaryCard title="Comercial e Vendas" icon={<Briefcase size={18} />}>
            <SummaryItem label="Venda Direta" value={data.sell_directly} />
            <SummaryItem label="Método de Venda" value={data.sell_method} />
            <SummaryItem label="Organização Portfólio" value={data.organization_preference} />
          </SummaryCard>
        </section>
      </div>

      <SummaryCard title="Visão Final" icon={<Settings size={18} />}>
        <SummaryItem label="Expectativas de Sucesso" value={data.expectations_final} />
        {data.deadline && <SummaryItem label="Prazo Desejado" value={new Date(data.deadline).toLocaleDateString()} />}
      </SummaryCard>
    </motion.div>
  );
};

const SummaryCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="clay-card p-6 space-y-4 bg-white/40 border border-white/60">
    <h4 className="font-bold flex items-center gap-2 text-primary font-display">
      {icon} {title}
    </h4>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
  <div className="space-y-1">
    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">{label}</p>
    <p className="text-sm font-medium leading-relaxed">{value || "Não informado"}</p>
  </div>
);

export default BoyczukBriefing;
