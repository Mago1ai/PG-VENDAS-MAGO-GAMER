import { useState, useEffect, FormEvent, useMemo, useCallback } from "react";
import { 
  ShieldCheck, 
  Sparkles,
  Play,
  Volume2,
  Tv,
  HelpCircle,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Heart,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sliders,
  Disc,
  History,
  Monitor,
  Gamepad2,
  Smartphone
} from "lucide-react";
import { getPS2Cover3D } from "./services/coverService";

// --- CREDENCIAIS DO SUPABASE (GRAVAÇÃO DE TOKENS EM TEMPO REAL) ---
const SUPABASE_URL = "https://vonyukxaguxbbituavlt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbnl1a3hhZ3V4YmJpdHVhdmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTU5NzUsImV4cCI6MjEwMzYzMTk3NX0.BYqfyQy6nzHQYCkIYaqdlwbZWPfCRbSUjzVB1EKwi44";

// --- SINTETIZADOR DO ÁUDIO DE BOOT DO PS2 (WEB AUDIO API NATIVA) ---
function playPs2BootSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    // Ganho Mestre
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.45, now + 1.2);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);
    masterGain.connect(ctx.destination);

    // Frequências da harmonia do boot (acorde de abertura místico em Lá menor / 9ª)
    const harmonicFrequencies = [55, 82.4, 110, 164.8, 220, 277.2, 329.6, 440, 554.3];

    harmonicFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq * 0.98, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 1.6);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.exponentialRampToValueAtTime(2600, now + 2.2);
      filter.frequency.exponentialRampToValueAtTime(450, now + 5.5);

      gain.gain.setValueAtTime(0.0001, now);
      const targetGain = 0.16 / (idx * 0.45 + 1);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.8 + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 5.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 6.0);
    });

    // Soprador de ar atmosférico / Ruído de mar do boot
    const bufferSize = ctx.sampleRate * 4.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.04;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(220, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(750, now + 2.0);
    noiseFilter.Q.value = 2.5;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 1.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.00001, now + 4.8);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noise.start(now);
    noise.stop(now + 5.0);
  } catch (err) {
    console.warn("Áudio não pôde iniciar:", err);
  }
}

// --- ESTRUTURA DOS JOGOS E MEMÓRIAS AFETIVAS (CAPAS 100% CORRETAS) ---
interface PreservedGame {
  title: string;
  serial: string;
  tag: string;
  category: "action" | "sports" | "fight" | "terror";
  memoryQuote: string;
  memoryStory: string;
  coverUrl: string;
}

const PRESERVED_COLLECTION: PreservedGame[] = [
  {
    title: "Grand Theft Auto: San Andreas",
    serial: "SLUS-20946",
    tag: "🏆 RECORDISTA SUPREMO",
    category: "action",
    memoryQuote: "R1, R2, L1, X, Esquerda, Baixo, Direita, Cima...",
    memoryStory: "Aquele sábado ensolarado em 2004. O caderno da escola cheio de códigos anotados a caneta. O pôr do sol alaranjado sobre Los Santos enquanto tocava rap clássico na rádio e a sirene da polícia ao fundo.",
    coverUrl: getPS2Cover3D("SLUS-20946")
  },
  {
    title: "Pro Evolution Soccer 2008",
    serial: "SLUS-21685",
    tag: "⚽ FUTEBOL RAIZ",
    category: "sports",
    memoryQuote: "A bomba do Adriano Imperador com força 99 e narração brasileira.",
    memoryStory: "A sala lotada de amigos, ventilador no máximo e a disputa pra ver quem não ficava com o controle com analógico mole. O gol aos 90' e a comemoração batendo a mão no sofá.",
    coverUrl: getPS2Cover3D("SLUS-21685")
  },
  {
    title: "Need for Speed: Underground 2",
    serial: "SLUS-21065",
    tag: "🚗 VELOCIDADE PURA",
    category: "sports",
    memoryQuote: "Riders on the storm... into this house we're born...",
    memoryStory: "A chuva caindo no asfalto molhado de Bayview, o ronco do motor do Skyline, as luzes de neon verde sob o carro e horas perdidas na oficina montando o som do porta-malas.",
    coverUrl: getPS2Cover3D("SLUS-21065")
  },
  {
    title: "Dragon Ball Z: Budokai Tenkaichi 3",
    serial: "SLUS-21678",
    tag: "⚡ ANIME SUPREMO",
    category: "fight",
    memoryQuote: "Kamehameha! Gire os dois analógicos o mais rápido possível!",
    memoryStory: "A palma da mão vermelha de tanto girar o analógico no choque de poderes. A dublagem com as vozes da infância e mais de 160 guerreiros destruindo o cenário.",
    coverUrl: getPS2Cover3D("SLUS-21678")
  },
  {
    title: "God of War II",
    serial: "SCUS-97481",
    tag: "🔥 ÉPICO CINEMATOGRÁFICO",
    category: "action",
    memoryQuote: "Abertura monumental: Kratos desafiando o Colosso de Rodes.",
    memoryStory: "O combate cinematográfico com as Lâminas de Atena logo nos primeiros 10 minutos. O jogo que provou que o PS2 era capaz de milagres gráficos.",
    coverUrl: getPS2Cover3D("SCUS-97481")
  },
  {
    title: "Resident Evil 4",
    serial: "SLUS-21134",
    tag: "🧟 TERROR INESQUECÍVEL",
    category: "terror",
    memoryQuote: "Un forastero! O som da motosserra no escuro.",
    memoryStory: "Jogar no escuro com o coração disparado. A chuva torrencial, munição quase zerada e o alívio profundo ao ouvir a música serena da máquina de escrever.",
    coverUrl: getPS2Cover3D("SLUS-21134")
  },
  {
    title: "Bully (Canis Canem Edit)",
    serial: "SLUS-21269",
    tag: "🎒 MUNDO ABERTO",
    category: "action",
    memoryQuote: "O sino tocou! Fuja dos monitores antes que te peguem!",
    memoryStory: "Jimmy Hopkins de skate pelo pátio da Bullworth Academy. Fugir das aulas de inglês, atirar estilingue e dominar a escola inteira com a jaqueta dos valentões.",
    coverUrl: getPS2Cover3D("SLUS-21269")
  },
  {
    title: "Def Jam: Fight for NY",
    serial: "SLUS-21004",
    tag: "🥊 LUTA DE RUA",
    category: "fight",
    memoryQuote: "Snoop Dogg, Busta Rhymes e combates subterrâneos brutais.",
    memoryStory: "As batalhas em arenas de Nova York ao som do mais puro hip-hop dos anos 2000. Arremessar o oponente contra o trem do metrô em disputas viscerais.",
    coverUrl: getPS2Cover3D("SLUS-21004")
  },
  {
    title: "Black",
    serial: "SLUS-21376",
    tag: "💥 TIRO SUPREMO",
    category: "terror",
    memoryQuote: "O ápice gráfico e sonoro de um tiroteio no PlayStation 2.",
    memoryStory: "O chão tremendo, pedaços de concreto voando e o som dos cartuchos caindo. Parecia um jogo de duas gerações à frente na velha TV de 20 polegadas.",
    coverUrl: getPS2Cover3D("SLUS-21376")
  }
];

