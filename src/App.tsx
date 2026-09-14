import { useState, useEffect, FormEvent } from "react";
import { 
  ArrowRight, 
  Check, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Gamepad2,
  Clock,
  Sparkles,
  Tv,
  Usb,
  MessageCircle,
  Download,
  Headphones,
  Zap,
  Smartphone,
  Laptop
} from "lucide-react";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Meta Pixel tracking helper
const trackInitiateCheckout = () => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout");
  }
};

const CAKTO_CHECKOUT_URL = "https://pay.cakto.com.br/en8u7oi_293089";
const WHATSAPP_GENERAL_URL = "https://wa.me/5531987086362?text=Oi,%20estou%20na%20p%C3%A1gina%20do%20Mago%20Gamer%20e%20quero%20tirar%20uma%20d%C3%BAvida%20sobre%20os%20jogos";
const WHATSAPP_PIX_URL = "https://wa.me/5531987086362?text=Oi,%20quero%20comprar%20o%20Kit%20Mago%20Gamer%20VIP%20no%20Pix%20direto";

// The 5 Retro Platforms (+7.000 games)
const RETRO_PLATFORMS = [
  {
    id: "ps2",
    emoji: "🎮",
    tag: "PlayStation 2",
    title: "A biblioteca lendária com clássicos testados"
  },
  {
    id: "ps1",
    emoji: "💿",
    tag: "PlayStation 1",
    title: "Todos os clássicos inesquecíveis do PS1"
  },
  {
    id: "snes",
    emoji: "🍄",
    tag: "Super Nintendo",
    title: "Super Mario, Donkey Kong, Top Gear e mais"
  },
  {
    id: "megadrive",
    emoji: "🦔",
    tag: "Mega Drive",
    title: "Sonic e a inesquecível era de ouro da SEGA"
  },
  {
    id: "arcade",
    emoji: "🕹️",
    tag: "Fliperama / Arcade",
    title: "The King of Fighters, Street Fighter e Metal Slug"
  }
];

