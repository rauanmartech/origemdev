import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  ShoppingBag as StoreIcon, 
  Tag as CollectionIcon, 
  Star as BrandIcon, 
  Send as SendIcon, 
  Sparkles as ToneIcon,
  ChevronRight as RightIcon,
  ChevronLeft as LeftIcon,
  CheckCircle2 as SuccessIcon,
  Loader2 as LoadingIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Dummy2 Schema (Focus on Store/E-commerce)
const dummy2Schema = z.object({
  store_name: z.string().min(2, "Nome da loja é obrigatório"),
  niche: z.string().min(5, "Defina o nicho de mercado"),
  product_types: z.array(z.string()).min(1, "Selecione ao menos um tipo de produto"),
  brand_tone: z.string().min(10, "Descreva o tom da marca"),
});

type Dummy2Data = z.infer<typeof dummy2Schema>;

const STEPS = [
  { id: "store", title: "Loja", icon: StoreIcon },
  { id: "products", title: "Produtos", icon: CollectionIcon },
  { id: "tone", title: "Marca", icon: ToneIcon },
];

const Dummy2Briefing = ({ userId }: { userId?: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  const form = useForm<Dummy2Data>({
    resolver: zodResolver(dummy2Schema),
    defaultValues: {
      product_types: [],
    }
  });

  React.useEffect(() => {
    if (userId) checkExistingBriefing();
  }, [userId]);

  const checkExistingBriefing = async () => {
    try {
      const { data } = await supabase
        .from("dummy2_briefings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setSubmittedData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingCheck(false);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["store_name", "niche"];
      case 1: return ["product_types"];
      case 2: return ["brand_tone"];
      default: return [];
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

  const onSubmit = async (data: Dummy2Data) => {
    console.log("Iniciando submissão do briefing Dummy2:", data);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("dummy2_briefings").insert([
        { ...data, user_id: userId }
      ]);

      if (error) throw error;
      toast.success("Briefing Dummy2 enviado!");
      setCurrentStep(STEPS.length);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCheck) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <LoadingIcon className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium text-muted-foreground italic">Sincronizando loja...</p>
      </div>
    );
  }

  if (submittedData) {
    return <Dummy2Summary data={submittedData} />;
  }

  if (currentStep === STEPS.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full p-12 text-center flex flex-col items-center space-y-6 mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
          <SuccessIcon size={48} />
        </div>
        <h2 className="text-3xl font-bold font-display">Loja Registrada!</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Obrigado pelas informações, Dummy2. Analisaremos seu nicho em breve.
        </p>
        <button onClick={() => checkExistingBriefing()} className="clay-btn-outline px-8 mt-4">Ver Resumo</button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="clay-badge mb-2 bg-blue-500/10 text-blue-600 border-blue-500/20">Briefing E-commerce</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
          Dummy2 <span className="text-blue-500 italic">Marketplace</span>
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg">
          Configuração de marca e catálogo para o ambiente Dummy2.
        </p>
      </header>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 px-2">
          {STEPS.map((step, idx) => (
            <div key={step.id} className={`flex flex-col items-center gap-2 transition-all duration-300 ${idx <= currentStep ? 'text-blue-500' : 'text-muted-foreground opacity-50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${idx <= currentStep ? 'bg-blue-500/10 border-2 border-blue-500/20' : 'bg-muted border-2 border-transparent'}`}>
                <step.icon size={18} />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <Progress value={((currentStep + 1) / STEPS.length) * 100} className="h-2 rounded-full bg-muted shadow-inner" />
      </div>

      <div className="relative min-h-[400px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1 flex justify-between">
                      Nome da Loja
                      <span className="text-[10px] text-muted-foreground font-normal">mín. 2 letras</span>
                    </label>
                    <input {...form.register("store_name")} className="clay-input w-full" placeholder="Ex: Dummy2 Store" />
                    {form.formState.errors.store_name && <p className="text-red-500 text-xs ml-1">{form.formState.errors.store_name.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1 flex justify-between">
                      Nicho de Mercado
                      <span className="text-[10px] text-muted-foreground font-normal">mín. 5 letras</span>
                    </label>
                    <input {...form.register("niche")} className="clay-input w-full" placeholder="Ex: Moda Sustentável, Gadgets" />
                    {form.formState.errors.niche && <p className="text-red-500 text-xs ml-1">{form.formState.errors.niche.message}</p>}
                  </div>
                </div>
                <div className="pt-8 flex justify-end">
                  <button type="button" onClick={nextStep} className="clay-btn bg-blue-500 hover:bg-blue-600 px-10 flex items-center gap-2 text-white">
                    Próximo <RightIcon size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1">O que a loja vende?</label>
                  {form.formState.errors.product_types && <p className="text-red-500 text-xs ml-1">{form.formState.errors.product_types.message}</p>}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {["Roupas", "Acessórios", "Produtos Digitais", "Decoração", "Alimentos", "Tecnologia"].map(item => (
                      <label key={item} className="flex items-center gap-2 p-4 rounded-2xl bg-muted/20 hover:bg-blue-500/5 cursor-pointer transition-all border border-transparent hover:border-blue-500/20">
                        <input type="checkbox" value={item} {...form.register("product_types")} />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <LeftIcon size={18} /> Anterior
                  </button>
                  <button type="button" onClick={nextStep} className="clay-btn bg-blue-500 hover:bg-blue-600 px-10 flex items-center gap-2 text-white">
                    Próximo <RightIcon size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    Tom de Voz da Marca
                    <span className="text-[10px] text-muted-foreground font-normal">mín. 10 caracteres</span>
                  </label>
                  <textarea {...form.register("brand_tone")} className="clay-input w-full h-[150px]" placeholder="Ex: Amigável, luxuoso, direto..." />
                  {form.formState.errors.brand_tone && <p className="text-red-500 text-xs ml-1">{form.formState.errors.brand_tone.message}</p>}
                </div>
                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <LeftIcon size={18} /> Anterior
                  </button>
                  <button type="submit" disabled={isSubmitting} className="clay-btn bg-foreground text-white px-12 flex items-center gap-3">
                    {isSubmitting ? <LoadingIcon className="animate-spin" /> : <SendIcon size={18} />}
                    Finalizar Loja
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

const Dummy2Summary = ({ data }: { data: any }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
    <div className="flex items-center justify-between border-b border-blue-100 pb-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold font-display text-blue-600">{data.store_name}</h2>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold">E-commerce Dummy2</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Configurado em</p>
        <p className="font-bold">{new Date(data.created_at).toLocaleDateString()}</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="clay-card p-6 space-y-4 border-blue-50/50">
        <div className="flex items-center gap-2 text-blue-500 font-bold">
          <BrandIcon size={18} />
          <span>Ficha Técnica</span>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Nicho</p>
          <p className="text-sm font-medium">{data.niche}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Tom de Voz</p>
          <p className="text-sm leading-relaxed">{data.brand_tone}</p>
        </div>
      </div>

      <div className="clay-card p-6 space-y-4 border-blue-50/50">
        <div className="flex items-center gap-2 text-blue-500 font-bold">
          <CollectionIcon size={18} />
          <span>Categorias</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.product_types?.map((f: string) => (
            <span key={f} className="px-3 py-1 bg-blue-500/10 text-blue-600 text-[10px] rounded-full font-bold">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default Dummy2Briefing;
