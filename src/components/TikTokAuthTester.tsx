import { useState, useEffect } from "react";
import { 
  getTikTokAuthUrl, 
  exchangeCodeForToken, 
  DEFAULT_TIKTOK_CONFIG, 
  TikTokTokenResponse 
} from "../services/tiktokAuth";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  ArrowLeft, 
  Key, 
  Globe, 
  ShieldCheck, 
  RefreshCw,
  ExternalLink
} from "lucide-react";

export function TikTokAuthTester() {
  const [loading, setLoading] = useState<boolean>(false);
  const [tokenData, setTokenData] = useState<TikTokTokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authCode, setAuthCode] = useState<string | null>(null);

  useEffect(() => {
    // Carrega dados salvos no localStorage (se houver)
    const saved = localStorage.getItem("mago_post_tiktok_auth");
    if (saved) {
      try {
        setTokenData(JSON.parse(saved));
      } catch {
        // ignora
      }
    }

    // Verifica se há `code` nos parâmetros de busca (callback do TikTok)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const errorParam = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (errorParam) {
      setError(`Erro no retorno do TikTok: ${errorDescription || errorParam}`);
      return;
    }

    if (code) {
      setAuthCode(code);
      handleExchangeCode(code);
    }
  }, []);

  const handleExchangeCode = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log("[Mago Post] Trocando code por access_token oficial...");
      const result = await exchangeCodeForToken(code);
      setTokenData(result);
      localStorage.setItem("mago_post_tiktok_auth", JSON.stringify(result));
      console.log("[Mago Post] Token obtido com sucesso. Open ID:", result.open_id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("[Mago Post] Erro no exchangeCodeForToken:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectTikTok = () => {
    try {
      const { url } = getTikTokAuthUrl();
      console.log("[Mago Post] Redirecionando para autorização oficial:", url);
      window.location.href = url;
    } catch (err) {
      setError("Falha ao gerar URL de autorização.");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("mago_post_tiktok_auth");
    setTokenData(null);
    setAuthCode(null);
    setError(null);
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full bg-[#101423]/90 border border-indigo-500/20 backdrop-blur-xl rounded-2xl p-6 sm:p-10 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg">
              🎵
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Mago Post &bull; TikTok OAuth 2.0
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Módulo de Teste de Integração e Conexão de Contas
              </p>
            </div>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-white transition px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </a>
        </div>

        {/* Informações da Configuração */}
        <div className="bg-[#0b0e19] border border-white/5 rounded-xl p-4 mb-6 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" /> Client Key:
            </span>
            <code className="bg-indigo-950/50 text-indigo-300 px-2 py-0.5 rounded font-mono">
              {DEFAULT_TIKTOK_CONFIG.clientKey}
            </code>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" /> Redirect URI:
            </span>
            <span className="text-slate-300 font-mono truncate max-w-[280px] sm:max-w-md">
              {DEFAULT_TIKTOK_CONFIG.redirectUri}
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Escopos Ativos:
            </span>
            <span className="text-slate-300 font-mono">
              user.info.basic, video.upload, video.publish
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="my-8 py-8 flex flex-col items-center justify-center text-center bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
            <p className="text-sm font-semibold text-indigo-200">
              Autenticando com a API oficial do TikTok...
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Trocando código de autorização por access token
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="my-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-3 text-red-200 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-300">Falha na Autenticação</p>
              <p className="text-xs text-red-200/80 mt-1 break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {tokenData && !loading && (
          <div className="my-6 p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-base">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              Conta TikTok Conectada com Sucesso!
            </div>

            <div className="bg-[#07090e]/80 p-3.5 rounded-lg border border-emerald-500/20 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Open ID da Conta:</span>
                <span className="font-mono font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded">
                  {tokenData.open_id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tipo de Token:</span>
                <span className="font-mono text-slate-200">{tokenData.token_type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Validade do Token:</span>
                <span className="font-mono text-slate-200">
                  {Math.round(tokenData.expires_in / 3600)} horas ({tokenData.expires_in}s)
                </span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <span className="text-slate-400 block mb-1">Access Token (Início):</span>
                <code className="text-[11px] text-slate-300 break-all bg-black/40 p-1.5 rounded block font-mono">
                  {tokenData.access_token.substring(0, 32)}...
                </code>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDisconnect}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition"
              >
                Desconectar Conta
              </button>
            </div>
          </div>
        )}

        {/* Action Button: Conectar */}
        {!tokenData && !loading && (
          <div className="mt-8 space-y-3">
            <button
              onClick={handleConnectTikTok}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#FE2C55] text-white shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2.5 transform active:scale-[0.99]"
            >
              <ExternalLink className="w-4 h-4" />
              Conectar Conta TikTok Oficial
            </button>
            <p className="text-center text-[11px] text-slate-400">
              Você será redirecionado para a página oficial de consentimento do TikTok.
            </p>
          </div>
        )}

        {/* Footer links */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between text-xs text-slate-500">
          <a href="/termos.html" className="hover:text-indigo-400 transition">
            Termos de Serviço
          </a>
          <span>Casa Kame &bull; 2026</span>
          <a href="/privacidade.html" className="hover:text-indigo-400 transition">
            Política de Privacidade
          </a>
        </div>
      </div>
    </div>
  );
}
