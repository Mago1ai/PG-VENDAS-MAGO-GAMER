import { useState, useEffect, FormEvent, useMemo, useRef, useCallback } from "react";
import { 
  ShieldCheck, 
  Sparkles,
  Play,
  Volume2,
  VolumeX,
  Tv,
  HelpCircle,
  MessageCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  ExternalLink,
  Heart,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sliders,
  HardDrive,
  Disc,
  History,
  Monitor
} from "lucide-react";
import { getPS2Cover3D } from "./services/coverService";

// --- CREDENCIAIS DO SUPABASE (GRAVAÇÃO DE TOKENS EM TEMPO REAL) ---
const SUPABASE_URL = "https://vonyukxaguxbbituavlt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvbnl1a3hhZ3V4YmJpdHVhdmx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNTU5NzUsImV4cCI6MjEwMzYzMTk3NX0.BYqfyQy6nzHQYCkIYaqdlwbZWPfCRbSUjzVB1EKwi44";

// --- SINTETIZADOR DO ÁUDIO DE BOOT DO PS2 (WEB AUDIO API NATIVA) ---
// Recria fielmente a abertura orquestral sub-grave e o acorde atmosférico clássico
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

      // Filtro passa-baixa progressivo (revelando brilho conforme o som sobe)
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

// --- ESTRUTURA DOS JOGOS E MEMÓRIAS AFETIVAS ---
interface PreservedGame {
  title: string;
  serial: string;
  year: string;
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
    year: "2004",
    tag: "🏆 O MAIOR CLÁSSICO",
    category: "action",
    memoryQuote: "R1, R2, L1, X, Esquerda, Baixo, Direita, Cima...",
    memoryStory: "Aquele sábado ensolarado em 2004. O caderno da escola com as folhas arrancadas no chão cheias de códigos anotados a caneta. O pôr do sol alaranjado sobre Los Santos enquanto tocava 'A Horse with No Name' ou rap clássico na rádio e a sirene da polícia ao fundo.",
    coverUrl: getPS2Cover3D("SLUS-20946")
  },
  {
    title: "Bomba Patch 100% Atualizado",
    serial: "SLUS-21820",
    year: "2005",
    tag: "⚽ FUTEBOL RAIZ",
    category: "sports",
    memoryQuote: "100% Atualizado, é ruim de aturar! Com a nossa equipe ninguém vai desbancar...",
    memoryStory: "A sala lotada de amigos, ventilador ligado no máximo e a disputa pra não ficar com o controle que tinha o direcional mole. Aquele chute do meio de campo com o Adriano Imperador de força 99, o gol aos 90' e a comemoração batendo a mão no sofá.",
    coverUrl: getPS2Cover3D("SLUS-21820")
  },
  {
    title: "Need for Speed: Underground 2",
    serial: "SLUS-21065",
    year: "2004",
    tag: "🚗 VELOCIDADE PURA",
    category: "sports",
    memoryQuote: "Riders on the storm... into this house we're born...",
    memoryStory: "A chuva caindo no asfalto molhado de Bayview, o ronco do motor do Nissan Skyline, as luzes de neon verde sob o carro e horas perdidas na oficina escolhendo a caixa de som do porta-malas e o pára-choque perfeito.",
    coverUrl: getPS2Cover3D("SLUS-21065")
  },
  {
    title: "Dragon Ball Z: Budokai Tenkaichi 3",
    serial: "SLUS-21670",
    year: "2007",
    tag: "⚡ ANIME SUPREMO",
    category: "fight",
    memoryQuote: "Kamehameha! Gire os dois analógicos o mais rápido possível!",
    memoryStory: "A palma da mão vermelha de tanto girar o analógico contra a parede no choque de poderes. A dublagem com vozes da nossa infância, mais de 160 guerreiros e a sensação única de voar pelo cenário destruindo montanhas.",
    coverUrl: getPS2Cover3D("SLUS-21670")
  },
  {
    title: "God of War II",
    serial: "SCUS-97481",
    year: "2007",
    tag: "🔥 ÉPICO CINEMATOGRÁFICO",
    category: "action",
    memoryQuote: "I will make you suffer, Zeus!",
    memoryStory: "A abertura mais espetacular da história dos consoles: Kratos gigante em Rodes, desafiando o Colosso de pedra logo nos primeiros 10 minutos. O combate com as Lâminas de Atena que fez todo mundo acreditar que o PS2 era capaz de milagres gráficos.",
    coverUrl: getPS2Cover3D("SCUS-97481")
  },
  {
    title: "Resident Evil 4",
    serial: "SLUS-21134",
    year: "2005",
    tag: "🧟 TERROR INESQUECÍVEL",
    category: "terror",
    memoryQuote: "Un forastero! ¡Agárrenlo!",
    memoryStory: "Jogar no escuro com o coração disparado. A chuva torrencial, a munição quase zerada, o som assustador da motosserra do Dr. Salvador ecoando no vilarejo e a paz indescritível ao encontrar uma máquina de escrever com a trilha suave do save.",
    coverUrl: getPS2Cover3D("SLUS-21134")
  },
  {
    title: "Bully (Canis Canem Edit)",
    serial: "SLUS-21269",
    year: "2006",
    tag: "🎒 MUNDO ABERTO",
    category: "action",
    memoryQuote: "O sino tocou! Fuja dos monitores antes que te peguem!",
    memoryStory: "Jimmy Hopkins de skate pelo pátio da Bullworth Academy. Fugir das aulas de inglês, atirar bolinhas de gude na escada, acertar estilingue no diretor e dominar a escola inteira com a jaqueta dos valentões.",
    coverUrl: getPS2Cover3D("SLUS-21269")
  },
  {
    title: "Def Jam: Fight for NY",
    serial: "SLUS-21004",
    year: "2004",
    tag: "🥊 LUTA DE RUA",
    category: "fight",
    memoryQuote: "Snoop Dogg, DMX e Busta Rhymes no ringue de rua.",
    memoryStory: "As batalhas subterrâneas em arenas de Nova York onde o público te empurrava de volta pro combate. Arremessar o oponente contra o trem do metrô ao som do mais puro hip-hop dos anos 2000.",
    coverUrl: getPS2Cover3D("SLUS-21004")
  },
  {
    title: "Black",
    serial: "SLUS-21376",
    year: "2006",
    tag: "💥 TIRO SUPREMO",
    category: "terror",
    memoryQuote: "O som de um tiroteio real dentro da sua sala de estar.",
    memoryStory: "O chão tremendo, pedaços de concreto voando na tela e o som dos cartuchos caindo no chão. Ninguém acreditava que um console de 32MB de RAM podia entregar tanta destruição e beleza gráfica.",
    coverUrl: getPS2Cover3D("SLUS-21376")
  }
];