// --- PERGUNTAS FREQUENTES DA COMUNIDADE ---
const COMMUNITY_FAQS = [
  {
    q: "Funciona em qualquer modelo de PlayStation 2 (Fat e Slim)?",
    a: "Sim! Funciona em qualquer aparelho de PlayStation 2 (FAT ou SLIM). Você só precisa de um Pen Drive comum ou HD Externo com OPL. Não depende de leitor óptico."
  },
  {
    q: "Preciso de chip Matrix no PS2 para ler Pen Drive/OPL?",
    a: "Não é obrigatório chip físico! O OPL roda direto via Memory Card (com FMCB / FunTuna) ou qualquer destrava padrão. Nosso vídeo de 3 minutos ensina como fazer."
  },
  {
    q: "Não tenho um PC forte. Consigo jogar no celular ou computador fraco?",
    a: "Sim! Celulares intermediários (Android ou iPhone) rodam com controles Bluetooth com extrema fluidez, e no computador os arquivos já vão prontos para o emulador leve."
  },
  {
    q: "Como eu recebo o acesso aos jogos e ao Token VIP?",
    a: "A liberação é imediata e automática! Assim que a contribuição de R$ 29,90 é confirmada, você recebe na tela, no e-mail e no WhatsApp o seu Token VIP e o link dos servidores na nuvem em alta velocidade."
  },
  {
    q: "E se eu tiver dúvidas durante a instalação?",
    a: "Você não fica sozinho! Você terá o nosso contato de WhatsApp individual de suporte para tirar qualquer dúvida até o jogo estar rodando na sua tela."
  }
];

