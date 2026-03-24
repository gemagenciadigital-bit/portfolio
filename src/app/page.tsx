import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      <Cursor />
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
      <Footer />
    </>
  );
}
