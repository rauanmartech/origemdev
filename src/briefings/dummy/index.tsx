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
  CheckCircle2, 
  Loader2,
  Globe,
  Palette,
  Users,
  Send,
  Zap
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Dummy Schema
const dummySchema = z.object({
  project_name: z.string().min(2, "Nome do projeto é obrigatório"),
  vibe: z.string().min(5, "Defina a 'vibe' do projeto"),
  features: z.array(z.string()).min(1, "Selecione ao menos uma feature"),
  description: z.string().min(10, "Uma breve descrição ajuda muito"),
});

type DummyData = z.infer<typeof dummySchema>;

const STEPS = [
  { id: "concept", title: "Conceito", icon: Zap },
  { id: "details", title: "Detalhes", icon: Palette },
  { id: "finish", title: "Finalizar", icon: CheckCircle2 },
];

const DummyBriefing = ({ userId }: { userId?: string }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [isLoadingCheck, setIsLoadingCheck] = useState(true);

  const form = useForm<DummyData>({
    resolver: zodResolver(dummySchema),
    defaultValues: {
      features: [],
    }
  });

  React.useEffect(() => {
    if (userId) checkExistingBriefing();
  }, [userId]);

  const checkExistingBriefing = async () => {
    try {
      const { data, error } = await supabase
        .from("dummy_briefings")
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

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 0: return ["project_name", "vibe"];
      case 1: return ["features"];
      case 2: return ["description"];
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

  const onSubmit = async (data: DummyData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("dummy_briefings").insert([
        {
          ...data,
          user_id: userId,
        }
      ]);

      if (error) throw error;

      toast.success("Briefing de teste enviado!");
      setCurrentStep(STEPS.length);
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao enviar. Verifique se a tabela SQL foi criada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingCheck) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <Loader2 className="animate-spin text-primary" size={32} />
        <p className="text-sm font-medium text-muted-foreground italic">Verificando histórico do projeto...</p>
      </div>
    );
  }

  if (submittedData) {
    return <DummySummary data={submittedData} />;
  }

  if (currentStep === STEPS.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full p-12 text-center flex flex-col items-center space-y-6 mx-auto"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold font-display">Teste Concluído!</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Este é o briefing do usuário Dummy. Tudo funcionando como deveria.
        </p>
        <button 
          onClick={() => checkExistingBriefing()} 
          className="clay-btn-outline px-8 mt-4"
        >
          Visualizar Respostas
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="clay-badge mb-2">Ambiente de Teste</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground font-display">
          Dummy <span className="text-primary italic">Project</span>
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg">
          Este é um briefing gerado dinamicamente para o usuário de testes.
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

      <div className="relative min-h-[400px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait" initial={false}>
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1 flex justify-between">
                      Nome do Projeto de Teste
                      <span className="text-[10px] text-muted-foreground font-normal">mín. 2 letras</span>
                    </label>
                    <input {...form.register("project_name")} className="clay-input w-full" placeholder="Ex: Meu App Incrível" />
                    {form.formState.errors.project_name && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.project_name.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold block ml-1 flex justify-between">
                      Vibe do Projeto
                      <span className="text-[10px] text-muted-foreground font-normal">mín. 5 letras</span>
                    </label>
                    <input {...form.register("vibe")} className="clay-input w-full" placeholder="Ex: Futurista, Clean, Cyberpunk" />
                    {form.formState.errors.vibe && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.vibe.message}</p>}
                  </div>
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
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    Features Desejadas
                    <span className="text-[10px] text-muted-foreground font-normal">selecione ao menos 1</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Login Social", "Dark Mode", "Chat Realtime", "Pagamentos", "Dashboard", "API"].map(feature => (
                      <label key={feature} className="flex items-center gap-2 p-4 rounded-2xl bg-muted/20 hover:bg-primary/5 cursor-pointer transition-all border border-transparent hover:border-primary/20">
                        <input type="checkbox" value={feature} {...form.register("features")} className="w-4 h-4" />
                        <span className="text-sm">{feature}</span>
                      </label>
                    ))}
                  </div>
                  {form.formState.errors.features && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.features.message}</p>}
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
                className="space-y-8"
              >
                <div className="space-y-4">
                  <label className="text-sm font-semibold block ml-1 flex justify-between">
                    Descrição Final
                    <span className="text-[10px] text-muted-foreground font-normal">mín. 10 caracteres</span>
                  </label>
                  <textarea {...form.register("description")} className="clay-input w-full h-[150px]" placeholder="Conte mais sobre o projeto dummy..." />
                  {form.formState.errors.description && <p className="text-red-500 text-xs mt-1 ml-1">{form.formState.errors.description.message}</p>}
                </div>
                <div className="pt-8 flex justify-between gap-4">
                  <button type="button" onClick={prevStep} className="clay-btn-outline px-6 flex items-center gap-2">
                    <ChevronLeft size={18} /> Anterior
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="clay-btn px-12 flex items-center gap-3 bg-foreground text-white"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                    Finalizar Briefing
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

const DummySummary = ({ data }: { data: any }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="max-w-4xl mx-auto space-y-8"
  >
    <div className="flex items-center justify-between border-b pb-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold font-display">{data.project_name}</h2>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-primary">Status: Finalizado</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Respondido em</p>
        <p className="font-bold">{new Date(data.created_at).toLocaleDateString()}</p>
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Zap size={18} />
          <span>Conceito</span>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Vibe Escolhida</p>
          <p className="text-sm font-medium">{data.vibe}</p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Descrição</p>
          <p className="text-sm leading-relaxed">{data.description}</p>
        </div>
      </div>

      <div className="clay-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Globe size={18} />
          <span>Funcionalidades</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.features?.map((f: string) => (
            <span key={f} className="px-3 py-1 bg-primary/5 text-primary text-xs rounded-full border border-primary/10 font-bold">
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default DummyBriefing;
