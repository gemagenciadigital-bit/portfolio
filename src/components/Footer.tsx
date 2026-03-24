import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0a0a] py-16 border-t border-white/5 relative z-20 overflow-hidden">
      
      {/* Background soft glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20 blur-[100px] pointer-events-none opacity-50" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-20 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left group cursor-pointer">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            GEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 font-bold ml-1 transition-all duration-500 group-hover:from-blue-400 group-hover:to-cyan-200">Agencia Digital</span>
          </h3>
          <p className="text-sm md:text-base text-gray-500 font-light mt-3 tracking-widest uppercase">
            Marketing Integral y Excelencia Visual
          </p>
        </div>

        {/* Action Button */}
        <a 
          href="https://www.instagram.com/gem.agenciadigital/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Button Hover Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-pink-400 group-hover:text-white transition-colors relative z-10">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          <span className="text-white font-semibold text-lg relative z-10 tracking-wide">
            Conecta con nosotros
          </span>
          <Zap className="w-5 h-5 text-gray-500 group-hover:text-yellow-400 transition-colors ml-2 relative z-10 fill-current opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 duration-300" />
        </a>
        
      </div>
      
      {/* Copyright Line */}
      <div className="mt-16 text-center border-t border-white/5 pt-8 relative z-10">
        <p className="text-xs text-gray-600 tracking-widest uppercase">
          © {new Date().getFullYear()} GEM Agencia Digital. Todos los derechos reservados.
        </p>
      </div>

    </footer>
  );
}