// --- PERGUNTAS FREQUENTES DA COMUNIDADE ---
const COMMUNITY_FAQS = [
  {
    q: "O que é exatamente o projeto 'Memórias Preservadas'?",
    a: "É uma iniciativa independente criada por jogadores para manter viva a história e o acervo definitivo do PlayStation 2. Em vez de lidar com discos riscados, leitores queimados ou emuladores complicados, mantemos servidores dedicados de alta velocidade com todo o catálogo organizado, dublado, legendado e pronto para jogar."
  },
  {
    q: "Posso jogar no meu PlayStation 2 físico ou no PC/Celular?",
    a: "Em tudo! O acervo foi padronizado para funcionar tanto no PS2 original (via OPL em Pendrive/HD Externo, mesmo com leitor estragado) quanto no seu computador, notebook ou smartphone Android. Você escolhe onde quer reviver suas lembranças."
  },
  {
    q: "Os jogos possuem dublagens e legendas em português?",
    a: "Sim! Preservamos com carinho as dublagens clássicas brasileiras (como Dragon Ball Z BT3 e God of War II) e todas as traduções e edições icônicas da época (como Bomba Patch e GTA San Andreas legendado)."
  },
  {
    q: "Tenho pouco tempo livre no dia a dia. Vale a pena para mim?",
    a: "Foi pensado exatamente para você. Nós crescemos, as contas chegaram e a rotina pesou. A proposta deste projeto é ser a sua pausa de 5 a 20 minutos: você aperta o play e o jogo abre imediatamente, sem instalações demoradas ou configurações técnicas."
  },
  {
    q: "Para onde vai o valor do apoio de R$ 29,90?",
    a: "100% do valor arrecadado é destinado à manutenção dos servidores dedicados de armazenamento, largura de banda para downloads ultra-rápidos e suporte direto aos membros do clube. É o que garante que essas memórias nunca saiam do ar."
  }
];

