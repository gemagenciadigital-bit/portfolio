import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212]">
      {/* 
        The ScrollyCanvas component contains the 500vh container, 
        sticky HTML canvas matching sequence images, and the Overlay Component
      */}
      <ScrollyCanvas />
      
      {/* 
        Projects Component placed below the cinematic scroll, 
        giving space to explore other creative works
      */}
      <Projects />
    </main>
  );
}
