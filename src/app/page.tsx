import ButtonClick from "./components/ButtonClick";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex flex-col justify-center text-white mx-auto min-h-screen items-center w-full bg-back1 bg-cover bg-center relative overflow-hidden">
      
      {/* Decorative Gradient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] bg-red-650/10 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="glass-card p-10 md:p-16 rounded-3xl text-center max-w-3xl mx-4 flex flex-col items-center space-y-8 shadow-2xl relative z-10 border border-white/10 select-none">
        
        {/* Animated Headline */}
        <h1 className="font-extrabold text-5xl sm:text-6xl md:text-8xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-100 to-green-400">
          APPTION
        </h1>

        <p className="text-xl md:text-2xl font-light text-neutral-300 max-w-lg leading-relaxed">
          Créez des pétitions, rassemblez des voix et <span className="text-green-400 font-medium">influencez le cours de l&apos;histoire</span> !
        </p>

        <Link href="/login" className="inline-block pt-4">
          <ButtonClick
            text="Démarrer le changement"
            classArrow="text-2xl"
            classButton="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-neutral-950 px-10 py-4.5 text-base font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
          />
        </Link>
      </div>
    </div>
  );
}