export default function App() {
  // Estados de Interface e Gatilhos Sensoriais
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "action" | "sports" | "fight" | "terror">("all");
  const [selectedGameMemory, setSelectedGameMemory] = useState<PreservedGame | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tvPower, setTvPower] = useState(true);
  const [tvChannel, setTvChannel] = useState(1);

  // Estados de Checkout e Preservação
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "pix" | "success">("form");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userWhatsapp, setUserWhatsapp] = useState("");
  const [isSavingToken, setIsSavingToken] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");

  // Disparo do Áudio do Boot
  const handlePlayBoot = useCallback(() => {
    setIsPlayingAudio(true);
    playPs2BootSound();
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 5500);
  }, []);

  // Filtro de Jogos
  const filteredCollection = useMemo(() => {
    if (activeTab === "all") return PRESERVED_COLLECTION;
    return PRESERVED_COLLECTION.filter(item => item.category === activeTab);
  }, [activeTab]);

  // Submissão do Acesso VIP
  const handleSupportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    setIsSavingToken(true);
    const tokenCode = "MAGO-VIP-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedToken(tokenCode);

    try {
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
        console.warn("Aviso na gravação Supabase, fallback liberado.");
      }
    } catch (err) {
      console.warn("Conexão fallback com banco:", err);
    } finally {
      setIsSavingToken(false);
      setCheckoutStep("success");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#06070b] text-white selection:bg-[#0070d1] selection:text-white font-inter antialiased overflow-x-hidden pb-16 sm:pb-0">
      
      {/* OVERLAY DE SCANLINES CRT RETRÔ (OPCIONAL) */}
      {scanlinesActive && (
        <div className="fixed inset-0 crt-overlay z-50 pointer-events-none opacity-50" />
      )}

      {/* AMBIÊNCIA DE LUZ SUTIL PLAYSTATION 2 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-[#003791]/30 via-[#0070d1]/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-6 w-[400px] h-[400px] bg-[#00d2ff]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* BARRA DE AVISO SUPERIOR (ESTILO FIRMWARE RETRO) */}
      <div className="bg-[#002868]/90 border-b border-[#0070d1]/40 text-xs sm:text-sm py-2 px-4 text-center font-chakra text-zinc-200 tracking-wide">
        ⚡ SERVIDORES DEDICADOS NA NUVEM • COMPATÍVEL COM OPL (PS2), CELULAR (ANDROID/IOS) E PC
      </div>

      {/* --- HEADER: IDENTIDADE MAGO GAMER & COMPRA RÁPIDA --- */}
      <header className="border-b border-zinc-800/80 bg-[#06070b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Identidade */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0070d1] to-[#003791] flex items-center justify-center font-chakra font-black text-white text-base shadow-[0_0_15px_rgba(0,112,209,0.6)]">
              PS
            </div>
            <div>
              <span className="font-chakra font-bold text-lg tracking-wider text-white flex items-center gap-1">
                MAGO<span className="text-[#00d2ff]">GAMER</span>
              </span>
              <span className="text-[9px] font-chakra text-zinc-400 tracking-widest block uppercase">
                Biblioteca Retro PS2
              </span>
            </div>
          </div>

          {/* Símbolos Oficiais e Ações */}
          <div className="flex items-center gap-3">
            
            {/* Botão de Áudio do Boot */}
            <button
              onClick={handlePlayBoot}
              disabled={isPlayingAudio}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-chakra font-bold transition-all border ${
                isPlayingAudio 
                  ? "bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_15px_#00d2ff]" 
                  : "bg-[#0a0e1a] text-zinc-300 border-zinc-700 hover:border-[#0070d1]"
              }`}
              title="Tocar o acorde nostálgico de inicialização do PS2"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse text-black" : "text-[#00d2ff]"}`} />
              <span>{isPlayingAudio ? "TOCANDO..." : "SOM DO BOOT"}</span>
            </button>

            {/* Símbolos do Controle */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a0d16] border border-zinc-800 text-xs font-black">
              <span className="text-[#00e676]">▲</span>
              <span className="text-[#f50057]">■</span>
              <span className="text-[#ff1744]">●</span>
              <span className="text-[#2979ff]">✖</span>
            </div>

            {/* CTA Principal do Header */}
            <button
              onClick={() => {
                setCheckoutStep("form");
                setShowCheckoutModal(true);
              }}
              className="bg-[#0070d1] hover:bg-[#005be3] transition text-white px-4 sm:px-6 py-2 rounded-lg font-chakra font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(0,112,209,0.5)] flex items-center gap-1.5"
            >
              <span>COMPRAR ACESSO VIP (R$ 29,90)</span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: MINIMALISTA, NOSTÁLGICA E FOCADA EM CONVERSÃO */}
      {/* ========================================================================= */}
      <section className="relative pt-10 sm:pt-16 pb-16 px-4 max-w-6xl mx-auto text-center" id="hero">
        
        {/* Badge Nostálgico */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0070d1]/15 border border-[#0070d1]/40 text-xs text-[#00d2ff] font-chakra font-semibold tracking-wider uppercase mb-5">
          <span>● A TARDE DE SÁBADO EM 2004 AINDA VIVE EM VOCÊ</span>
        </div>

        {/* Headline de Alta Conversão */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-chakra font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15] mb-5">
          Reviva a Era de Ouro do <span className="text-[#00d2ff] drop-shadow-[0_0_25px_rgba(0,210,255,0.4)]">PlayStation 2</span> Sem Passar Raiva.
        </h1>

        {/* Subtítulo Claro e Direto */}
        <p className="text-sm sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal mb-8">
          Chega de gravar DVDs que não funcionam ou garimpar links quebrados com vírus. Tenha acesso direto via nuvem a <strong>mais de 1.000 jogos testados</strong>, prontos para rodar no seu <strong>Pen Drive (OPL)</strong>, <strong>Celular</strong> ou <strong>PC</strong>.
        </p>

        {/* Badges de Compatibilidade Rápida (Triple Platform Cards) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl mx-auto my-6 text-center">
          <div className="bg-[#0c101c] border border-zinc-800 hover:border-[#0070d1]/50 p-3 sm:p-3.5 rounded-xl transition-all">
            <p className="font-chakra text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider">CONSOLE</p>
            <p className="font-chakra font-bold text-sm sm:text-base text-zinc-100 mt-1">100% OPL</p>
            <span className="text-[9px] sm:text-[10px] text-[#00e676] font-mono">Fat & Slim</span>
          </div>
          <div className="bg-[#0c101c] border border-zinc-800 hover:border-[#0070d1]/50 p-3 sm:p-3.5 rounded-xl transition-all">
            <p className="font-chakra text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider">SMARTPHONE</p>
            <p className="font-chakra font-bold text-sm sm:text-base text-zinc-100 mt-1">Android & iOS</p>
            <span className="text-[9px] sm:text-[10px] text-[#00d2ff] font-mono">Controle Bluetooth</span>
          </div>
          <div className="bg-[#0c101c] border border-zinc-800 hover:border-[#0070d1]/50 p-3 sm:p-3.5 rounded-xl transition-all">
            <p className="font-chakra text-[10px] sm:text-xs text-zinc-400 font-bold uppercase tracking-wider">COMPUTADOR</p>
            <p className="font-chakra font-bold text-sm sm:text-base text-zinc-100 mt-1">PC / Notebook</p>
            <span className="text-[9px] sm:text-[10px] text-[#00e676] font-mono">Pré-Configurado</span>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL DE COMPRA NO INÍCIO (PRIMEIRA DOBRA) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-6">
          <button
            onClick={() => {
              setCheckoutStep("form");
              setShowCheckoutModal(true);
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0070d1] hover:bg-[#005be3] text-white font-chakra font-bold text-base sm:text-lg shadow-[0_0_30px_rgba(0,112,209,0.6)] transition-all flex items-center justify-center gap-2"
          >
            <span>COMPRAR MEU ACESSO VIP (R$ 29,90)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handlePlayBoot}
            className={`w-full sm:w-auto px-5 py-3.5 rounded-xl font-chakra font-bold text-sm transition-all border flex items-center justify-center gap-2 ${
              isPlayingAudio
                ? "bg-[#00d2ff] text-black border-[#00d2ff] shadow-[0_0_20px_#00d2ff]"
                : "bg-[#0c101c] hover:bg-[#131b32] text-zinc-300 border-zinc-700"
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? "animate-pulse text-black" : "text-[#00d2ff]"}`} />
            <span>{isPlayingAudio ? "TOCANDO BOOT DE 2004..." : "Ouvir Som de Boot do PS2"}</span>
          </button>
        </div>

        {/* Micro Selos de Confiança */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-zinc-400 font-chakra mb-12">
          <span className="flex items-center gap-1 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00e676]" />
            Acesso Vitalício
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00e676]" />
            Download Imediato
          </span>
          <span className="flex items-center gap-1 text-zinc-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00e676]" />
            Suporte no WhatsApp
          </span>
        </div>

        {/* VITRINE MINIMALISTA DE JOGOS NO HERO (SEM QUADRADOS PESADOS) */}
        <div className="relative max-w-4xl mx-auto pt-4 pb-8">
          <div className="flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto py-4 no-scrollbar">
            {[
              { title: "GTA San Andreas", cover: getPS2Cover3D("SLUS-20946") },
              { title: "PES 2008", cover: getPS2Cover3D("SLUS-21685") },
              { title: "NFS Underground 2", cover: getPS2Cover3D("SLUS-21065") },
              { title: "DBZ Tenkaichi 3", cover: getPS2Cover3D("SLUS-21678") },
              { title: "God of War II", cover: getPS2Cover3D("SCUS-97481") }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="w-32 sm:w-40 h-44 sm:h-56 shrink-0 transition-transform duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  const el = document.getElementById("catalogo");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <img 
                  src={item.cover} 
                  alt={item.title} 
                  className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,112,209,0.3)]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <p className="text-xs font-chakra text-zinc-400 mt-2">
            + Mais de 1.000 capas e jogos clássicos catalogados na nuvem.
          </p>
        </div>

        {/* ESTATÍSTICAS SOCIAIS E PROVA DA COMUNIDADE */}
        <div className="grid grid-cols-3 gap-4 border-t border-zinc-800/80 pt-8 text-center max-w-3xl mx-auto font-chakra">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-wider">+1.480</p>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Jogadores Ativos</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400 tracking-wider">★ 4.9/5</p>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Avaliação dos Membros</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[#00e676] tracking-wider">100%</p>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Testado e Funcional</p>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. CATÁLOGO DE JOGOS: CAPAS FLUTUANTES LIVRES (SEM QUADRADOS ENVOLTA) */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-6xl mx-auto border-t border-zinc-800/80" id="catalogo">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-chakra font-bold text-[#00d2ff] uppercase tracking-widest mb-2">
            Catálogo Sem Dor de Cabeça
          </p>
          <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white tracking-tight">
            Os Maiores Clássicos que Marcaram a Sua Vida
          </h2>
          <p className="text-sm text-zinc-400 mt-3">
            Capas 3D oficiais, arquivos verificados e sem corrupção. Clique no jogo para ver a memória ou jogar.
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: "all", label: "Todas as Obras" },
            { id: "action", label: "Ação & Aventura" },
            { id: "sports", label: "Futebol & Velocidade" },
            { id: "fight", label: "Luta & Animes" },
            { id: "terror", label: "Sobrevivência & Tiro" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-chakra font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#0070d1] text-white shadow-[0_0_15px_rgba(0,112,209,0.5)]"
                  : "bg-[#0c101c] text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRADE DE CAPAS 3D FLUTUANTES (TOTALMENTE LIVRES DE CAIXAS/QUADRADOS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          {filteredCollection.map((game) => (
            <div
              key={game.serial}
              className="group flex flex-col items-center text-center transition-all duration-300"
            >
              {/* Capa 3D Oficial Flutuando (Sem caixa quadrada) */}
              <div className="relative w-48 sm:w-52 h-64 sm:h-72 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,112,209,0.35)]"
                  loading="lazy"
                />
                <span className="absolute -top-1 left-2 px-2.5 py-0.5 rounded-full bg-[#060810]/95 backdrop-blur-md border border-white/15 text-[10px] font-chakra font-bold text-[#00e676] uppercase tracking-wider shadow-lg">
                  {game.tag}
                </span>
              </div>

              {/* Título Oficial que Corresponde Exatamente à Capa */}
              <h3 className="text-lg sm:text-xl font-chakra font-bold text-white tracking-wide mt-4 group-hover:text-[#00d2ff] transition-colors">
                {game.title}
              </h3>

              {/* Citação Nostálgica */}
              <p className="text-xs italic text-zinc-400 font-serif mt-1.5 max-w-xs line-clamp-2">
                "{game.memoryQuote}"
              </p>

              {/* Botões de Ação */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelectedGameMemory(game)}
                  className="py-2 px-3.5 rounded-xl bg-[#0c1220] hover:bg-[#131b32] text-zinc-300 hover:text-white text-xs font-chakra font-semibold transition-all border border-zinc-800 hover:border-[#0070d1] flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>Ver História</span>
                </button>

                <button
                  onClick={() => {
                    setCheckoutStep("form");
                    setShowCheckoutModal(true);
                  }}
                  className="py-2 px-4 rounded-xl bg-[#0070d1] hover:bg-[#005be3] text-white text-xs font-chakra font-bold transition-all shadow-[0_0_15px_rgba(0,112,209,0.4)]"
                >
                  Jogar Agora
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Chamada para Lista Completa de Jogos */}
        <div className="mt-14 text-center">
          <p className="text-xs sm:text-sm font-chakra text-zinc-400 mb-4 tracking-wider">
            + Mais de 1.000 títulos clássicos de PS2 testados e disponíveis para acesso imediato.
          </p>
          <button
            onClick={() => {
              setCheckoutStep("form");
              setShowCheckoutModal(true);
            }}
            className="inline-flex items-center gap-2 bg-[#0c1220] hover:bg-[#152038] border border-[#0070d1]/50 hover:border-[#00d2ff] text-white px-7 py-3 rounded-xl font-chakra font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(0,112,209,0.3)]"
          >
            <span>VER LISTA COMPLETA NA NUVEM VIP</span>
            <ArrowRight className="w-4 h-4 text-[#00d2ff]" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. COMO FUNCIONA EM 3 PASSOS SIMPLES */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 border-t border-zinc-800/80 max-w-5xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <p className="text-xs font-chakra font-bold text-[#00d2ff] uppercase tracking-widest">Sem Burocracia</p>
          <h2 className="text-3xl sm:text-4xl font-chakra font-bold text-white tracking-tight">
            Como Funciona em 3 Passos Simples
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Do primeiro clique até o jogo rodando na sua tela em minutos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#090c15] border border-zinc-800 hover:border-[#0070d1] p-6 rounded-2xl relative transition-all">
            <div className="w-10 h-10 bg-[#0070d1]/20 border border-[#0070d1] text-[#00d2ff] rounded-xl flex items-center justify-center font-chakra font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-chakra font-bold text-lg text-white mb-2">Acesse a Nuvem VIP</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Você recebe o link direto imediatamente por e-mail e WhatsApp. Servidores dedicados na nuvem, sem anúncios chatos ou links falsos.
            </p>
          </div>

          <div className="bg-[#090c15] border border-zinc-800 hover:border-[#0070d1] p-6 rounded-2xl relative transition-all">
            <div className="w-10 h-10 bg-[#0070d1]/20 border border-[#0070d1] text-[#00d2ff] rounded-xl flex items-center justify-center font-chakra font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-chakra font-bold text-lg text-white mb-2">Passe com 1 Clique</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Use os arquivos direto no Pen Drive (OPL) do videogame, ou configure no seu celular ou computador com nossos vídeos guiados de 3 minutos.
            </p>
          </div>

          <div className="bg-[#090c15] border border-zinc-800 hover:border-[#0070d1] p-6 rounded-2xl relative transition-all">
            <div className="w-10 h-10 bg-[#0070d1]/20 border border-[#0070d1] text-[#00d2ff] rounded-xl flex items-center justify-center font-chakra font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-chakra font-bold text-lg text-white mb-2">Pegue o Controle e Jogue</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Ligue o aparelho e volte no tempo. Memory card, saves e jogos funcionando exatamente como no console original.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CONEXÃO COM A ROTINA: "UM PORTAL DE 5 MINUTOS" (TV DE TUBO CRT) */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-6xl mx-auto border-t border-zinc-800/80">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Lado Esquerdo */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1]/15 border border-[#00d2ff]/40 text-xs text-[#00d2ff] font-chakra">
              <Clock className="w-3.5 h-3.5" />
              <span>O PORTAL PARA O PASSADO CABE NA SUA MÃO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-chakra font-bold text-white tracking-tight leading-tight">
              Nós crescemos, a rotina pesou. <br />
              <span className="text-[#00d2ff]">Este é o seu portal de 5 minutos.</span>
            </h2>

            <p className="text-base text-zinc-300 leading-relaxed">
              Trabalho, trânsito, prazos, boletos. O tempo livre encolheu. Ninguém mais tem 3 horas para queimar mídias em velocidade 4x, caçar gravadores antigos ou configurar emuladores cheios de plugins que travam no primeiro vídeo.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 bg-[#0a0d16] p-4 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-[#0070d1]/20 flex items-center justify-center shrink-0 text-[#00d2ff]">
                  <Play className="w-4 h-4 fill-[#00d2ff]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-chakra">Sem Espera, Direto no Menu</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Chegue cansado à noite, ligue e jogue. Em 10 segundos você já está disputando uma partida no PES ou cruzando San Andreas de moto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0a0d16] p-4 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-[#00e676]/20 flex items-center justify-center shrink-0 text-[#00e676]">
                  <Disc className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-chakra">Salvação dos Leitores Queimados</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Seu PS2 guardado no armário volta à vida. Roda tudo digitalmente via OPL em pendrive ou HD externo, sem forçar nenhum laser.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0a0d16] p-4 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-[#f50057]/20 flex items-center justify-center shrink-0 text-[#f50057]">
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-chakra">Na TV Antiga ou na Tela Moderna</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Ajustado para cabo componente, HDMI de Smart TVs ou o autêntico charme 480i com scanlines nas velhas TVs de tubo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lado Direito: A TV de Tubo Retrô Interativa */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#12141c] p-6 rounded-3xl border-4 border-[#252836] shadow-[0_0_60px_rgba(0,0,0,0.9)] relative">
              
              <div className="flex items-center justify-between pb-3 text-xs font-mono text-zinc-500">
                <span>SONY TRINITRON • RETRO CRT 21"</span>
                <span className="text-[#00e676] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping" />
                  NTSC-U
                </span>
              </div>

              <div className={`relative h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-black crt-screen-frame flex items-center justify-center transition-all ${
                tvPower ? "opacity-100" : "opacity-15"
              }`}>
                {tvPower ? (
                  <div className="w-full h-full p-4 flex flex-col justify-between relative">
                    <div className="flex items-center justify-between text-xs font-mono text-[#00d2ff] crt-glow">
                      <span>VIDEO {tvChannel}</span>
                      <span>480i • 60Hz</span>
                    </div>

                    <div className="text-center space-y-2">
                      <div className="inline-block p-3 rounded-xl bg-black/60 border border-[#0070d1]/40">
                        <Disc className="w-10 h-10 text-[#00d2ff] mx-auto animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <h4 className="text-white font-mono font-bold text-sm tracking-wider">
                        OPEN PS2 LOADER V22.1
                      </h4>
                      <p className="text-[11px] text-[#00e676] font-mono">
                        [READY] 1.042 JOGOS CATALOGADOS
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
                      <span>MEM: 8MB MAGICGATE</span>
                      <span>● ENTRAR | ✖ VOLTAR</span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-12 w-full pointer-events-none animate-pulse" />
                  </div>
                ) : (
                  <div className="text-center text-zinc-600 font-mono text-xs">
                    TV DESLIGADA
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTvPower(!tvPower)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      tvPower 
                        ? "bg-[#ff1744] text-white shadow-[0_0_10px_#ff1744]" 
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    POWER {tvPower ? "ON" : "OFF"}
                  </button>

                  <button
                    onClick={() => setTvChannel(c => c === 1 ? 2 : 1)}
                    disabled={!tvPower}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-all"
                  >
                    CANAL: AV-{tvChannel}
                  </button>
                </div>

                <div className="flex gap-1">
                  <div className="w-2 h-6 bg-zinc-800 rounded-sm" />
                  <div className="w-2 h-6 bg-zinc-800 rounded-sm" />
                  <div className="w-2 h-6 bg-zinc-800 rounded-sm" />
                  <div className="w-2 h-6 bg-zinc-800 rounded-sm" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SEÇÃO DE OFERTA PRINCIPAL (CLUBE & VALOR VIP) */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-4xl mx-auto border-t border-zinc-800/80" id="oferta">
        
        <div className="bg-[#0b0e1a] border-2 border-[#0070d1] rounded-2xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,112,209,0.35)] relative text-left">
          
          <div className="text-center space-y-2 mb-8">
            <span className="bg-[#0070d1] text-white text-xs font-chakra font-bold px-3 py-1 rounded tracking-wider uppercase">
              Acesso Completo e Ilimitado
            </span>
            <h2 className="text-2xl sm:text-4xl font-chakra font-bold text-white pt-2">
              O Que Você Vai Receber Agora:
            </h2>
          </div>

          <div className="space-y-3.5 mb-8">
            <div className="flex items-start gap-3 bg-black/40 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[#00d2ff] font-bold text-base">✔</span>
              <span className="text-xs sm:text-sm text-zinc-200">
                <strong className="text-white font-chakra">Catálogo VIP:</strong> Mais de 1.000 jogos de PS2 selecionados e organizados por ordem alfabética.
              </span>
            </div>

            <div className="flex items-start gap-3 bg-black/40 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[#00d2ff] font-bold text-base">✔</span>
              <span className="text-xs sm:text-sm text-zinc-200">
                <strong className="text-white font-chakra">Futebol Atualizado (PES/Bomba Patch):</strong> Com transferências recentes e narração clássica brasileira.
              </span>
            </div>

            <div className="flex items-start gap-3 bg-black/40 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[#00d2ff] font-bold text-base">✔</span>
              <span className="text-xs sm:text-sm text-zinc-200">
                <strong className="text-white font-chakra">Guia Completo OPL:</strong> Vídeo de 3 minutos ensinando como colocar no Pen Drive sem erro.
              </span>
            </div>

            <div className="flex items-start gap-3 bg-black/40 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[#00d2ff] font-bold text-base">✔</span>
              <span className="text-xs sm:text-sm text-zinc-200">
                <strong className="text-white font-chakra">Instalação Celular e PC:</strong> Emuladores leves já pré-configurados para você só abrir e jogar.
              </span>
            </div>

            <div className="flex items-start gap-3 bg-black/40 p-3.5 rounded-xl border border-zinc-800">
              <span className="text-[#00d2ff] font-bold text-base">✔</span>
              <span className="text-xs sm:text-sm text-zinc-200">
                <strong className="text-white font-chakra">Suporte Individual no WhatsApp:</strong> Tira-dúvidas caso precise de ajuda na configuração.
              </span>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6 text-center">
            <p className="text-xs font-chakra text-zinc-400 uppercase tracking-wider mb-2">
              Pagamento Único • Sem Mensalidades
            </p>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-zinc-500 text-lg line-through font-chakra">R$ 97,00</span>
              <span className="text-3xl sm:text-4xl font-chakra font-black text-white">R$ 29,90</span>
            </div>

            <button
              onClick={() => {
                setCheckoutStep("form");
                setShowCheckoutModal(true);
              }}
              className="w-full py-4 rounded-xl bg-[#0070d1] hover:bg-[#005be3] text-white font-chakra font-bold text-base sm:text-lg transition-all shadow-[0_0_30px_rgba(0,112,209,0.5)] flex items-center justify-center gap-2"
            >
              <span>COMPRAR MEU ACESSO AGORA →</span>
            </button>
            <p className="text-xs text-zinc-400 font-chakra mt-3">
              Liberação imediata do seu Token VIP no e-mail e WhatsApp após a confirmação.
            </p>
          </div>

        </div>

        {/* GARANTIA BLINDADA DE 7 DIAS */}
        <div className="bg-[#090c15] border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-[0_0_30px_rgba(16,185,129,0.15)] mt-12">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold mb-3">
            🛡️
          </div>
          <h3 className="font-chakra font-bold text-xl text-white">Garantia Blindada de 7 Dias</h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mt-2">
            Se você acessar a plataforma, baixar os arquivos e achar que não valeu a pena, basta pedir o reembolso em até 7 dias que devolvemos 100% do seu valor. Sem burocracia e sem ressentimentos.
          </p>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 6. FAQS: "DÚVIDAS DA NOSSA COMUNIDADE" */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-4xl mx-auto border-t border-zinc-800/80">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-chakra font-bold text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-sm text-zinc-400 mt-2 font-chakra">
            Tudo o que você precisa saber antes de garantir seu acesso.
          </p>
        </div>

        <div className="space-y-3 mb-12 text-left">
          {COMMUNITY_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-[#0a0d16] border border-zinc-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="font-chakra font-bold text-sm sm:text-base text-zinc-100">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00d2ff] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-800/80 bg-[#020305] py-10 px-4 text-center text-xs font-chakra text-zinc-500">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#00e676]">▲</span>
            <span className="text-[#f50057]">■</span>
            <span className="text-[#ff1744]">●</span>
            <span className="text-[#2979ff]">✖</span>
          </div>
          <p className="text-zinc-400">
            MAGO GAMER © 2026 — TODOS OS DIREITOS RESERVADOS.
          </p>
          <p className="text-[11px] text-zinc-600">
            PlayStation 2, DualShock, MagicGate e OPL são marcas de seus respectivos donos. Desenvolvido para preservar a era de ouro dos videogames.
          </p>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MODAL: ESTOJO / MEMÓRIA AFETIVA DO JOGO SELECIONADO */}
      {/* ========================================================================= */}
      {selectedGameMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0d111c] border-2 border-[#0070d1]/60 rounded-2xl max-w-lg w-full p-6 relative shadow-[0_0_50px_rgba(0,112,209,0.4)] text-left">
            
            <button
              onClick={() => setSelectedGameMemory(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/50"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-zinc-800">
              <img
                src={selectedGameMemory.coverUrl}
                alt={selectedGameMemory.title}
                className="w-16 h-22 object-contain rounded drop-shadow"
              />
              <div>
                <h3 className="text-lg font-chakra font-bold text-white leading-snug">
                  {selectedGameMemory.title}
                </h3>
                <span className="text-[10px] text-[#00e676] font-chakra font-semibold">
                  PRESERVADO EM ISO LIMPA • TESTADO
                </span>
              </div>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-[#060810] rounded-xl border border-zinc-800 text-xs italic font-serif text-zinc-300">
                "{selectedGameMemory.memoryQuote}"
              </div>
              <div>
                <span className="text-[11px] font-chakra text-zinc-400 uppercase tracking-wider block mb-1">
                  A Lembrança de Sábado à Tarde:
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {selectedGameMemory.memoryStory}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-chakra font-bold text-[#00e676]">
                R$ 29,90 (Acesso Vitalício)
              </span>
              <button
                onClick={() => {
                  setSelectedGameMemory(null);
                  setCheckoutStep("form");
                  setShowCheckoutModal(true);
                }}
                className="py-2.5 px-5 rounded-xl bg-[#0070d1] hover:bg-[#005be3] text-white font-chakra font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,112,209,0.4)]"
              >
                Comprar Acesso VIP
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESGATE DO TOKEN VIP (CHECKOUT & SUPABASE TOKEN) */}
      {/* ========================================================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b0e18] border-2 border-[#0070d1] rounded-2xl max-w-md w-full p-6 relative shadow-[0_0_60px_rgba(0,112,209,0.4)] text-left">
            
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800/50"
            >
              ✕
            </button>

            {checkoutStep === "form" && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0070d1]/30 flex items-center justify-center text-[#00d2ff]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-chakra font-bold text-white">Garantir Meu Acesso VIP</h3>
                    <span className="text-[10px] font-chakra text-zinc-400">+1.000 Jogos Prontos • R$ 29,90</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 my-3 leading-relaxed">
                  Preencha seus dados para receber o <strong>Token VIP Oficial</strong> de acesso ilimitado aos servidores e tutoriais guiados.
                </p>

                <form onSubmit={handleSupportSubmit} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-[11px] font-chakra text-zinc-400 mb-1">SEU NOME COMPLETO</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alan Ferreira"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060810] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#0070d1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-chakra text-zinc-400 mb-1">SEU E-MAIL (RECEBIMENTO DO TOKEN)</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@gmail.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060810] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#0070d1]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-chakra text-zinc-400 mb-1">WHATSAPP (SUPORTE INDIVIDUAL)</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={userWhatsapp}
                      onChange={(e) => setUserWhatsapp(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060810] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#0070d1]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingToken}
                      className="w-full py-3.5 rounded-xl bg-[#0070d1] hover:bg-[#005be3] text-white font-chakra font-bold text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,112,209,0.5)] transition-all flex items-center justify-center gap-2"
                    >
                      {isSavingToken ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" />
                          <span>Liberando seu Token VIP...</span>
                        </>
                      ) : (
                        <>
                          <span>Liberar Meu Acesso Agora (R$ 29,90)</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#00e676]/20 flex items-center justify-center mx-auto text-[#00e676]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-chakra font-bold text-white">Acesso VIP Liberado!</h3>
                <p className="text-xs text-zinc-300">
                  Seu cadastro foi registrado com sucesso nos servidores. O portal para as suas memórias já está aberto.
                </p>

                <div className="p-4 bg-[#060810] rounded-xl border border-[#00e676]/40 text-center space-y-1">
                  <span className="text-[10px] font-chakra text-zinc-400 block">SEU TOKEN VIP OFICIAL:</span>
                  <div className="text-lg font-chakra font-black text-[#00e676] tracking-widest selection:bg-white selection:text-black">
                    {generatedToken}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20acabei%20de%20comprar%20o%20acesso%20VIP%20do%20Mago%20Gamer!"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-[#25D366] text-black font-chakra font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>Falar com o Suporte no WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full py-2.5 text-xs text-zinc-400 hover:text-white font-chakra"
                  >
                    Fechar e Continuar Navegando
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
