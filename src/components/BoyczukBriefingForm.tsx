import React, { useState, useRef } from "react";
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
  Globe,
  Palette,
  Users,
  Briefcase,
  Heart,
  MessageSquare,
  Settings,
  Image as ImageIcon,
  Send
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
  audience_experience: z.string(),
  average_price: z.string(),
  audience_type: z.string(),

  // 3. Identidade Visual
  visual_identity_status: z.string(),
  colors: z.array(z.string()),
  colors_other: z.string().optional(),
  aesthetic_description: z.string().min(5, "Campo obrigatório"),

  // 4. Portfólio
  work_count: z.string(),
  organization_preference: z.string(),
  work_details: z.array(z.string()),

  // 5. Venda de Obras
  sell_directly: z.string(),
  sell_method: z.string(),
  artwork_info_needed: z.array(z.string()),
  artwork_info_other: z.string().optional(),

  // 6. Clube de Cartas
  club_description: z.string().optional(),
  club_status: z.string(),
  club_expectations: z.array(z.string()),
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

const BoyczukBriefingForm = ({ userId }: { userId?: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<{ [key: string]: File[] }>({});

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

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
      // Scroll inside the container if possible
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["artist_name", "art_description", "main_objective", "target_feeling"];
      case 1: return ["target_audience", "audience_experience", "average_price", "audience_type", "visual_identity_status", "colors", "aesthetic_description"];
      case 2: return ["work_count", "organization_preference", "work_details", "sell_directly", "sell_method", "artwork_info_needed"];
      case 3: return ["club_status", "club_expectations", "communication_style"];
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

  if (currentStep === STEPS.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="clay-card max-w-lg w-full p-12 text-center flex flex-col items-center space-y-6 mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold font-display">Obra Capturada!</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Seu briefing foi salvo na sua área do cliente. Boyczuk analisará cada detalhe em breve.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
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
        <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2 rounded-full bg-muted shadow-inner"      <div className="relative min-h-[600px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="clay-card p-8 md:p-12 space-y-8"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">1</span>
                    A Base do Projeto
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-sm font-semibold block ml-1">Nome Artístico / Marca</label>
                      <input {...form.register("artist_name")} className="clay-input w-full" placeholder="Ex: Boyczuk" />
                      {form.formState.errors.artist_name && <p className="text-destructive text-xs ml-2 mt-1">{form.formState.errors.artist_name.message}</p>}
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
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">Descreva sua arte em uma frase</label>
                  <textarea {...form.register("art_description")} className="clay-input w-full min-h-[100px]" placeholder="O que define sua essência visual?" />
                  {form.formState.errors.art_description && <p className="text-destructive text-xs ml-2 mt-1">{form.formState.errors.art_description.message}</p>}
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">O que você quer que a pessoa sinta ao entrar no site?</label>
                  <input {...form.register("target_feeling")} className="clay-input w-full" placeholder="Ex: Calma, introspecção, energia..." />
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
                className="clay-card p-8 md:p-12 space-y-8"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                  <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">2</span>
                  Público e Identidade
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Quem é seu público alvo?</label>
                    <textarea {...form.register("target_audience")} className="clay-input w-full h-[150px]" placeholder="Descreva quem admira ou compra sua arte." />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block ml-1">Experiência de compra</label>
                      <select {...form.register("audience_experience")} className="clay-input w-full">
                        <option value="Já compra">Já compra arte</option>
                        <option value="Está começando">Está começando</option>
                        <option value="Misto">Ambos</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block ml-1">Perfil do público</label>
                      <select {...form.register("audience_type")} className="clay-input w-full">
                        <option value="Emocional">Emocional / Sensível</option>
                        <option value="Estético">Estético / Visual</option>
                        <option value="Colecionador">Colecionador</option>
                        <option value="Casual">Casual</option>
                      </select>
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold block ml-1">Como descreveria sua estética?</label>
                  <select {...form.register("aesthetic_description")} className="clay-input w-full">
                    <option value="">Selecione...</option>
                    <option value="Minimalista">Minimalista</option>
                    <option value="Sombria">Sombria</option>
                    <option value="Vibrante">Vibrante</option>
                    <option value="Conceitual">Conceitual</option>
                    <option value="Orgânica">Orgânica</option>
                    <option value="Experimental">Experimental</option>
                  </select>
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
                className="clay-card p-8 md:p-12 space-y-8"
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
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1">Venda Direta?</label>
                    <select {...form.register("sell_directly")} className="clay-input w-full">
                      <option value="Sim">Sim, desejo checkout</option>
                      <option value="Não">Não</option>
                      <option value="Sob consulta">Apenas sob consulta</option>
                    </select>
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
                className="clay-card p-8 md:p-12 space-y-8"
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
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 inline-flex items-center gap-2">
                    <Palette size={16} /> Logo e Materiais do Clube
                  </label>
                  <input type="file" multiple className="clay-input w-full pt-6" onChange={(e) => handleFileUpload(e, 'club')} />
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
                className="clay-card p-8 md:p-12 space-y-10"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 font-display">
                  <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm">5</span>
                  Expectativas Finais
                </h3>

                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">O que faria você pensar: "É ISSO!" quando o site ficar pronto?</label>
                  <textarea {...form.register("expectations_final")} className="clay-input w-full min-h-[150px]" placeholder="Sua visão de sucesso..." />
                  {form.formState.errors.expectations_final && <p className="text-destructive text-xs ml-2 mt-1">{form.formState.errors.expectations_final.message}</p>}
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

export default BoyczukBriefingForm;