// Netflix-style 6 Classic PS2 Games (Poster format)
const NETFLIX_GAMES = [
  {
    id: "gta",
    title: "GTA San Andreas",
    cover: "/images/gta_box_3d.png"
  },
  {
    id: "gow",
    title: "God of War II",
    cover: "/images/gow_box_3d.png"
  },
  {
    id: "bomba",
    title: "Bomba Patch 100% Atualizado",
    cover: "/images/pes_box_3d.png"
  },
  {
    id: "re4",
    title: "Resident Evil 4",
    cover: "/images/re4_box_3d.png"
  },
  {
    id: "need",
    title: "Need for Speed Most Wanted",
    cover: "/images/need_box_3d.png"
  },
  {
    id: "defjam",
    title: "Def Jam Fight for NY",
    cover: "/images/defjam_box_3d.png"
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

  // Countdown timer for urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 10 ? 899 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Floating notifications
  useEffect(() => {
    const start = setTimeout(() => setShowToast(true), 3000);
    const interval = setInterval(() => {
      setShowToast(false);
      setTimeout(() => {
        setCurrentToastIndex((prev) => (prev + 1) % 4);
        setShowToast(true);
      }, 500);
    }, 14000);

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

  const handleProcessCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      alert("Por favor, preencha os dados obrigatórios.");
      return;
    }
    setCheckoutStep("loading");
    setTimeout(() => {
      const token = "VIP-PS2-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedToken(token);
      setCheckoutStep("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950 overflow-x-hidden pt-safe pb-safe">
      
      {/* --- HEADER SÓBRIO E COMPACTO MOBILE --- */}
      <header className="w-full border-b border-white/5 py-3.5 sm:py-4 px-4 sm:px-8 bg-[#07090e]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
              MAGO GAMER
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden md:inline-block text-[11px] font-medium text-zinc-400 tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 border border-white/5">
              100% Plug & Play • PS2, PC, Celular & TV Box
            </span>
            <a
              href={WHATSAPP_GENERAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 transition-all"
              id="header_whatsapp_link"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Suporte / WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* --- SEÇÃO 1: HERO SECTION MOBILE-FIRST --- */}
        <section className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 md:pt-20 md:pb-24 px-4 max-w-4xl mx-auto text-center" id="hero">
          
          {/* Tag de Destaque */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] sm:text-xs text-emerald-300 font-medium mb-5 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span>+7.000 Jogos Prontos • 100% Plug & Play</span>
          </div>

          {/* Headline Direta & Atraente */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight sm:leading-[1.15] max-w-3xl mx-auto">
            Reviva os Clássicos de PS2, PS1 e SNES Prontos no seu Console, PC ou Celular
          </h1>

          {/* Subheadline Clara sem Termos Complexos */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-5">
            Sem complicação ou configurações chatas. É só conectar no PlayStation 2 (Fat ou Slim), PC, Celular ou TV Box e curtir mais de 7.000 jogos lendários com capinhas em alta resolução.
          </p>

          {/* Dispositivos Suportados - Ícones Compactos */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-zinc-300 mt-5 mb-7">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
              <Tv className="w-3.5 h-3.5 text-emerald-400" /> PS2 (Fat/Slim)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
              <Laptop className="w-3.5 h-3.5 text-emerald-400" /> PC / Notebook
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Celular Android
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
              <Usb className="w-3.5 h-3.5 text-emerald-400" /> TV Box / Pendrive
            </span>
          </div>

          {/* Botão de Ação Imediata Acima da Dobra */}
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <a
              href={CAKTO_CHECKOUT_URL}
              onClick={() => trackInitiateCheckout()}
              className="neon-pulse-btn w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] text-zinc-950 font-extrabold text-base sm:text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 uppercase font-display text-center shadow-lg"
              id="hero_cta_btn"
            >
              <span>QUERO MEU ACESSO (R$ 25,00)</span>
              <ArrowRight className="w-5 h-5 shrink-0" />
            </a>

            <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-400 mt-3.5">
              <span className="inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" /> Liberação Imediata
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Garantia de 7 Dias
              </span>
            </div>
          </div>

        </section>

        {/* --- SEÇÃO 2: VITRINE DE JOGOS (CARROSSEL DESLIZÁVEL / GRID RESPONSIVO) --- */}
        <section className="py-10 sm:py-16 px-4 max-w-6xl mx-auto border-t border-white/5" id="vitrine">
          
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Catálogo de Clássicos em HD
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              +7.000 Jogos Prontos e Organizados
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Deslize para ver alguns dos clássicos inclusos com capas originais em alta definição.
            </p>
          </div>

          {/* Carrossel Deslizável Horizontal no Mobile (snap-x scrollbar-none) & Grid no Desktop */}
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto snap-x scrollbar-none pb-3 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {NETFLIX_GAMES.map((game) => (
              <div 
                key={game.id}
                className="group flex flex-col items-center shrink-0 w-[140px] sm:w-auto snap-center"
              >
                {/* Poster 3:4 com cantos arredondados */}
                <div className="w-full aspect-[3/4] bg-[#0f141c] border border-white/5 rounded-xl overflow-hidden p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:shadow-xl">
                  <img 
                    src={game.cover} 
                    alt={`Capa de ${game.title}`}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300"
                  />
                </div>

                {/* Nome do jogo */}
                <h3 className="text-xs font-medium text-zinc-300 mt-2 text-center truncate w-full group-hover:text-white transition-colors">
                  {game.title}
                </h3>
              </div>
            ))}
          </div>

          {/* 5 Plataformas Retrô Inclusas */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5">
            <div className="text-center mb-4 sm:mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                5 Plataformas Inclusas (+7.000 Jogos Prontos)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
              {RETRO_PLATFORMS.map((plat) => (
                <div 
                  key={plat.id}
                  className="bg-[#0f141c] border border-white/5 rounded-xl p-3 sm:p-4 flex items-start gap-3 sm:flex-col sm:justify-between hover:border-white/15 transition-all text-left"
                >
                  <span className="text-2xl sm:text-xl shrink-0">{plat.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight mb-0.5">
                      [{plat.tag}]
                    </div>
                    <p className="text-[11px] text-zinc-400 font-light leading-snug">
                      {plat.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* --- SEÇÃO 3: COMO FUNCIONA (3 PASSOS RÁPIDOS) --- */}
        <section className="py-10 sm:py-16 px-4 max-w-5xl mx-auto border-t border-white/5" id="como-funciona">
          
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12 space-y-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Zero Complicação
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Como Funciona?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Em menos de 3 minutos seus jogos já estão rodando.
            </p>
          </div>

          {/* 3 Passos Ilustrados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-6">
            
            {/* Passo 1 */}
            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-5 sm:p-7 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Usb className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px] font-bold tracking-widest uppercase">
                    Passo 01
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  1. Coloque os jogos no Pendrive
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Arquivos testados e compactados, com capinhas já configuradas.
                </p>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-5 sm:p-7 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Tv className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px] font-bold tracking-widest uppercase">
                    Passo 02
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  2. Plugue no seu Aparelho
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Conecte na entrada USB do seu PS2, PC, Notebook ou TV Box.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-5 sm:p-7 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                    <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-zinc-500 font-mono text-[11px] font-bold tracking-widest uppercase">
                    Passo 03
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  3. Ligue e Jogue!
                </h3>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  Escolha qualquer um dos +7.000 títulos e divirta-se na hora.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* --- SEÇÃO 4: CARD DE OFERTA DE ALTA CONVERSÃO (R$ 25,00) --- */}
        <section className="py-10 sm:py-16 px-4 max-w-2xl mx-auto border-t border-white/5" id="oferta">
          
          {/* Contador de urgência */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/5 text-[11px] sm:text-xs text-zinc-300 mx-auto mb-6 justify-center w-full max-w-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Condição promocional expira em:</span>
            <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded text-xs">
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Card Principal de Oferta */}
          <div className="bg-[#0f141c] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="text-center space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                Acesso Vitalício & Imediato
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Kit Mago Gamer VIP
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto">
                Tudo configurado para você plugar e jogar sem estresse técnico.
              </p>
            </div>

            {/* Checklist de Benefícios */}
            <div className="max-w-md mx-auto space-y-2.5 sm:space-y-3 mb-8 text-xs sm:text-sm text-zinc-200">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>+7.000 jogos clássicos organizados e prontos</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Compatível com PS2 (Fat e Slim), PC, Celular e TV Box</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Não precisa de leitor de disco nem peças caras</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Tutorial rápido em vídeo de 3 minutos passo a passo</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Suporte direto no WhatsApp para tirar dúvidas</span>
              </div>
            </div>

            {/* Bloco de Preço: De R$ 97,00 por R$ 25,00 */}
            <div className="text-center pt-5 border-t border-white/5 max-w-md mx-auto">
              <span className="text-xs text-zinc-400 line-through block">
                De R$ 97,00
              </span>
              
              <div className="flex items-baseline justify-center gap-1 my-1.5">
                <span className="text-xs sm:text-sm font-semibold text-zinc-400">por apenas</span>
                <span className="text-xs text-zinc-400 font-bold">R$</span>
                <span className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  25,00
                </span>
              </div>

              <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block mb-5">
                Pagamento Único • Sem Mensalidades
              </span>

              {/* Botão Primário: Checkout Cakto (50% OFF) */}
              <a
                href={CAKTO_CHECKOUT_URL}
                onClick={() => trackInitiateCheckout()}
                className="neon-pulse-btn w-full py-4 px-5 bg-[#10B981] hover:bg-[#059669] text-zinc-950 font-extrabold text-sm sm:text-base rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer uppercase font-display tracking-wide flex items-center justify-center gap-2 text-center shadow-lg"
                id="oferta_cta_btn"
              >
                <span>COMPRAR MEU ACESSO COM 50% OFF</span>
                <ArrowRight className="w-5 h-5 shrink-0" />
              </a>

              {/* Botão Secundário: WhatsApp / Pix Direto */}
              <a
                href={WHATSAPP_PIX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 py-3 px-4 rounded-xl border border-emerald-500/25 hover:border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-center"
                id="oferta_whatsapp_pix_btn"
              >
                <MessageCircle className="w-4 h-4 shrink-0 text-[#25D366]" />
                <span>Prefere pagar via Pix direto? Fale no WhatsApp</span>
              </a>

              <p className="text-[11px] text-zinc-400 mt-4">
                🔒 Pagamento 100% seguro com liberação imediata no seu e-mail.
              </p>
            </div>

          </div>

          {/* 3 Ícones Compactos em Linha de Segurança / Garantia */}
          <div className="grid grid-cols-3 gap-2 mt-6 max-w-2xl mx-auto">
            <div className="bg-[#0f141c] border border-white/5 rounded-xl p-3 text-center flex flex-col items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-zinc-200 leading-tight">Acesso Imediato</span>
              <span className="text-[9px] text-zinc-400 mt-0.5">Envio no e-mail</span>
            </div>
            <div className="bg-[#0f141c] border border-white/5 rounded-xl p-3 text-center flex flex-col items-center justify-center">
              <Headphones className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-zinc-200 leading-tight">Suporte WhatsApp</span>
              <span className="text-[9px] text-zinc-400 mt-0.5">Ajuda rápida</span>
            </div>
            <div className="bg-[#0f141c] border border-white/5 rounded-xl p-3 text-center flex flex-col items-center justify-center">
              <Download className="w-4 h-4 text-emerald-400 mb-1" />
              <span className="text-[10px] sm:text-xs font-bold text-zinc-200 leading-tight">Download Seguro</span>
              <span className="text-[9px] text-zinc-400 mt-0.5">100% testado</span>
            </div>
          </div>

          {/* Garantia Incondicional de 7 Dias */}
          <div className="mt-6 text-center max-w-lg mx-auto p-4 sm:p-6 rounded-2xl bg-[#0f141c] border border-white/5">
            <div className="flex items-center justify-center gap-2 mb-1.5 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Garantia Incondicional de 7 Dias</span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-light leading-relaxed">
              Teste o acervo à vontade. Se você não conseguir rodar seus jogos em até 7 dias, devolvemos 100% do seu dinheiro.
            </p>
          </div>

        </section>
      </main>

      {/* --- FOOTER ELEGANTE E MINIMALISTA --- */}
      <footer className="border-t border-white/5 py-8 sm:py-10 px-4 text-center text-xs text-zinc-400 space-y-2.5">
        <div className="flex items-center justify-center gap-1.5 font-medium text-zinc-300">
          <Gamepad2 className="w-4 h-4 text-emerald-400" />
          <span>Mago Gamer Oficial © {new Date().getFullYear()}</span>
        </div>
        <p className="max-w-md mx-auto font-light leading-relaxed text-[11px]">
          Uso estritamente nostálgico e educacional para preservação de mídias históricas. PlayStation é marca registrada da Sony Interactive Entertainment.
        </p>
        <span className="block text-[10px] text-zinc-400">
          Ambiente Criptografado • Todos os Direitos Reservados
        </span>
      </footer>

      {/* --- NOTIFICAÇÃO SUTIL NO MOBILE --- */}
      <div 
        className={`fixed bottom-24 left-4 z-40 max-w-[280px] bg-[#0f141c]/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md transition-all duration-500 transform ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-zinc-200 truncate">
              {currentToastIndex === 0 && "Marcos (Porto Alegre/RS) liberou acesso"}
              {currentToastIndex === 1 && "Felipe (São Paulo/SP) plugou e jogou"}
              {currentToastIndex === 2 && "Juliano (Curitiba/PR) ativou os 7.000 jogos"}
              {currentToastIndex === 3 && "Rodrigo (Salvador/BA) jogou Bomba Patch"}
            </p>
            <p className="text-[10px] text-emerald-400">Acesso VIP liberado com sucesso</p>
          </div>
        </div>
      </div>

      {/* --- BOTÃO FLUTUANTE DE WHATSAPP MOBILE (56x56px, #25D366, PULSE) --- */}
      <a
        href={WHATSAPP_GENERAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 group focus:outline-none"
        aria-label="Tire dúvidas no WhatsApp"
        id="floating_whatsapp_btn"
      >
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-[#0f141c]/95 border border-emerald-500/30 text-xs font-medium text-emerald-300 shadow-xl backdrop-blur-md transition-all group-hover:border-emerald-400 group-hover:bg-[#151c27]">
          Tire dúvidas no WhatsApp
        </span>
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-950/60 transition-all duration-300 group-hover:scale-105 group-active:scale-95">
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
          <MessageCircle className="w-7 h-7 relative z-10 fill-current text-white" />
        </div>
      </a>

      {/* --- CHECKOUT EXPRESS MODAL --- */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#0f141c] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            
            {/* Header do modal */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="font-bold text-xs text-zinc-200 uppercase tracking-wide">
                Finalizar Pedido Seguro
              </span>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutStep === "form" && (
              <form onSubmit={handleProcessCheckout} className="p-5 space-y-4">
                <div className="bg-[#07090e] p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-medium text-zinc-300 block">Kit Mago Gamer VIP</span>
                    <span className="text-[10px] text-zinc-500">+7.000 Jogos • 100% Plug & Play</span>
                  </div>
                  <span className="font-extrabold text-white text-sm">R$ 25,00</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-3.5 py-2 bg-[#07090e] border border-white/10 focus:border-white/30 focus:outline-none rounded-lg text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    E-mail Principal *
                  </label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-3.5 py-2 bg-[#07090e] border border-white/10 focus:border-white/30 focus:outline-none rounded-lg text-xs text-white"
                  />
                  <span className="text-[10px] text-zinc-400 block font-light">
                    O acesso com os jogos e o vídeo de 3 minutos serão enviados para este endereço.
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                    Forma de Pagamento
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("pix")}
                      className={`py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === "pix"
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-[#07090e] border-white/5 text-zinc-400"
                      }`}
                    >
                      ⚡ PIX Instantâneo
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-white/10 border-white/30 text-white"
                          : "bg-[#07090e] border-white/5 text-zinc-400"
                      }`}
                    >
                      💳 Cartão
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={() => trackInitiateCheckout()}
                  className="w-full py-3.5 bg-[#10B981] hover:bg-[#059669] text-zinc-950 font-extrabold text-xs rounded-xl tracking-wider uppercase transition-all cursor-pointer shadow-md mt-2"
                >
                  Confirmar e Gerar Acesso (R$ 25,00)
                </button>
              </form>
            )}

            {checkoutStep === "loading" && (
              <div className="p-8 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
                <h4 className="font-bold text-sm text-white">Processando...</h4>
                <p className="text-xs text-zinc-400 font-light">Liberando seu acesso individual.</p>
              </div>
            )}

            {checkoutStep === "success" && (
              <div className="p-6 text-center space-y-4">
                <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-zinc-200 mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">Acesso VIP Gerado!</h4>
                  <p className="text-xs text-zinc-400 mt-0.5 font-light">Compra aprovada com sucesso</p>
                </div>
                <div className="bg-[#07090e] p-3 rounded-lg border border-white/10 font-mono text-sm font-bold text-zinc-200 select-all">
                  {generatedToken}
                </div>
                <p className="text-xs text-zinc-400 text-left bg-[#07090e] p-3 rounded-lg border border-white/5 font-light">
                  Enviamos o link de acesso aos jogos e o vídeo de 3 minutos para <strong className="text-zinc-200">{userEmail}</strong>. É só plugar e jogar!
                </p>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-lg uppercase cursor-pointer transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

