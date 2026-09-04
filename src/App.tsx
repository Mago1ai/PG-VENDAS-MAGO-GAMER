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
  Play,
  HardDrive,
  Cpu,
  Layers,
  FolderDown
} from "lucide-react";
import { getPS2Cover3D, getBoxartUrl } from "./services/coverService";

// Capas 3D Oficiais em Alta Definição extraídas direto da API do Mago Gamer (xlenore/ps2-covers)
const CLASSIC_GAMES = [
  {
    title: "Grand Theft Auto: San Andreas",
    serial: "SLUS-20946",
    desc: "O clássico supremo com legendas e rádios em PT-BR. Carl Johnson em Los Santos.",
    tag: "🏆 MAIS JOGADO",
    badge: "PT-BR",
    coverUrl: getPS2Cover3D("SLUS-20946")
  },
  {
    title: "God of War II",
    serial: "SCUS-97481",
    desc: "Kratos destruindo os Deuses do Olimpo em combate cinematográfico dublado.",
    tag: "🔥 LENDÁRIO",
    badge: "DUBLADO",
    coverUrl: getPS2Cover3D("SCUS-97481")
  },
  {
    title: "Bomba Patch 100% Atualizado",
    serial: "SLUS-21820",
    desc: "Elencos de 2026, narração clássica e os maiores times do futebol brasileiro.",
    tag: "⚽ FUTEBOL",
    badge: "100% ATUAL",
    coverUrl: getPS2Cover3D("SLUS-21820")
  },
  {
    title: "Resident Evil 4",
    serial: "SLUS-21134",
    desc: "Leon enfrentando Las Plagas com armas tunadas e gráficos revolucionários.",
    tag: "🧟 TERROR",
    badge: "LEGENDADO",
    coverUrl: getPS2Cover3D("SLUS-21134")
  },
  {
    title: "Need for Speed: Underground 2",
    serial: "SLUS-21065",
    desc: "Riders on the Storm, personalização total, neon e trilha sonora perfeita.",
    tag: "🚗 VELOCIDADE",
    badge: "SAVE 100%",
    coverUrl: getPS2Cover3D("SLUS-21065")
  },
  {
    title: "Black",
    serial: "SLUS-21376",
    desc: "O jogo de tiro mais pesado do PS2. Efeitos de explosão e som de cinema.",
    tag: "💥 FPS CLÁSSICO",
    badge: "AÇÃO PURA",
    coverUrl: getPS2Cover3D("SLUS-21376")
  },
  {
    title: "Dragon Ball Z: Budokai Tenkaichi 3",
    serial: "SLUS-21670",
    desc: "Mais de 160 guerreiros Z com dublagem brasileira clássica de anime.",
    tag: "⚡ ANIME",
    badge: "DUBLADO",
    coverUrl: getPS2Cover3D("SLUS-21670")
  },
  {
    title: "Def Jam: Fight for NY",
    serial: "SLUS-21004",
    desc: "Combates brutais com lendas do rap mundial nas ruas de Nova York.",
    tag: "🥊 LUTA",
    badge: "HISTÓRICO",
    coverUrl: getPS2Cover3D("SLUS-21004")
  },
  {
    title: "Bully (Canis Canem Edit)",
    serial: "SLUS-21269",
    desc: "Jimmy Hopkins dominando a Bullworth Academy. Missões clássicas em PT-BR.",
    tag: "🎒 MUNDO ABERTO",
    badge: "PT-BR",
    coverUrl: getPS2Cover3D("SLUS-21269")
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
    { name: "Lucas A.", city: "São Paulo - SP", action: "baixou GTA San Andreas PT-BR", time: "agora mesmo" },
    { name: "Marcos V.", city: "Belo Horizonte - MG", action: "garantiu o Kit Mago OPL", time: "há 2 min" },
    { name: "Rodrigo P.", city: "Curitiba - PR", action: "ativou o Token VIP Vitalício", time: "há 4 min" },
    { name: "Alexandre G.", city: "Rio de Janeiro - RJ", action: "instalou God of War II no PenDrive", time: "há 7 min" }
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
    const start = setTimeout(() => setShowToast(true), 1500);
    const interval = setInterval(() => {
      setShowToast(false);
      setTimeout(() => {
        setCurrentToastIndex((prev) => (prev + 1) % TOASTS.length);
        setShowToast(true);
      }, 500);
    }, 8000);

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
    <div className="relative min-h-screen bg-[#06070b] text-white selection:bg-[#0070d1] selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* CORES OFICIAIS SONY PLAYSTATION 2 & MAGO GAMER (GLOWS AMBIENTES) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-[#003791]/30 via-[#0070d1]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[400px] h-[400px] bg-[#00d2ff]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-4 w-[450px] h-[450px] bg-[#003791]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* --- HEADER: IDENTIDADE PLAYSTATION 2 & MAGO GAMER --- */}
      <header className="border-b border-[#0070d1]/20 bg-[#06070b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Mago Gamer" 
              className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(0,112,209,0.8)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                MAGO <span className="text-[#00d2ff] drop-shadow-[0_0_8px_#00d2ff]">GAMER</span>
              </span>
              <span className="text-[9px] font-bold text-zinc-400 tracking-widest block uppercase">
                Área VIP Oficial PlayStation 2 & Retrô
              </span>
            </div>
          </div>

          {/* Símbolos Oficiais do Controle PlayStation (▲ ■ ● ✖) */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0a0d16] border border-[#0070d1]/30 text-xs font-black shadow-[0_0_15px_rgba(0,112,209,0.15)]">
            <span className="text-[#00e676] drop-shadow-[0_0_6px_#00e676]">▲</span>
            <span className="text-[#f50057] drop-shadow-[0_0_6px_#f50057]">■</span>
            <span className="text-[#ff1744] drop-shadow-[0_0_6px_#ff1744]">●</span>
            <span className="text-[#2979ff] drop-shadow-[0_0_6px_#2979ff]">✖</span>
            <span className="text-zinc-300 text-[10px] uppercase tracking-wider ml-1 font-mono">KIT OPL V22</span>
          </div>
        </div>
      </header>

      {/* --- SEÇÃO 1: HERO SECTION (PRIMEIRA DOBRA COM NOSTALGIA IMEDIATA) --- */}
      <section className="relative pt-8 pb-14 px-4 max-w-6xl mx-auto" id="hero">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Lado Esquerdo: Copy Direta sem enrolação */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0070d1]/15 border border-[#00d2ff]/40 text-xs text-[#00d2ff] font-extrabold tracking-wider uppercase shadow-[0_0_15px_rgba(0,210,255,0.25)]">
              <Zap className="w-4 h-4 text-[#00d2ff] animate-pulse" />
              <span>SISTEMA OPL 1-CLIQUE • JOGUE NO PENDRIVE</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Reviva a <span className="bg-gradient-to-r from-[#00d2ff] via-[#2979ff] to-[#00e676] bg-clip-text text-transparent drop-shadow">Era de Ouro do PS2</span> Sem Passar Raiva!
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Chega de gravar DVD que não lê, baixar ISO corrompida ou quebrar a cabeça com tutoriais complicados. Nós entregamos o <strong>Kit Mago OPL 1-Clique</strong> + <strong>Mais de 1.000 Jogos Testados</strong> para você plugar no pendrive e jogar hoje mesmo.
            </p>

            {/* Checklist de Dores Resolvidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2.5 text-zinc-200 bg-[#0c101c] p-2.5 rounded-xl border border-[#0070d1]/20">
                <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">+1.000 Jogos (Dublados & PT-BR)</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-200 bg-[#0c101c] p-2.5 rounded-xl border border-[#0070d1]/20">
                <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Formatador & Instalador Automático</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-200 bg-[#0c101c] p-2.5 rounded-xl border border-[#0070d1]/20">
                <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Zero Vírus • Download 100% Direto</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-200 bg-[#0c101c] p-2.5 rounded-xl border border-[#0070d1]/20">
                <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Suporte VIP direto no WhatsApp</span>
              </div>
            </div>

            {/* Botão de Ação Imediata (Cor do Triângulo Verde PS2) */}
            <div className="pt-2 space-y-3">
              <button
                onClick={scrollToOffer}
                className="w-full sm:w-auto px-8 py-4.5 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-zinc-950 font-black text-lg sm:text-xl rounded-2xl shadow-[0_0_30px_rgba(0,230,118,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                id="hero_cta_ps2"
              >
                <span>QUERO MEU ACESSO VIP (R$ 29,90)</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-[#00d2ff] font-bold">
                  <Zap className="w-3.5 h-3.5 text-[#00d2ff]" /> Entrega Instantânea do Token
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0070d1]" /> Garantia Blindada de 7 Dias
                </span>
              </div>
            </div>

          </div>

          {/* Lado Direito: Showcase Real do Kit OPL + PS2 Slim */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#0070d1] to-[#00d2ff] rounded-3xl opacity-25 blur-2xl animate-pulse" />
            
            <div className="relative bg-[#0b0e17] rounded-3xl border border-[#0070d1]/40 p-6 shadow-2xl space-y-5">
              
              {/* Header do Card com o Console PS2 */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
                <div className="flex items-center gap-2">
                  <img src="/icons/ps2_real.jpg" alt="PS2 Console" className="w-8 h-8 rounded-lg object-cover border border-[#0070d1]/30" onError={(e) => e.currentTarget.style.display='none'} />
                  <div>
                    <span className="text-xs font-black text-white block uppercase">PLAYSTATION 2 SYSTEM</span>
                    <span className="text-[10px] text-[#00d2ff] font-bold">COMPATÍVEL COM TODOS OS MODELOS</span>
                  </div>
                </div>
                <span className="text-xs font-black text-[#00e676] bg-[#00e676]/10 px-2.5 py-1 rounded-md border border-[#00e676]/30">
                  100% TESTADO
                </span>
              </div>

              {/* Destaque das 3 Capas 3D Oficiais (GTA, GOW2 e RE4) */}
              <div className="grid grid-cols-3 gap-2.5 py-1">
                <div className="bg-[#080a10] rounded-xl p-1.5 text-center border border-[#0070d1]/20 hover:border-[#00d2ff] transition-all hover:-translate-y-1 shadow-lg">
                  <img src={getPS2Cover3D("SLUS-20946")} alt="GTA SA" className="w-full h-28 object-contain rounded drop-shadow-md mb-1" />
                  <span className="text-[10px] font-bold text-zinc-300 block truncate">GTA San Andreas</span>
                </div>
                <div className="bg-[#080a10] rounded-xl p-1.5 text-center border border-[#0070d1]/20 hover:border-[#00d2ff] transition-all hover:-translate-y-1 shadow-lg">
                  <img src={getPS2Cover3D("SCUS-97481")} alt="God of War II" className="w-full h-28 object-contain rounded drop-shadow-md mb-1" />
                  <span className="text-[10px] font-bold text-zinc-300 block truncate">God of War II</span>
                </div>
                <div className="bg-[#080a10] rounded-xl p-1.5 text-center border border-[#0070d1]/20 hover:border-[#00d2ff] transition-all hover:-translate-y-1 shadow-lg">
                  <img src={getPS2Cover3D("SLUS-21134")} alt="Resident Evil 4" className="w-full h-28 object-contain rounded drop-shadow-md mb-1" />
                  <span className="text-[10px] font-bold text-zinc-300 block truncate">Resident Evil 4</span>
                </div>
              </div>

              {/* Kit Mago OPL Banner Oficial */}
              <div className="bg-gradient-to-r from-[#0c1222] to-[#090d18] rounded-2xl p-4 border border-[#0070d1]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0070d1]/20 border border-[#0070d1]/40 flex items-center justify-center font-bold text-[#00d2ff]">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">Kit Mago OPL 1-Clique</span>
                    <span className="text-[10px] text-zinc-400">USBUtility + GUIFormat + OPL Manager</span>
                  </div>
                </div>
                <span className="text-[10px] font-black text-[#00e676] bg-[#00e676]/10 px-2 py-1 rounded border border-[#00e676]/30 uppercase">
                  PLUG & PLAY
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Métricas de Prova Social */}
        <div className="grid grid-cols-3 gap-4 border-t border-[#0070d1]/20 pt-6 text-center text-zinc-400 mt-6">
          <div>
            <span className="block text-2xl md:text-3xl font-black text-white">+1.480</span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Gamers Ativos</span>
          </div>
          <div className="border-x border-[#0070d1]/20">
            <span className="block text-2xl md:text-3xl font-black text-[#00d2ff]">⭐ 4.9/5</span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Avaliações Positivas</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-black text-[#00e676]">🚀 100%</span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Downloads Rápidos</span>
          </div>
        </div>

      </section>

      {/* --- SEÇÃO 2: VITRINE DAS CAPAS 3D OFICIAIS DO PS2 --- */}
      <section className="py-16 px-4 bg-[#080b14] border-y border-[#0070d1]/20" id="vitrine">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1]/15 border border-[#0070d1]/40 text-xs font-extrabold text-[#00d2ff] uppercase">
              <Gamepad2 className="w-4 h-4" />
              <span>CAPAS 3D OFICIAIS DO ACERVO</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Os Maiores Clássicos que Marcaram Sua Vida
            </h2>
            <p className="text-sm md:text-base text-zinc-300">
              Mais de 1.000 jogos testados no OPL, organizados, compactados e prontos para passar pro seu pendrive.
            </p>
          </div>

          {/* Grid com Capas 3D Oficiais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CLASSIC_GAMES.map((game, i) => (
              <div 
                key={i}
                className="group relative bg-[#0d111d]/90 rounded-2xl border border-[#0070d1]/30 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#00d2ff] hover:shadow-[0_10px_35px_rgba(0,112,209,0.35)]"
              >
                {/* Header Estilo Case Original PS2 */}
                <div className="bg-[#090d16] px-4 py-2 border-b border-[#0070d1]/20 flex items-center justify-between">
                  <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase flex items-center gap-1.5">
                    <span className="text-[#00d2ff]">PLAYSTATION 2</span>
                    <span className="text-zinc-600 font-mono">[{game.serial}]</span>
                  </span>
                  <span className="text-[9px] font-extrabold text-[#00e676] bg-[#00e676]/10 px-2 py-0.5 rounded uppercase">
                    {game.badge}
                  </span>
                </div>

                {/* Exibição da Capa 3D Oficial com Relevo e Sombra */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-b from-[#080b12] to-[#04060a] flex items-center justify-center p-3">
                  <img 
                    src={game.coverUrl} 
                    alt={`Capa oficial 3D de ${game.title}`}
                    loading="lazy"
                    className="h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback seguro caso a imagem falhe
                      e.currentTarget.src = `https://placehold.co/300x450/090d16/00d2ff?text=${encodeURIComponent(game.title)}&font=roboto`;
                    }}
                  />
                  <div className="absolute bottom-3 left-3 bg-[#060810]/95 text-[10px] text-[#00e676] font-bold px-2 py-1 rounded border border-[#00e676]/30 uppercase flex items-center gap-1">
                    <Check className="w-3 h-3" /> Testado no OPL
                  </div>
                </div>

                {/* Detalhes do Jogo */}
                <div className="p-5 space-y-2 border-t border-[#0070d1]/20 bg-[#0a0d16]">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-black text-lg text-white tracking-tight truncate">
                      {game.title}
                    </h3>
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
              ...e mais de 1.000 outros jogos de PS2, PS1 e Emuladores liberados para você baixar!
            </p>
            <button 
              onClick={scrollToOffer}
              className="px-8 py-4 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] text-zinc-950 font-black text-base md:text-lg rounded-xl shadow-[0_0_25px_rgba(0,230,118,0.3)] transition-all hover:scale-105 cursor-pointer uppercase font-display"
            >
              LIBERAR TODOS OS JOGOS NA ÁREA VIP
            </button>
          </div>

        </div>
      </section>

      {/* --- SEÇÃO 3: 3 PASSOS SIMPLES (PLUG & PLAY) --- */}
      <section className="py-16 px-4 max-w-5xl mx-auto" id="passos">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#00d2ff] block">
            SEM COMPLICAÇÃO
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            Como Funciona em 3 Passos:
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#0c101c] border border-[#0070d1]/30 p-6 rounded-2xl space-y-3 relative shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-[#0070d1]/20 border border-[#0070d1]/40 flex items-center justify-center font-black text-[#00d2ff] text-xl">
              1
            </div>
            <h3 className="font-extrabold text-lg text-white">Conecte o Pendrive</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Conecte seu pendrive ou HD externo no computador. Qualquer marca ou tamanho funciona perfeitamente!
            </p>
          </div>

          <div className="bg-[#0c101c] border border-[#0070d1]/30 p-6 rounded-2xl space-y-3 relative shadow-lg">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-black text-purple-400 text-xl">
              2
            </div>
            <h3 className="font-extrabold text-lg text-white">Passe com 1-Clique</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use o Kit Mago OPL automático. Ele formata e coloca a estrutura de pastas e jogos pronta no pendrive.
            </p>
          </div>

          <div className="bg-[#0c101c] border border-[#00e676]/40 p-6 rounded-2xl space-y-3 relative shadow-[0_0_25px_rgba(0,230,118,0.15)]">
            <div className="w-11 h-11 rounded-xl bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center font-black text-[#00e676] text-xl">
              3
            </div>
            <h3 className="font-extrabold text-lg text-white">Plugue no PS2 e Jogue!</h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Ligue seu console e divirta-se com os clássicos carregando instantaneamente na sua tela!
            </p>
          </div>

        </div>

      </section>

      {/* --- SEÇÃO 4: OFERTA IRRESISTÍVEL (R$ 29,90) --- */}
      <section className="py-16 px-4 max-w-4xl mx-auto" id="oferta-vip">
        
        {/* Banner de Urgência */}
        <div className="mb-6 py-2.5 px-4 bg-red-500/15 border border-red-500/40 rounded-xl text-center flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-red-400 animate-pulse">
          <Clock className="w-4 h-4" />
          <span>ESTA CONDIÇÃO PROMOCIONAL EXPIRA EM: <strong className="text-white font-mono text-base">{formatTime(secondsLeft)}</strong></span>
        </div>

        <div className="relative bg-gradient-to-b from-[#0c101d] to-[#060810] rounded-3xl border-2 border-[#00e676]/50 p-8 sm:p-10 shadow-[0_0_50px_rgba(0,230,118,0.2)]">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Lista de Benefícios */}
            <div className="md:col-span-7 space-y-5">
              <span className="text-xs font-black uppercase tracking-widest text-[#00d2ff] bg-[#0070d1]/20 px-3 py-1 rounded-md border border-[#0070d1]/40">
                ACESSO VITALÍCIO • TOKEN IMEDIATO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                O Que Você Vai Receber Agora:
              </h2>

              <ul className="space-y-3 text-xs sm:text-sm text-zinc-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#00e676] shrink-0" />
                  <span><strong>Kit Mago OPL 1-Clique:</strong> Programas oficiais de formatação e injeção</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#00e676] shrink-0" />
                  <span><strong>Biblioteca com +1.000 Jogos</strong> (PS2, PS1 e Retrô em alta velocidade)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#00e676] shrink-0" />
                  <span><strong>Videoaulas Práticas:</strong> Aprenda a rodar do zero em 5 minutos</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#00e676] shrink-0" />
                  <span><strong>Token de Acesso Permanente</strong> (sem mensalidades ou taxas ocultas)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-[#00e676] shrink-0" />
                  <span><strong>Suporte VIP Individual no WhatsApp</strong></span>
                </li>
              </ul>
            </div>

            {/* Box de Preço Oficial */}
            <div className="md:col-span-5 bg-[#080b12] p-6 rounded-2xl border border-[#0070d1]/30 text-center space-y-4 shadow-2xl">
              <span className="text-xs font-bold text-zinc-500 line-through block">
                De R$ 97,00 por apenas:
              </span>
              <div>
                <span className="text-4xl sm:text-5xl font-black text-white">
                  R$ 29<span className="text-2xl font-bold text-[#00e676]">,90</span>
                </span>
                <span className="block text-[11px] text-zinc-400 mt-1">
                  Pagamento Único • Acesso Imediato
                </span>
              </div>

              <button
                onClick={handleOpenCheckout}
                className="w-full py-4 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-zinc-950 font-black text-lg rounded-xl shadow-[0_0_25px_rgba(0,230,118,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                id="main_checkout_button"
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
        <div className="bg-[#0c101c] border border-[#0070d1]/30 p-8 rounded-3xl space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center mx-auto text-[#00e676]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white">Garantia Blindada de 7 Dias</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Se você não conseguir rodar seus jogos no PS2 ou achar que o material não te atendeu, mande uma mensagem no suporte que devolvemos 100% do seu dinheiro. Sem perguntas e sem letras miúdas!
          </p>
        </div>
      </section>

      {/* --- FOOTER OFICIAL --- */}
      <footer className="py-8 px-4 border-t border-[#0070d1]/20 text-center text-xs text-zinc-500 space-y-2 bg-[#04060a]">
        <p>© {new Date().getFullYear()} Mago Gamer • Todos os direitos reservados.</p>
        <p className="text-[10px] text-zinc-600">PlayStation e PS2 são marcas registradas da Sony Interactive Entertainment.</p>
      </footer>

      {/* --- NOTIFICAÇÃO FLUTUANTE DE PROVA SOCIAL --- */}
      {showToast && (
        <div className="fixed bottom-4 left-4 z-50 bg-[#0c101c]/95 border border-[#0070d1]/50 backdrop-blur-md p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-xs">
          <div className="w-9 h-9 rounded-xl bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#00e676]" />
          </div>
          <div className="text-left leading-tight">
            <p className="text-xs font-bold text-white">
              {TOASTS[currentToastIndex].name} <span className="text-[10px] text-zinc-500 font-normal">({TOASTS[currentToastIndex].city})</span>
            </p>
            <p className="text-[11px] text-[#00d2ff] font-semibold">
              {TOASTS[currentToastIndex].action}
            </p>
            <span className="text-[9px] text-zinc-500">{TOASTS[currentToastIndex].time}</span>
          </div>
        </div>
      )}

      {/* --- MODAL DE CHECKOUT DIRETO COM TOKEN --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c101c] border border-[#0070d1]/40 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-[0_0_50px_rgba(0,112,209,0.3)] animate-scale-in">
            
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutStep === "form" && (
              <form onSubmit={handleProcessCheckout} className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-[#00e676] uppercase tracking-widest">CHECKOUT VIP SEGURO</span>
                  <h3 className="text-2xl font-black text-white">Liberar Token de Acesso</h3>
                  <p className="text-xs text-zinc-400">Investimento único: <strong className="text-[#00e676] font-bold text-sm">R$ 29,90</strong></p>
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
                      className="w-full px-4 py-3 bg-[#080b12] border border-[#0070d1]/30 rounded-xl text-sm text-white focus:border-[#00d2ff] outline-none"
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
                      className="w-full px-4 py-3 bg-[#080b12] border border-[#0070d1]/30 rounded-xl text-sm text-white focus:border-[#00d2ff] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Forma de Pagamento:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === "pix" 
                            ? "bg-[#00e676]/15 border-[#00e676] text-[#00e676]" 
                            : "bg-[#080b12] border-zinc-800 text-zinc-400"
                        }`}
                      >
                        ⚡ PIX (Imediato)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          paymentMethod === "card" 
                            ? "bg-[#0070d1]/20 border-[#00d2ff] text-[#00d2ff]" 
                            : "bg-[#080b12] border-zinc-800 text-zinc-400"
                        }`}
                      >
                        💳 Cartão de Crédito
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] text-zinc-950 font-black text-base rounded-xl shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-all hover:scale-102 cursor-pointer mt-2"
                >
                  PAGAR R$ 29,90 E GERAR MEU TOKEN
                </button>
              </form>
            )}

            {checkoutStep === "loading" && (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#00d2ff] border-t-transparent rounded-full animate-spin mx-auto" />
                <h4 className="text-lg font-bold text-white">Gerando seu Token VIP...</h4>
                <p className="text-xs text-zinc-400">Conectando aos servidores seguros do Mago Gamer</p>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="py-4 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#00e676]/20 border border-[#00e676]/50 flex items-center justify-center mx-auto text-[#00e676]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">Acesso VIP Liberado!</h4>
                  <p className="text-xs text-zinc-400">Seu Token de Acesso permanente foi gerado com sucesso:</p>
                </div>

                <div className="p-4 bg-[#080b12] border border-[#00e676]/50 rounded-2xl shadow-inner">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Seu Token Mágico:</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#00e676] tracking-wider">
                    {generatedToken}
                  </span>
                </div>

                <a
                  href="https://mago4.vercel.app"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-4 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] text-zinc-950 font-black text-base rounded-xl shadow-lg transition-all"
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
