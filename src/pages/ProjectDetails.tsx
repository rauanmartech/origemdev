import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { projectsData } from "../data/projectsData";
import { InteractivePreview } from "../components/InteractivePreview";
import { MobilePreviews } from "../components/MobilePreviews";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const project = projectsData.find(p => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center pt-32 px-4">
          <h1 className="text-4xl font-bold mb-4">Projeto não encontrado</h1>
          <Link to="/projetos" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar para projetos
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = project.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-16 md:py-32 px-4 relative">
        <div className="max-w-4xl mx-auto relative z-10">
          
          <Link to="/projetos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Voltar para projetos
          </Link>

          <div className="clay-card rounded-[2rem] p-8 md:p-12 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10 border border-primary/20">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground">
                {project.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((t) => (
                <span key={t} className="clay-badge">
                  {t}
                </span>
              ))}
            </div>

            {!project.fullDescription && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {project.description}
              </p>
            )}

            {project.link && (
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Acessar Projeto Oficial <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {project.fullDescription && (
            <div className="mb-16">
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">Sobre o Projeto</h2>
              <div className="space-y-6">
                {project.fullDescription.map((paragraph, idx) => (
                  <p key={idx} className="text-lg text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className="mb-16">
              <h3 className="font-display text-3xl font-bold text-foreground mb-8">
                Destaques do Projeto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="w-2.5 h-2.5 mt-2 rounded-full bg-primary shrink-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <p className="text-muted-foreground font-medium leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(project.video || project.image) && (
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-border/50">
              {project.video ? (
                <video 
                  src={project.video} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {project.previews && project.previews.length > 0 && (
            <div className="mt-16 space-y-12">
              {project.isMobile ? (
                <MobilePreviews previews={project.previews} />
              ) : (
                <>
                  <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                    Previews da Página
                  </h2>
                  {project.previews.map((preview, index) => (
                    <InteractivePreview key={index} title={preview.title} src={preview.image} />
                  ))}
                </>
              )}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetails;
