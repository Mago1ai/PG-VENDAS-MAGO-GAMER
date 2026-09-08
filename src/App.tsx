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
  Usb
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

// The 5 Retro Platforms (+7.000 games)
const RETRO_PLATFORMS = [
  {
    id: "ps2",
    emoji: "🎮",
    tag: "PlayStation 2",
    title: "A biblioteca lendária"
  },
  {
    id: "ps1",
    emoji: "💿",
    tag: "PlayStation 1",
    title: "Todos os clássicos do PS1"
  },
  {
    id: "snes",
    emoji: "🍄",
    tag: "Super Nintendo (SNES)",
    title: "Super Mario, Donkey Kong, Top Gear"
  },
  {
    id: "megadrive",
    emoji: "🦔",
    tag: "Mega Drive (SEGA)",
    title: "Sonic e a era de ouro da Sega"
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
    title: "Bomba Patch",
    cover: "/images/pes_box_3d.png"
  },
  {
    id: "re4",
    title: "Resident Evil 4",
    cover: "/images/re4_box_3d.png"
  },
  {
    id: "need",
    title: "Need for Speed",
    cover: "/images/need_box_3d.png"
  },
  {
    id: "defjam",
    title: "Def Jam",
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

  const scrollToOffer = () => {
    const target = document.getElementById("oferta");
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
      const token = "VIP-PS2-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedToken(token);
      setCheckoutStep("success");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950">
      
      {/* --- HEADER SÓBRIO E DISCRETO --- */}
      <header className="w-full border-b border-white/5 py-5 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white">
              MAGO GAMER
            </span>
          </div>

          <span className="text-[11px] font-medium text-zinc-400 tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 border border-white/5">
            100% Plug & Play • Jogue pelo Pendrive
          </span>
        </div>
      </header>

      <main>
        {/* --- SEÇÃO 1: HERO SECTION LEVE & ELEGANTE --- */}
        <section className="relative pt-20 pb-28 md:pt-28 md:pb-36 px-4 max-w-4xl mx-auto text-center" id="hero">
          
          {/* Tag sutil sem verde */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>PlayStation 2 • 100% Plug & Play • +7.000 Jogos Prontos</span>
          </div>

          {/* Headline nostálgica marcante */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12] max-w-3xl mx-auto">
            Lembra daquela sensação mágica de ligar o PS2 na sexta-feira à noite?
          </h1>

          {/* Subheadline sem termos técnicos */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed mt-7">
            Sem complicação técnica. Sem precisar entender de computador. É só plugar no console e jogar os seus clássicos favoritos direto pelo pendrive.
          </p>

          {/* Benefícios rápidos com foco 100% Plug & Play */}
          <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 text-xs sm:text-sm text-zinc-400 mt-8 mb-10">
            <div className="flex items-center gap-2">
              <Usb className="w-4 h-4 text-zinc-400" />
              <span>100% Plug & Play</span>
            </div>
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-zinc-400" />
              <span>Qualquer PS2 (Fat ou Slim)</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-zinc-400" />
              <span>+7.000 Clássicos Prontos</span>
            </div>
          </div>

          {/* Botão Principal Verde Neon EXCLUSIVO */}
          <div className="flex flex-col items-center">
            <a
              href={CAKTO_CHECKOUT_URL}
              onClick={() => trackInitiateCheckout()}
              className="neon-pulse-btn w-full sm:w-auto px-10 py-4 bg-[#10B981] hover:bg-[#059669] text-zinc-950 font-extrabold text-base md:text-lg rounded-xl transition-all duration-200 hover:scale-102 active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer uppercase font-display text-center"
              id="hero_cta_btn"
            >
              <span>QUERO MEU ACESSO (R$ 25,00)</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <span className="text-xs text-zinc-500 mt-4 font-normal">
              ⚡ Acesso liberado imediatamente • Garantia Incondicional de 7 Dias
            </span>
          </div>

        </section>

        {/* --- SEÇÃO 2: VITRINE DE JOGOS + ACERVO EXPANDIDO PARA +7.000 CLÁSSICOS --- */}
        <section className="py-24 md:py-32 px-4 max-w-6xl mx-auto border-t border-white/5" id="vitrine">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Catálogo de Clássicos Definitivo
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Mais de 7.000 Clássicos que Marcaram Época
            </h2>
            <p className="text-sm md:text-base text-zinc-400 font-light">
              Títulos testados e compactados, prontos para rodar com carregamento rápido e capas em alta definição.
            </p>
          </div>

          {/* Grid de capas estilo catálogo Netflix (proporção de pôster 3:4) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {NETFLIX_GAMES.map((game) => (
              <div 
                key={game.id}
                className="group flex flex-col items-center cursor-pointer"
              >
                {/* Poster 3:4 com cantos arredondados e borda sutil */}
                <div className="w-full aspect-[3/4] bg-[#0f141c] border border-white/5 rounded-xl overflow-hidden p-2 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-white/20 group-hover:shadow-xl">
                  <img 
                    src={game.cover} 
                    alt={`Capa de ${game.title}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300"
                  />
                </div>

                {/* Nome do jogo discreto abaixo */}
                <h3 className="text-xs sm:text-sm font-medium text-zinc-300 mt-3 text-center truncate w-full group-hover:text-white transition-colors">
                  {game.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Barra/Grid Visual destacando as 5 Plataformas Retrô Inclusas logo abaixo da vitrine */}
          <div className="mt-14 pt-10 border-t border-white/5">
            <div className="text-center mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                5 Plataformas Inclusas no Pacote (+7.000 Jogos)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {RETRO_PLATFORMS.map((plat) => (
                <div 
                  key={plat.id}
                  className="bg-[#0f141c] border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-white/15 transition-all text-left"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">{plat.emoji}</span>
                      <span className="text-xs font-bold text-white tracking-tight">
                        [{plat.tag}]
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-light leading-relaxed">
                      {plat.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* --- SEÇÃO 3: COMO FUNCIONA (ULTRA-SIMPLES E VISUAL) --- */}
        <section className="py-24 md:py-32 px-4 max-w-5xl mx-auto border-t border-white/5" id="como-funciona">
          
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              100% Plug & Play
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Como Funciona?
            </h2>
            <p className="text-sm text-zinc-400 font-light">
              Sem complicação técnica. Sem precisar entender de computador. É só plugar no console e jogar.
            </p>
          </div>

          {/* 3 Passos Ilustrados com Ícones Grandes de Pendrive, Console e Controle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Passo 1: [Ícone de Pendrive] -> Coloque os jogos no Pendrive */}
            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200">
                    <Usb className="w-7 h-7" />
                  </div>
                  <span className="text-zinc-500 font-mono text-xs font-bold tracking-widest uppercase">
                    Passo 01
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Coloque os jogos no Pendrive
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Arquivos já prontos e mastigados.
                </p>
              </div>
            </div>

            {/* Passo 2: [Ícone de Console PS2] -> Plugue no seu Console */}
            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200">
                    <Tv className="w-7 h-7" />
                  </div>
                  <span className="text-zinc-500 font-mono text-xs font-bold tracking-widest uppercase">
                    Passo 02
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Plugue no seu Console
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Direto na porta USB do seu PlayStation 2.
                </p>
              </div>
            </div>

            {/* Passo 3: [Ícone de Controle Gamer] -> Ligue e Jogue! */}
            <div className="bg-[#0f141c] border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-200">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <span className="text-zinc-500 font-mono text-xs font-bold tracking-widest uppercase">
                    Passo 03
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Ligue e Jogue!
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Mais de 7.000 clássicos na tela com capinha.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* --- SEÇÃO 4: CARD DE PREÇO (FOCO TOTAL DA PÁGINA) --- */}
        <section className="py-24 md:py-32 px-4 max-w-3xl mx-auto border-t border-white/5" id="oferta">
          
          {/* Contador de urgência discreto */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs text-zinc-300 mx-auto mb-8 justify-center w-full max-w-sm">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>Condição promocional expira em:</span>
            <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded text-xs">
              {formatTime(secondsLeft)}
            </span>
          </div>

          {/* Card Principal de Oferta */}
          <div className="bg-[#0f141c] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            <div className="text-center space-y-3 mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Acesso Completo & Vitalício
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Kit Mago Gamer VIP
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto">
                Sem complicação técnica. Sem precisar entender de computador. É só plugar no console e jogar.
              </p>
            </div>

            {/* Checklist de Benefícios Diretos */}
            <div className="max-w-md mx-auto space-y-3.5 mb-10 text-xs sm:text-sm text-zinc-300">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Mais de 7.000 jogos clássicos prontos para usar</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Funciona em qualquer PlayStation 2</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Não precisa de leitor nem de peças caras</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Vídeo rápido de 3 minutos mostrando como plugar e jogar</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <span>Acesso vitalício imediato</span>
              </div>
            </div>

            {/* Bloco de Preço: De R$ 97,00 por apenas R$ 25,00 */}
            <div className="text-center pt-6 border-t border-white/5 max-w-md mx-auto">
              <span className="text-xs text-zinc-400 line-through block">
                De R$ 97,00
              </span>
              
              <div className="flex items-baseline justify-center gap-1.5 my-2">
                <span className="text-sm font-semibold text-zinc-400">por apenas</span>
                <span className="text-xs text-zinc-400 font-bold">R$</span>
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  25,00
                </span>
              </div>

              <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider block mb-6">
                Pagamento único • Acesso imediato
              </span>

              {/* Botão de Compra Verde Neon com Sombra Suave e Redirecionamento Direto */}
              <a
                href={CAKTO_CHECKOUT_URL}
                onClick={() => trackInitiateCheckout()}
                className="neon-pulse-btn w-full py-4 px-6 bg-[#10B981] hover:bg-[#059669] text-zinc-950 font-extrabold text-base rounded-xl transition-all duration-200 hover:scale-102 active:scale-98 cursor-pointer uppercase font-display tracking-wide flex items-center justify-center gap-2 text-center"
                id="oferta_cta_btn"
              >
                <span>QUERO MEU ACESSO (R$ 25,00)</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <p className="text-[11px] text-zinc-400 mt-4">
                🔒 Pagamento 100% seguro com liberação imediata por e-mail.
              </p>
            </div>

          </div>

          {/* Garantia Discreta */}
          <div className="mt-12 text-center max-w-lg mx-auto p-6 rounded-2xl bg-[#0f141c] border border-white/5">
            <div className="flex items-center justify-center gap-2 mb-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Garantia Incondicional de 7 Dias</span>
            </div>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Teste o acervo à vontade. Se você não conseguir rodar seus jogos em até 7 dias, devolvemos 100% do seu dinheiro.
            </p>
          </div>

        </section>
      </main>

      {/* --- FOOTER ELEGANTE E MINIMALISTA --- */}
      <footer className="border-t border-white/5 py-12 px-4 text-center text-xs text-zinc-400 space-y-3">
        <div className="flex items-center justify-center gap-1.5 font-medium text-zinc-300">
          <Gamepad2 className="w-4 h-4 text-zinc-400" />
          <span>Mago Gamer Oficial © {new Date().getFullYear()}</span>
        </div>
        <p className="max-w-md mx-auto font-light leading-relaxed">
          Uso estritamente nostálgico e educacional para preservação de mídias históricas. PlayStation é marca registrada da Sony Interactive Entertainment.
        </p>
        <span className="block text-[10px] text-zinc-400">
          Ambiente Criptografado • Todos os Direitos Reservados
        </span>
      </footer>

      {/* --- NOTIFICAÇÃO SUTIL (SEM POLUIÇÃO VISUAL) --- */}
      <div 
        className={`fixed bottom-5 left-5 z-40 max-w-xs bg-[#0f141c] border border-white/10 rounded-xl p-3.5 shadow-2xl transition-all duration-500 transform ${
          showToast ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-zinc-200 truncate">
              {currentToastIndex === 0 && "Marcos de Porto Alegre/RS liberou acesso"}
              {currentToastIndex === 1 && "Felipe de São Paulo/SP plugou o pendrive e jogou"}
              {currentToastIndex === 2 && "Juliano de Curitiba/PR ativou os 7.000 clássicos"}
              {currentToastIndex === 3 && "Rodrigo de Salvador/BA jogou Bomba Patch"}
            </p>
            <p className="text-[10px] text-zinc-400">Acesso VIP liberado com sucesso</p>
          </div>
        </div>
      </div>

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

