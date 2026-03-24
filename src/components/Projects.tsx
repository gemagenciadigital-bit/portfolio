import { ArrowUpRight, Megaphone, Video, Image as ImageIcon, LineChart, Search, Globe } from "lucide-react";

const PROJECT_DATA = [
  {
    title: "Inmobiliaria Premium",
    description: "Plataforma de propiedades con buscador avanzado y sistema de alto rendimiento.",
    tags: ["Desarrollo Web", "SEO Local", "Meta Ads"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
  },
  {
    title: "Centro de Estética",
    description: "Presencia digital elegante orientada a la reserva de turnos e identidad visual.",
    tags: ["Diseño Web", "Instagram", "Estrategia"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
  },
  {
    title: "Centro Holístico",
    description: "Espacio digital sereno para terapeutas, reservas y programas de bienestar.",
    tags: ["Web Design", "Reels", "Identidad"],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2720&ixlib=rb-4.0.3",
  },
  {
    title: "Clínica de Odontología",
    description: "Embudo corporativo enfocado en conversión y captación de pacientes.",
    tags: ["Landing Page", "Performance", "Campañas"],
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
  },
];

const SERVICES = [
  {
    title: "Desarrollo de Sitios Web",
    description: "Soluciones a medida con tecnologías modernas para asegurar velocidad y conversión.",
    icon: Globe,
  },
  {
    title: "Diseño para Instagram",
    description: "Creación de imágenes de alto impacto visual y un feed magnético y profesional.",
    icon: ImageIcon,
  },
  {
    title: "Edición de Videos REELS",
    description: "Edición de videos cortos dinámicos pensados para maximizar la retención de la audiencia.",
    icon: Video,
  },
  {
    title: "Campañas en Meta",
    description: "Publicidad hiper-segmentada en Facebook e Instagram para escalar el ROI.",
    icon: Megaphone,
  },
  {
    title: "Estrategia de Mercado",
    description: "Investigación, análisis de competencia y definición de la ruta comercial óptima.",
    icon: LineChart,
  },
  {
    title: "Optimización SEO",
    description: "Posicionamiento orgánico y escalable para ganar verdadero terreno en buscadores.",
    icon: Search,
  },
];

export default function Projects() {
  return (
    <section className="relative w-full bg-[#0a0a0a] border-t border-white/5 py-32 px-4 md:px-20 z-20">
      
      {/* SECCIÓN PORTAFOLIO WEB */}
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl md:text-6xl font-bold mb-16 text-white drop-shadow-md">
          Proyectos <span className="font-light italic text-gray-400">Destacados.</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {PROJECT_DATA.map((project, idx) => (
            <div 
              key={idx}
              className="glass rounded-2xl overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-2 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none transition-opacity duration-300 group-hover:opacity-70" />
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-80 object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end">
                <div className="flex justify-between items-end">
                  <div>
                     <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                       {project.title}
                     </h3>
                     <p className="text-sm text-gray-300 font-light max-w-sm">
                       {project.description}
                     </p>
                  </div>
                  <div className="w-12 h-12 rounded-full glass flex justify-center items-center group-hover:bg-white group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {project.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-white/10 text-white/80 border border-white/10 backdrop-blur-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DE MARKETING DIGITAL INTEGRAL */}
      <div className="mx-auto max-w-7xl mt-40">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md leading-tight">
            Mucho más que código.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Marketing Digital Integral.</span>
          </h2>
          <p className="mt-6 text-xl text-gray-400 font-light leading-relaxed">
            Mi enfoque es 360°. Un sitio web hermoso sólo es el punto de partida. Cuento con las herramientas para diseñar y ejecutar toda la ruta de captación y fidelización de tus clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div 
                key={idx}
                className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors border border-white/5 hover:border-white/20"
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 tracking-wide">
                  {service.title}
                </h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
    </section>
  );
}
