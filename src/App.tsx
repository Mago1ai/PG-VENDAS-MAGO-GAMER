import { useState, useEffect, FormEvent } from "react";
import { 
  Flame, 
  ShieldCheck, 
  Zap, 
  Star, 
  ArrowRight, 
  Clock, 
  Award, 
  Check, 
  X, 
  Smartphone, 
  Tv, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Gamepad2,
  Tv2,
  Download,
  HelpCircle,
  MessageCircle,
  Play
} from "lucide-react";

// Legítimas capas em alta definição dos maiores clássicos do PS2 (Nostalgia Pura)
const CLASSIC_GAMES = [
  {
    title: "GTA San Andreas",
    desc: "O rei do PS2. Andar de bike em Los Santos, ouvir K-DST e códigos clássicos.",
    tag: "🏆 O MAIOR CLÁSSICO",
    image: "https://upload.wikimedia.org/wikipedia/pt/9/92/Grand_Theft_Auto_San_Andreas_capa.png",
    color: "from-amber-500/20 to-amber-500/5",
    glow: "shadow-amber-500/20",
    badge: "PT-BR"
  },
  {
    title: "God of War II",
    desc: "Kratos desafiando o Olimpo com lâminas do caos e batalhas épicas dubladas.",
    tag: "🔥 MAIS JOGADO",
    image: "https://upload.wikimedia.org/wikipedia/en/7/7e/God_of_War_II_cover.jpg",
    color: "from-red-500/20 to-red-500/5",
    glow: "shadow-red-500/20",
    badge: "DUBLADO"
  },
  {
    title: "Bomba Patch 100% Atualizado",
    desc: "Com narração clássica, times brasileiros de 2026 e músicas inesquecíveis.",
    tag: "⚽ PAIXÃO NACIONAL",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=500&q=80",
    color: "from-emerald-500/20 to-emerald-500/5",
    glow: "shadow-emerald-500/20",
    badge: "ATUALIZADO"
  },
  {
    title: "Resident Evil 4",
    desc: "Leon S. Kennedy na Espanha enfrentando o vilarejo com gráficos revolucionários.",
    tag: "🧟 TERROR LENDÁRIO",
    image: "https://upload.wikimedia.org/wikipedia/pt/3/33/Resident_Evil_4_capa.png",
    color: "from-blue-600/20 to-blue-600/5",
    glow: "shadow-blue-500/20",
    badge: "LEGENDADO"
  },
  {
    title: "NFS Underground 2",
    desc: "Riders on the Storm tocando, neon embaixo do carro e ronco do motor.",
    tag: "🚗 VELOCIDADE MÁXIMA",
    image: "https://upload.wikimedia.org/wikipedia/en/0/05/Need_for_Speed_Underground_2_box_art.jpg",
    color: "from-purple-500/20 to-purple-500/5",
    glow: "shadow-purple-500/20",
    badge: "100% SAVE"
  },
  {
    title: "Black",
    desc: "O ápice gráfico do PS2. Tiros pesados, destruição de cenário e adrenalina pura.",
    tag: "💥 PODER DE FOGO",
    image: "https://upload.wikimedia.org/wikipedia/en/9/91/Black_cover.jpg",
    color: "from-zinc-500/20 to-zinc-500/5",
    glow: "shadow-zinc-500/20",
    badge: "AÇÃO TOTAL"
  },
  {
    title: "DBZ Budokai Tenkaichi 3",
    desc: "Mais de 160 personagens, transformações em tempo real e batalhas pelo ar.",
    tag: "⚡ ANIME CLÁSSICO",
    image: "https://upload.wikimedia.org/wikipedia/en/6/6f/Dragon_Ball_Z_Budokai_Tenkaichi_3.jpg",
    color: "from-yellow-500/20 to-yellow-500/5",
    glow: "shadow-yellow-500/20",
    badge: "DUBLADO"
  },
  {
    title: "Def Jam Fight for NY",
    desc: "Snoop Dogg, Busta Rhymes e combates brutais nas ruas de Nova York.",
    tag: "🥊 LUTA BRUTAL",
    image: "https://upload.wikimedia.org/wikipedia/en/a/a2/Def_Jam_-_Fight_for_NY_Coverart.png",
    color: "from-indigo-500/20 to-indigo-500/5",
    glow: "shadow-indigo-500/20",
    badge: "HISTÓRICO"
  },
  {
    title: "Bully (Canis Canem Edit)",
    desc: "Jimmy Hopkins dominando a Bullworth Academy com estilingue e skate.",
    tag: "🎒 MUNDO ABERTO",
    image: "https://upload.wikimedia.org/wikipedia/pt/b/b5/Bully_capa.png",
    color: "from-orange-500/20 to-orange-500/5",
    glow: "shadow-orange-500/20",
    badge: "PT-BR"
  }
];

