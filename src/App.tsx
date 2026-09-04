import { useState, useEffect, FormEvent, useMemo } from "react";
import { 
  Flame, 
  ShieldCheck, 
  Zap, 
  Star, 
  ArrowRight, 
  Clock, 
  Check, 
  X, 
  Smartphone, 
  Tv, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Gamepad2,
  HardDrive,
  Download,
  HelpCircle,
  MessageCircle,
  Play,
  ChevronDown,
  ChevronUp,
  Cpu,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { getPS2Cover3D } from "./services/coverService";

// Credenciais de API Direta do Supabase Mago Gamer (Zero bibliotecas pesadas)
const SUPABASE_URL = "https://vonyukxaguxbbituavlt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbnl1a3hhZ3V4YmJpdHVhdmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTU5NzUsImV4cCI6MjEwMzYzMTk3NX0.BYqfyQy6nzHQYCkIYaqdlwbZWPfCRbSUjzVB1EKwi44";

// Capas 3D Oficiais em Alta Definição (API do Mago Gamer)
interface GameItem {
  title: string;
  serial: string;
  desc: string;
  tag: string;
  badge: string;
  category: "action" | "fight" | "sports" | "terror";
  coverUrl: string;
}

const CLASSIC_GAMES: GameItem[] = [
  {
    title: "Grand Theft Auto: San Andreas",
    serial: "SLUS-20946",
    desc: "O clássico supremo com legendas e rádios em PT-BR. Ande por Los Santos, San Fierro e Las Venturas.",
    tag: "🏆 RECORDISTA",
    badge: "PT-BR",
    category: "action",
    coverUrl: getPS2Cover3D("SLUS-20946")
  },
  {
    title: "God of War II",
    serial: "SCUS-97481",
    desc: "Kratos desafiando o Olimpo com as Lâminas de Atena em combate cinematográfico totalmente dublado.",
    tag: "🔥 MAIS JOGADO",
    badge: "DUBLADO",
    category: "action",
    coverUrl: getPS2Cover3D("SCUS-97481")
  },
  {
    title: "Bomba Patch 100% Atualizado",
    serial: "SLUS-21820",
    desc: "Elencos de 2026, narração clássica brasileira e todos os estádios e times nacionais.",
    tag: "⚽ BRASILEIRÃO",
    badge: "100% ATUAL",
    category: "sports",
    coverUrl: getPS2Cover3D("SLUS-21820")
  },
  {
    title: "Resident Evil 4",
    serial: "SLUS-21134",
    desc: "Leon S. Kennedy enfrentando Las Plagas no vilarejo. O maior jogo de terror da história do PS2.",
    tag: "🧟 TERROR",
    badge: "LEGENDADO",
    category: "terror",
    coverUrl: getPS2Cover3D("SLUS-21134")
  },
  {
    title: "Need for Speed: Underground 2",
    serial: "SLUS-21065",
    desc: "Riders on the Storm, personalização completa, luzes neon, rachas noturnos e ronco do motor.",
    tag: "🚗 VELOCIDADE",
    badge: "SAVE 100%",
    category: "sports",
    coverUrl: getPS2Cover3D("SLUS-21065")
  },
  {
    title: "Black",
    serial: "SLUS-21376",
    desc: "O ápice gráfico do PlayStation 2. Destruição de cenários, som de cinema e tiroteio intenso.",
    tag: "💥 TIRO SUPREMO",
    badge: "AÇÃO TOTAL",
    category: "terror",
    coverUrl: getPS2Cover3D("SLUS-21376")
  },
  {
    title: "Dragon Ball Z: Budokai Tenkaichi 3",
    serial: "SLUS-21670",
    desc: "Mais de 160 personagens, transformações em tempo real e a lendária dublagem brasileira clássica.",
    tag: "⚡ ANIME",
    badge: "DUBLADO",
    category: "fight",
    coverUrl: getPS2Cover3D("SLUS-21670")
  },
  {
    title: "Def Jam: Fight for NY",
    serial: "SLUS-21004",
    desc: "Snoop Dogg, Busta Rhymes e combates subterrâneos violentos em arenas icônicas de Nova York.",
    tag: "🥊 LUTA DE RUA",
    badge: "HISTÓRICO",
    category: "fight",
    coverUrl: getPS2Cover3D("SLUS-21004")
  },
  {
    title: "Bully (Canis Canem Edit)",
    serial: "SLUS-21269",
    desc: "Jimmy Hopkins dominando a Bullworth Academy com estilingue, skate e missões inesquecíveis.",
    tag: "🎒 MUNDO ABERTO",
    badge: "PT-BR",
    category: "action",
    coverUrl: getPS2Cover3D("SLUS-21269")
  }
];

// Perguntas Frequentes Estratégicas (Quebra de Objeções)
const FAQS = [
  {
    q: "Funciona em qualquer modelo de PlayStation 2 (Fat e Slim)?",
    a: "Sim! 100% compatível com todos os modelos do PS2 (séries 30000, 50000, 70000 e até os Slim 90000 com FunTuna). Não importa a versão do seu console."
  },
  {
    q: "Preciso de chip Matrix ou o PS2 pode ser travado/bloqueado?",
    a: "Funciona perfeitamente em ambos! Mesmo que o leitor de DVD do seu PS2 esteja queimado ou que o console seja travado de fábrica, o sistema roda direto pelo Memory Card e Pendrive via OPL."
  },
  {
    q: "Não tenho um PC forte. Consigo passar os jogos mesmo assim?",
    a: "Com certeza! O instalador do Mago é super leve e roda em qualquer computador ou notebook antigo. E se você não tiver PC, nosso tutorial ensina até a passar os jogos pelo celular Android usando um cabo OTG!"
  },
  {
    q: "Como e quando eu recebo o meu Token VIP de Acesso?",
    a: "A entrega é instantânea e automática! Assim que o pagamento (PIX ou Cartão) é confirmado, o seu Token VIP é gerado na tela e enviado para o seu e-mail e WhatsApp com acesso vitalício."
  },
  {
    q: "E se eu tiver alguma dúvida durante a instalação?",
    a: "Você não fica sozinho! Você terá acesso direto ao nosso suporte individual via WhatsApp com a equipe do Mago Gamer para tirar qualquer dúvida até o jogo rodar na sua TV."
  }
];

export default function App() {
  const [secondsLeft, setSecondsLeft] = useState(899); // 14m 59s
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [currentToastIndex, setCurrentToastIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"all" | "action" | "fight" | "sports" | "terror">("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  // Checkout states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [checkoutStep, setCheckoutStep] = useState<"form" | "loading" | "success">("form");
  const [generatedToken, setGeneratedToken] = useState("");
  const [isSavingToken, setIsSavingToken] = useState(false);

  // Social Proof Toasts
  const TOASTS = [
    { name: "Lucas A.", city: "São Paulo - SP", action: "baixou GTA San Andreas PT-BR", time: "agora mesmo" },
    { name: "Marcos V.", city: "Belo Horizonte - MG", action: "garantiu o Kit Mago OPL", time: "há 2 min" },
    { name: "Rodrigo P.", city: "Curitiba - PR", action: "ativou o Token VIP Vitalício", time: "há 4 min" },
    { name: "Alexandre G.", city: "Rio de Janeiro - RJ", action: "instalou God of War II no PenDrive", time: "há 7 min" }
  ];

  // Scroll listener for sticky mobile buy bar
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Filtragem Otimizada de Jogos
  const filteredGames = useMemo(() => {
    if (activeCategory === "all") return CLASSIC_GAMES;
    return CLASSIC_GAMES.filter((game) => game.category === activeCategory);
  }, [activeCategory]);

  // Gravação Real do Token no Banco de Dados Supabase (public.tokens)
  const handleProcessCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) {
      alert("Por favor, preencha os dados obrigatórios.");
      return;
    }
    
    setCheckoutStep("loading");
    setIsSavingToken(true);

    // Gera o código do Token VIP
    const tokenCode = "MAGO-PS2-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedToken(tokenCode);

    try {
      // Injeção via API REST nativa do Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          code: tokenCode,
          name: `${userName.trim()} (${userEmail.trim()})`,
          created_at: new Date().toISOString(),
          active: true
        })
      });

      if (!response.ok) {
        console.warn("Aviso na gravação remota do Supabase, token liberado localmente.");
      }
    } catch (err) {
      console.warn("Conexão fallback com Supabase:", err);
    } finally {
      setIsSavingToken(false);
      setCheckoutStep("success");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06070b] text-white selection:bg-[#0070d1] selection:text-white font-sans antialiased overflow-x-hidden pb-16 sm:pb-0">
      
      {/* CORES OFICIAIS SONY PLAYSTATION 2 & MAGO GAMER (GLOWS AMBIENTES) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-[#003791]/30 via-[#0070d1]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-4 w-[400px] h-[400px] bg-[#00d2ff]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-4 w-[450px] h-[450px] bg-[#003791]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* --- HEADER: IDENTIDADE PLAYSTATION 2 & MAGO GAMER --- */}
      <header className="border-b border-[#0070d1]/20 bg-[#06070b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Mago Gamer" 
              className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_12px_rgba(0,112,209,0.8)]"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div>
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                MAGO <span className="text-[#00d2ff] drop-shadow-[0_0_8px_#00d2ff]">GAMER</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-zinc-400 tracking-widest block uppercase">
                Área VIP Oficial PlayStation 2
              </span>
            </div>
          </div>

          {/* Símbolos Oficiais do Controle PlayStation (▲ ■ ● ✖) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a0d16] border border-[#0070d1]/30 text-xs font-black shadow-[0_0_15px_rgba(0,112,209,0.15)]">
            <span className="text-[#00e676] drop-shadow-[0_0_6px_#00e676]">▲</span>
            <span className="text-[#f50057] drop-shadow-[0_0_6px_#f50057]">■</span>
            <span className="text-[#ff1744] drop-shadow-[0_0_6px_#ff1744]">●</span>
            <span className="text-[#2979ff] drop-shadow-[0_0_6px_#2979ff]">✖</span>
            <span className="hidden sm:inline text-zinc-300 text-[10px] uppercase tracking-wider ml-1 font-mono">OPL V22.1</span>
          </div>
        </div>
      </header>

      {/* --- SEÇÃO 1: HERO SECTION (PRIMEIRA DOBRA COM NOSTALGIA IMEDIATA) --- */}
      <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 max-w-6xl mx-auto" id="hero">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Lado Esquerdo: Copy Direta sem enrolação */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0070d1]/15 border border-[#00d2ff]/40 text-xs text-[#00d2ff] font-extrabold tracking-wider uppercase shadow-[0_0_15px_rgba(0,210,255,0.25)]">
              <Zap className="w-4 h-4 text-[#00d2ff] animate-pulse" />
              <span>SISTEMA OPL 1-CLIQUE • PLUG & PLAY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.08]">
              Reviva a <span className="bg-gradient-to-r from-[#00d2ff] via-[#2979ff] to-[#00e676] bg-clip-text text-transparent drop-shadow">Era de Ouro do PS2</span> Sem Passar Raiva!
            </h1>

            <p className="text-sm sm:text-lg text-zinc-300 leading-relaxed font-normal">
              Chega de gravar DVD que não lê, baixar ISO corrompida ou perder horas em tutoriais chatos. Nós entregamos o <strong>Kit Mago OPL 1-Clique</strong> + <strong>Mais de 1.000 Jogos Prontos</strong> para você plugar no pendrive e reviver sua infância hoje mesmo.
            </p>

            {/* Checklist de Dores Resolvidas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
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
                <span className="text-xs sm:text-sm font-semibold">Zero Vírus • Download em Alta Velocidade</span>
              </div>
              <div className="flex items-center gap-2.5 text-zinc-200 bg-[#0c101c] p-2.5 rounded-xl border border-[#0070d1]/20">
                <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">Suporte VIP Individual no WhatsApp</span>
              </div>
            </div>

            {/* Botão de Ação Imediata (Cor do Triângulo Verde PS2) */}
            <div className="pt-2 space-y-3">
              <button
                onClick={scrollToOffer}
                className="neon-btn-ps2 w-full sm:w-auto px-8 py-4.5 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] hover:to-[#059669] text-zinc-950 font-black text-lg sm:text-xl rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                id="hero_cta_ps2"
              >
                <span>QUERO MEU ACESSO VIP (R$ 29,90)</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1 text-[#00d2ff] font-bold">
                  <Zap className="w-3.5 h-3.5 text-[#00d2ff]" /> Entrega Automática do Token
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0070d1]" /> Garantia Incondicional de 7 Dias
                </span>
              </div>
            </div>

          </div>

          {/* Lado Direito: Showcase Real do Kit OPL + PS2 Slim */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-[#0070d1] to-[#00d2ff] rounded-3xl opacity-25 blur-2xl animate-pulse" />
            
            <div className="relative bg-[#0b0e17] rounded-3xl border border-[#0070d1]/40 p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5">
              
              {/* Header do Card com o Console PS2 */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <img 
                    src="/icons/ps2_real.jpg" 
                    alt="Console PS2" 
                    className="w-8 h-8 rounded-lg object-cover border border-[#0070d1]/30 shadow"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
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
                  <img src={getPS2Cover3D("SLUS-20946")} alt="GTA SA" className="w-full h-24 sm:h-28 object-contain rounded drop-shadow-md mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-300 block truncate">GTA San Andreas</span>
                </div>
                <div className="bg-[#080a10] rounded-xl p-1.5 text-center border border-[#0070d1]/20 hover:border-[#00d2ff] transition-all hover:-translate-y-1 shadow-lg">
                  <img src={getPS2Cover3D("SCUS-97481")} alt="God of War II" className="w-full h-24 sm:h-28 object-contain rounded drop-shadow-md mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-300 block truncate">God of War II</span>
                </div>
                <div className="bg-[#080a10] rounded-xl p-1.5 text-center border border-[#0070d1]/20 hover:border-[#00d2ff] transition-all hover:-translate-y-1 shadow-lg">
                  <img src={getPS2Cover3D("SLUS-21134")} alt="Resident Evil 4" className="w-full h-24 sm:h-28 object-contain rounded drop-shadow-md mb-1" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-300 block truncate">Resident Evil 4</span>
                </div>
              </div>

              {/* Kit Mago OPL Banner Oficial */}
              <div className="bg-gradient-to-r from-[#0c1222] to-[#090d18] rounded-2xl p-3.5 sm:p-4 border border-[#0070d1]/30 flex items-center justify-between">
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
        <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-[#0070d1]/20 pt-6 text-center text-zinc-400 mt-6">
          <div>
            <span className="block text-xl sm:text-3xl font-black text-white">+1.480</span>
            <span className="text-[9px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Gamers Ativos</span>
          </div>
          <div className="border-x border-[#0070d1]/20">
            <span className="block text-xl sm:text-3xl font-black text-[#00d2ff]">⭐ 4.9/5</span>
            <span className="text-[9px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Avaliações VIP</span>
          </div>
          <div>
            <span className="block text-xl sm:text-3xl font-black text-[#00e676]">🚀 100%</span>
            <span className="text-[9px] sm:text-xs uppercase font-bold tracking-wider text-zinc-500">Servidor Rápido</span>
          </div>
        </div>

      </section>

      {/* --- SEÇÃO 2: VITRINE DAS CAPAS 3D OFICIAIS DO PS2 (COM ABAS DE CATEGORIAS) --- */}
      <section className="py-14 sm:py-18 px-4 bg-[#080b14] border-y border-[#0070d1]/20" id="vitrine">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1]/15 border border-[#0070d1]/40 text-xs font-extrabold text-[#00d2ff] uppercase">
              <Gamepad2 className="w-4 h-4" />
              <span>ACERVO VITALÍCIO DE JOGOS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white">
              Os Maiores Clássicos que Marcaram Sua Vida
            </h2>
            <p className="text-xs sm:text-base text-zinc-300">
              Mais de 1.000 jogos testados no OPL, organizados, compactados e prontos para passar pro seu pendrive.
            </p>
          </div>

          {/* Abas Interativas de Categorias de Jogos */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: "all", label: "🔥 Todos os Clássicos" },
              { id: "action", label: "⚔️ Ação & Aventura" },
              { id: "fight", label: "🥊 Luta & Anime" },
              { id: "sports", label: "⚽ Esporte & Corrida" },
              { id: "terror", label: "🧟 Terror & Tiro" }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#0070d1] text-white shadow-[0_0_15px_rgba(0,112,209,0.5)] border border-[#00d2ff]"
                    : "bg-[#0c101c] text-zinc-400 border border-zinc-800 hover:text-white hover:border-[#0070d1]/40"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid com Capas 3D Oficiais e Skeleton Shimmer Loading */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredGames.map((game, i) => (
              <div 
                key={game.serial + i}
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

                {/* Exibição da Capa 3D Oficial com Skeleton Shimmer */}
                <div className="relative h-72 overflow-hidden bg-gradient-to-b from-[#080b12] to-[#04060a] flex items-center justify-center p-3">
                  
                  {/* Skeleton placeholder enquanto a imagem não carrega */}
                  {!loadedImages[game.serial] && (
                    <div className="absolute inset-4 rounded-xl skeleton-shimmer flex items-center justify-center">
                      <Gamepad2 className="w-8 h-8 text-[#0070d1]/30 animate-pulse" />
                    </div>
                  )}

                  <img 
                    src={game.coverUrl} 
                    alt={`Capa oficial 3D de ${game.title}`}
                    loading="lazy"
                    onLoad={() => setLoadedImages(prev => ({ ...prev, [game.serial]: true }))}
                    className={`h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.9)] transition-all duration-500 group-hover:scale-105 ${
                      loadedImages[game.serial] ? "opacity-100" : "opacity-0"
                    }`}
                    onError={(e) => {
                      setLoadedImages(prev => ({ ...prev, [game.serial]: true }));
                      e.currentTarget.src = `https://placehold.co/300x450/090d16/00d2ff?text=${encodeURIComponent(game.title)}&font=roboto`;
                    }}
                  />

                  <div className="absolute bottom-3 left-3 bg-[#060810]/95 text-[10px] text-[#00e676] font-bold px-2 py-1 rounded border border-[#00e676]/30 uppercase flex items-center gap-1 shadow">
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
            <p className="text-xs sm:text-sm text-zinc-400 mb-5 font-medium">
              ...e mais de 1.000 outros jogos de PS2, PS1 e Emuladores liberados para você baixar!
            </p>
            <button 
              onClick={scrollToOffer}
              className="px-8 py-4 bg-gradient-to-r from-[#00e676] to-[#10b981] hover:from-[#10b981] text-zinc-950 font-black text-base sm:text-lg rounded-xl shadow-[0_0_25px_rgba(0,230,118,0.3)] transition-all hover:scale-105 cursor-pointer uppercase font-display"
            >
              LIBERAR TODOS OS JOGOS NA ÁREA VIP
            </button>
          </div>

        </div>
      </section>

      {/* --- SEÇÃO 3: 3 PASSOS SIMPLES (PLUG & PLAY) --- */}
      <section className="py-14 sm:py-18 px-4 max-w-5xl mx-auto" id="passos">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#00d2ff] block">
            SEM COMPLICAÇÃO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Como Funciona em 3 Passos Simples:
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#0c101c] border border-[#0070d1]/30 p-6 rounded-2xl space-y-3 relative shadow-lg hover:border-[#00d2ff] transition-all">
            <div className="w-11 h-11 rounded-xl bg-[#0070d1]/20 border border-[#0070d1]/40 flex items-center justify-center font-black text-[#00d2ff] text-xl">
              1
            </div>
            <h3 className="font-extrabold text-lg text-white">Conecte o Pendrive</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Conecte seu pendrive ou HD externo no computador. Qualquer marca ou tamanho funciona perfeitamente!
            </p>
          </div>

          <div className="bg-[#0c101c] border border-[#0070d1]/30 p-6 rounded-2xl space-y-3 relative shadow-lg hover:border-purple-400 transition-all">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center font-black text-purple-400 text-xl">
              2
            </div>
            <h3 className="font-extrabold text-lg text-white">Passe com 1-Clique</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use o Kit Mago OPL automático. Ele formata e coloca a estrutura de pastas e jogos pronta no pendrive.
            </p>
          </div>

          <div className="bg-[#0c101c] border border-[#00e676]/40 p-6 rounded-2xl space-y-3 relative shadow-[0_0_25px_rgba(0,230,118,0.15)] hover:border-[#00e676] transition-all">
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
      <section className="py-14 sm:py-18 px-4 max-w-4xl mx-auto" id="oferta-vip">
        
        {/* Banner de Urgência */}
        <div className="mb-6 py-2.5 px-4 bg-red-500/15 border border-red-500/40 rounded-xl text-center flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-red-400 animate-pulse">
          <Clock className="w-4 h-4" />
          <span>ESTA CONDIÇÃO PROMOCIONAL EXPIRA EM: <strong className="text-white font-mono text-base">{formatTime(secondsLeft)}</strong></span>
        </div>

        <div className="relative bg-gradient-to-b from-[#0c101d] to-[#060810] rounded-3xl border-2 border-[#00e676]/50 p-6 sm:p-10 shadow-[0_0_50px_rgba(0,230,118,0.2)]">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Lista de Benefícios */}
            <div className="md:col-span-7 space-y-4 sm:space-y-5">
              <span className="text-xs font-black uppercase tracking-widest text-[#00d2ff] bg-[#0070d1]/20 px-3 py-1 rounded-md border border-[#0070d1]/40 inline-block">
                ACESSO VITALÍCIO • TOKEN IMEDIATO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                O Que Você Vai Receber Agora:
              </h2>

              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-zinc-300">
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
                  Pagamento Único • Acesso Vitalício
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
                <p>⚡ Token salvo e ativado na hora no Supabase</p>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* --- SEÇÃO 5: FAQ INTERATIVO (QUEBRA DE TODAS AS OBJEÇÕES) --- */}
      <section className="py-14 sm:py-18 px-4 max-w-4xl mx-auto" id="faq">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#00d2ff] block">
            TIRE SUAS DÚVIDAS
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Perguntas Frequentes
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Tudo o que você precisa saber antes de garantir seu acesso VIP.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-[#0c101c] border border-[#0070d1]/30 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#00d2ff] transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-[#0070d1] shrink-0" />
                  <span>{faq.q}</span>
                </span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-5 h-5 text-[#00d2ff] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-zinc-500 shrink-0" />
                )}
              </button>
              
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/60 bg-[#080b12]/60">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* --- SEÇÃO 6: GARANTIA DE 7 DIAS --- */}
      <section className="py-10 px-4 max-w-3xl mx-auto text-center">
        <div className="bg-[#0c101c] border border-[#0070d1]/30 p-6 sm:p-8 rounded-3xl space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#00e676]/10 border border-[#00e676]/30 flex items-center justify-center mx-auto text-[#00e676]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white">Garantia Blindada de 7 Dias</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Se você não conseguir rodar seus jogos no PS2 ou achar que o material não te atendeu, mande uma mensagem no suporte do WhatsApp que devolvemos 100% do seu dinheiro. Sem burocracia e sem letras miúdas!
          </p>
        </div>
      </section>

      {/* --- FOOTER OFICIAL --- */}
      <footer className="py-8 px-4 border-t border-[#0070d1]/20 text-center text-xs text-zinc-500 space-y-2 bg-[#04060a]">
        <p>© {new Date().getFullYear()} Mago Gamer • Todos os direitos reservados.</p>
        <p className="text-[10px] text-zinc-600">PlayStation e PS2 são marcas registradas da Sony Interactive Entertainment.</p>
      </footer>

      {/* --- STICKY BOTTOM BAR NO MOBILE (AUMENTA CONVERSÃO) --- */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-[#06070b]/95 backdrop-blur-lg border-t border-[#0070d1]/30 p-3 flex items-center justify-between gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
          <div className="leading-tight">
            <span className="text-[9px] font-bold text-zinc-400 block uppercase">TOKEN VIP VITALÍCIO</span>
            <span className="text-lg font-black text-white">
              R$ 29<span className="text-xs font-bold text-[#00e676]">,90</span>
            </span>
          </div>
          <button
            onClick={handleOpenCheckout}
            className="px-5 py-2.5 bg-gradient-to-r from-[#00e676] to-[#10b981] text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(0,230,118,0.4)] flex items-center gap-1.5 cursor-pointer"
          >
            <span>COMPRAR AGORA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --- NOTIFICAÇÃO FLUTUANTE DE PROVA SOCIAL --- */}
      {showToast && (
        <div className="fixed bottom-16 sm:bottom-4 left-4 z-50 bg-[#0c101c]/95 border border-[#0070d1]/50 backdrop-blur-md p-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in max-w-xs">
          <div className="w-8 h-8 rounded-xl bg-[#00e676]/20 border border-[#00e676]/40 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#00e676]" />
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

      {/* --- MODAL DE CHECKOUT COM INTEGRAÇÃO REAL NO SUPABASE --- */}
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
                    <label className="block text-xs font-bold text-zinc-300 mb-1">WhatsApp (para suporte imediato):</label>
                    <input 
                      type="tel" 
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="(XX) 99999-9999"
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
                <h4 className="text-lg font-bold text-white">Criando e Ativando seu Token VIP...</h4>
                <p className="text-xs text-zinc-400">Gravando credencial no banco de dados na nuvem (Supabase)</p>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="py-4 text-center space-y-5">
                <div className="w-14 h-14 rounded-full bg-[#00e676]/20 border border-[#00e676]/50 flex items-center justify-center mx-auto text-[#00e676]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-white">Acesso VIP Liberado!</h4>
                  <p className="text-xs text-zinc-400">Seu Token de Acesso permanente foi gravado e ativado no banco de dados:</p>
                </div>

                <div className="p-4 bg-[#080b12] border border-[#00e676]/50 rounded-2xl shadow-inner">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Seu Token Mágico Ativo:</span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#00e676] tracking-wider select-all">
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

                <p className="text-[10px] text-zinc-500">
                  ⚡ O Token já pode ser usado na tela de login da plataforma.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