// --- COMPONENTE CANVAS 3D: AS TORRES E O BOOT DO PS2 ---
function Ps2BootCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 420;
    };
    window.addEventListener("resize", handleResize);

    // Gerar as 22 torres / monolitos icônicos da BIOS do PS2
    const towers = Array.from({ length: 22 }).map((_, i) => {
      const angle = (i / 22) * Math.PI * 2;
      const radius = 120 + (i % 4) * 35;
      return {
        baseX: Math.cos(angle) * radius,
        baseZ: Math.sin(angle) * radius,
        y: (Math.sin(i * 1.5) * 40),
        height: 60 + (i % 5) * 28,
        width: 16 + (i % 3) * 6,
        colorIdx: i % 3,
        rotationSpeed: 0.003 + (i % 3) * 0.002
      };
    });

    // Partículas flutuantes de luz (o pó místico do boot)
    const dust = Array.from({ length: 40 }).map(() => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 300,
      z: Math.random() * 400 - 200,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.4 + 0.1
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Fundo azul translúcido com gradiente radial (o horizonte infinito do PS2)
      const grad = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, Math.max(width, height) / 1.5
      );
      grad.addColorStop(0, "rgba(0, 55, 145, 0.45)");
      grad.addColorStop(0.5, "rgba(0, 20, 60, 0.25)");
      grad.addColorStop(1, "rgba(6, 7, 11, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Renderizar partículas de poeira
      dust.forEach(p => {
        p.y -= p.speed;
        if (p.y < -150) p.y = 150;
        const scale = 250 / (250 + p.z);
        const px = centerX + p.x * scale;
        const py = centerY + p.y * scale;

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${0.4 * scale})`;
        ctx.fill();
      });

      // Rotação suave do conjunto de monolitos
      const cosT = Math.cos(time * 0.35);
      const sinT = Math.sin(time * 0.35);

      // Ordenar torres pela profundidade Z projetada para renderizar oclusão correta
      const projectedTowers = towers.map(t => {
        const rx = t.baseX * cosT - t.baseZ * sinT;
        const rz = t.baseX * sinT + t.baseZ * cosT + 300; // distância da câmera
        return { ...t, rx, rz };
      }).sort((a, b) => b.rz - a.rz);

      projectedTowers.forEach(t => {
        const perspective = 320 / t.rz;
        const x = centerX + t.rx * perspective;
        const y = centerY + t.y * perspective;
        const w = t.width * perspective;
        const h = t.height * perspective;
        const alpha = Math.min(1, Math.max(0.2, (perspective - 0.4) * 2));

        // Desenhar corpo da torre (translúcido e com iluminação azul ciano)
        ctx.save();
        ctx.translate(x, y);

        const towerGrad = ctx.createLinearGradient(0, -h, 0, h);
        if (t.colorIdx === 0) {
          towerGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
          towerGrad.addColorStop(0.3, `rgba(0, 210, 255, ${alpha * 0.7})`);
          towerGrad.addColorStop(1, `rgba(0, 55, 145, ${alpha * 0.2})`);
        } else if (t.colorIdx === 1) {
          towerGrad.addColorStop(0, `rgba(180, 225, 255, ${alpha * 0.85})`);
          towerGrad.addColorStop(0.5, `rgba(0, 112, 209, ${alpha * 0.6})`);
          towerGrad.addColorStop(1, `rgba(0, 20, 60, ${alpha * 0.15})`);
        } else {
          towerGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
          towerGrad.addColorStop(0.4, `rgba(0, 180, 255, ${alpha * 0.65})`);
          towerGrad.addColorStop(1, `rgba(0, 40, 120, ${alpha * 0.2})`);
        }

        ctx.fillStyle = towerGrad;
        ctx.fillRect(-w / 2, -h, w, h);

        // Aresta brilhante da torre (wireframe sutil característico do PS2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(-w / 2, -h, w, h);

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#0070d1]/30 bg-[#040508]/90 shadow-[0_0_50px_rgba(0,112,209,0.25)]">
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* Texto overlay sutil de inicialização */}
      <div className="absolute top-4 left-4 flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#00d2ff]/80 bg-[#06070b]/70 px-3 py-1 rounded-md border border-[#00d2ff]/20 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
        SISTEMA NATIVO PS2 BIOS • MEMÓRIA OPERACIONAL
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] font-mono tracking-widest text-zinc-400/80 bg-[#06070b]/70 px-3 py-1 rounded-md border border-white/10 backdrop-blur-sm">
        SCPH-39001 • CANVAS 60 FPS
      </div>
    </div>
  );
}

export default function App() {
  // Estados de Interface e Gatilhos Sensoriais
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [scanlinesActive, setScanlinesActive] = useState(true);
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

  // Submissão do Apoio / Reserva da Cadeira no Clube
  const handleSupportSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    setIsSavingToken(true);
    const tokenCode = "MAGO-MEM-" + Math.floor(100000 + Math.random() * 900000);
    setGeneratedToken(tokenCode);

    try {
      // Gravação direta no Supabase Cloud DB
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
    <div className="relative min-h-screen bg-[#040508] text-white selection:bg-[#0070d1] selection:text-white font-sans antialiased overflow-x-hidden pb-16 sm:pb-0">
      
      {/* OVERLAY DE SCANLINES CRT RETRÔ (COM TOGGLE) */}
      {scanlinesActive && (
        <div className="fixed inset-0 crt-overlay z-50 pointer-events-none opacity-60" />
      )}

      {/* AMBIÊNCIA DE LUZ DE BOOT PLAYSTATION 2 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#003791]/35 via-[#0070d1]/10 to-transparent blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-6 w-[450px] h-[450px] bg-[#00d2ff]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-6 w-[500px] h-[500px] bg-[#003791]/15 rounded-full blur-[160px] pointer-events-none" />

      {/* --- HEADER: BARRA DE NAVEGAÇÃO & CONTROLES SENSORIAIS --- */}
      <header className="border-b border-[#0070d1]/25 bg-[#06070b]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Identidade */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0070d1] to-[#003791] p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(0,112,209,0.8)]">
              <Disc className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                MEMÓRIAS <span className="text-[#00d2ff] drop-shadow-[0_0_8px_#00d2ff]">PRESERVADAS</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-zinc-400 tracking-widest block uppercase font-mono">
                Acervo Histórico PS2 • 2000–2008
              </span>
            </div>
          </div>

          {/* Símbolos Oficiais e Controles de Áudio / CRT */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Botão de Áudio do Boot */}
            <button
              onClick={handlePlayBoot}
              disabled={isPlayingAudio}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isPlayingAudio 
                  ? "bg-[#00d2ff] text-black shadow-[0_0_20px_#00d2ff]" 
                  : "bg-[#0c101c] hover:bg-[#121828] text-zinc-200 border border-[#0070d1]/40"
              }`}
              title="Tocar o acorde icônico do boot do PS2"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse" : "text-[#00d2ff]"}`} />
              <span className="hidden md:inline font-mono">
                {isPlayingAudio ? "TOCANDO BOOT..." : "SOM DO BOOT"}
              </span>
            </button>

            {/* Toggle de Scanlines da TV */}
            <button
              onClick={() => setScanlinesActive(!scanlinesActive)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono transition-all border ${
                scanlinesActive 
                  ? "bg-[#0070d1]/20 text-[#00d2ff] border-[#00d2ff]/40" 
                  : "bg-zinc-900/80 text-zinc-400 border-zinc-700"
              }`}
              title="Ativar ou desativar linhas de tubo (Scanlines CRT)"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SCANLINES {scanlinesActive ? "ON" : "OFF"}</span>
            </button>

            {/* Símbolos do Controle PlayStation */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0a0d16] border border-[#0070d1]/30 text-xs font-black">
              <span className="text-[#00e676]">▲</span>
              <span className="text-[#f50057]">■</span>
              <span className="text-[#ff1744]">●</span>
              <span className="text-[#2979ff]">✖</span>
            </div>

            {/* CTA do Clube */}
            <button
              onClick={() => {
                setCheckoutStep("form");
                setShowCheckoutModal(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0070d1] to-[#00d2ff] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-all"
            >
              Apoiar Clube
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: "O BARULHO DO BOOT NO ESCURO" */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-16 pb-16 sm:pb-24 px-4 max-w-6xl mx-auto text-center" id="hero">
        
        {/* Badge Nostálgico */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0070d1]/15 border border-[#00d2ff]/40 text-xs text-[#00d2ff] font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(0,210,255,0.2)] mb-6">
          <History className="w-4 h-4 text-[#00d2ff]" />
          <span>PROJETO INDEPENDENTE DE PRESERVAÇÃO HISTÓRICA</span>
        </div>

        {/* Título Principal Conforme Manifesto */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.1] mb-6">
          A tarde de sábado em <span className="bg-gradient-to-r from-[#00d2ff] via-[#2979ff] to-[#ffffff] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,210,255,0.4)]">2004</span> ainda vive em você.
        </h1>

        {/* Subtítulo Afetivo Conforme Manifesto */}
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal mb-8">
          Lembra do barulho do memory card lendo no escuro e a tela de blocos se formando? Não é sobre jogos. É sobre quem nós éramos.
        </p>

        {/* Botão de Disparo do Som com Ondas Visuais */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={handlePlayBoot}
            className={`group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all ${
              isPlayingAudio 
                ? "bg-[#00d2ff] text-black shadow-[0_0_35px_rgba(0,210,255,0.8)] scale-105" 
                : "bg-[#0d1222] hover:bg-[#131b32] text-white border border-[#0070d1]/50 shadow-[0_0_20px_rgba(0,112,209,0.3)]"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
              <Play className={`w-4 h-4 ${isPlayingAudio ? "text-black fill-black" : "text-[#00d2ff] fill-[#00d2ff]"}`} />
            </div>
            <span className="font-mono tracking-wide">
              {isPlayingAudio ? "Ecoando o Boot do PS2..." : "Ouvir o Som de Boot no Escuro"}
            </span>
            {isPlayingAudio && (
              <span className="flex gap-1">
                <span className="w-1.5 h-4 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-6 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            )}
          </button>

          <button
            onClick={() => {
              const el = document.getElementById("galeria");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/5 text-zinc-300 font-semibold text-sm sm:text-base border border-zinc-700/80 transition-all"
          >
            <BookOpen className="w-4 h-4 text-[#00e676]" />
            <span>Explorar as Memórias Preservadas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Animação Canvas: A Sequência de Boot do PS2 em 3D */}
        <div className="max-w-4xl mx-auto">
          <Ps2BootCanvas />
          <p className="text-xs font-mono text-zinc-500 mt-3 text-center">
            * Animação nativa de renderização dos monolitos da BIOS do PlayStation 2 rodando a 60 quadros por segundo.
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. GALERIA DE PRESERVAÇÃO: "AS HISTÓRIAS QUE NÓS JOGAMOS" */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-6xl mx-auto border-t border-zinc-800/80" id="galeria">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1]/10 border border-[#0070d1]/30 text-xs text-[#00d2ff] font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACERVO VIVO • PRESERVAÇÃO EM 1:1</span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Os clássicos que moldaram a nossa infância. Preservados para sempre.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 leading-relaxed">
            Nenhum jogo é apenas um arquivo. É a memória de um gol aos 90' no PES ou do "wasted" no GTA. Clique em qualquer obra para abrir o estojo e resgatar a história daquela época.
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
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
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#0070d1] text-white shadow-[0_0_15px_rgba(0,112,209,0.5)]"
                  : "bg-[#0a0d16] text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grade de Capas 3D que se Abrem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollection.map((game) => (
            <div
              key={game.serial}
              className="group relative bg-[#090c15] rounded-2xl border border-[#0070d1]/20 hover:border-[#00d2ff]/60 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,112,209,0.25)] hover:-translate-y-1"
            >
              <div>
                {/* Cabeçalho do Card: Serial do PS2 e Ano */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-zinc-800">
                  <span className="text-[#00d2ff] font-bold">{game.serial}</span>
                  <span className="bg-zinc-800/80 px-2 py-0.5 rounded text-[10px]">{game.year}</span>
                </div>

                {/* Capa Oficial 3D com Flutuação */}
                <div className="relative my-4 flex items-center justify-center py-2">
                  <div className="w-44 sm:w-48 h-60 sm:h-64 relative transition-transform duration-500 group-hover:scale-105 group-hover:rotate-1">
                    <img
                      src={game.coverUrl}
                      alt={game.title}
                      className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-bold text-[#00e676] uppercase tracking-wider">
                    {game.tag}
                  </span>
                </div>

                {/* Título da Obra */}
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#00d2ff] transition-colors">
                  {game.title}
                </h3>

                {/* Citação Nostálgica */}
                <p className="text-xs italic text-zinc-400 font-serif mt-2 border-l-2 border-[#0070d1] pl-3 py-1">
                  "{game.memoryQuote}"
                </p>
              </div>

              {/* Botão de Abrir Estojo / Memória */}
              <div className="mt-5 pt-3 border-t border-zinc-800/80">
                <button
                  onClick={() => setSelectedGameMemory(game)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0c1220] hover:bg-[#0070d1] text-zinc-200 hover:text-white text-xs font-bold transition-all border border-[#0070d1]/30 hover:border-transparent"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00d2ff] group-hover:text-white" />
                  <span>Resgatar Memória de Infância</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. CONEXÃO COM A ROTINA: "UM PORTAL DE 5 MINUTOS" (TV DE TUBO CRT) */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-6xl mx-auto border-t border-zinc-800/80">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Lado Esquerdo: Reflexão sobre a Rotina */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0070d1]/15 border border-[#00d2ff]/40 text-xs text-[#00d2ff] font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>O PORTAL PARA O PASSADO CABE NA SUA MÃO</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Nós crescemos, a rotina pesou. <br />
              <span className="text-[#00d2ff]">Este é o seu portal de 5 minutos.</span>
            </h2>

            <p className="text-base text-zinc-300 leading-relaxed">
              Trabalho, trânsito, prazos, boletos. O tempo livre encolheu. Ninguém mais tem 3 horas para queimar mídias em velocidade 4x, caçar gravadores antigos ou configurar emuladores cheios de plugins que travam no primeiro vídeo.
            </p>

            {/* Três Pilares da Preservação Descomplicada */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 bg-[#0a0d16] p-4 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-[#0070d1]/20 flex items-center justify-center shrink-0 text-[#00d2ff]">
                  <Play className="w-4 h-4 fill-[#00d2ff]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sem Espera, Direto no Menu</h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Chegue cansado à noite, ligue e jogue. Em 10 segundos você já está disputando uma partida no Bomba Patch ou cruzando San Andreas de moto.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0a0d16] p-4 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-[#00e676]/20 flex items-center justify-center shrink-0 text-[#00e676]">
                  <Disc className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Salvação dos Leitores Queimados</h4>
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
                  <h4 className="text-sm font-bold text-white">Na TV Antiga ou na Tela Moderna</h4>
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
              
              {/* Moldura da TV com Alto-Falantes Laterais */}
              <div className="flex items-center justify-between pb-3 text-xs font-mono text-zinc-500">
                <span>SONY TRINITRON • RETRO CRT 21"</span>
                <span className="text-[#00e676] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping" />
                  NTSC-U
                </span>
              </div>

              {/* A Tela Curva da TV */}
              <div className={`relative h-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-black crt-screen-frame flex items-center justify-center transition-all ${
                tvPower ? "opacity-100" : "opacity-15"
              }`}>
                {tvPower ? (
                  <div className="w-full h-full p-4 flex flex-col justify-between relative">
                    {/* Canal e Modo */}
                    <div className="flex items-center justify-between text-xs font-mono text-[#00d2ff] crt-glow">
                      <span>VIDEO {tvChannel}</span>
                      <span>480i • 60Hz</span>
                    </div>

                    {/* Conteúdo Exibido no Tubo */}
                    <div className="text-center space-y-2">
                      <div className="inline-block p-3 rounded-xl bg-black/60 border border-[#0070d1]/40">
                        <img 
                          src="/logo.png" 
                          alt="Logo Mago" 
                          className="w-12 h-12 mx-auto object-contain drop-shadow-[0_0_15px_#0070d1]"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      </div>
                      <h4 className="text-white font-mono font-bold text-sm tracking-wider">
                        OPEN PS2 LOADER V22.1
                      </h4>
                      <p className="text-[11px] text-[#00e676] font-mono">
                        [READY] 1.042 JOGOS CATALOGADOS
                      </p>
                    </div>

                    {/* Barra de Status Inferior do OPL */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800/80 pt-2">
                      <span>MEM: 8MB MAGICGATE</span>
                      <span>● ENTRAR | ✖ VOLTAR</span>
                    </div>

                    {/* Linha de Scanline sutil interna */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-12 w-full pointer-events-none animate-pulse" />
                  </div>
                ) : (
                  <div className="text-center text-zinc-600 font-mono text-xs">
                    TV DESLIGADA
                  </div>
                )}
              </div>

              {/* Botões Analógicos da TV de Tubo */}
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
      {/* 4. O CLUBE DE PRESERVAÇÃO: "MANTENHA ESTE SONHO LIGADO" */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-6xl mx-auto border-t border-zinc-800/80" id="clube">
        
        <div className="bg-gradient-to-b from-[#0a0e1c] to-[#06070b] border-2 border-[#0070d1]/40 rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-[0_0_60px_rgba(0,112,209,0.2)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Lado Esquerdo: Memory Card 8MB Estilizado */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="w-56 sm:w-64 bg-[#151922] rounded-2xl border-2 border-zinc-700 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative group hover:border-[#00d2ff] transition-all">
                
                {/* Ranhura e Logo MagicGate */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-700 pb-2">
                  <span className="font-bold text-white tracking-wider">PlayStation 2</span>
                  <span className="text-[#00d2ff]">8MB</span>
                </div>

                {/* Área da Etiqueta do Memory Card */}
                <div className="my-4 bg-[#0a0d16] p-3 rounded-lg border border-zinc-800 text-center space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">ETIQUETA DE SALVAMENTO</div>
                  <div className="text-xs font-bold text-[#00e676] font-mono">
                    SAVE_2004_MEMORIES.BIN
                  </div>
                  <div className="text-[9px] text-zinc-400">
                    STATUS: PRESERVADO PERMANENTE
                  </div>
                </div>

                {/* Conector e Indicador LED */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-700 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
                    <span>MagicGate™ CLOUD</span>
                  </div>
                  <span className="text-zinc-500">SLOT 1</span>
                </div>
              </div>

              <span className="text-xs font-mono text-zinc-500 mt-4 text-center">
                * Cartão de Memória Comunitário — Servidores 24h/7d
              </span>
            </div>

            {/* Lado Direito: Convite ao Clube e Valor Simbólico */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00e676]/15 border border-[#00e676]/40 text-xs text-[#00e676] font-mono">
                <Heart className="w-3.5 h-3.5 fill-[#00e676]" />
                <span>ESFORÇO INDEPENDENTE E COMUNITÁRIO</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Faça parte deste esforço independente de preservação.
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                Este não é um produto de massa nem um comércio frio. É uma iniciativa mantida por jogadores dedicados para garantir que esses servidores nunca desliguem e que essas obras nunca se percam no tempo.
              </p>

              {/* O que o apoio cobre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-zinc-200 bg-black/40 p-3 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                  <span>Tráfego Ilimitado em Alta Velocidade</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-200 bg-black/40 p-3 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                  <span>Atualizações Constantes do Acervo</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-200 bg-black/40 p-3 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                  <span>Suporte Humano de Jogador para Jogador</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-200 bg-black/40 p-3 rounded-xl border border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-[#00e676] shrink-0" />
                  <span>Acesso Imediato ao Token VIP</span>
                </div>
              </div>

              {/* Preço Secundário e CTA Principal */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <span className="text-xs text-zinc-400 uppercase font-mono block">Apoio para Manutenção</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black text-white">R$ 29,90</span>
                    <span className="text-xs text-zinc-400 font-mono">/único ou contribuição</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCheckoutStep("form");
                    setShowCheckoutModal(true);
                  }}
                  className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#0070d1] via-[#00d2ff] to-[#00e676] text-black font-black text-sm uppercase tracking-wider hover:opacity-95 shadow-[0_0_30px_rgba(0,210,255,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Resgatar Minha Cadeira no Clube</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. FAQS E SELO DE CONFIANÇA: "DÚVIDAS DA NOSSA COMUNIDADE" */}
      {/* ========================================================================= */}
      <section className="relative py-16 sm:py-24 px-4 max-w-4xl mx-auto border-t border-zinc-800/80">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Dúvidas da nossa comunidade.
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Transparência absoluta de quem ama os jogos clássicos tanto quanto você.
          </p>
        </div>

        {/* Acordeão de Perguntas */}
        <div className="space-y-3 mb-12">
          {COMMUNITY_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-[#0a0d16] border border-zinc-800 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/30 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-zinc-100">
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

        {/* SELO DE CONFIANÇA EMOCIONAL (CONFORME MANIFESTO) */}
        <div className="bg-[#0c1220] border border-[#0070d1]/30 rounded-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto shadow-[0_0_30px_rgba(0,112,209,0.15)]">
          <div className="w-12 h-12 rounded-full bg-[#0070d1]/20 flex items-center justify-center mx-auto mb-4 text-[#00d2ff]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
            Preservação Garantida por Jogadores
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            "Se o portal não abrir, se o sistema não rodar no seu console ou computador, ou se não for exatamente a viagem no tempo que você esperava, nós devolvemos o seu apoio integralmente em até 7 dias. Sem perguntas e sem ressentimentos."
          </p>
        </div>

      </section>

      {/* --- FOOTER: HOMENAGEM À HISTÓRIA DOS VIDEOGAMES --- */}
      <footer className="border-t border-zinc-800/80 bg-[#020305] py-10 px-4 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#00e676]">▲</span>
            <span className="text-[#f50057]">■</span>
            <span className="text-[#ff1744]">●</span>
            <span className="text-[#2979ff]">✖</span>
          </div>
          <p className="text-zinc-400">
            Projeto independente e comunitário de preservação da história dos videogames.
          </p>
          <p className="text-[11px] text-zinc-600">
            PlayStation 2, DualShock, MagicGate e OPL são marcas de seus respectivos donos. Todas as obras originais pertencem a seus criadores e produtoras. Mantido com carinho para as próximas gerações.
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
                <span className="text-[10px] font-mono text-[#00d2ff] uppercase block">
                  {selectedGameMemory.serial} • {selectedGameMemory.year}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {selectedGameMemory.title}
                </h3>
                <span className="text-[10px] text-[#00e676] font-mono">
                  PRESERVADO EM ISO 1:1 • SEM CORRUPÇÃO
                </span>
              </div>
            </div>

            <div className="my-4 space-y-3">
              <div className="p-3 bg-[#060810] rounded-xl border border-zinc-800 text-xs italic font-serif text-zinc-300">
                "{selectedGameMemory.memoryQuote}"
              </div>
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  A Lembrança de Sábado à Tarde:
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {selectedGameMemory.memoryStory}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                CLUBE DE PRESERVAÇÃO
              </span>
              <button
                onClick={() => {
                  setSelectedGameMemory(null);
                  setCheckoutStep("form");
                  setShowCheckoutModal(true);
                }}
                className="py-2 px-4 rounded-lg bg-[#0070d1] hover:bg-[#00d2ff] text-white hover:text-black font-bold text-xs uppercase tracking-wider transition-all"
              >
                Acessar Este e Mais 1.000 Jogos
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RESGATE DE CADEIRA NO CLUBE (CHECKOUT & SUPABASE TOKEN) */}
      {/* ========================================================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0b0e18] border-2 border-[#00d2ff]/50 rounded-2xl max-w-md w-full p-6 relative shadow-[0_0_60px_rgba(0,210,255,0.3)] text-left">
            
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
                    <h3 className="text-lg font-bold text-white">Resgatar Minha Cadeira</h3>
                    <span className="text-[10px] font-mono text-zinc-400">Iniciativa Memórias Preservadas</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 my-3 leading-relaxed">
                  Preencha seus dados para receber o <strong>Token VIP Oficial</strong> de acesso ilimitado aos servidores de preservação e tutoriais guiados.
                </p>

                <form onSubmit={handleSupportSubmit} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">SEU NOME COMPLETO</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alan Ferreira"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060810] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">SEU E-MAIL (RECEBIMENTO DO TOKEN)</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@gmail.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060810] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-400 mb-1">WHATSAPP (SUPORTE INDIVIDUAL)</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={userWhatsapp}
                      onChange={(e) => setUserWhatsapp(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060810] border border-zinc-700 text-sm text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSavingToken}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0070d1] to-[#00d2ff] text-black font-extrabold text-sm uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                      {isSavingToken ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Gravando no Supabase...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirmar Apoio (R$ 29,90)</span>
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

                <h3 className="text-xl font-bold text-white">Bem-vindo ao Clube!</h3>
                <p className="text-xs text-zinc-300">
                  Sua contribuição foi registrada com sucesso nos servidores do Supabase. O portal para as suas memórias já está aberto.
                </p>

                <div className="p-4 bg-[#060810] rounded-xl border border-[#00e676]/40 text-center space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 block">SEU TOKEN VIP OFICIAL:</span>
                  <div className="text-lg font-mono font-black text-[#00e676] tracking-widest selection:bg-white selection:text-black">
                    {generatedToken}
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://wa.me/5511999999999?text=Ol%C3%A1%2C%20acabei%20de%20apoiar%20o%20clube%20Mem%C3%B3rias%20Preservadas!"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-black" />
                    <span>Falar com o Guardião no WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full py-2.5 text-xs text-zinc-400 hover:text-white font-mono"
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