export default function App() {
  const [secondsLeft, setSecondsLeft] = useState(899); // 14m 59s
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [currentToastIndex, setCurrentToastIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  // Checkout states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [checkoutStep, setCheckoutStep] = useState<"form" | "loading" | "success">("form");
  const [generatedToken, setGeneratedToken] = useState("");

  // Social Proof Toasts
  const TOASTS = [
    { name: "Carlos M.", city: "São Paulo - SP", action: "garantiu o Kit Mago OPL", time: "há 2 min" },
    { name: "Rafael S.", city: "Belo Horizonte - MG", action: "baixou GTA San Andreas PT-BR", time: "há 5 min" },
    { name: "Luciano F.", city: "Curitiba - PR", action: "ativou o Token VIP Vitalício", time: "há 8 min" },
    { name: "Diego T.", city: "Rio de Janeiro - RJ", action: "reviveu o PS2 no Pendrive", time: "há 11 min" }
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 10 ? 899 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floating notifications
  useEffect(() => {
    const start = setTimeout(() => setShowToast(true), 2000);
    const interval = setInterval(() => {
      setShowToast(false);
      setTimeout(() => {
        setCurrentToastIndex((prev) => (prev + 1) % TOASTS.length);
        setShowToast(true);
      }, 500);
    }, 9000);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, []);

  const formatTime = (time: number) => {
    const m = Math.floor(time / 60);
    const s = time % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const scrollToOffer = () => {
    const target = document.getElementById("oferta-vip");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenCheckout = () => {
    setShowCheckoutModal(true);
    setCheckoutStep("form");
  };

  const handleProcessCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      alert("Por favor, preencha os dados obrigatórios.");
      return;
    }
    setCheckoutStep("loading");
    setTimeout(() => {
      const token = "MAGO-PS2-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedToken(token);
      setCheckoutStep("success");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#06070b] text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950 font-sans antialiased overflow-x-hidden">
      
      {/* RADIANT AMBIENT RETRO GLOWS (PlayStation Blue & Emerald) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#0070d1]/15 via-emerald-950/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-[#00d2ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* --- SEÇÃO 1: HERO SECTION (PRIMEIRA DOBRA COM NOSTALGIA PURA) --- */}
      <section className="relative pt-6 pb-12 px-4 max-w-6xl mx-auto flex flex-col justify-between" id="hero">
        
        {/* Simple Brand Header com Símbolos do PS2 */}
        <div className="flex items-center justify-between w-full pb-6 border-b border-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070d1]/15 border border-[#0070d1]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,112,209,0.3)]">
              <Gamepad2 className="w-6 h-6 text-[#00d2ff]" />
            </div>
            <div>
              <span className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-1.5">
                MAGO <span className="text-[#00d2ff]">GAMER</span>
              </span>
              <span className="text-[9px] font-bold text-zinc-500 tracking-widest block uppercase">
                O Portal Oficial do Retrogamer
              </span>
            </div>
          </div>

          {/* Símbolos Oficiais PlayStation (▲ ■ ● ✖) */}
          <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-black">
            <span className="text-[#00e676]">▲</span>
            <span className="text-[#f50057]">■</span>
            <span className="text-[#ff1744]">●</span>
            <span className="text-[#2979ff]">✖</span>
            <span className="text-zinc-400 text-[10px] uppercase tracking-wider ml-1">OPL 1-CLIQUE</span>
          </div>
        </div>

        {/* Hero Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8 md:py-14">
          
          {/* Left Emotional Copy block */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>OFERTA ESPECIAL: ACESSO VIP VITALÍCIO</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Reviva a <span className="bg-gradient-to-r from-[#00d2ff] via-blue-400 to-emerald-400 bg-clip-text text-transparent">Era de Ouro do PS2</span> Sem Dor de Cabeça!
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Lembra da sensação de ligar o videogame na sexta à noite? Nós criamos o <strong>Kit OPL 1-Clique</strong> + Biblioteca com <strong>+1.000 Jogos Prontos</strong> para você plugar no pendrive e jogar hoje mesmo.
            </p>

            {/* Micro bullet points for instant reading */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 text-zinc-200 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">+1.000 Jogos Testados</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Instalador Automático</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Zero Vírus / Sem Travar</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Suporte VIP no WhatsApp</span>
              </div>
            </div>

            {/* Giant clean responsive CTA button */}
            <div className="pt-3 space-y-3">
              <button
                onClick={scrollToOffer}
                className="w-full sm:w-auto px-8 py-4.5 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-lg sm:text-xl rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                id="hero_giant_cta"
              >
                <span>QUERO MEU ACESSO VIP AGORA</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Zap className="w-3.5 h-3.5" /> Entrega Imediata do Token
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Garantia de 7 Dias
                </span>
              </div>
            </div>

          </div>

          {/* Right Product Image block (Console PS2 + Pendrive + Memory Card Showcase) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#0070d1] to-emerald-500 rounded-3xl opacity-25 blur-2xl animate-pulse" />
            
            {/* Visual Nostalgic Frame */}
            <div className="relative bg-[#0b0d13] rounded-3xl border border-[#0070d1]/30 p-6 shadow-2xl space-y-5">
              
              {/* Header do Card */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">STATUS: ONLINE</span>
                </div>
                <span className="text-xs font-black text-[#00d2ff] bg-[#0070d1]/20 px-2.5 py-1 rounded-md border border-[#0070d1]/40">
                  V3.5.1 VIP
                </span>
              </div>

              {/* Showcase dos Jogos Rápidos */}
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="bg-zinc-900/80 rounded-xl p-2 text-center border border-zinc-800/80 hover:border-emerald-500/50 transition-colors">
                  <img src="https://upload.wikimedia.org/wikipedia/pt/9/92/Grand_Theft_Auto_San_Andreas_capa.png" alt="GTA" className="w-full h-24 object-cover rounded-lg mb-1.5 shadow" />
                  <span className="text-[10px] font-bold text-zinc-300 block truncate">GTA San Andreas</span>
                </div>
                <div className="bg-zinc-900/80 rounded-xl p-2 text-center border border-zinc-800/80 hover:border-emerald-500/50 transition-colors">
                  <img src="https://upload.wikimedia.org/wikipedia/en/7/7e/God_of_War_II_cover.jpg" alt="GOW2" className="w-full h-24 object-cover rounded-lg mb-1.5 shadow" />
                  <span className="text-[10px] font-bold text-zinc-300 block truncate">God of War II</span>
                </div>
                <div className="bg-zinc-900/80 rounded-xl p-2 text-center border border-zinc-800/80 hover:border-emerald-500/50 transition-colors">
                  <img src="https://upload.wikimedia.org/wikipedia/pt/3/33/Resident_Evil_4_capa.png" alt="RE4" className="w-full h-24 object-cover rounded-lg mb-1.5 shadow" />
                  <span className="text-[10px] font-bold text-zinc-300 block truncate">Resident Evil 4</span>
                </div>
              </div>

              {/* Memory Card + Pendrive Badges */}
              <div className="bg-[#12151f] rounded-2xl p-4 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-bold text-purple-400">
                    💾
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Kit Mago OPL 1-Clique</span>
                    <span className="text-[10px] text-zinc-400">Formatação & Injeção Automática</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  PLUG & PLAY
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic Metric bar */}
        <div className="grid grid-cols-3 gap-4 border-t border-zinc-900 pt-6 text-center text-zinc-400">
          <div>
            <span className="block text-2xl md:text-3xl font-black text-white">+1.480</span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Gamers Ativos</span>
          </div>
          <div className="border-x border-zinc-900">
            <span className="block text-2xl md:text-3xl font-black text-white">⭐ 4.9/5</span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Avaliações Positivas</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-black text-white">🚀 100%</span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Servidores Diretos</span>
          </div>
        </div>

      </section>

      {/* --- SEÇÃO 2: VITRINE VISUAL DE JOGOS CLÁSSICOS (GRID COM AS CAPAS HISTÓRICAS) --- */}
      <section className="py-16 px-4 bg-[#08090f] border-y border-zinc-900/80" id="vitrine">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1]/10 border border-[#0070d1]/30 text-xs font-bold text-[#00d2ff] uppercase">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>ACERVO VITALÍCIO LIBERADO</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Os Maiores Clássicos da Sua Vida
            </h2>
            <p className="text-sm md:text-base text-zinc-400">
              Mais de 1.000 jogos testados, compactados e prontos para rodar no seu PS2 sem travar.
            </p>
          </div>

          {/* Grid of Authentic 3D Game Cases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLASSIC_GAMES.map((game, i) => (
              <div 
                key={i}
                className="group relative bg-[#0e1017]/90 rounded-2xl border border-zinc-800/80 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#0070d1]/60 hover:shadow-[0_10px_30px_rgba(0,112,209,0.2)]"
              >
                {/* Visual Header bar representing typical original PS2 DVD case layout */}
                <div className="bg-[#141722] px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase flex items-center gap-1">
                    <span className="text-[#00d2ff]">PS2</span> SYSTEM
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                    {game.badge}
                  </span>
                </div>

                {/* Cover Art Wrapper with Zoom and Light Glow */}
                <div className="relative h-72 overflow-hidden bg-zinc-950 flex items-center justify-center p-3">
                  <img 
                    src={game.image} 
                    alt={`Capa do jogo ${game.title}`}
                    referrerPolicy="no-referrer"
                    className="h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 rounded"
                  />
                  {/* Floating Action Text overlay */}
                  <div className="absolute bottom-3 left-3 bg-zinc-950/90 text-[10px] text-emerald-400 font-bold px-2 py-1 rounded border border-emerald-500/30 uppercase flex items-center gap-1">
                    <Check className="w-3 h-3" /> Testado no OPL
                  </div>
                </div>

                {/* Details layout */}
                <div className="p-5 space-y-2 border-t border-zinc-900 bg-[#0c0e14]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-lg text-white tracking-tight">
                      {game.title}
                    </h3>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase bg-zinc-900 px-1.5 py-0.5 rounded">
                      {game.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-light">
                    {game.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-zinc-400 mb-6 font-medium">
              ...e mais de 1.000 outros jogos de PS2, PS1 e Emuladores prontos para baixar!
            </p>
            <button 
              onClick={scrollToOffer}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-base md:text-lg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 cursor-pointer uppercase"
            >
              QUERO ACESSAR TODOS OS JOGOS
            </button>
          </div>

        </div>
      </section>

      {/* --- SEÇÃO 3: 3 PASSOS SIMPLES --- */}
      <section className="py-16 px-4 max-w-5xl mx-auto" id="passos">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 block">
            SUPER FÁCIL E RÁPIDO
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Como Funciona em 3 Passos:
          </h2>
        </div>

        {/* Easy 1-2-3 Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#0e1017] border border-zinc-800/80 p-6 rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-[#0070d1]/15 border border-[#0070d1]/30 flex items-center justify-center font-black text-[#00d2ff] text-lg">
              1
            </div>
            <h3 className="font-extrabold text-lg text-white">Conecte o Pendrive</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Espete seu pendrive ou HD externo no computador. Qualquer tamanho funciona!
            </p>
          </div>

          <div className="bg-[#0e1017] border border-zinc-800/80 p-6 rounded-2xl space-y-3 relative">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center font-black text-purple-400 text-lg">
              2
            </div>
            <h3 className="font-extrabold text-lg text-white">Passe com 1-Clique</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use o instalador automático do Mago. Ele formata e coloca o jogo pronto no pendrive.
            </p>
          </div>

          <div className="bg-[#0e1017] border border-emerald-500/40 p-6 rounded-2xl space-y-3 relative shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-lg">
              3
            </div>
            <h3 className="font-extrabold text-lg text-white">Plugue no PS2 e Jogue!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Conecte no seu console e pronto! Seus jogos favoritos carregam na hora.
            </p>
          </div>

        </div>

      </section>

      {/* --- SEÇÃO 4: OFERTA IRRESISTÍVEL & CRONÔMETRO (R$ 29,90) --- */}
      <section className="py-16 px-4 max-w-4xl mx-auto" id="oferta-vip">
        
        {/* Banner de Urgência */}
        <div className="mb-6 py-2.5 px-4 bg-red-500/10 border border-red-500/30 rounded-xl text-center flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-red-400 animate-pulse">
          <Clock className="w-4 h-4" />
          <span>ESTA OFERTA COM DESCONTO EXPIRA EM: <strong className="text-white font-mono text-base">{formatTime(secondsLeft)}</strong></span>
        </div>

        <div className="relative bg-gradient-to-b from-[#0e1017] to-[#07080c] rounded-3xl border-2 border-emerald-500/40 p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Lista de Benefícios */}
            <div className="md:col-span-7 space-y-5">
              <span className="text-xs font-black uppercase tracking-widest text-[#00d2ff] bg-[#0070d1]/20 px-3 py-1 rounded-md border border-[#0070d1]/40">
                ACESSO COMPLETO + TOKEN VIP
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Tudo o Que Você Vai Receber:
              </h2>

              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span><strong>Kit Mago OPL 1-Clique:</strong> Instalador automático de jogos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span><strong>+1.000 Jogos de PS2 e PS1</strong> em servidores ultra rápidos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span><strong>Videoaulas Práticas:</strong> Passo a passo do zero</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span><strong>Token de Acesso Vitalício</strong> (sem mensalidades)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span><strong>Suporte Direto no WhatsApp</strong></span>
                </li>
              </ul>
            </div>

            {/* Caixa de Preço */}
            <div className="md:col-span-5 bg-[#06070b] p-6 rounded-2xl border border-zinc-800 text-center space-y-4 shadow-xl">
              <span className="text-xs font-bold text-zinc-400 line-through block">
                De R$ 97,00 por apenas:
              </span>
              <div>
                <span className="text-4xl sm:text-5xl font-black text-white">
                  R$ 29<span className="text-2xl font-bold text-emerald-400">,90</span>
                </span>
                <span className="block text-[11px] text-zinc-400 mt-1">
                  Pagamento Único • Acesso Vitalício
                </span>
              </div>

              <button
                onClick={handleOpenCheckout}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-zinc-950 font-black text-lg rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                id="main_checkout_cta"
              >
                <span>COMPRAR MEU TOKEN AGORA</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-[10px] text-zinc-500 space-y-1">
                <p>🔒 Pagamento 100% Seguro via PIX ou Cartão</p>
                <p>⚡ Token enviado na hora após confirmação</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* --- SEÇÃO 5: GARANTIA DE 7 DIAS --- */}
      <section className="py-12 px-4 max-w-3xl mx-auto text-center">
        <div className="bg-[#0e1017] border border-zinc-800 p-8 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white">Garantia Blindada de 7 Dias</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Se por qualquer motivo você não conseguir rodar seus jogos ou achar que o Mago Gamer não é pra você, basta nos mandar uma mensagem no WhatsApp que devolvemos 100% do seu dinheiro. Risco Zero!
          </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 px-4 border-t border-zinc-900 text-center text-xs text-zinc-500 space-y-2">
        <p>© {new Date().getFullYear()} Mago Gamer • Tropa do Dragão. Todos os direitos reservados.</p>
        <p className="text-[10px] text-zinc-600">Este site não tem afiliação oficial com a Sony Interactive Entertainment. PlayStation e PS2 são marcas registradas.</p>
      </footer>

      {/* --- FLOATING SOCIAL PROOF TOAST --- */}
      {showToast && (
        <div className="fixed bottom-4 left-4 z-50 bg-[#0e1017]/95 border border-[#0070d1]/40 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left leading-tight">
            <p className="text-xs font-bold text-white">
              {TOASTS[currentToastIndex].name} <span className="text-[10px] text-zinc-500 font-normal">({TOASTS[currentToastIndex].city})</span>
            </p>
            <p className="text-[11px] text-emerald-400">
              {TOASTS[currentToastIndex].action}
            </p>
            <span className="text-[9px] text-zinc-500">{TOASTS[currentToastIndex].time}</span>
          </div>
        </div>
      )}

      {/* --- MODAL DE CHECKOUT SIMPLES & DIRETO --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1017] border border-zinc-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl animate-scale-in">
            
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === "form" && (
              <form onSubmit={handleProcessCheckout} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">CHECKOUT SEGURO</span>
                  <h3 className="text-2xl font-black text-white">Garantir Token VIP</h3>
                  <p className="text-xs text-zinc-400">Valor com desconto: <strong className="text-emerald-400 font-bold text-sm">R$ 29,90</strong></p>
                </div>

                <div className="space-y-3 text-left">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Seu Nome Completo:</label>
                    <input 
                      type="text" 
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Seu E-mail (onde receberá o Token):</label>
                    <input 
                      type="email" 
                      required
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="seuemail@gmail.com"
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:border-emerald-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Forma de Pagamento:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === "pix" 
                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-400" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        ⚡ PIX (Imediato)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === "card" 
                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-400" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-400"
                        }`}
                      >
                        💳 Cartão de Crédito
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-base rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-102 cursor-pointer mt-2"
                >
                  PAGAR R$ 29,90 E LIBERAR ACESSO
                </button>
              </form>
            )}

            {checkoutStep === "loading" && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-lg font-bold text-white">Gerando seu Token VIP...</h4>
                <p className="text-xs text-zinc-400">Conectando aos servidores seguros do Mago Gamer</p>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="py-4 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">Acesso VIP Liberado!</h4>
                  <p className="text-xs text-zinc-400">Seu Token de Acesso permanente foi gerado com sucesso:</p>
                </div>

                <div className="p-4 bg-zinc-950 border border-emerald-500/40 rounded-2xl">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Seu Token Mágico:</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-emerald-400 tracking-wider">
                    {generatedToken}
                  </span>
                </div>

                <a
                  href="https://mago4.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-base rounded-xl shadow-lg transition-all"
                >
                  ENTRAR NO MAGO GAMER AGORA
                </a>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
